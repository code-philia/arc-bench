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
SETUP_LOG="${RESULT_ROOT}/logs/setup.log"
APP_LOG="${RESULT_ROOT}/logs/app.log"
TEST_LOG="${RESULT_ROOT}/logs/test.log"
HEALTH_PATH="${ARC_HEALTH_PATH:-/api/health}"
START_TIMEOUT="${ARC_START_TIMEOUT_SECONDS:-60}"
REFERENCE_TEST_TIMEOUT="${ARC_REFERENCE_TEST_TIMEOUT:-15000}"
REFERENCE_PROCESS_TIMEOUT="${ARC_REFERENCE_PROCESS_TIMEOUT:-600000}"
REFERENCE_PROCESS_TERMINATION_GRACE_MS="${ARC_REFERENCE_PROCESS_TERMINATION_GRACE_MS:-5000}"
REFERENCE_GLOBAL_TIMEOUT="${ARC_REFERENCE_GLOBAL_TIMEOUT:-}"
REFERENCE_ARTIFACT_COPY_TIMEOUT_SECONDS="${ARC_REFERENCE_ARTIFACT_COPY_TIMEOUT_SECONDS:-30}"
REFERENCE_TEST_TERMINATION_GRACE_SECONDS="${ARC_REFERENCE_TEST_TERMINATION_GRACE_SECONDS:-5}"
BASE_URL="http://127.0.0.1:${APP_PORT}"
SETUP_PID=""
SERVER_PID=""
TEST_PID=""
APP_PROJECT_DIR=""
APP_TEST_DIR=""
setup_status="not-run"
runtime_status="not-run"
test_status="not-run"
receipt_status="running"
termination_reason="none"
receipt_written=0

if [[ -z "${REFERENCE_GLOBAL_TIMEOUT}" && "${REFERENCE_PROCESS_TIMEOUT}" =~ ^[0-9]+$ ]]; then
  if (( REFERENCE_PROCESS_TIMEOUT > 30000 )); then
    REFERENCE_GLOBAL_TIMEOUT=$((REFERENCE_PROCESS_TIMEOUT - 30000))
  else
    REFERENCE_GLOBAL_TIMEOUT="${REFERENCE_PROCESS_TIMEOUT}"
  fi
fi

usage() {
  cat <<'EOF'
Usage:
  docker run ... --entrypoint /usr/local/bin/arc-reference-entrypoint arc-reproduction:latest <app-name>

Supported app names:
EOF
  node -e '
    const fs = require("fs");
    const config = JSON.parse(fs.readFileSync("apps.config.json", "utf8"));
    console.log("  " + Object.keys(config.apps).join(", "));
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
test_results_dir=${RESULT_ROOT}/test-results/
playwright_report_dir=${RESULT_ROOT}/playwright-report/
receipt_status=${receipt_status}
termination_reason=${termination_reason}
reference_test_timeout_ms=${REFERENCE_TEST_TIMEOUT}
reference_global_timeout_ms=${REFERENCE_GLOBAL_TIMEOUT:-not-set}
reference_process_timeout_ms=${REFERENCE_PROCESS_TIMEOUT}
EOF
}

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
      --exclude='./database.db' \
      --exclude='./frontend/database.db' \
      --exclude='./backend/database.db' \
      --exclude='*.sqlite' \
      --exclude='*.sqlite3' \
      -cf - .
  ) | (cd "${target}" && tar -xf -)
}

run_setup() {
  set -Eeuo pipefail
  copy_project_source "${SOURCE_PROJECT}" "${PROJECT_WORKSPACE}"
  install_node_project "${PROJECT_WORKSPACE}"
  install_node_project "${PROJECT_WORKSPACE}/frontend"
  install_node_project "${PROJECT_WORKSPACE}/backend"
  run_build_if_present "${PROJECT_WORKSPACE}"
  run_build_if_present "${PROJECT_WORKSPACE}/frontend"
}

copy_artifacts() {
  local base="$1"
  if [[ -d "${base}/test-results" ]]; then
    timeout --kill-after=5s "${REFERENCE_ARTIFACT_COPY_TIMEOUT_SECONDS}s" \
      cp -a "${base}/test-results" "${RESULT_ROOT}/test-results" 2>>"${SETUP_LOG}" || true
  elif [[ -d "${REPO_ROOT}/test-results/${APP_NAME}" ]]; then
    timeout --kill-after=5s "${REFERENCE_ARTIFACT_COPY_TIMEOUT_SECONDS}s" \
      cp -a "${REPO_ROOT}/test-results/${APP_NAME}" "${RESULT_ROOT}/test-results" 2>>"${SETUP_LOG}" || true
  fi

  if [[ -d "${base}/playwright-report" ]]; then
    timeout --kill-after=5s "${REFERENCE_ARTIFACT_COPY_TIMEOUT_SECONDS}s" \
      cp -a "${base}/playwright-report" "${RESULT_ROOT}/playwright-report" 2>>"${SETUP_LOG}" || true
  elif [[ -d "${REPO_ROOT}/playwright-report" ]]; then
    timeout --kill-after=5s "${REFERENCE_ARTIFACT_COPY_TIMEOUT_SECONDS}s" \
      cp -a "${REPO_ROOT}/playwright-report" "${RESULT_ROOT}/playwright-report" 2>>"${SETUP_LOG}" || true
  fi
}

stop_process_group() {
  local pid="$1"
  if [[ -z "${pid}" ]] || ! kill -0 "${pid}" 2>/dev/null; then
    return 0
  fi

  kill -TERM -- "-${pid}" 2>/dev/null || kill -TERM "${pid}" 2>/dev/null || true
  for _ in $(seq 1 "${REFERENCE_TEST_TERMINATION_GRACE_SECONDS}"); do
    kill -0 "${pid}" 2>/dev/null || break
    sleep 1
  done
  kill -KILL -- "-${pid}" 2>/dev/null || kill -KILL "${pid}" 2>/dev/null || true
  wait "${pid}" 2>/dev/null || true
}

stop_setup() {
  if [[ -n "${SETUP_PID}" ]]; then
    stop_process_group "${SETUP_PID}"
    SETUP_PID=""
  fi
}

stop_test() {
  if [[ -n "${TEST_PID}" ]]; then
    stop_process_group "${TEST_PID}"
    TEST_PID=""
  fi
}

stop_server() {
  if [[ -n "${SERVER_PID}" ]]; then
    stop_process_group "${SERVER_PID}"
    SERVER_PID=""
  fi
}

write_receipt() {
  if [[ "${receipt_written}" -eq 1 ]]; then
    return 0
  fi
  receipt_written=1
  mkdir -p "${RESULT_ROOT}/logs"
  copy_artifacts "${REPO_ROOT}" || true
  write_summary || true
}

handle_signal() {
  local signal_name="$1"
  local signal_status="$2"
  receipt_status="interrupted"
  termination_reason="signal:${signal_name}"
  test_status="${signal_status}"
  write_summary || true
  receipt_written=1
  stop_setup || true
  stop_test || true
  stop_server || true
  exit "${signal_status}"
}

cleanup() {
  set +e
  stop_setup
  stop_test
  stop_server
  write_receipt
}

trap 'handle_signal TERM 143' TERM
trap 'handle_signal INT 130' INT
trap 'handle_signal HUP 129' HUP
trap cleanup EXIT

echo "[ARC-Bench Reference] Preparing ${APP_NAME} reference project"
export -f copy_project_source has_npm_script install_node_project run_build_if_present run_setup
export SOURCE_PROJECT PROJECT_WORKSPACE
(
  exec setsid --wait bash -c run_setup
) > "${SETUP_LOG}" 2>&1 &
SETUP_PID=$!

set +e
wait "${SETUP_PID}"
setup_status=$?
set -e
SETUP_PID=""

if [[ "${setup_status}" -ne 0 ]]; then
  echo "[ARC-Bench Reference] Reference setup failed. See ${SETUP_LOG}" >&2
  receipt_status="failed"
  termination_reason="setup_failed"
  write_receipt
  exit "${setup_status}"
fi

if [[ -f "${PROJECT_WORKSPACE}/backend/package.json" ]]; then
  START_DIR="${PROJECT_WORKSPACE}/backend"
elif [[ -f "${PROJECT_WORKSPACE}/package.json" ]]; then
  START_DIR="${PROJECT_WORKSPACE}"
else
  echo "[ARC-Bench Reference] No runnable package.json found in ${PROJECT_WORKSPACE} or ${PROJECT_WORKSPACE}/backend" >&2
  runtime_status="not-started"
  receipt_status="failed"
  termination_reason="runtime_package_missing"
  write_receipt
  exit 2
fi

echo "[ARC-Bench Reference] Starting ${APP_NAME} reference application on port ${APP_PORT}"
(
  cd "${START_DIR}"
  exec setsid --wait env \
    ARC_DB_FILE="${APP_ROOT}/runtime/database.db" \
    PORT="${APP_PORT}" \
    npm run start
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
  receipt_status="failed"
  termination_reason="runtime_unhealthy"
  write_receipt
  exit 1
fi

echo "[ARC-Bench Reference] Running benchmark tests for ${APP_NAME}"
test_args=(--app "${APP_NAME}" --target-url "${BASE_URL}" --timeout "${REFERENCE_TEST_TIMEOUT}")
if [[ -n "${REFERENCE_GLOBAL_TIMEOUT}" ]]; then
  test_args+=(--global-timeout "${REFERENCE_GLOBAL_TIMEOUT}")
fi
if [[ -n "${REFERENCE_PROCESS_TIMEOUT}" ]]; then
  test_args+=(--process-timeout "${REFERENCE_PROCESS_TIMEOUT}")
fi
if [[ -n "${REFERENCE_PROCESS_TERMINATION_GRACE_MS}" ]]; then
  test_args+=(--process-termination-grace "${REFERENCE_PROCESS_TERMINATION_GRACE_MS}")
fi

(
  cd "${REPO_ROOT}"
  exec setsid --wait env \
    PLAYWRIGHT_OUTPUT_ROOT="${EXPORT_ROOT%/}/reference" \
    PLAYWRIGHT_REPORT_ROOT="${EXPORT_ROOT%/}/reference" \
    TARGET_URL="${BASE_URL}" \
    npm run test -- "${test_args[@]}"
) > "${TEST_LOG}" 2>&1 &
TEST_PID=$!

set +e
wait "${TEST_PID}"
test_status=$?
set -e
TEST_PID=""
cat "${TEST_LOG}" || true

if [[ "${test_status}" -eq 124 ]]; then
  receipt_status="interrupted"
  termination_reason="playwright_process_timeout"
elif grep -Eq '^Timed out waiting .* (test suite|teardown)' "${TEST_LOG}" 2>/dev/null; then
  receipt_status="interrupted"
  termination_reason="playwright_global_timeout"
else
  receipt_status="completed"
  termination_reason="none"
fi
copy_artifacts "${REPO_ROOT}" || true
write_receipt
exit "${test_status}"
