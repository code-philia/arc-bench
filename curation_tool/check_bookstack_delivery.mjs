import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const yaml = require(resolve(dirname(require.resolve('playwright-core/package.json')), 'lib/utilsBundle.js')).yaml;
const directory = 'arc-bench/bookstack/requirements';
const before = process.argv[2] ? yaml.parse(readFileSync(process.argv[2], 'utf8')) : undefined;
const raw = readFileSync(`${directory}/requirements.yaml`, 'utf8');
const after = yaml.parse(raw);
const clean = value => typeof value === 'string'
  ? value.replace(/【[^【】]*】/g, '').replace(/;\s*$/g, '.').replace(/\s+/g, ' ').trim()
  : Array.isArray(value) ? value.map(clean)
  : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k,v]) => [k, clean(v)])) : value;
if (before) assert.deepEqual(clean(after), clean(before), 'Only isolated content and adjacent whitespace/punctuation may change');
assert(!/[【】]|role\s*=|accessible name|evaluator|not sampled|not tested|Seed prerequisites/i.test(raw));
const ids = new Set(), images = new Map(), references = [];
let requirements = 0, leaves = 0, scenarios = 0;
const walk = node => {
  if (node.id) {
    if (node.id.startsWith('IMG-')) {
      const previous = images.get(node.id);
      assert(!previous || JSON.stringify(previous) === JSON.stringify(node), `Conflicting image ${node.id}`);
      images.set(node.id, node);
      assert(existsSync(resolve(directory, node.reference)), node.reference);
    } else {
      assert(!ids.has(node.id), `Duplicate ${node.id}`); ids.add(node.id);
      if (node.id === 'ROOT' || node.id.startsWith('REQ-')) { requirements++; if (!node.children?.length) leaves++; }
      if (node.id.startsWith('SCN-')) scenarios++;
    }
  }
  for (const value of Object.values(node)) {
    if (typeof value === 'string') for (const match of value.matchAll(/\\ref\[(requirement|image)\]\(([^)]+)\)/g)) references.push(match.slice(1));
    else if (Array.isArray(value)) value.forEach(v => { if (v && typeof v === 'object') walk(v); });
    else if (value && typeof value === 'object') walk(value);
  }
};
walk(after);
for (const [kind, id] of references) assert(kind === 'image' ? images.has(id) : ids.has(id), `Unresolved ${id}`);
assert.equal(requirements, 34); assert.equal(leaves, 24); assert.equal(scenarios, 35);
const specs = readdirSync('arc-bench/bookstack/tests').filter(n => /^REQ-.*\.spec\.ts$/.test(n));
assert.equal(specs.length, 24);
assert.equal(specs.reduce((n,f) => n + [...readFileSync(`arc-bench/bookstack/tests/${f}`, 'utf8').matchAll(/\btest\(/g)].length, 0), 35);
const skills = ['bench-curation', 'bench-data-curation', 'bench-role-curation', 'bench-meta-curation', 'bench-time-curation', 'bench-ui-curation', 'bench-quality-curation'];
for (const skill of skills) {
  const path = `curation_tool/${skill}/SKILL.md`, text = readFileSync(path, 'utf8');
  const meta = yaml.parse(text.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  assert.equal(meta.name, skill); assert(meta.description);
  for (const [,target] of text.matchAll(/\]\(([^)]+)\)/g)) if (!/^https?:|^#/.test(target)) assert(existsSync(resolve(dirname(path), target.split('#')[0])), `${path}: ${target}`);
}
for (const path of ['README_curation.md', 'curation_tool/README.md']) {
  for (const [,target] of readFileSync(path, 'utf8').matchAll(/\]\(([^)]+)\)/g)) if (!/^https?:|^#/.test(target)) assert(existsSync(resolve(dirname(path), target.split('#')[0])), `${path}: ${target}`);
}
console.log(JSON.stringify({result:'passed', requirements, leaves, scenarios, specs:specs.length, tests:35, markers:0, skills:skills.length, semantic_diff:before ? 'isolated_content_only' : 'not_requested', references:'resolved'}));
