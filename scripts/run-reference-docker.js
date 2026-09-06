#!/usr/bin/env node

const { spawn } = require('node:child_process');
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
  --global-timeout <ms>        Playwright suite timeout.
  --process-timeout <ms>       Hard timeout for the Playwright process.
  --container-name <name>      Docker container name for cleanup and diagnostics.
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
    globalTimeout: process.env.ARC_REFERENCE_GLOBAL_TIMEOUT || '',
    processTimeout: process.env.ARC_REFERENCE_PROCESS_TIMEOUT || '',
    containerName: process.env.ARC_REFERENCE_CONTAINER_NAME || '',
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
    else if (arg === '--global-timeout') options.globalTimeout = takeValue(argv, index++, arg);
    else if (arg === '--process-timeout') options.processTimeout = takeValue(argv, index++, arg);
    else if (arg === '--container-name') options.containerName = takeValue(argv, index++, arg);
    else if (!arg.startsWith('--') && options.app === '12306') options.app = arg;
    else throw new Error(`Unknown option: ${arg}`);
  }

  return options;
}

function hasReferenceProject(appName) {
  const projectPath = resolveProjectDir(appName);
  return fs.existsSync(projectPath) && fs.statSync(projectPath).isDirectory();
}

function resolveApps(selection) {
  if (selection === 'all') {
    const availableApps = appNames.filter(hasReferenceProject);
    if (availableApps.length === 0) {
      throw new Error('No reference projects found under arc-bench/webapp/<app>/project');
    }
    return availableApps;
  }
  if (!appConfig[selection]) {
    throw new Error(`Unknown app "${selection}". Supported apps: ${appNames.join(', ')}`);
  }
  if (!hasReferenceProject(selection)) {
    throw new Error(`Reference project not found for ${selection}: ${resolveProjectDir(selection)}`);
  }
  return [selection];
}

function resolveProjectDir(appName) {
  const configured = appConfig[appName].projectDir || `arc-bench/webapp/${appName}/project`;
  return path.resolve(rootDir, configured);
}

function resolveTestDir(appName) {
  const configured = appConfig[appName].testDir || `arc-bench/webapp/${appName}/tests`;
  return {
    hostPath: path.resolve(rootDir, configured),
    containerPath: `/opt/arc/${configured.replace(/\\/g, '/')}`,
  };
}

function signalExitCode(signal) {
  return {
    SIGHUP: 129,
    SIGINT: 130,
    SIGTERM: 143,
  }[signal] || 1;
}

function stopProcess(child, signal) {
  if (!child || child.exitCode !== null || child.signalCode) return;
  try {
    child.kill(signal);
  } catch (error) {
    if (error.code !== 'ESRCH') {
      console.error(`[ARC-Bench] Could not signal Docker runner: ${error.message}`);
    }
  }
}

function stopContainer(containerName) {
  const stopper = spawn('docker', ['stop', '--timeout', '5', containerName], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  const forceTimer = setTimeout(() => stopProcess(stopper, 'SIGKILL'), 8000);
  stopper.once('close', () => clearTimeout(forceTimer));
  return stopper;
}

function runDocker(dockerArgs, containerName) {
  return new Promise((resolve) => {
    const child = spawn('docker', dockerArgs, {
      cwd: rootDir,
      stdio: 'inherit',
      shell: process.platform === 'win32',
      detached: process.platform !== 'win32',
    });
    let interrupted = false;
    let interruptionSignal;
    let settled = false;
    let stopper;
    let forceTimer;

    const cleanup = () => {
      if (forceTimer) clearTimeout(forceTimer);
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

    const onSignal = (signal) => {
      if (interrupted) {
        stopProcess(child, 'SIGKILL');
        if (stopper) stopProcess(stopper, 'SIGKILL');
        return;
      }
      interrupted = true;
      interruptionSignal = signal;
      console.error(`[ARC-Bench] Forwarding ${signal} and stopping ${containerName}`);
      stopper = stopContainer(containerName);
      forceTimer = setTimeout(() => stopProcess(child, 'SIGKILL'), 9000);
    };

    const onSigint = () => onSignal('SIGINT');
    const onSigterm = () => onSignal('SIGTERM');
    const onSighup = () => onSignal('SIGHUP');
    process.once('SIGINT', onSigint);
    process.once('SIGTERM', onSigterm);
    process.once('SIGHUP', onSighup);
    child.once('error', (error) => {
      console.error(`[ARC-Bench] Could not start Docker: ${error.message}`);
      finish(1);
    });
    child.once('close', (code, signal) => {
      if (interrupted) finish(signalExitCode(interruptionSignal || signal || 'SIGTERM'));
      else finish(typeof code === 'number' ? code : signalExitCode(signal));
    });
  });
}

async function runReferenceApp(appName, options) {
  const outputPath = path.resolve(rootDir, options.outputDir);
  const projectPath = resolveProjectDir(appName);
  const testDir = resolveTestDir(appName);
  const containerName = options.containerName || `arc-reference-${appName}-${process.pid}-${Date.now()}`;
  if (!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,62}$/.test(containerName)) {
    throw new Error(`Invalid Docker container name: ${containerName}`);
  }

  if (!fs.existsSync(testDir.hostPath) || !fs.statSync(testDir.hostPath).isDirectory()) {
    throw new Error(`Benchmark test directory not found for ${appName}: ${testDir.hostPath}`);
  }
  fs.mkdirSync(outputPath, { recursive: true });

  const dockerArgs = [
    'run',
    '--rm',
    '--mount',
    `type=bind,source=${outputPath},target=/export`,
    '--mount',
    `type=bind,source=${projectPath},target=/opt/arc/arc-bench/webapp/${appName}/project,readonly`,
    '--mount',
    `type=bind,source=${testDir.hostPath},target=${testDir.containerPath},readonly`,
    '--name',
    containerName,
    '-e',
    `ARC_RUNTIME_PORT=${options.runtimePort}`,
    '-e',
    `ARC_REFERENCE_TEST_TIMEOUT=${options.timeout}`,
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

  if (options.globalTimeout) {
    dockerArgs.push('-e', `ARC_REFERENCE_GLOBAL_TIMEOUT=${options.globalTimeout}`);
  }
  if (options.processTimeout) {
    dockerArgs.push('-e', `ARC_REFERENCE_PROCESS_TIMEOUT=${options.processTimeout}`);
  }
  dockerArgs.push(options.image, appName);

  console.log(`[ARC-Bench] Running ${appName} reference implementation in Docker`);
  return runDocker(dockerArgs, containerName);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    process.exit(0);
  }

  const selectedApps = resolveApps(options.app);
  let exitCode = 0;
  for (const appName of selectedApps) {
    const result = await runReferenceApp(appName, options);
    if (result.status !== 0) exitCode = result.status;
    if (result.interrupted) break;
  }
  process.exit(exitCode);
}

main().catch((error) => {
  console.error(`[ARC-Bench] ${error.message}`);
  console.error('Run `npm run reference -- --help` for usage.');
  process.exit(1);
});
