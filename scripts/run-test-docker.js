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
  npm run test:docker -- --app <name|all> --target-url <url|mapping> [options]

Options:
  --app <name|all>             App to test. Defaults to all.
  --target-url <url|mapping>   Target URL. For all apps, use app=url,app=url.
  --image <name>               Docker image name. Defaults to arc-reproduction:latest.
  --output-dir <path>          Host output directory. Defaults to docker-output.
  --workers <n>                Playwright worker count.
  --timeout <ms>               Per-test timeout.
  --expect-timeout <ms>        Assertion timeout.
  --headed                     Run browsers headed.
  --project <name>             Playwright project name.
  --grep <pattern>             Playwright grep pattern.
  --env <key=value>            Additional Docker environment variable. Repeatable.
  --help                       Show this help.

Examples:
  npm run test:docker -- --app bookstack --target-url http://host.docker.internal:3301
  npm run test:docker -- --app bookstack --target-url http://127.0.0.1:3301
  npm run test:docker -- --app all --target-url bookstack=http://host.docker.internal:3301,keep=http://host.docker.internal:3302`);
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
    image: process.env.IMAGE_NAME || 'arc-reproduction:latest',
    outputDir: process.env.OUTPUT_DIR || 'docker-output',
    env: [],
    forwarded: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--app' || arg === '-a') options.app = takeValue(argv, index++, arg);
    else if (arg === '--target-url' || arg === '--url') options.targetUrl = takeValue(argv, index++, arg);
    else if (arg === '--image') options.image = takeValue(argv, index++, arg);
    else if (arg === '--output-dir') options.outputDir = takeValue(argv, index++, arg);
    else if (arg === '--env' || arg === '-e') options.env.push(takeValue(argv, index++, arg));
    else if (['--workers', '--timeout', '--expect-timeout', '--project', '--grep'].includes(arg)) {
      options.forwarded.push(arg, takeValue(argv, index++, arg));
    } else if (arg === '--headed') {
      options.forwarded.push(arg);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function validateAppSelection(selection) {
  if (selection === 'all') return;
  if (!appConfig[selection]) {
    throw new Error(`Unknown app "${selection}". Supported apps: ${appNames.join(', ')}`);
  }
}

function resolveApps(selection) {
  validateAppSelection(selection);
  return selection === 'all' ? appNames : [selection];
}

function resolveTestDir(appName) {
  const configured = appConfig[appName].testDir || `arc-bench/webapp/${appName}/tests`;
  return {
    hostPath: path.resolve(rootDir, configured),
    containerPath: `/opt/arc/${configured.replace(/\\/g, '/')}`,
  };
}

function rewriteLocalhostUrl(value) {
  if (!value) return value;
  return value
    .split(',')
    .map((item) => {
      const separatorIndex = item.indexOf('=');
      const name = separatorIndex >= 0 ? item.slice(0, separatorIndex) : '';
      const rawUrl = separatorIndex >= 0 ? item.slice(separatorIndex + 1) : item;
      const url = rawUrl.trim();
      let nextUrl = url;
      try {
        const parsed = new URL(url);
        if (['127.0.0.1', 'localhost', '0.0.0.0'].includes(parsed.hostname)) {
          parsed.hostname = 'host.docker.internal';
          nextUrl = parsed.toString().replace(/\/$/, '');
        }
      } catch {
        nextUrl = url;
      }
      return name ? `${name.trim()}=${nextUrl}` : nextUrl;
    })
    .join(',');
}

function runDockerTests(options) {
  if (!options.targetUrl) {
    throw new Error('--target-url is required for Docker test runs');
  }
  const selectedApps = resolveApps(options.app);

  const outputPath = path.resolve(rootDir, options.outputDir);
  fs.mkdirSync(outputPath, { recursive: true });

  const dockerTargetUrl = rewriteLocalhostUrl(options.targetUrl);
  const dockerArgs = [
    'run',
    '--rm',
    '--add-host',
    'host.docker.internal:host-gateway',
    '--mount',
    `type=bind,source=${outputPath},target=/export`,
  ];

  for (const appName of selectedApps) {
    const testDir = resolveTestDir(appName);
    if (!fs.existsSync(testDir.hostPath) || !fs.statSync(testDir.hostPath).isDirectory()) {
      throw new Error(`Benchmark test directory not found for ${appName}: ${testDir.hostPath}`);
    }
    dockerArgs.push('--mount', `type=bind,source=${testDir.hostPath},target=${testDir.containerPath},readonly`);
  }

  dockerArgs.push(
    '-e',
    'PLAYWRIGHT_OUTPUT_ROOT=/export/test',
    '-e',
    'PLAYWRIGHT_REPORT_ROOT=/export/test',
    '--entrypoint',
    'npm',
  );

  for (const item of options.env) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*=/.test(item)) {
      throw new Error(`Invalid environment assignment: ${item}`);
    }
    dockerArgs.push('-e', item);
  }

  dockerArgs.push(
    options.image,
    'run',
    'test',
    '--',
    '--app',
    options.app,
    '--target-url',
    dockerTargetUrl,
    ...options.forwarded,
  );

  console.log(`[ARC-Bench] Running Docker tests for ${options.app} against ${dockerTargetUrl}`);
  const result = spawnSync('docker', dockerArgs, {
    cwd: rootDir,
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
  process.exit(runDockerTests(options));
} catch (error) {
  console.error(`[ARC-Bench] ${error.message}`);
  console.error('Run `npm run test:docker -- --help` for usage.');
  process.exit(1);
}
