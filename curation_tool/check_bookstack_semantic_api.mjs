/** Type-check semantic migration and prevent raw implementation APIs in REQs. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
const require = createRequire(import.meta.url);
const ts = require(process.argv[2] ?? 'typescript');
const root = resolve(import.meta.dirname, '..');
const tests = resolve(root, 'arc-bench/bookstack/tests');
const specs = readdirSync(tests).filter(name => name.endsWith('.spec.ts'));
for (const name of specs) {
  const source = readFileSync(resolve(tests, name), 'utf8');
  assert.ok(!/\.(?:getByRole|getByLabel|getByPlaceholder|getByText|locator|inputValue|innerText|click|check|uncheck)\s*\(/.test(source), `${name}: raw DOM API in REQ`);
  assert.ok(!/\b(?:entry|button|region|field|readField)\s*\(/.test(source), `${name}: raw locator helper in REQ`);
}
const files = readdirSync(tests, { recursive: true })
  .filter(name => name.endsWith('.ts')).map(name => resolve(tests, name));
const program = ts.createProgram(files, {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.CommonJS,
  moduleResolution: ts.ModuleResolutionKind.Node10,
  types: ['node'],
  typeRoots: [resolve(root, 'node_modules/@types')],
  skipLibCheck: true,
  noEmit: true,
});
const diagnostics = ts.getPreEmitDiagnostics(program);
for (const d of diagnostics) console.error(ts.flattenDiagnosticMessageText(d.messageText, '\n'));
assert.equal(diagnostics.length, 0, 'TypeScript diagnostics');
const result = {
  schema_version: 1, spec_files: specs.length, typescript_files: files.length,
  raw_req_api_check: 'passed', unexpected_type_diagnostics: diagnostics.length,
  environment_diagnostics: [],
  type_dependencies: 'Root bench devDependencies; no case-specific Playwright path or diagnostic exemptions.',
};
const reportDirectory = resolve(root, 'ref/bookstack');
mkdirSync(reportDirectory, { recursive: true });
writeFileSync(resolve(reportDirectory, 'role_semantic_api_checks.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
