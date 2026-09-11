#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const benchmarkDir = path.join(rootDir, 'arc-bench', 'webapp');
const failures = [];

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function fail(message) {
  failures.push(message);
}

function relative(file) {
  return path.relative(rootDir, file).replace(/\\/g, '/');
}

const config = read(path.join(rootDir, 'playwright.config.ts'));
if (!/fullyParallel:\s*false/.test(config)) fail('playwright.config.ts must set fullyParallel: false');
if (!/workers:\s*1\b/.test(config)) fail('playwright.config.ts must set workers: 1');
if (/PLAYWRIGHT_WORKERS/.test(config)) fail('PLAYWRIGHT_WORKERS must not override sequential execution');

const playwrightRunner = read(path.join(rootDir, 'scripts/run-playwright.js'));
if (/PLAYWRIGHT_WORKERS/.test(playwrightRunner)) {
  fail('scripts/run-playwright.js must not read a worker-count override');
}
if (!/['"]--workers['"]\s*,\s*['"]1['"]/.test(playwrightRunner)) {
  fail('scripts/run-playwright.js must force --workers 1 in the Playwright command');
}
const dockerRunner = read(path.join(rootDir, 'scripts/run-test-docker.js'));
if (/--workers|PLAYWRIGHT_WORKERS/.test(dockerRunner)) {
  fail('scripts/run-test-docker.js must not expose a worker-count override');
}

const forbiddenSpecPatterns = [
  [/\bpage\.goto\s*\(/, 'direct page navigation'],
  [/\b(?:page\.)?request\s*\.|\/api\//, 'direct API access'],
  [/\b(?:localStorage|sessionStorage)\b/, 'browser storage access'],
  [/\.evaluate\s*\(|\.route\s*\(/, 'page internals or request interception'],
  [/toHaveURL\s*\(|\bpage\.url\s*\(/, 'internal URL assertion'],
  [/\.locator\(\s*['"`](?:\.|#|\[data-)/, 'class, id, or data-attribute selector'],
];

function atomicRequirementIds(source) {
  const lines = source.split(/\r?\n/);
  const ids = new Set();
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^(\s*)- id:\s*(REQ-[\w.-]+)\s*$/);
    if (!match) continue;
    const indent = match[1].length;
    for (let next = index + 1; next < lines.length; next += 1) {
      const nextId = lines[next].match(/^(\s*)- id:/);
      if (nextId && nextId[1].length <= indent) break;
      const type = lines[next].match(/^(\s*)type:\s*(\w+)\s*$/);
      if (type && type[1].length === indent + 2) {
        if (type[2] === 'ATOMIC') ids.add(match[2]);
        break;
      }
    }
  }
  return ids;
}

function yamlScalar(raw) {
  const value = raw.trim();
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value);
    } catch {
      return value.slice(1, -1);
    }
  }
  return value;
}

function requirementScenarioNames(source) {
  const lines = source.split(/\r?\n/);
  const scenariosById = new Map();
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^(\s*)- id:\s*(REQ-[\w.-]+)\s*$/);
    if (!match) continue;
    const indent = match[1].length;
    const names = [];
    let inScenarios = false;
    for (let next = index + 1; next < lines.length; next += 1) {
      const nextId = lines[next].match(/^(\s*)- id:/);
      if (nextId && nextId[1].length <= indent) break;
      if (new RegExp(`^\\s{${indent + 2}}scenarios:\\s*$`).test(lines[next])) {
        inScenarios = true;
        continue;
      }
      if (!inScenarios) continue;
      const scenario = lines[next].match(
        new RegExp(`^(?:\\s{${indent + 2}}|\\s{${indent + 4}})- name:\\s*(.+?)\\s*$`),
      );
      if (scenario) names.push(yamlScalar(scenario[1]));
    }
    scenariosById.set(match[2], names);
  }
  return scenariosById;
}

for (const appEntry of fs.readdirSync(benchmarkDir, { withFileTypes: true })) {
  if (!appEntry.isDirectory()) continue;
  const app = appEntry.name;
  const appDir = path.join(benchmarkDir, app);
  const requirementsFile = path.join(appDir, 'requirements', 'requirements.yaml');
  const testsDir = path.join(appDir, 'tests');
  if (!fs.existsSync(requirementsFile) || !fs.existsSync(testsDir)) continue;

  const requirementsSource = read(requirementsFile);
  const requirementIds = new Set(
    [...requirementsSource.matchAll(/^\s*- id:\s*(REQ-[\w.-]+)\s*$/gm)].map((match) => match[1]),
  );
  const atomicIds = atomicRequirementIds(requirementsSource);
  const scenariosById = requirementScenarioNames(requirementsSource);
  const specFiles = fs.readdirSync(testsDir).filter((name) => /^REQ-.+\.spec\.ts$/.test(name));
  const specIds = new Set(specFiles.map((name) => name.slice(0, -'.spec.ts'.length)));

  for (const requirementId of atomicIds) {
    if (!specIds.has(requirementId)) fail(`${app} requirement ${requirementId} has no spec file`);
  }

  for (const name of specFiles) {
    const file = path.join(testsDir, name);
    const source = read(file);
    const fileRequirement = name.slice(0, -'.spec.ts'.length);
    if (!requirementIds.has(fileRequirement)) {
      fail(`${relative(file)} has no matching requirement ID`);
    }

    const declared = source.match(/^\/\/ requirement:\s*(REQ-[\w.-]+)\s*$/m)?.[1];
    if (declared !== fileRequirement) {
      fail(`${relative(file)} must declare // requirement: ${fileRequirement}`);
    }

    const testIds = [...source.matchAll(/\btest\(\s*['"`](REQ-[\w.-]+):/g)].map((match) => match[1]);
    if (testIds.length === 0) fail(`${relative(file)} contains no requirement-prefixed test title`);
    for (const testId of testIds) {
      if (testId !== fileRequirement) {
        fail(`${relative(file)} contains test title for ${testId}`);
      }
    }

    const testTitles = [...source.matchAll(/\btest\(\s*['"`]REQ-[\w.-]+:\s*([^'"`]+)['"`]\s*,/g)]
      .map((match) => match[1].trim());
    const scenarioNames = scenariosById.get(fileRequirement) ?? [];
    if (testTitles.length !== scenarioNames.length
      || testTitles.some((title, index) => title !== scenarioNames[index])) {
      fail(`${relative(file)} test titles must match requirement scenario names in order`);
    }

    for (const [pattern, label] of forbiddenSpecPatterns) {
      if (pattern.test(source)) fail(`${relative(file)} uses forbidden ${label}`);
    }
  }

  const helperFile = path.join(testsDir, 'helpers.ts');
  const helperSource = read(helperFile);
  const navigationCalls = [...helperSource.matchAll(/page\.goto\s*\(([^)]*)\)/g)].map((match) => match[1].trim());
  if (navigationCalls.length !== 1 || navigationCalls[0] !== "'/'") {
    fail(`${relative(helperFile)} must contain exactly one page.goto('/') entry navigation`);
  }
  if (/toHaveURL\s*\(|\bpage\.url\s*\(/.test(helperSource)) {
    fail(`${relative(helperFile)} must not assert internal URLs`);
  }
  for (const [pattern, label] of forbiddenSpecPatterns.slice(1)) {
    if (pattern.test(helperSource)) fail(`${relative(helperFile)} uses forbidden ${label}`);
  }
}

if (failures.length > 0) {
  console.error('Benchmark test contract audit failed:');
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log('Benchmark test contract audit passed.');
