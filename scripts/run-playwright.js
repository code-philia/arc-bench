#!/usr/bin/env node

const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const configPath = path.join(rootDir, 'apps.config.json');
const appConfig = JSON.parse(fs.readFileSync(configPath, 'utf8')).apps;
const appNames = Object.keys(appConfig);
const defaultTargetUrl = process.env.TARGET_URL
  || `http://127.0.0.1:${process.env.ARC_RUNTIME_PORT || '3301'}`;

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
  --process-timeout <ms>       Hard timeout for the Playwright child process.
  --process-termination-grace <ms>
                               Grace period before force-killing that process tree.
  --list                       List supported apps.
  --help                       Show this help.

Examples:
  npm run test -- --app bookstack
  npm run test -- --app bookstack --workers 1 --timeout 90000
  npm run test -- --app all --target-url http://127.0.0.1:3301`);
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
    processTimeout: process.env.PLAYWRIGHT_PROCESS_TIMEOUT || '',
    processTerminationGrace: process.env.PLAYWRIGHT_PROCESS_TERMINATION_GRACE_MS || '5000',
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
    else if (arg === '--process-timeout') options.processTimeout = takeValue(argv, index++, arg);
    else if (arg === '--process-termination-grace') {
      options.processTerminationGrace = takeValue(argv, index++, arg);
    }
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
    const separatorIndex = item.indexOf('=');
    const name = separatorIndex >= 0 ? item.slice(0, separatorIndex) : '';
    const url = separatorIndex >= 0 ? item.slice(separatorIndex + 1) : '';
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

function parseTimeout(value, label, { allowZero = true } = {}) {
  if (!value) return 0;
  const timeout = Number(value);
  if (!Number.isSafeInteger(timeout) || timeout < 0 || (!allowZero && timeout === 0)) {
    throw new Error(`${label} must be a non-negative integer in milliseconds`);
  }
  return timeout;
}

function signalExitCode(signal) {
  return {
    SIGHUP: 129,
    SIGINT: 130,
    SIGTERM: 143,
  }[signal] || 1;
}

function signalProcessTree(child, signal) {
  if (!child || !child.pid) return;
  try {
    if (process.platform === 'win32') {
      const taskkillArgs = ['/PID', String(child.pid), '/T'];
      if (signal === 'SIGKILL') taskkillArgs.push('/F');
      const taskkill = spawn('taskkill', taskkillArgs, {
        stdio: 'ignore',
        windowsHide: true,
      });
      taskkill.once('error', (error) => {
        if (error.code !== 'ESRCH') {
          console.error(`[ARC] Could not terminate the Playwright process tree: ${error.message}`);
        }
      });
      taskkill.unref();
    } else {
      process.kill(-child.pid, signal);
    }
  } catch (error) {
    if (error.code !== 'ESRCH') {
      console.error(`[ARC] Could not send ${signal} to Playwright process tree: ${error.message}`);
    }
  }
}

function runPlaywrightProcess(args, env, { timeoutMs, terminationGraceMs }) {
  return new Promise((resolve) => {
    const child = spawn('npx', args, {
      cwd: rootDir,
      env,
      stdio: 'inherit',
      shell: process.platform === 'win32',
      detached: process.platform !== 'win32',
    });
    let settled = false;
    let timedOut = false;
    let interrupted = false;
    let terminating = false;
    let timeoutHandle;
    let forceKillHandle;

    const cleanup = () => {
      if (timeoutHandle) clearTimeout(timeoutHandle);
      if (forceKillHandle) clearTimeout(forceKillHandle);
      process.off('SIGINT', onSigint);
      process.off('SIGTERM', onSigterm);
      process.off('SIGHUP', onSighup);
    };

    const finish = (status) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve({ status, interrupted });
    };

    const stop = ({ timeout = false, signal = 'SIGTERM' } = {}) => {
      if (settled || terminating) return;
      terminating = true;
      timedOut = timeout;
      interrupted = !timeout;
      if (timeout) {
        console.error(`[ARC] Playwright process exceeded ${timeoutMs}ms; terminating its process tree`);
      } else {
        console.error(`[ARC] Forwarding ${signal} to the Playwright process tree`);
      }
      signalProcessTree(child, signal);
      forceKillHandle = setTimeout(() => {
        signalProcessTree(child, 'SIGKILL');
        finish(timeout ? 124 : signalExitCode(signal));
      }, terminationGraceMs);
    };

    const onSignal = (signal) => stop({ signal });
    const onSigint = () => onSignal('SIGINT');
    const onSigterm = () => onSignal('SIGTERM');
    const onSighup = () => onSignal('SIGHUP');
    process.once('SIGINT', onSigint);
    process.once('SIGTERM', onSigterm);
    process.once('SIGHUP', onSighup);

    child.once('error', (error) => {
      console.error(`[ARC] Could not start Playwright: ${error.message}`);
      finish(1);
    });
    child.once('close', (code, signal) => {
      if (terminating) return;
      if (timedOut) finish(124);
      else if (interrupted) finish(signalExitCode(signal || 'SIGTERM'));
      else finish(typeof code === 'number' ? code : signalExitCode(signal));
    });

    if (timeoutMs > 0) timeoutHandle = setTimeout(() => stop({ timeout: true }), timeoutMs);
  });
}

async function runForApp(appName, options, targetUrls) {
  const app = appConfig[appName];
  const targetUrl = targetUrls[appName] || targetUrls['*'] || app.targetUrl || defaultTargetUrl;
  const outputRoot = process.env.PLAYWRIGHT_OUTPUT_ROOT || '';
  const reportRoot = process.env.PLAYWRIGHT_REPORT_ROOT || '';
  const env = {
    ...process.env,
    ARC_APP: appName,
    TARGET_URL: targetUrl,
    PLAYWRIGHT_OUTPUT_DIR: outputRoot
      ? path.join(outputRoot, appName, 'test-results')
      : process.env.PLAYWRIGHT_OUTPUT_DIR || path.join('test-results', appName),
    PLAYWRIGHT_REPORT_DIR: reportRoot
      ? path.join(reportRoot, appName, 'playwright-report')
      : process.env.PLAYWRIGHT_REPORT_DIR || 'playwright-report',
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
  return runPlaywrightProcess(args, env, {
    timeoutMs: parseTimeout(options.processTimeout, '--process-timeout'),
    terminationGraceMs: parseTimeout(
      options.processTerminationGrace,
      '--process-termination-grace',
      { allowZero: false },
    ),
  });
}

async function main() {
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
    const result = await runForApp(appName, options, targetUrls);
    if (result.status !== 0) exitCode = result.status;
    if (result.interrupted) break;
  }

  process.exit(exitCode);
}

main().catch((error) => {
  console.error(`[ARC] ${error.message}`);
  console.error('Run `npm run test -- --help` for usage.');
  process.exit(1);
});
