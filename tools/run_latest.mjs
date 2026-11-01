#!/usr/bin/env node
// Run an npm script in the newest version snapshot, on Windows or Unix.
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const script = process.argv[2];
if (!script) throw new Error('Usage: node tools/run_latest.mjs <npm-script> [args...]');
const names = readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.startsWith('eukaryotic_eucharist_mobile_v'))
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
const latest = names.at(-1);
const pkg = JSON.parse(readFileSync(join(root, latest, 'package.json'), 'utf8'));
if (!pkg.scripts?.[script]) throw new Error(`${latest} has no npm script named ${script}`);
const npm = 'npm';
const result = spawnSync(npm, ['run', script, '--', ...process.argv.slice(3)], {
  cwd: join(root, latest),
  stdio: 'inherit',
  shell: process.platform === 'win32',
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
