const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: __dirname,
  testMatch: '*.spec.ts',
  workers: 1,
  retries: 0,
  timeout: 10_000,
  expect: { timeout: 650 },
  use: { browserName: 'chromium', trace: 'retain-on-failure' },
});
