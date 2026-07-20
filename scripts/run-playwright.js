#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const configPath = path.join(rootDir, 'apps.config.json');
const appConfig = JSON.parse(fs.readFileSync(configPath, 'utf8')).apps;
const appNames = Object.keys(appConfig);

function printHelp() {
  console.log(`Usage:
  npm run test -- --app <name|all> [options]

Options:
  --app <name|all>             App to test. Defaults to all.
  --target-url <url|mapping>   Target URL. For all apps, use app=url,app=url.
  --workers <n>                Playwright worker count.
  --timeout <ms>               Per-test timeout.
  --expect-timeout <ms>        Assertion timeout.
  --headed                     Run browsers headed.
  --project <name>             Playwright project name.
  --grep <pattern>             Playwright grep pattern.
  --list                       List supported apps.
  --help                       Show this help.

Examples:
  npm run test -- --app 12306 --target-url http://127.0.0.1:3101
  npm run test -- --app 12306 --workers 4 --timeout 90000
  npm run test -- --app all --target-url 12306=http://127.0.0.1:3101,bookstack=http://127.0.0.1:3102`);
}

function takeValue(args, index, option) {
  const value = args[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${option} requires a value`);
  }
  return value;
}

function parseArgs(argv) {
  const options = {
    app: process.env.ARC_APP || 'all',
    targetUrl: process.env.TARGET_URL || '',
    workers: process.env.PLAYWRIGHT_WORKERS || '',
    timeout: process.env.PLAYWRIGHT_TEST_TIMEOUT || '',
    expectTimeout: process.env.PLAYWRIGHT_EXPECT_TIMEOUT || '',
    playwrightArgs: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--') {
      options.playwrightArgs.push(...argv.slice(index + 1));
      break;
    }
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--list') options.list = true;
    else if (arg === '--headed') options.playwrightArgs.push('--headed');
    else if (arg === '--app' || arg === '-a') options.app = takeValue(argv, index++, arg);
    else if (arg === '--target-url' || arg === '--url') options.targetUrl = takeValue(argv, index++, arg);
    else if (arg === '--workers') options.workers = takeValue(argv, index++, arg);
    else if (arg === '--timeout') options.timeout = takeValue(argv, index++, arg);
    else if (arg === '--expect-timeout') options.expectTimeout = takeValue(argv, index++, arg);
    else if (arg === '--project') options.playwrightArgs.push('--project', takeValue(argv, index++, arg));
    else if (arg === '--grep') options.playwrightArgs.push('--grep', takeValue(argv, index++, arg));
    else options.playwrightArgs.push(arg);
  }

  return options;
}

function parseTargetUrls(value) {
  if (!value) return {};
  if (!value.includes('=')) return { '*': value };

  return value.split(',').reduce((map, item) => {
    const [name, url] = item.split('=');
    if (!name || !url) throw new Error(`Invalid target URL mapping: ${item}`);
    map[name.trim()] = url.trim();
    return map;
  }, {});
}

function resolveApps(selection) {
  if (selection === 'all') return appNames;
  if (!appConfig[selection]) {
    throw new Error(`Unknown app "${selection}". Supported apps: ${appNames.join(', ')}`);
  }
  return [selection];
}

function runForApp(appName, options, targetUrls) {
  const app = appConfig[appName];
  const targetUrl = targetUrls[appName] || targetUrls['*'] || app.targetUrl;
  const env = {
    ...process.env,
    ARC_APP: appName,
    TARGET_URL: targetUrl,
    PLAYWRIGHT_OUTPUT_DIR: path.join('test-results', appName),
  };
  if (options.workers) env.PLAYWRIGHT_WORKERS = options.workers;
  if (options.timeout) env.PLAYWRIGHT_TEST_TIMEOUT = options.timeout;
  if (options.expectTimeout) env.PLAYWRIGHT_EXPECT_TIMEOUT = options.expectTimeout;

  const args = [
    'playwright',
    'test',
    app.testDir,
    '--config',
    'playwright.config.ts',
    ...options.playwrightArgs,
  ];

  console.log(`\n[ARC] Running ${appName} tests against ${targetUrl}`);
  const result = spawnSync('npx', args, {
    cwd: rootDir,
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  return result.status || 0;
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    process.exit(0);
  }
  if (options.list) {
    console.log(appNames.join('\n'));
    process.exit(0);
  }

  const selectedApps = resolveApps(options.app);
  const targetUrls = parseTargetUrls(options.targetUrl);
  let exitCode = 0;

  for (const appName of selectedApps) {
    const status = runForApp(appName, options, targetUrls);
    if (status !== 0) exitCode = status;
  }

  process.exit(exitCode);
} catch (error) {
  console.error(`[ARC] ${error.message}`);
  console.error('Run `npm run test -- --help` for usage.');
  process.exit(1);
}
