# ARC Experiment Reproduction Repository

## Repository Scope and References

This repository is the reproduction and evaluation bundle for ARC
(Agentic Requirement Compiler). It contains:

- `arc-bench/webapp/<app>/requirements/`: structured requirements for the
  benchmark web apps and a minimal smoke demo;
- `arc-bench/webapp/<app>/tests/`: Playwright tests for those apps;
- `agentic-requirement-compiler/`: the ARC compiler as a Git submodule;
- `Dockerfile` and `docker/entrypoint.sh`: the containerized compile, run, and
  test workflow.

Generated applications, logs, raw test results, and HTML reports are exported
under `docker-output/<app>/` after a run.

This repository is not a standalone implementation of the ARC compiler. The
compiler and its application templates are provided through Git submodules.

- **ARC Agent**: <https://github.com/code-philia/agentic-requirement-compiler>

## Repository Checkout and Environment Setup

### Prerequisites

Install the following:

- Docker Desktop on Windows/macOS or Docker Engine on Linux;
- access to an OpenAI-compatible model API;

### Clone the Repository and Update Submodules

```bash
git clone https://github.com/code-philia/ARC.git ARC
cd ARC

git submodule sync --recursive
git submodule update --init --remote --recursive
```

### Configure ARC Environment

The environment file belongs to the ARC compiler submodule. Read the configuration instructions in:

```text
agentic-requirement-compiler/README.md
```

Create the compiler environment file from the template.

Linux/macOS:

```bash
cp agentic-requirement-compiler/.env_example \
   agentic-requirement-compiler/.env
```

Windows PowerShell:

```powershell
Copy-Item `
  agentic-requirement-compiler\.env_example `
  agentic-requirement-compiler\.env
```

Edit `agentic-requirement-compiler/.env` according to the ARC compiler README.
At minimum, configure the model API credentials and model name. The file is
passed to Docker at runtime and is excluded from the Docker image.

## Complete Reproduction Flow

For one application, the complete flow is:

```text
arc-bench/webapp/<app>/
|-- requirements/   input requirements and reference assets
`-- tests/          Playwright tests for the generated app

ARC compiles `arc-bench/webapp/<app>/requirements/`
  -> generated backend starts on port 3301
  -> /api/health becomes available
  -> Playwright tests run from `arc-bench/webapp/<app>/tests/`
  -> application, logs, raw results, and HTML report are exported
```

The recommended command performs all steps in one isolated container. Start
with `demo-smoke` for a small smoke test before running the larger benchmark
apps.

If you add or modify `arc-bench/`, `apps.config.json`, `scripts/`, or
`docker/entrypoint.sh`, rebuild the image before running the container again.
The image copies those files at build time.

Linux:

```bash
mkdir -p docker-output

docker run --rm \
  --env-file agentic-requirement-compiler/.env \
  --mount "type=bind,source=$PWD/docker-output,target=/export" \
  arc-reproduction:latest demo-smoke
```

macOS:

```bash
mkdir -p docker-output

docker run --rm \
  --env-file agentic-requirement-compiler/.env \
  --mount "type=bind,source=$PWD/docker-output,target=/export" \
  arc-reproduction:latest demo-smoke
```

Windows PowerShell:

```powershell
New-Item -ItemType Directory -Force docker-output | Out-Null

docker run --rm `
  --env-file agentic-requirement-compiler\.env `
  --mount "type=bind,source=$((Get-Location).Path)\docker-output,target=/export" `
  arc-reproduction:latest demo-smoke
```

Replace `demo-smoke` with one of:

```text
demo-smoke
12306
bookstack
ctrip
keep
prestashop
stackoverflow
```

The container entrypoint performs:

```text
arc compile
  -> PORT=3301 npm run start
  -> wait for http://127.0.0.1:3301/api/health
  -> npm run test -- --app <app-name>
```

The container exits with:

- `0` when compilation, startup, and tests succeed;
- a non-zero status when compilation fails, the health check fails, or tests
  fail.

## Step-by-Step Commands

The one-container command above is recommended for complete reproduction. The
following commands are useful when debugging or running one stage separately.

### Step 1: Build the Docker Image

Linux/macOS:

```bash
docker build --progress=plain -t arc-reproduction:latest .
```

Windows PowerShell:

```powershell
docker build --progress=plain -t arc-reproduction:latest .
```

Parameter meanings:

- `docker build`: builds an image from the `Dockerfile`;
- `--progress=plain`: prints complete build logs;
- `-t arc-reproduction:latest`: assigns the image name and tag;
- `.`: uses the current repository as the Docker build context.


### Step 2: Compile an Application Only
This command runs ARC compilation without starting the generated application or
running Playwright.

Linux/macOS:

```bash
docker run --rm \
  --env-file agentic-requirement-compiler/.env \
  --mount "type=bind,source=$PWD/docker-output,target=/export" \
  --entrypoint arc \
  arc-reproduction:latest \
  compile /opt/arc/arc-bench/webapp/demo-smoke/requirements \
  -o /export/demo-smoke/application \
  --type web \
  --clean
```

Windows PowerShell:

```powershell
docker run --rm `
  --env-file agentic-requirement-compiler\.env `
  --mount "type=bind,source=$((Get-Location).Path)\docker-output,target=/export" `
  --entrypoint arc `
  arc-reproduction:latest `
  compile /opt/arc/arc-bench/webapp/demo-smoke/requirements `
  -o /export/demo-smoke/application `
  --type web `
  --clean
```

Parameter meanings:

- `--entrypoint arc`: bypasses the default Docker entrypoint and calls the
  installed ARC CLI directly;
- `compile`: compiles a requirement directory into an application;
- `/opt/arc/arc-bench/webapp/demo-smoke/requirements`: the requirement
  directory inside the image;
- `-o /export/demo-smoke/application`: the generated application output
  directory;
- `--type web`: selects web application generation;
- `--clean`: removes an existing output directory before compilation;
- `--mount ...:/export`: persists the container output under
  `docker-output/demo-smoke/application` on the host.

### Step 3: Start an Existing Application and Run Its Tests

The default entrypoint already starts and tests a newly generated application.
To test an existing generated application, mount it into a fresh container,
start its backend, wait for the health endpoint, and run Playwright.

Linux/macOS:

```bash
docker run --rm \
  --mount "type=bind,source=$PWD/docker-output/demo-smoke/application,target=/workspaces/demo-smoke" \
  --entrypoint /bin/bash \
  arc-reproduction:latest \
  -lc 'set -e
       (cd /workspaces/demo-smoke/backend && PORT=3301 npm run start >/tmp/arc-app.log 2>&1) &
       server_pid=$!
       trap "kill $server_pid 2>/dev/null || true" EXIT
       until curl --fail --silent http://127.0.0.1:3301/api/health >/dev/null; do sleep 1; done
       cd /opt/arc
       TARGET_URL=http://127.0.0.1:3301 npm run test -- --app demo-smoke'
```

Windows PowerShell:

```powershell
docker run --rm `
  --mount "type=bind,source=$((Get-Location).Path)\docker-output\demo-smoke\application,target=/workspaces/demo-smoke" `
  --entrypoint /bin/bash `
  arc-reproduction:latest `
  -lc 'set -e; (cd /workspaces/demo-smoke/backend && PORT=3301 npm run start >/tmp/arc-app.log 2>&1) & server_pid=$!; trap "kill $server_pid 2>/dev/null || true" EXIT; until curl --fail --silent http://127.0.0.1:3301/api/health >/dev/null; do sleep 1; done; cd /opt/arc; TARGET_URL=http://127.0.0.1:3301 npm run test -- --app demo-smoke'
```

This form assumes the generated application already contains its dependencies
and frontend build output. Otherwise, use the complete one-container command.

### Step 4: Run All Applications

Linux/macOS:

```bash
for app in demo-smoke 12306 bookstack ctrip keep prestashop stackoverflow; do
  docker run --rm \
    --env-file agentic-requirement-compiler/.env \
    --mount "type=bind,source=$PWD/docker-output,target=/export" \
    arc-reproduction:latest "$app"
done
```

Windows PowerShell:

```powershell
$apps = @("demo-smoke", "12306", "bookstack", "ctrip", "keep", "prestashop", "stackoverflow")
New-Item -ItemType Directory -Force docker-output | Out-Null

foreach ($app in $apps) {
  docker run --rm `
    --env-file agentic-requirement-compiler\.env `
    --mount "type=bind,source=$((Get-Location).Path)\docker-output,target=/export" `
    arc-reproduction:latest $app
}
```

Each application runs in its own container and does not reuse another
application's backend process or workspace.

To launch the six benchmark applications in six separate Windows PowerShell
terminal windows, run:

```powershell
.\scripts\start-complete-flow.ps1
```

Optional switches:

- `-IncludeSmokeDemo`: also starts `demo-smoke`;
- `-CleanOutput`: removes `docker-output\<app>` before starting each app;
- `-ImageName <name>`: overrides the Docker image name, default
  `arc-reproduction:latest`;
- `-EnvFile <path>`: overrides the environment file path, default
  `agentic-requirement-compiler\.env`;
- `-OutputDir <path>`: overrides the export directory, default
  `docker-output`.

## Outputs and Test Runner

Results are written to:

```text
docker-output/<app>/
|-- application/       generated ARC application
|-- logs/
|   |-- compile.log    ARC compilation log
|   |-- app.log        application startup log
|   `-- test.log       Playwright log
|-- test-results/      screenshots, videos, traces, and raw results
|-- playwright-report/ Playwright HTML report
`-- summary.txt        compilation, runtime, and test statuses
```

Open the HTML report at:

```text
docker-output/demo-smoke/playwright-report/index.html
```
