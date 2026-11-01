#!/usr/bin/env node
// Cross-platform replacement for kernel_tests.sh. Requires Node >= 18 and Python 3.
import { readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const filter = process.argv[2] || '';
const npm = 'npm';
const python = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
let failed = false;

const builds = readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.startsWith('eukaryotic_eucharist_mobile_v'))
  .map((entry) => join(root, entry.name))
  .sort((a, b) => basename(a).localeCompare(basename(b), undefined, { numeric: true }));

function run(label, command, args, cwd, options = {}) {
  const started = Date.now();
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', ...options });
  const output = `${result.stdout || ''}${result.stderr || ''}`.trim();
  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  if (result.status === 0) {
    const marker = output.split(/\r?\n/).filter((line) => line.includes('_OK')).at(-1) || '';
    console.log(`ok   ${label} (${seconds}s) ${marker}`.trimEnd());
    return;
  }
  failed = true;
  console.error(`FAIL ${label}`);
  for (const line of output.split(/\r?\n/).slice(-15)) console.error(`     ${line}`);
  if (result.error) console.error(`     ${result.error.message}`);
}

for (const dir of builds) {
  const name = basename(dir);
  if (filter && !name.includes(filter)) continue;
  const packagePath = join(dir, 'package.json');
  let pkg = {};
  try { pkg = JSON.parse(readFileSync(packagePath, 'utf8')); } catch {}
  if (pkg.scripts?.smoke) {
    run(name, npm, ['run', '--silent', 'smoke'], dir, { shell: process.platform === 'win32' });
    continue;
  }
  const candidates = [join(dir, 'tests'), join(dir, 'test')]
    .flatMap((folder) => {
      try { return readdirSync(folder).filter((name) => /^smoke.*\.mjs$/i.test(name)).map((name) => join(folder, name)); }
      catch { return []; }
    });
  if (candidates.length) run(name, process.execPath, [candidates[0]], dir);
  else console.log(`skip ${name} (no smoke test)`);
}

run('immune_incursion', python, ['-m', 'unittest', 'immune_incursion.test_kernel'], root);
process.exitCode = failed ? 1 : 0;
