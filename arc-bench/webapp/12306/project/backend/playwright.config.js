const { defineConfig } = require('@playwright/test');
const path = require('path');
const Module = require('module');

process.env.NODE_PATH = [path.resolve(__dirname, 'node_modules'), process.env.NODE_PATH].filter(Boolean).join(path.delimiter);
Module._initPaths();

const baseURL = process.env.PLAYWRIGHT_BASE_URL || process.env.ARC_WEB_BASE_URL || 'http://127.0.0.1:3000';
const testDate = process.env.ARC_TEST_DATE || new Date().toISOString().slice(0, 10);
process.env.ARC_TEST_DATE = testDate;
const webPort = new URL(baseURL).port || '3000';
const testDatabase = path.resolve(__dirname, '.arc-test-db', `playwright-${process.pid}.db`);

module.exports = defineConfig({
  testDir: '../../tests',
  testMatch: /REQ-.*\.(js|jsx|ts|tsx)$/,
  timeout: 30000,
  workers: 1,
  fullyParallel: false,
  webServer: {
    command: 'node src/index.js',
    url: `${baseURL}/api/health`,
    timeout: 30000,
    reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER === '1',
    env: { PORT: webPort, ARC_TEST_MODE: '1', ARC_TEST_DATE: testDate, ARC_DB_FILE: testDatabase },
  },
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
});
