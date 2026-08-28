#!/usr/bin/env bash

set -Eeuo pipefail

APP_NAME="${1:-${ARC_APP:-}}"
EXPORT_ROOT="${EXPORT_ROOT:-/export}"
APP_PORT="${ARC_RUNTIME_PORT:-3301}"
REPO_ROOT="/opt/arc"
CONFIG_PATH="${REPO_ROOT}/apps.config.json"
RESULT_ROOT="${EXPORT_ROOT%/}/reference/${APP_NAME}"
WORKSPACE_ROOT="/workspaces/reference"
APP_ROOT="${WORKSPACE_ROOT}/${APP_NAME}"
PROJECT_WORKSPACE="${APP_ROOT}/project"
TEST_WORKSPACE="${APP_ROOT}/tests"
SETUP_LOG="${RESULT_ROOT}/logs/setup.log"
APP_LOG="${RESULT_ROOT}/logs/app.log"
TEST_LOG="${RESULT_ROOT}/logs/test.log"
HEALTH_PATH="${ARC_HEALTH_PATH:-/api/health}"
START_TIMEOUT="${ARC_START_TIMEOUT_SECONDS:-60}"
REFERENCE_TEST_TIMEOUT="${ARC_REFERENCE_TEST_TIMEOUT:-15000}"
REFERENCE_REPORTER="${ARC_REFERENCE_REPORTER:-line}"
BASE_URL="http://127.0.0.1:${APP_PORT}"
SERVER_PID=""
APP_PROJECT_DIR=""
APP_TEST_DIR=""

usage() {
  cat <<'EOF'
Usage:
  docker run ... --entrypoint /usr/local/bin/arc-reference-entrypoint arc-reproduction:latest <app-name>

Supported app names:
EOF
  node -e '
    const fs = require("fs");
    const config = JSON.parse(fs.readFileSync("apps.config.json", "utf8"));
    console.log(`  ${Object.keys(config.apps).join(", ")}`);
  ' 2>/dev/null || true
}

config_value() {
  local field="$1"
  local fallback="$2"
  node -e '
    const fs = require("fs");
    const config = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    const appName = process.argv[2];
    const field = process.argv[3];
    const fallback = process.argv[4];
    const app = config.apps[appName];
    if (!app) process.exit(1);
    process.stdout.write(app[field] || fallback);
  ' "${CONFIG_PATH}" "${APP_NAME}" "${field}" "${fallback}"
}

if [[ -z "${APP_NAME}" || "${APP_NAME}" == "all" ]]; then
  usage >&2
  exit 2
fi

if ! APP_PROJECT_DIR="$(config_value "projectDir" "arc-bench/webapp/${APP_NAME}/project")"; then
  echo "[ARC-Bench Reference] Unknown app: ${APP_NAME}" >&2
  usage >&2
  exit 2
fi
APP_TEST_DIR="$(config_value "testDir" "arc-bench/webapp/${APP_NAME}/tests")"

SOURCE_PROJECT="${REPO_ROOT}/${APP_PROJECT_DIR}"
SOURCE_TESTS="${REPO_ROOT}/${APP_TEST_DIR}"
if [[ ! -d "${SOURCE_PROJECT}" ]]; then
  echo "[ARC-Bench Reference] Reference project not found: ${SOURCE_PROJECT}" >&2
  exit 2
fi
if [[ ! -d "${SOURCE_TESTS}" ]]; then
  echo "[ARC-Bench Reference] Test directory not found: ${SOURCE_TESTS}" >&2
  exit 2
fi

mkdir -p "${RESULT_ROOT}"
find "${RESULT_ROOT}" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
mkdir -p "${RESULT_ROOT}/logs" "${APP_ROOT}"
rm -rf "${APP_ROOT}" "${REPO_ROOT}/test-results/${APP_NAME}" "${REPO_ROOT}/playwright-report"
mkdir -p "${APP_ROOT}"

write_summary() {
  local setup_status="$1"
  local runtime_status="$2"
  local test_status="$3"
  cat > "${RESULT_ROOT}/summary.txt" <<EOF
app=${APP_NAME}
mode=reference
setup_status=${setup_status}
runtime_status=${runtime_status}
test_status=${test_status}
target_url=${BASE_URL}
source_project=${APP_PROJECT_DIR}
source_tests=${APP_TEST_DIR}
workspace=${PROJECT_WORKSPACE}
test_results_dir=test-results/
playwright_report_dir=playwright-report/
EOF
}

cleanup() {
  if [[ -n "${SERVER_PID}" ]] && kill -0 "${SERVER_PID}" 2>/dev/null; then
    kill "${SERVER_PID}" 2>/dev/null || true
    wait "${SERVER_PID}" 2>/dev/null || true
  fi
}
trap cleanup EXIT

has_npm_script() {
  local package_json="$1"
  local script_name="$2"
  node -e '
    const fs = require("fs");
    const pkg = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    process.exit(pkg.scripts && pkg.scripts[process.argv[2]] ? 0 : 1);
  ' "${package_json}" "${script_name}"
}

install_node_project() {
  local dir="$1"
  if [[ ! -f "${dir}/package.json" ]]; then
    return 0
  fi

  (
    cd "${dir}"
    npm install
  )
}

run_build_if_present() {
  local dir="$1"
  if [[ ! -f "${dir}/package.json" ]] || ! has_npm_script "${dir}/package.json" "build"; then
    return 0
  fi

  (
    cd "${dir}"
    npm run build
  )
}

copy_project_source() {
  local source="$1"
  local target="$2"
  mkdir -p "${target}"

  (
    cd "${source}"
    tar \
      --exclude='./node_modules' \
      --exclude='./frontend/node_modules' \
      --exclude='./backend/node_modules' \
      -cf - .
  ) | (cd "${target}" && tar -xf -)
}

install_playwright_browser_if_present() {
  local dir="$1"
  if [[ ! -f "${dir}/package.json" ]]; then
    return 0
  fi

  if [[ -f "${dir}/node_modules/@playwright/test/cli.js" ]]; then
    (cd "${dir}" && node node_modules/@playwright/test/cli.js install chromium)
  fi

  if [[ -f "${dir}/node_modules/playwright/cli.js" ]]; then
    (cd "${dir}" && node node_modules/playwright/cli.js install chromium)
  fi
}

copy_artifacts() {
  local base="$1"
  if [[ -d "${base}/test-results" ]]; then
    cp -a "${base}/test-results" "${RESULT_ROOT}/test-results"
  elif [[ -d "${REPO_ROOT}/test-results/${APP_NAME}" ]]; then
    cp -a "${REPO_ROOT}/test-results/${APP_NAME}" "${RESULT_ROOT}/test-results"
  fi

  if [[ -d "${base}/playwright-report" ]]; then
    cp -a "${base}/playwright-report" "${RESULT_ROOT}/playwright-report"
  elif [[ -d "${REPO_ROOT}/playwright-report" ]]; then
    cp -a "${REPO_ROOT}/playwright-report" "${RESULT_ROOT}/playwright-report"
  fi
}

echo "[ARC-Bench Reference] Preparing ${APP_NAME} reference project"
set +e
{
  copy_project_source "${SOURCE_PROJECT}" "${PROJECT_WORKSPACE}"
  mkdir -p "${TEST_WORKSPACE}"
  cp -a "${SOURCE_TESTS}/." "${TEST_WORKSPACE}/"

  install_node_project "${PROJECT_WORKSPACE}"
  install_node_project "${PROJECT_WORKSPACE}/frontend"
  install_node_project "${PROJECT_WORKSPACE}/backend"
  install_playwright_browser_if_present "${PROJECT_WORKSPACE}"
  install_playwright_browser_if_present "${PROJECT_WORKSPACE}/backend"
  run_build_if_present "${PROJECT_WORKSPACE}"
  run_build_if_present "${PROJECT_WORKSPACE}/frontend"
} > "${SETUP_LOG}" 2>&1
setup_status=$?
set -e

if [[ "${setup_status}" -ne 0 ]]; then
  echo "[ARC-Bench Reference] Reference setup failed. See ${SETUP_LOG}" >&2
  write_summary "${setup_status}" "not-started" "not-run"
  exit "${setup_status}"
fi

if [[ -f "${PROJECT_WORKSPACE}/backend/playwright.config.js" ]]; then
  echo "[ARC-Bench Reference] Running project Playwright config for ${APP_NAME}"
  set +e
  (
    cd "${PROJECT_WORKSPACE}/backend"
    PLAYWRIGHT_BASE_URL="${BASE_URL}" \
      npx playwright test \
        --config playwright.config.js \
        --timeout="${REFERENCE_TEST_TIMEOUT}" \
        --reporter="${REFERENCE_REPORTER}"
  ) 2>&1 | tee "${TEST_LOG}"
  test_status=${PIPESTATUS[0]}
  set -e
  copy_artifacts "${PROJECT_WORKSPACE}/backend"
  write_summary "${setup_status}" "managed-by-playwright" "${test_status}"
  exit "${test_status}"
fi

if [[ -f "${PROJECT_WORKSPACE}/backend/package.json" ]]; then
  START_DIR="${PROJECT_WORKSPACE}/backend"
elif [[ -f "${PROJECT_WORKSPACE}/package.json" ]]; then
  START_DIR="${PROJECT_WORKSPACE}"
else
  echo "[ARC-Bench Reference] No runnable package.json found in ${PROJECT_WORKSPACE} or ${PROJECT_WORKSPACE}/backend" >&2
  write_summary "${setup_status}" "not-started" "not-run"
  exit 2
fi

echo "[ARC-Bench Reference] Starting ${APP_NAME} reference application on port ${APP_PORT}"
(
  cd "${START_DIR}"
  PORT="${APP_PORT}" npm run start
) > "${APP_LOG}" 2>&1 &
SERVER_PID=$!

runtime_status=1
for _ in $(seq 1 "${START_TIMEOUT}"); do
  if curl --fail --silent "${BASE_URL}${HEALTH_PATH}" > /dev/null; then
    runtime_status=0
    break
  fi
  if ! kill -0 "${SERVER_PID}" 2>/dev/null; then
    break
  fi
  sleep 1
done

if [[ "${runtime_status}" -ne 0 ]]; then
  echo "[ARC-Bench Reference] Reference application did not become healthy at ${BASE_URL}${HEALTH_PATH}" >&2
  write_summary "${setup_status}" "${runtime_status}" "not-run"
  exit 1
fi

echo "[ARC-Bench Reference] Running benchmark tests for ${APP_NAME}"
set +e
TARGET_URL="${BASE_URL}" npm run test -- --app "${APP_NAME}" 2>&1 | tee "${TEST_LOG}"
test_status=${PIPESTATUS[0]}
set -e

copy_artifacts "${REPO_ROOT}"
write_summary "${setup_status}" "${runtime_status}" "${test_status}"
exit "${test_status}"
