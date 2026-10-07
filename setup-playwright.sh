#!/usr/bin/env bash
# Run: source ./setup-playwright.sh "http://127.0.0.1:33000"
# Run from the application directory containing tests/; invoking by absolute path is supported.
# Optional Linux system dependencies: append --with-deps.

_setup_playwright_main() {
  local setup_dir setup_url setup_browser_option
  setup_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)" || return 1
  if [[ -d "$PWD/tests" ]]; then
    setup_dir="$PWD"
  fi
  setup_url="${1:-${PLAYWRIGHT_BASE_URL:-http://127.0.0.1:33000}}"
  setup_browser_option="${2:-}"

  if [[ $# -gt 2 || ( -n "$setup_browser_option" && "$setup_browser_option" != '--with-deps' ) ]]; then
    printf 'Usage: source %q <application-url> [--with-deps]\n' "$setup_dir/setup-playwright.sh" >&2
    return 1
  fi
  if [[ ! -d "$setup_dir/tests" ]]; then
    printf 'Run setup from an application directory containing tests/. Missing: %s/tests\n' "$setup_dir" >&2
    return 1
  fi
  if ! command -v node >/dev/null || ! command -v npm >/dev/null; then
    printf 'Install Node.js 22 LTS and npm first.\n' >&2
    return 1
  fi

  # A subshell keeps the caller's working directory and shell options intact.
  (
    set -e
    cd -- "$setup_dir"
    node - "$setup_url" <<'NODE'
const fs = require('node:fs');
const target = new URL(process.argv[2]);
if (!['http:', 'https:'].includes(target.protocol)) {
  throw new Error('Application URL must use http:// or https://');
}
const helpers = fs.existsSync('tests/helpers.ts') ? fs.readFileSync('tests/helpers.ts', 'utf8') : '';
const railFixture = fs.existsSync('tests/fixtures/test.ts') ? fs.readFileSync('tests/fixtures/test.ts', 'utf8') : '';
const isStackOverflow = helpers.includes('SO_RUN_ID');
const timezone = helpers.includes('CTRIP_RUN_ID') || railFixture.includes('RAIL_BASE_URL_TEMPLATE')
  ? 'Asia/Shanghai' : 'UTC';
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
fs.writeFileSync('playwright.config.ts', `import { defineConfig, devices } from '@playwright/test';
import { randomBytes } from 'node:crypto';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || ${JSON.stringify(target.href)};
// Generate once in the runner; workers inherit this ID. Explicit evaluator IDs take precedence.
const runId = process.env.PLAYWRIGHT_RUN_ID ||= randomBytes(8).toString('hex');
for (const key of ['BOOKSTACK_RUN_ID', 'KEEP_RUN_ID', 'CTRIP_RUN_ID', 'SO_RUN_ID', 'RAIL_RUN_ID']) {
  process.env[key] ||= runId;
}
// Secondary browser contexts must use the same application as the primary context.
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
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL,
    timezoneId: ${JSON.stringify(timezone)},
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    ${isStackOverflow ? `{ name: 'chromium', grepInvert: expiredComment, use: { ...devices['Desktop Chrome'] } },
    {
      name: 'expired-comment', grep: expiredComment,
      use: { ...devices['Desktop Chrome'], baseURL: process.env.SO_EXPIRED_BASE_URL || baseURL },
    },` : `{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },`}
  ],
});
`);
const ignored = ['/node_modules/', '/playwright-report/', '/test-results/', '/blob-report/', '/playwright/.auth/'];
const existing = fs.existsSync('.gitignore') ? fs.readFileSync('.gitignore', 'utf8') : '';
const lines = new Set(existing.split(/\r?\n/));
const missing = ignored.filter(line => !lines.has(line));
if (missing.length) {
  fs.appendFileSync('.gitignore', (existing && !existing.endsWith('\n') ? '\n' : '') + missing.join('\n') + '\n');
}
NODE
    npm install --no-audit --no-fund
    if [[ "$setup_browser_option" == '--with-deps' ]]; then
      npx playwright install --with-deps chromium
    else
      npx playwright install chromium
    fi
  ) || return 1

  export PLAYWRIGHT_BASE_URL="$setup_url"
  printf '\nPlaywright setup complete. Application URL: %s\n' "$PLAYWRIGHT_BASE_URL"
  printf 'Run tests:\n  cd %q\n  npm run test:e2e\n' "$setup_dir"
  printf 'List tests: npm run test:e2e:list\nView report: npm run test:e2e:report\n'
  if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
    printf '\nTo set the URL in your terminal: export PLAYWRIGHT_BASE_URL=%q\n' "$setup_url"
  fi
}

if _setup_playwright_main "$@"; then
  unset -f _setup_playwright_main
else
  unset -f _setup_playwright_main
  return 1 2>/dev/null || exit 1
fi
