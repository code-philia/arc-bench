# Compiling Large Multi-Modal Requirement Documents into Runnable Software Systems: From an Agentic Test-Driven Perspective

This repository is a reproduction bundle for ARC generation and evaluation.

## Contents

- `agentic-requirement-compiler/`: ARC compiler as a git submodule.
- `arc-bench/`: six web apps, each with a complete `requirements/` directory and `tests/` directory.
- Root Playwright config and a test runner that supports one app or all apps, worker control, timeouts, and target URL overrides.

## Repository Layout

```text
ARC/
|-- agentic-requirement-compiler/
|-- arc-bench/
|   `-- webapp/
|       |-- requirements/
|       `-- tests/
|-- apps.config.json
|-- playwright.config.ts
|-- scripts/
`-- README.md
```

## Reproduction Flow

### 1. Fetch the compiler

Clone this repository with submodules:

```bash
git clone --recurse-submodules <ARC_REPO_URL> ARC
cd ARC
```

If you already cloned without submodules:

```bash
git submodule update --init --recursive
```

The compiler repository is pinned at `agentic-requirement-compiler/`.

### 2. Set up ARC compiler dependencies

Follow the compiler README in `agentic-requirement-compiler/`:

```bash
cd agentic-requirement-compiler
uv venv

# Windows PowerShell
.venv\Scripts\Activate.ps1

uv pip install -r src/requirements.txt
uv pip install -e .
```

Set your model configuration in `.env` at the ARC root if needed. Start from `.env.example`.

When running ARC from the compiler submodule, point the compiler to the root env file:

```bash
export ARC_ENV_FILE="$(pwd)/../.env"
```

On Windows PowerShell:

```powershell
$env:ARC_ENV_FILE = (Resolve-Path ..\.env)
```

### 3. Generate one app

Each web app in `arc-bench/webapp/requirements/` can be compiled independently.

The `--web-port` value is part of the reproduction contract. Use the same port later when you run the generated app and the Playwright tests.

Example for `12306`:

```bash
cd agentic-requirement-compiler
arc-agent ../arc-bench/webapp/requirements/12306 --app-type web --output-dir ../workspace/12306 --web-port 3101 --clear-all
```

Use the matching port for each app:

- `12306` -> `3101`
- `bookstack` -> `3102`
- `ctrip` -> `3103`
- `keep` -> `3104`
- `prestashop` -> `3105`
- `stackoverflow` -> `3106`

### 4. Start the generated app

The web template produced by ARC is backend-led. Build the frontend, then start the backend from the generated output directory. The backend serves both `/api/*` and the compiled frontend from the same origin.

The generated template README explains the exact commands, but the standard flow is:

```bash
cd ../workspace/12306
cd backend
npm install

cd ../frontend
npm install
npm run build

cd ../backend
PORT=3101 npm run start
```

On Windows PowerShell, set `PORT` before starting the backend:

```powershell
cd ..\workspace\12306\backend
$env:PORT = "3101"
npm run start
```

The app should be reachable at the port passed through `--web-port`.

Health check:

```bash
curl http://127.0.0.1:3101/api/health
```

If you use the generated frontend dev server instead of the backend-hosted production-style flow, make sure the Playwright `--target-url` points to the actual browser entry URL.

### 5. Run Playwright tests

Install Playwright once at the ARC root:

```bash
cd ../../
npm install
npm run test:install
```

Run one app:

```bash
npm run test -- --app 12306 --target-url http://127.0.0.1:3101
```

Run all six apps:

```bash
npm run test -- --app all
```

Override worker count and timeout when needed:

```bash
npm run test -- --app 12306 --workers 4 --timeout 90000 --target-url http://127.0.0.1:3101
```

Pass a different target URL per app when running all:

```bash
npm run test -- --app all --target-url 12306=http://127.0.0.1:3101,bookstack=http://127.0.0.1:3102,ctrip=http://127.0.0.1:3103,keep=http://127.0.0.1:3104,prestashop=http://127.0.0.1:3105,stackoverflow=http://127.0.0.1:3106
```

## Batch Commands

Generate another app by changing the requirement directory, output directory, and port:

```bash
cd agentic-requirement-compiler
arc-agent ../arc-bench/webapp/requirements/bookstack --app-type web --output-dir ../workspace/bookstack --web-port 3102 --clear-all
arc-agent ../arc-bench/webapp/requirements/ctrip --app-type web --output-dir ../workspace/ctrip --web-port 3103 --clear-all
arc-agent ../arc-bench/webapp/requirements/keep --app-type web --output-dir ../workspace/keep --web-port 3104 --clear-all
arc-agent ../arc-bench/webapp/requirements/prestashop --app-type web --output-dir ../workspace/prestashop --web-port 3105 --clear-all
arc-agent ../arc-bench/webapp/requirements/stackoverflow --app-type web --output-dir ../workspace/stackoverflow --web-port 3106 --clear-all
```

For each generated app, repeat the same backend-hosted start flow with the matching `PORT`.

## Generated Web App Runtime

The generated ARC web template uses this runtime shape:

```text
workspace/<app>/
|-- frontend/
`-- backend/
```

Production-style serving is single-origin:

```bash
cd workspace/<app>/backend
npm install

cd ../frontend
npm install
npm run build

cd ../backend
npm run start
```

Set `PORT` explicitly if the process is not already using the ARC-configured `--web-port`.

## Test Runner

`scripts/run-playwright.js` wraps Playwright with these controls:

- `--app <name|all>`
- `--workers <n>`
- `--timeout <ms>`
- `--expect-timeout <ms>`
- `--target-url <url>` or `app=url,app=url`

The runner maps each app to the corresponding test directory under `arc-bench/webapp/tests/`.

## Notes

- The six apps are: `12306`, `bookstack`, `ctrip`, `keep`, `prestashop`, and `stackoverflow`.
- `playwright.config.ts` uses `TARGET_URL` as the base URL.
- Generated output is expected under `workspace/`.
