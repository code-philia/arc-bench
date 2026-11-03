#!/usr/bin/env bash
# Run: source ./setup-playwright.sh "http://127.0.0.1:33000"
# Run from the application directory containing tests/; invoking by absolute path is supported.
# Optional Linux system dependencies: append --with-deps.

_setup_playwright_main() {
  local setup_script_dir setup_dir setup_url setup_browser_option
  setup_script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)" || return 1
  setup_dir="$setup_script_dir"
  if [[ -d "$PWD/tests" ]]; then
    setup_dir="$PWD"
  fi
  setup_url="${1:-http://127.0.0.1:33000}"
  setup_browser_option="${2:-}"

  if [[ $# -gt 2 || ( -n "$setup_browser_option" && "$setup_browser_option" != '--with-deps' ) ]]; then
    printf 'Usage: source %q <application-url> [--with-deps]\n' "$setup_dir/setup-playwright.sh" >&2
    return 1
  fi
  if [[ ! -d "$setup_dir/tests" ]]; then
    printf 'Run setup from an application directory containing tests/. Missing: %s/tests\n' "$setup_dir" >&2
    return 1
  fi
  if ! command -v node >/dev/null || ! command -v npm >/dev/null; then
    printf 'Install Node.js 22 LTS and npm first.\n' >&2
    return 1
  fi

  # A subshell keeps the caller's working directory and shell options intact.
  (
    set -e
    cd -- "$setup_dir"
    node "$setup_script_dir/setup-playwright.cjs" "$setup_dir" "$setup_url"
    npm install --no-audit --no-fund
    if [[ "$setup_browser_option" == '--with-deps' ]]; then
      npx playwright install --with-deps chromium
    else
      npx playwright install chromium
    fi
  ) || return 1

  printf '\nPlaywright setup complete. Application URL: %s\n' "$setup_url"
  printf 'Run tests:\n  cd %q\n  npm run test:e2e\n' "$setup_dir"
  printf 'List tests: npm run test:e2e:list\nView report: npm run test:e2e:report\n'
}

if _setup_playwright_main "$@"; then
  unset -f _setup_playwright_main
else
  unset -f _setup_playwright_main
  return 1 2>/dev/null || exit 1
fi
