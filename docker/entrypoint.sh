#!/usr/bin/env bash

set -Eeuo pipefail

APP_NAME="${1:-${ARC_APP:-}}"
EXPORT_ROOT="${EXPORT_ROOT:-/export}"
APP_PORT="${ARC_RUNTIME_PORT:-3301}"
REPO_ROOT="/opt/arc"
APP_WORKSPACE="${REPO_ROOT}/workspace/${APP_NAME}"
RESULT_ROOT="${EXPORT_ROOT%/}/${APP_NAME}"
COMPILE_LOG="${RESULT_ROOT}/logs/compile.log"
APP_LOG="${RESULT_ROOT}/logs/app.log"
TEST_LOG="${RESULT_ROOT}/logs/test.log"
SERVER_PID=""
APP_REQUIREMENT_DIR=""

usage() {
  cat <<'EOF'
Usage:
  docker run ... arc-reproduction:latest <app-name>

Supported app names:
EOF
  node -e '
    const fs = require("fs");
    const config = JSON.parse(fs.readFileSync("apps.config.json", "utf8"));
    console.log(`  ${Object.keys(config.apps).join(", ")}`);
  ' 2>/dev/null || true
}

if [[ -z "${APP_NAME}" || "${APP_NAME}" == "all" ]]; then
  usage >&2
  exit 2
fi

if ! APP_REQUIREMENT_DIR="$(node -e '
  const fs = require("fs");
  const config = JSON.parse(fs.readFileSync("apps.config.json", "utf8"));
  const app = process.argv[1];
  if (!config.apps[app]) process.exit(1);
  process.stdout.write(config.apps[app].requirementDir);
' "${APP_NAME}")"; then
  echo "[ARC Docker] Unknown app: ${APP_NAME}" >&2
  usage >&2
  exit 2
fi

mkdir -p "${RESULT_ROOT}"
find "${RESULT_ROOT}" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
mkdir -p "${RESULT_ROOT}/application" "${RESULT_ROOT}/logs"
rm -rf \
  "${REPO_ROOT}/test-results/${APP_NAME}" \
  "${REPO_ROOT}/playwright-report"

write_summary() {
  local compile_status="$1"
  local test_status="$2"
  local runtime_status="$3"
  cat > "${RESULT_ROOT}/summary.txt" <<EOF
app=${APP_NAME}
compile_status=${compile_status}
runtime_status=${runtime_status}
test_status=${test_status}
target_url=http://127.0.0.1:${APP_PORT}
application_dir=application/
test_results_dir=test-results/
playwright_report_dir=playwright-report/
EOF
}

copy_application() {
  if [[ -d "${APP_WORKSPACE}" ]]; then
    cp -a "${APP_WORKSPACE}/." "${RESULT_ROOT}/application/"
  fi
}

cleanup() {
  if [[ -n "${SERVER_PID}" ]] && kill -0 "${SERVER_PID}" 2>/dev/null; then
    kill "${SERVER_PID}" 2>/dev/null || true
    wait "${SERVER_PID}" 2>/dev/null || true
  fi
}
trap cleanup EXIT

echo "[ARC Docker] Compiling ${APP_NAME}"
set +e
arc compile \
  "${APP_REQUIREMENT_DIR}" \
  -o "${APP_WORKSPACE}" \
  --type web \
  --clean 2>&1 | tee "${COMPILE_LOG}"
compile_status=${PIPESTATUS[0]}
set -e

copy_application

if [[ "${compile_status}" -ne 0 ]]; then
  write_summary "${compile_status}" "not-run" "not-started"
  exit "${compile_status}"
fi

echo "[ARC Docker] Starting generated application on the default port ${APP_PORT}"
(
  cd "${APP_WORKSPACE}/backend"
  PORT="${APP_PORT}" npm run start
) > "${APP_LOG}" 2>&1 &
SERVER_PID=$!

runtime_status=1
for _ in $(seq 1 60); do
  if curl --fail --silent "http://127.0.0.1:${APP_PORT}/api/health" > /dev/null; then
    runtime_status=0
    break
  fi
  if ! kill -0 "${SERVER_PID}" 2>/dev/null; then
    break
  fi
  sleep 1
done

if [[ "${runtime_status}" -ne 0 ]]; then
  echo "[ARC Docker] Generated application did not become healthy" >&2
  copy_application
  write_summary "${compile_status}" "not-run" "${runtime_status}"
  exit 1
fi

echo "[ARC Docker] Running Playwright tests for ${APP_NAME}"
set +e
TARGET_URL="http://127.0.0.1:${APP_PORT}" \
  npm run test -- --app "${APP_NAME}" 2>&1 | tee "${TEST_LOG}"
test_status=${PIPESTATUS[0]}
set -e

if [[ -d "${REPO_ROOT}/test-results/${APP_NAME}" ]]; then
  cp -a "${REPO_ROOT}/test-results/${APP_NAME}" "${RESULT_ROOT}/test-results"
fi
if [[ -d "${REPO_ROOT}/playwright-report" ]]; then
  cp -a "${REPO_ROOT}/playwright-report" "${RESULT_ROOT}/playwright-report"
fi
copy_application
write_summary "${compile_status}" "${test_status}" "${runtime_status}"

exit "${test_status}"
