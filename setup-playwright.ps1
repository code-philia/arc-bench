param(
    [Parameter(Position = 0)]
    [string]$ApplicationUrl = "$(if ($env:PLAYWRIGHT_BASE_URL) { $env:PLAYWRIGHT_BASE_URL } else { 'http://127.0.0.1:33000' })",

    [switch]$WithDeps
)

$ErrorActionPreference = 'Stop'

function Fail([string]$Message) {
    Write-Error $Message
    exit 1
}

$nodeCommand = Get-Command node.exe -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
$npmCommand = Get-Command npm.cmd -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
$npxCommand = Get-Command npx.cmd -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1

if (-not $nodeCommand) {
    Fail 'Node.js 22 LTS is required.'
}
if (-not $npmCommand -or -not $npxCommand) {
    Fail 'npm.cmd and npx.cmd are required. Install Node.js 22 LTS with npm and reopen PowerShell.'
}

$currentDirectory = (Get-Location).Path
$scriptDirectory = $PSScriptRoot
if (Test-Path (Join-Path $currentDirectory 'tests')) {
    $setupDirectory = $currentDirectory
} else {
    $setupDirectory = $scriptDirectory
}
if (-not (Test-Path (Join-Path $setupDirectory 'tests'))) {
    Fail "Run this script from a directory containing tests/. Missing: $setupDirectory\tests"
}

try {
    $parsedUrl = [System.Uri]$ApplicationUrl
    if ($parsedUrl.Scheme -notin @('http', 'https') -or [string]::IsNullOrEmpty($parsedUrl.Host)) {
        throw 'The URL must use http:// or https://.'
    }
} catch {
    Fail "Invalid application URL '$ApplicationUrl'. Use an http:// or https:// URL."
}

$nodeScript = @'
const fs = require('node:fs');
const baseURL = process.argv[2];
const timezone = process.argv[3];
const isStackOverflow = process.argv[4] === 'true';
const isRail = process.argv[5] === 'true';

const pkg = fs.existsSync('package.json')
  ? JSON.parse(fs.readFileSync('package.json', 'utf8'))
  : { name: 'playwright-requirement-tests', private: true };
pkg.scripts = {
  ...pkg.scripts,
  'test:e2e': 'playwright test',
  'test:e2e:list': 'playwright test --list',
  'test:e2e:ui': 'playwright test --ui',
  'test:e2e:report': 'playwright show-report',
};
pkg.devDependencies = { ...pkg.devDependencies, '@playwright/test': '1.57.0' };
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

const expiredComment = /REQ-5\\.3: Refuse an expired comment edit/;
const projects = isStackOverflow
  ? `{
      name: 'chromium', grepInvert: expiredComment,
      use: { ...devices['Desktop Chrome'] },
    }, {
      name: 'expired-comment', grep: expiredComment,
      use: { ...devices['Desktop Chrome'], baseURL: process.env.SO_EXPIRED_BASE_URL || baseURL },
    },`
  : `{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },`;

fs.writeFileSync('playwright.config.ts', `import { defineConfig, devices } from '@playwright/test';
import { randomBytes } from 'node:crypto';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || ${JSON.stringify(baseURL)};
const runId = process.env.PLAYWRIGHT_RUN_ID ||= randomBytes(8).toString('hex');
for (const key of ['BOOKSTACK_RUN_ID', 'KEEP_RUN_ID', 'CTRIP_RUN_ID', 'SO_RUN_ID', 'RAIL_RUN_ID']) {
  process.env[key] ||= runId;
}
process.env.SO_BASE_URL ||= baseURL;
const expiredComment = /REQ-5\\.3: Refuse an expired comment edit/;

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: !!process.env.CI,
  timeout: 10_000,
  expect: { timeout: 10_000 },
  outputDir: './test-results',
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL,
    timezoneId: ${JSON.stringify(timezone)},
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [${projects}],
});
`);

const ignored = ['/node_modules/', '/playwright-report/', '/test-results/', '/blob-report/', '/playwright/.auth/'];
const existing = fs.existsSync('.gitignore') ? fs.readFileSync('.gitignore', 'utf8') : '';
const lines = new Set(existing.split(/\r?\n/));
const missing = ignored.filter(line => !lines.has(line));
if (missing.length) fs.appendFileSync('.gitignore', (existing && !existing.endsWith('\n') ? '\n' : '') + missing.join('\n') + '\n');
'@

Push-Location $setupDirectory
try {
    $helpersPath = Join-Path (Get-Location) 'tests/helpers.ts'
    $fixturePath = Join-Path (Get-Location) 'tests/fixtures/test.ts'
    $helpers = if (Test-Path $helpersPath) { Get-Content $helpersPath -Raw } else { '' }
    $fixture = if (Test-Path $fixturePath) { Get-Content $fixturePath -Raw } else { '' }
    $isStackOverflow = $helpers.Contains('SO_RUN_ID')
    $isRail = $helpers.Contains('CTRIP_RUN_ID') -or $fixture.Contains('RAIL_BASE_URL_TEMPLATE')
    $timezone = if ($isRail) { 'Asia/Shanghai' } else { 'UTC' }
    $tempNodeScript = Join-Path ([System.IO.Path]::GetTempPath()) "setup-playwright-$([guid]::NewGuid()).cjs"
    Set-Content -Path $tempNodeScript -Value $nodeScript -Encoding UTF8
    try {
        Write-Host "Generating configuration with $($nodeCommand.Source)"
        & $nodeCommand.Source $tempNodeScript $ApplicationUrl $timezone $($isStackOverflow.ToString().ToLower()) $($isRail.ToString().ToLower())
        if ($LASTEXITCODE -ne 0) { throw "Configuration generation failed (exit code $LASTEXITCODE)." }
        Write-Host "Installing dependencies with $($npmCommand.Source)"
        & $npmCommand.Source install --no-audit --no-fund
        if ($LASTEXITCODE -ne 0) { throw "npm install failed (exit code $LASTEXITCODE)." }
        Write-Host "Installing Chromium with $($npxCommand.Source)"
        if ($WithDeps) {
            & $npxCommand.Source playwright install --with-deps chromium
        } else {
            & $npxCommand.Source playwright install chromium
        }
        if ($LASTEXITCODE -ne 0) { throw "Chromium installation failed (exit code $LASTEXITCODE)." }
    } finally {
        Remove-Item $tempNodeScript -Force -ErrorAction SilentlyContinue
    }
} finally {
    Pop-Location
}

$env:PLAYWRIGHT_BASE_URL = $ApplicationUrl
Write-Host ""
Write-Host "Playwright setup complete. Application URL: $ApplicationUrl"
Write-Host "Run tests:"
Write-Host "  Set-Location '$setupDirectory'"
Write-Host "  npm run test:e2e"
Write-Host "List tests: npm run test:e2e:list"
Write-Host "View report: npm run test:e2e:report"
