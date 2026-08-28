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
  npm run reference -- --app <name|all> [options]
  npm run reference -- <name> [options]

Options:
  --app <name|all>             Reference app to run. Defaults to 12306.
  --image <name>               Docker image name. Defaults to arc-reproduction:latest.
  --output-dir <path>          Host output directory. Defaults to docker-output.
  --runtime-port <port>        Shared app/test port. Defaults to 3301.
  --env-file <path>            Optional env file for database or runtime variables.
  --env <key=value>            Additional Docker environment variable. Repeatable.
  --timeout <ms>               Playwright test timeout. Defaults to 15000.
  --reporter <name>            Playwright reporter. Defaults to line.
  --help                       Show this help.

Examples:
  npm run reference -- --app 12306
  npm run reference -- 12306
  npm run reference -- --app 12306 --runtime-port 3141`);
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
    app: process.env.ARC_APP || '12306',
    image: process.env.IMAGE_NAME || 'arc-reproduction:latest',
    outputDir: process.env.OUTPUT_DIR || 'docker-output',
    runtimePort: process.env.ARC_RUNTIME_PORT || '3301',
    envFile: process.env.ENV_FILE || '',
    timeout: process.env.ARC_REFERENCE_TEST_TIMEOUT || '15000',
    reporter: process.env.ARC_REFERENCE_REPORTER || 'line',
    env: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--app' || arg === '-a') options.app = takeValue(argv, index++, arg);
    else if (arg === '--image') options.image = takeValue(argv, index++, arg);
    else if (arg === '--output-dir') options.outputDir = takeValue(argv, index++, arg);
    else if (arg === '--runtime-port') options.runtimePort = takeValue(argv, index++, arg);
    else if (arg === '--env-file') options.envFile = takeValue(argv, index++, arg);
    else if (arg === '--env' || arg === '-e') options.env.push(takeValue(argv, index++, arg));
    else if (arg === '--timeout') options.timeout = takeValue(argv, index++, arg);
    else if (arg === '--reporter') options.reporter = takeValue(argv, index++, arg);
    else if (!arg.startsWith('--') && options.app === '12306') options.app = arg;
    else throw new Error(`Unknown option: ${arg}`);
  }

  return options;
}

function resolveApps(selection) {
  if (selection === 'all') return appNames;
  if (!appConfig[selection]) {
    throw new Error(`Unknown app "${selection}". Supported apps: ${appNames.join(', ')}`);
  }
  return [selection];
}

function resolveProjectDir(appName) {
  const configured = appConfig[appName].projectDir || `arc-bench/webapp/${appName}/project`;
  return path.resolve(rootDir, configured);
}

function runReferenceApp(appName, options) {
  const outputPath = path.resolve(rootDir, options.outputDir);
  const projectPath = resolveProjectDir(appName);

  if (!fs.existsSync(projectPath) || !fs.statSync(projectPath).isDirectory()) {
    throw new Error(`Reference project not found for ${appName}: ${projectPath}`);
  }
  fs.mkdirSync(outputPath, { recursive: true });

  const dockerArgs = [
    'run',
    '--rm',
    '--mount',
    `type=bind,source=${outputPath},target=/export`,
    '--mount',
    `type=bind,source=${projectPath},target=/opt/arc/arc-bench/webapp/${appName}/project,readonly`,
    '-e',
    `ARC_RUNTIME_PORT=${options.runtimePort}`,
    '-e',
    `ARC_REFERENCE_TEST_TIMEOUT=${options.timeout}`,
    '-e',
    `ARC_REFERENCE_REPORTER=${options.reporter}`,
    '--entrypoint',
    '/usr/local/bin/arc-reference-entrypoint',
  ];

  if (options.envFile) {
    const envPath = path.resolve(rootDir, options.envFile);
    if (!fs.existsSync(envPath)) {
      throw new Error(`Environment file not found: ${envPath}`);
    }
    dockerArgs.push('--env-file', envPath);
  }

  for (const item of options.env) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*=/.test(item)) {
      throw new Error(`Invalid environment assignment: ${item}`);
    }
    dockerArgs.push('-e', item);
  }

  dockerArgs.push(options.image, appName);

  console.log(`[ARC-Bench] Running ${appName} reference implementation in Docker`);
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

  const selectedApps = resolveApps(options.app);
  let exitCode = 0;
  for (const appName of selectedApps) {
    const status = runReferenceApp(appName, options);
    if (status !== 0) exitCode = status;
  }
  process.exit(exitCode);
} catch (error) {
  console.error(`[ARC-Bench] ${error.message}`);
  console.error('Run `npm run reference -- --help` for usage.');
  process.exit(1);
}
