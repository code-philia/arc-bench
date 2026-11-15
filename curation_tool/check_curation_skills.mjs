/** Validate the curation skill package without reading requirements or apps.
 * Usage: node curation_tool/check_curation_skills.mjs [repository-root]
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const yaml = require('playwright-core/lib/utilsBundle').yaml;
const skills = ['bench-curation', 'bench-data-curation', 'bench-role-curation', 'bench-meta-curation', 'bench-ui-curation', 'bench-quality-curation'];

export function checkCurationSkills(repositoryRoot) {
  const root = resolve(repositoryRoot);
  const directory = join(root, 'curation_tool');
  const files = new Set();
  for (const skill of skills) {
    const entry = join(directory, skill, 'SKILL.md');
    assert(existsSync(entry), `Missing skill: ${skill}`);
    const raw = readFileSync(entry, 'utf8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    assert(match, `Missing frontmatter: ${entry}`);
    const metadata = yaml.parse(match[1]);
    assert.equal(metadata.name, skill, `Skill name differs from directory: ${entry}`);
    assert(/^[a-z0-9-]{1,63}$/.test(metadata.name), `Invalid name: ${entry}`);
    assert(typeof metadata.description === 'string' && metadata.description.trim().length > 0 && metadata.description.length <= 1024, `Invalid description: ${entry}`);
    for (const name of readdirSync(join(directory, skill), { recursive: true })) {
      if (name.endsWith('.md')) files.add(join(directory, skill, name));
    }
  }
  for (const name of readdirSync(directory)) {
    if (name.endsWith('.md')) files.add(join(directory, name));
  }
  const readme = join(root, 'README_curation.md');
  if (existsSync(readme)) files.add(readme);
  let links = 0;
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    for (const [, target] of source.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^[a-z][a-z0-9+.-]*:|^#/i.test(target)) continue;
      const destination = resolve(dirname(file), target.split('#')[0]);
      assert(existsSync(destination), `Broken relative link: ${file} -> ${target}`);
      links++;
    }
  }
  return { result: 'passed', skills: skills.length, markdown_files: files.size, relative_links: links };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = process.argv[2] ?? resolve(dirname(fileURLToPath(import.meta.url)), '..');
  console.log(JSON.stringify(checkCurationSkills(root)));
}
