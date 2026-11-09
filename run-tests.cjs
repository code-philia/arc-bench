const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const [directory, applicationUrl, ...playwrightArguments] = process.argv.slice(2);
const usage = 'Usage: npm test -- <test-directory> <application-url> [Playwright options]';

if (directory === '--help' || directory === '-h') {
  console.log(usage);
  console.log('Example: npm test -- ./arc-bench/12306/tests http://127.0.0.1:3000');
  process.exit(0);
}

if (!directory || !applicationUrl) {
  console.error(usage);
  process.exit(1);
}

let target;
try {
  target = new URL(applicationUrl);
} catch {
  console.error('Application URL must be a valid http:// or https:// URL.');
  process.exit(1);
}
if (!['http:', 'https:'].includes(target.protocol)) {
  console.error('Application URL must use http:// or https://.');
  process.exit(1);
}

let testDirectory = path.resolve(directory);
if (!fs.existsSync(testDirectory) || !fs.statSync(testDirectory).isDirectory()) {
  console.error(`Test directory does not exist: ${testDirectory}`);
  process.exit(1);
}
const nestedTests = path.join(testDirectory, 'tests');
if (fs.existsSync(nestedTests) && fs.statSync(nestedTests).isDirectory()) {
  testDirectory = nestedTests;
}

// Use the shared installation even when the tests are outside this repository.
const modulePaths = [path.join(__dirname, 'node_modules')];
if (process.env.NODE_PATH) {
  modulePaths.push(process.env.NODE_PATH);
}

console.log(`Test directory: ${testDirectory}`);
console.log(`Application URL: ${target.href}`);

const result = spawnSync(process.execPath, [
  require.resolve('@playwright/test/cli'),
  'test',
  '--config', path.join(__dirname, 'playwright.config.cjs'),
  ...playwrightArguments,
], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_PATH: modulePaths.join(path.delimiter),
    ARC_BENCH_TEST_DIR: testDirectory,
    ARC_BENCH_BASE_URL: target.href,
  },
});

if (result.error) {
  console.error(result.error.message);
}
if (result.signal) {
  process.kill(process.pid, result.signal);
} else {
  process.exit(result.status ?? 1);
}
