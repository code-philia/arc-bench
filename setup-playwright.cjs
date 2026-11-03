const fs = require('node:fs');
const path = require('node:path');

const directory = path.resolve(process.argv[2] || '.');
const target = new URL(process.argv[3] || 'http://127.0.0.1:33000');
if (!['http:', 'https:'].includes(target.protocol)) {
  throw new Error('Application URL must use http:// or https://');
}
if (!fs.existsSync(path.join(directory, 'tests'))) {
  throw new Error('Run setup from an application directory containing tests/');
}

const packagePath = path.join(directory, 'package.json');
const pkg = fs.existsSync(packagePath)
  ? JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  : { name: 'playwright-requirement-tests', private: true };
pkg.scripts = {
  ...pkg.scripts,
  'test:e2e': 'playwright test',
  'test:e2e:list': 'playwright test --list',
  'test:e2e:ui': 'playwright test --ui',
  'test:e2e:report': 'playwright show-report',
};
pkg.devDependencies = { ...pkg.devDependencies, '@playwright/test': '1.57.0' };
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');

// The two Chinese travel tasks declare +08:00 benchmark clocks in their fixtures.
const fixturePath = path.join(directory, 'tests/fixtures/data.ts');
const fixtures = fs.existsSync(fixturePath) ? fs.readFileSync(fixturePath, 'utf8') : '';
const timezone = fixtures.includes('+08:00') ? 'Asia/Shanghai' : 'UTC';
fs.writeFileSync(path.join(directory, 'playwright.config.ts'), `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: true,
  timeout: 10_000,
  expect: { timeout: 10_000 },
  outputDir: './test-results',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: ${JSON.stringify(target.href)},
    timezoneId: ${JSON.stringify(timezone)},
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
`);

const ignored = ['/node_modules/', '/playwright-report/', '/test-results/', '/blob-report/', '/playwright/.auth/'];
const ignorePath = path.join(directory, '.gitignore');
const existing = fs.existsSync(ignorePath) ? fs.readFileSync(ignorePath, 'utf8') : '';
const lines = new Set(existing.split(/\r?\n/));
const missing = ignored.filter(line => !lines.has(line));
if (missing.length) {
  fs.appendFileSync(ignorePath, (existing && !existing.endsWith('\n') ? '\n' : '') + missing.join('\n') + '\n');
}
