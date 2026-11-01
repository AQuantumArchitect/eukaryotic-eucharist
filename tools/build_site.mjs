#!/usr/bin/env node
// Assemble the GitHub Pages artifact without a platform-specific shell.
import { cpSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = resolve(process.argv[2] || join(root, '_site'));
const latest = 'eukaryotic_eucharist_mobile_v1_3_3';
const classic = 'eukaryotic_eucharist_mobile_v1_3_2';

if (out === root || !relative(dirname(root), out)) throw new Error(`Refusing unsafe output path: ${out}`);

function copyBuild(source, destination) {
  mkdirSync(destination, { recursive: true });
  cpSync(join(source, 'index.html'), join(destination, 'index.html'));
  try { cpSync(join(source, 'src'), join(destination, 'src'), { recursive: true }); } catch {}
}

function walk(folder) {
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const path = join(folder, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'versions'), { recursive: true });
cpSync(join(root, 'site', 'index.html'), join(out, 'index.html'));
cpSync(join(root, 'docs', 'screenshots'), join(out, 'screenshots'), { recursive: true });
writeFileSync(join(out, '.nojekyll'), '');

copyBuild(join(root, latest), join(out, 'mecha-fish'));
copyBuild(join(root, classic), join(out, 'classic'));
copyBuild(join(root, 'immune_incursion'), join(out, 'immune'));

for (const entry of readdirSync(root, { withFileTypes: true })) {
  if (!entry.isDirectory() || !entry.name.startsWith('eukaryotic_eucharist_mobile_v')) continue;
  copyBuild(join(root, entry.name), join(out, 'versions', entry.name.replace('eukaryotic_eucharist_mobile_', '')));
}

const files = walk(out);
const pages = files.filter((path) => path.endsWith('index.html')).length;
const bytes = files.reduce((sum, path) => sum + statSync(path).size, 0);
console.log(`Built ${pages} pages into ${out} (${(bytes / 1024 / 1024).toFixed(1)} MiB)`);
