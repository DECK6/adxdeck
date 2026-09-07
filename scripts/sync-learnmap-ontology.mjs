#!/usr/bin/env node
// Copies the IRI hosting trees built by the two learning-map repositories into this site so every
// https://dexa.art/learnmap/... ontology, vocabulary, version and schema IRI dereferences.
//
//   node scripts/sync-learnmap-ontology.mjs          # copy + prune, then verify
//   node scripts/sync-learnmap-ontology.mjs --check  # verify only (exit 1 on drift)
//
// Each source repository publishes dist/hosting/manifest.json (built by `build:hosting`) listing
// the files it owns, the site prefixes it governs, paths shared with the other repository (must be
// byte-identical) and paths pinned by the parent-facing learnmap app that the sync never touches.

import { createHash } from 'node:crypto';
import { copyFile, mkdir, readdir, readFile, rename, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const DEFAULT_SOURCES = Object.freeze([
  { name: 'elementary', root: process.env.LEARNMAP_ELEMENTARY_ROOT ?? path.resolve(REPO_ROOT, '..', 'korean-elementary-learning-map') },
  { name: 'secondary', root: process.env.LEARNMAP_SECONDARY_ROOT ?? path.resolve(REPO_ROOT, '..', 'korean-secondary-learning-map') },
]);

async function sha256(filePath) {
  return createHash('sha256').update(await readFile(filePath)).digest('hex');
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir, out = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

async function loadSource(source) {
  const hostingDir = path.join(source.root, 'dist', 'hosting');
  const manifestPath = path.join(hostingDir, 'manifest.json');
  if (!(await exists(manifestPath))) throw new Error(`${source.name}: ${manifestPath} missing — run build:hosting in ${source.root}`);
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (manifest.formatVersion !== 1) throw new Error(`${source.name}: unsupported hosting manifest format ${manifest.formatVersion}`);
  for (const file of manifest.files) {
    const digest = await sha256(path.join(hostingDir, file.path));
    if (digest !== file.sha256) throw new Error(`${source.name}: dist/hosting/${file.path} does not match its manifest`);
  }
  return { ...source, hostingDir, manifest };
}

export async function syncLearnmapHosting({ sources = DEFAULT_SOURCES, siteRoot = REPO_ROOT, check = false } = {}) {
  const loaded = [];
  for (const source of sources) loaded.push(await loadSource(source));

  const desired = new Map();
  const ownedPrefixes = new Set();
  const pinned = new Set();
  for (const source of loaded) {
    for (const prefix of source.manifest.ownedPrefixes ?? []) ownedPrefixes.add(prefix);
    for (const pinnedPath of source.manifest.pinnedPaths ?? []) pinned.add(pinnedPath);
    for (const file of source.manifest.files) {
      const existing = desired.get(file.path);
      if (existing && existing.sha256 !== file.sha256) {
        throw new Error(`${file.path} differs between ${existing.source} and ${source.name}; rebuild both hosting trees from the same k12-core`);
      }
      if (!existing) desired.set(file.path, { ...file, source: source.name, sourcePath: path.join(source.hostingDir, file.path) });
    }
  }
  for (const pinnedPath of pinned) {
    if (desired.has(pinnedPath)) throw new Error(`${pinnedPath} is pinned by the learnmap app but a hosting manifest wants to overwrite it`);
  }

  const missing = [];
  const drift = [];
  let identical = 0;
  for (const [hostedPath, file] of desired) {
    const target = path.join(siteRoot, hostedPath);
    if (!(await exists(target))) missing.push(hostedPath);
    else if ((await sha256(target)) !== file.sha256) drift.push(hostedPath);
    else identical += 1;
  }
  const stale = [];
  for (const prefix of ownedPrefixes) {
    for (const absolute of await walk(path.join(siteRoot, prefix))) {
      const relative = path.relative(siteRoot, absolute).split(path.sep).join('/');
      if (!desired.has(relative) && !pinned.has(relative)) stale.push(relative);
    }
  }
  for (const pinnedPath of pinned) {
    if (!(await exists(path.join(siteRoot, pinnedPath)))) throw new Error(`pinned app artifact ${pinnedPath} is missing from the site`);
  }

  if (check) {
    const problems = [...missing.map((p) => `missing ${p}`), ...drift.map((p) => `drift ${p}`), ...stale.map((p) => `stale ${p}`)];
    if (problems.length) throw new Error(`learnmap hosting out of sync (${problems.length}): ${problems.slice(0, 10).join(' | ')}${problems.length > 10 ? ' | …' : ''}`);
    return { identical, copied: 0, removed: 0, sources: loaded };
  }

  let copied = 0;
  for (const hostedPath of [...missing, ...drift]) {
    const file = desired.get(hostedPath);
    const target = path.join(siteRoot, hostedPath);
    await mkdir(path.dirname(target), { recursive: true });
    const temporary = `${target}.tmp`;
    await copyFile(file.sourcePath, temporary);
    await rename(temporary, target);
    if ((await sha256(target)) !== file.sha256) throw new Error(`${hostedPath} copy verification failed`);
    copied += 1;
  }
  for (const relative of stale) await rm(path.join(siteRoot, relative), { force: true });
  await pruneEmptyDirectories(siteRoot, [...ownedPrefixes]);
  return { identical, copied, removed: stale.length, sources: loaded };
}

async function pruneEmptyDirectories(siteRoot, prefixes) {
  async function prune(dir) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return false;
    }
    let empty = true;
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const childEmpty = await prune(path.join(dir, entry.name));
        if (childEmpty) await rm(path.join(dir, entry.name), { recursive: true, force: true });
        else empty = false;
      } else empty = false;
    }
    return empty;
  }
  for (const prefix of prefixes) await prune(path.join(siteRoot, prefix));
}

async function main() {
  const check = process.argv.includes('--check');
  const result = await syncLearnmapHosting({ check });
  const summary = result.sources.map((source) => `${source.name} ${source.manifest.ontologyVersion} (${source.manifest.files.length} files)`).join(', ');
  console.log(`learnmap hosting ${check ? 'check' : 'sync'}: PASS — ${summary}; identical ${result.identical}, copied ${result.copied}, removed ${result.removed}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.stack ?? error);
    process.exitCode = 1;
  });
}
