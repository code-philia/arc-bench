param(
    [Parameter(Position = 0)]
    [string]$ApplicationUrl = 'http://127.0.0.1:33000',

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

Push-Location $setupDirectory
try {
    $generator = Join-Path $scriptDirectory 'setup-playwright.cjs'
    Write-Host "Generating configuration with $($nodeCommand.Source)"
    & $nodeCommand.Source $generator $setupDirectory $ApplicationUrl
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
    Pop-Location
}

Write-Host ""
Write-Host "Playwright setup complete. Application URL: $ApplicationUrl"
Write-Host "Run tests:"
Write-Host "  Set-Location '$setupDirectory'"
Write-Host "  npm run test:e2e"
Write-Host "List tests: npm run test:e2e:list"
Write-Host "View report: npm run test:e2e:report"
