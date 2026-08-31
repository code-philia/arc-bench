ARG BASE_IMAGE=mcr.microsoft.com/playwright:v1.54.0-noble
FROM ${BASE_IMAGE}

ENV PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
    VIRTUAL_ENV=/opt/venv \
    ARC_RUNTIME_PORT=3301 \
    PATH=/opt/venv/bin:$PATH

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        curl \
        git \
        python3 \
        python3-pip \
        python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/arc

COPY package.json package-lock.json ./
RUN npm ci \
    && node node_modules/@playwright/test/cli.js install chromium chromium-headless-shell \
    && node -e "const { chromium } = require('@playwright/test'); (async () => { const browser = await chromium.launch(); await browser.close(); })().catch((error) => { console.error(error); process.exit(1); });"

COPY agentic-requirement-compiler/ ./agentic-requirement-compiler/
RUN python3 -m pip install --break-system-packages --no-cache-dir uv \
    && uv venv "${VIRTUAL_ENV}" \
    && uv pip install --python "${VIRTUAL_ENV}/bin/python" \
        -r agentic-requirement-compiler/src/requirements.txt \
    && uv pip install --python "${VIRTUAL_ENV}/bin/python" \
        -e agentic-requirement-compiler

COPY apps.config.json playwright.config.ts ./
COPY scripts/ ./scripts/
COPY arc-bench/ ./arc-bench/
COPY docker/entrypoint.sh /usr/local/bin/arc-docker-entrypoint
COPY docker/reference-entrypoint.sh /usr/local/bin/arc-reference-entrypoint

RUN chmod +x /usr/local/bin/arc-docker-entrypoint \
    && chmod +x /usr/local/bin/arc-reference-entrypoint \
    && mkdir -p /workspaces /export

EXPOSE 3301

ENTRYPOINT ["/usr/local/bin/arc-docker-entrypoint"]
