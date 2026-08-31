import { defineConfig, devices } from '@playwright/test';

const testTimeout = Number(process.env.PLAYWRIGHT_TEST_TIMEOUT || 60_000);
const expectTimeout = Number(process.env.PLAYWRIGHT_EXPECT_TIMEOUT || 10_000);
const workers = process.env.PLAYWRIGHT_WORKERS
  ? Number(process.env.PLAYWRIGHT_WORKERS)
  : undefined;

export default defineConfig({
  testDir: './arc-bench/webapp',
  timeout: testTimeout,
  expect: {
    timeout: expectTimeout,
  },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers,
  reporter: [
    ['list'],
    ['html', { outputFolder: process.env.PLAYWRIGHT_REPORT_DIR || 'playwright-report', open: 'never' }],
  ],
  outputDir: process.env.PLAYWRIGHT_OUTPUT_DIR || 'test-results',
  use: {
    baseURL: process.env.TARGET_URL || process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3301',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
