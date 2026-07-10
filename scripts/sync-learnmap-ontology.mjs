#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, readdir, rename, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const DEFAULT_SOURCE_ROOT = path.resolve(REPO_ROOT, '..', 'korean-elementary-learning-map');
const DEFAULT_OUTPUT_DIR = path.join(REPO_ROOT, 'learnmap', 'ontology');
const PUBLIC_ARTIFACTS = Object.freeze(['learning-map.jsonld', 'learning-map.ttl']);

async function sha256(filePath) {
  return createHash('sha256').update(await readFile(filePath)).digest('hex');
}

export async function syncPublicOntology({
  sourceRoot = DEFAULT_SOURCE_ROOT,
  outputDir = DEFAULT_OUTPUT_DIR,
  check = false,
} = {}) {
  const distDir = path.join(sourceRoot, 'dist', 'ontology');
  const releaseManifest = JSON.parse(await readFile(path.join(distDir, 'release-manifest.json'), 'utf8'));
  await mkdir(outputDir, { recursive: true });

  const existing = (await readdir(outputDir)).sort();
  const unexpected = existing.filter((filename) => !PUBLIC_ARTIFACTS.includes(filename));
  assert.deepEqual(unexpected, [], `learnmap/ontology contains non-public artifacts: ${unexpected.join(', ')}`);

  const copied = [];
  for (const filename of PUBLIC_ARTIFACTS) {
    const sourceEntry = releaseManifest.files.find((file) => file.path === `dist/ontology/${filename}`);
    assert(sourceEntry, `release manifest is missing dist/ontology/${filename}`);
    const source = path.join(distDir, filename);
    const target = path.join(outputDir, filename);
    assert.equal(await sha256(source), sourceEntry.sha256, `${filename} source hash differs from the P3 release manifest`);

    if (!check) {
      const temporary = `${target}.tmp`;
      await copyFile(source, temporary);
      await rename(temporary, target);
    }

    const targetStats = await stat(target);
    assert.equal(targetStats.size, sourceEntry.bytes, `${filename} deployed byte size mismatch`);
    assert.equal(await sha256(target), sourceEntry.sha256, `${filename} deployed hash mismatch`);
    copied.push({ filename, bytes: targetStats.size, sha256: sourceEntry.sha256 });
  }

  return copied;
}

async function main() {
  const check = process.argv.includes('--check');
  const sourceArgument = process.argv.slice(2).find((argument) => !argument.startsWith('--'));
  const copied = await syncPublicOntology({
    sourceRoot: sourceArgument ? path.resolve(sourceArgument) : DEFAULT_SOURCE_ROOT,
    check,
  });
  console.log(
    `learnmap ontology ${check ? 'check' : 'sync'}: PASS (${copied.map((item) => `${item.filename} ${item.sha256}`).join(' / ')})`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.stack ?? error);
    process.exitCode = 1;
  });
}
