# ARC-Bench

`arc-bench` is a benchmark for requirement-to-application generation. It
evaluates whether a generation system can transform multi-modal web application
requirements into a runnable implementation whose behavior is validated by
end-to-end Playwright tests.

The benchmark is organized as a set of web application tasks. Each task pairs a
requirement package with an executable test suite, so different generators can
be compared against the same inputs and behavioral checks. This repository
contains:

- `arc-bench/webapp/<app>/requirements/`: structured requirements for the
  benchmark web apps;
- `arc-bench/webapp/<app>/tests/`: Playwright tests for those apps;
- `arc-bench/webapp/<app>/project/`: optional reference implementation for an
  app;
- `scripts/run-playwright.js` and `playwright.config.ts`: the benchmark test
  runner;
- `Dockerfile`: an optional containerized benchmark execution environment.

The benchmark itself is generator-agnostic: any method can consume the
requirements, produce a web application, start it locally, and run the provided
tests against the application URL.

## 📊 Benchmark Applications

Requirement counts are the number of atomic requirement nodes in
`requirements.yaml`. Test counts are the number of Playwright `test(...)` cases.

| App | # Requirements | # Test cases | # Domain |
| --- | ---: | ---: | --- |
| `keep` | 32 | 32 | Google Keep, <https://keep.google.com/> |
| `bookstack` | 34 | 34 | BookStack, <https://demo.bookstackapp.com/> |
| `stackoverflow` | 66 | 66 | Stack Overflow, <https://stackoverflow.com/> |
| `prestashop` | 86 | 86 | PrestaShop, <https://demo.prestashop.com/> |
| `12306` | 117 | 117 | China Railway 12306, <https://www.12306.cn/en> |
| `ctrip` | 125 | 125 | Ctrip, <https://www.ctrip.com/> |

## 🚀 Benchmark Basic Usage

The benchmark usage is independent of any particular generation method:

```text
arc-bench/webapp/<app>/requirements/
  -> generate a runnable web application with a chosen method
  -> start the generated application
  -> run arc-bench/webapp/<app>/tests/ against the application URL
```

Install the local test runner when running tests directly on the host:

```bash
npm install
npm run test:install
```

Run one benchmark application's tests against a running application:

```bash
npm run test -- --app bookstack --target-url http://127.0.0.1:3301
```

The Docker image in this repository provides a benchmark execution environment:
Node.js, Playwright browsers, the test runner, and benchmark files. Application
source code is imported at runtime, then installed, started, and tested inside
the container.

## 🧪 Reference Implementation Testing

Reference implementations can be placed under:

```text
arc-bench/webapp/<app>/project/
```
The reference app must listen on `PORT` and expose a health endpoint at
`/api/health`.

### Run Reference Implementation

Build or rebuild the benchmark image after changing Docker scripts or the test
runner:

```bash
npm run docker:build
```

Run the `12306` reference implementation in Docker and execute its benchmark
tests:

```bash
npm run reference -- --app 12306
```

Equivalent shorthand:

```bash
npm run reference:12306
```

## 🧩 ARC Baseline Reproduction Flow

This section is an application example of the benchmark using ARC (Agentic
Requirement Compiler) as the generation method. This repository is not a
standalone implementation of the ARC compiler; the compiler and its application
templates are provided through Git submodules.

- **ARC Agent**: <https://github.com/code-philia/agentic-requirement-compiler>

### Prerequisites

Install the following for the ARC baseline example:

- Docker Desktop on Windows/macOS or Docker Engine on Linux;
- access to an OpenAI-compatible model API.

### Clone the Repository and Update Submodules

Clone the benchmark repository and initialize the ARC compiler submodule and
its nested submodules:

```bash
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

The recommended ARC baseline command performs all steps in one isolated
container. The examples below use `bookstack`; replace it with another benchmark
app name as needed.

If you add or modify `arc-bench/`, `apps.config.json`, `scripts/`, or
`docker/entrypoint.sh`, rebuild the image before running the container again.
The image copies those files at build time.

Linux:

```bash
mkdir -p docker-output

docker run --rm \
  --env-file agentic-requirement-compiler/.env \
  --mount "type=bind,source=$PWD/docker-output,target=/export" \
  arc-reproduction:latest bookstack
```

macOS:

```bash
mkdir -p docker-output

docker run --rm \
  --env-file agentic-requirement-compiler/.env \
  --mount "type=bind,source=$PWD/docker-output,target=/export" \
  arc-reproduction:latest bookstack
```

Windows PowerShell:

```powershell
New-Item -ItemType Directory -Force docker-output | Out-Null

docker run --rm `
  --env-file agentic-requirement-compiler\.env `
  --mount "type=bind,source=$((Get-Location).Path)\docker-output,target=/export" `
  arc-reproduction:latest bookstack
```

Replace `bookstack` with one of:

```text
keep
bookstack
stackoverflow
prestashop
12306
ctrip
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

### Step-by-Step Commands

The one-container command above is recommended for complete reproduction. The
following commands are useful when debugging or running one stage separately.

#### Step 1: Build the Docker Image

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


#### Step 2: Compile an Application Only
This command runs ARC compilation without starting the generated application or
running Playwright.

Linux/macOS:

```bash
docker run --rm \
  --env-file agentic-requirement-compiler/.env \
  --mount "type=bind,source=$PWD/docker-output,target=/export" \
  --entrypoint arc \
  arc-reproduction:latest \
  compile /opt/arc/arc-bench/webapp/bookstack/requirements \
  -o /export/bookstack/application \
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
  compile /opt/arc/arc-bench/webapp/bookstack/requirements `
  -o /export/bookstack/application `
  --type web `
  --clean
```

Parameter meanings:

- `--entrypoint arc`: bypasses the default Docker entrypoint and calls the
  installed ARC CLI directly;
- `compile`: compiles a requirement directory into an application;
- `/opt/arc/arc-bench/webapp/bookstack/requirements`: the requirement
  directory inside the image;
- `-o /export/bookstack/application`: the generated application output
  directory;
- `--type web`: selects web application generation;
- `--clean`: removes an existing output directory before compilation;
- `--mount ...:/export`: persists the container output under
  `docker-output/bookstack/application` on the host.

#### Step 3: Start an Existing Application and Run Its Tests

The default entrypoint already starts and tests a newly generated application.
To test an existing generated application, mount it into a fresh container,
start its backend, wait for the health endpoint, and run Playwright.

Linux/macOS:

```bash
docker run --rm \
  --mount "type=bind,source=$PWD/docker-output/bookstack/application,target=/workspaces/bookstack" \
  --entrypoint /bin/bash \
  arc-reproduction:latest \
  -lc 'set -e
       (cd /workspaces/bookstack/backend && PORT=3301 npm run start >/tmp/arc-app.log 2>&1) &
       server_pid=$!
       trap "kill $server_pid 2>/dev/null || true" EXIT
       until curl --fail --silent http://127.0.0.1:3301/api/health >/dev/null; do sleep 1; done
       cd /opt/arc
       TARGET_URL=http://127.0.0.1:3301 npm run test -- --app bookstack'
```

Windows PowerShell:

```powershell
docker run --rm `
  --mount "type=bind,source=$((Get-Location).Path)\docker-output\bookstack\application,target=/workspaces/bookstack" `
  --entrypoint /bin/bash `
  arc-reproduction:latest `
  -lc 'set -e; (cd /workspaces/bookstack/backend && PORT=3301 npm run start >/tmp/arc-app.log 2>&1) & server_pid=$!; trap "kill $server_pid 2>/dev/null || true" EXIT; until curl --fail --silent http://127.0.0.1:3301/api/health >/dev/null; do sleep 1; done; cd /opt/arc; TARGET_URL=http://127.0.0.1:3301 npm run test -- --app bookstack'
```

This form assumes the generated application already contains its dependencies
and frontend build output. Otherwise, use the complete one-container command.

#### Step 4: Run All Applications

Linux/macOS:

```bash
for app in keep bookstack stackoverflow prestashop 12306 ctrip; do
  docker run --rm \
    --env-file agentic-requirement-compiler/.env \
    --mount "type=bind,source=$PWD/docker-output,target=/export" \
    arc-reproduction:latest "$app"
done
```

Windows PowerShell:

```powershell
$apps = @("keep", "bookstack", "stackoverflow", "prestashop", "12306", "ctrip")
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

### Outputs and Test Runner

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
docker-output/bookstack/playwright-report/index.html
```
