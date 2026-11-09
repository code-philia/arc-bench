const fs = require('node:fs');
const path = require('node:path');
const { defineConfig, devices } = require('@playwright/test');

const testDirectory = process.env.ARC_BENCH_TEST_DIR;
const baseURL = process.env.ARC_BENCH_BASE_URL;
if (!testDirectory || !baseURL) {
  throw new Error('Run: npm test -- <test-directory> <application-url>');
}

// Travel tasks declare their benchmark clock in the fixture data.
const fixturePath = path.join(testDirectory, 'fixtures', 'data.ts');
let timezoneId = 'UTC';
if (fs.existsSync(fixturePath)) {
  const fixtures = fs.readFileSync(fixturePath, 'utf8');
  if (fixtures.includes('+08:00')) {
    timezoneId = 'Asia/Shanghai';
  }
}

module.exports = defineConfig({
  testDir: testDirectory,
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: true,
  timeout: 10_000,
  expect: { timeout: 10_000 },
  outputDir: path.join(__dirname, 'test-results'),
  reporter: [
    ['list'],
    ['html', { outputFolder: path.join(__dirname, 'playwright-report'), open: 'never' }],
  ],
  use: {
    baseURL,
    timezoneId,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
