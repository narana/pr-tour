import fs from 'node:fs/promises';
import path from 'node:path';
import pois, { routeWaypoints, routeWaypointLabels } from '../src/data/pois.js';
import routeData from '../src/data/routeData.json' with { type: 'json' };
import { buildAudioSourceFingerprint, buildExpectedAudioFiles, buildRouteSourceFingerprint } from './asset-fingerprints.mjs';

const audioManifestPath = path.resolve('public/audio/en/manifest.json');
const audioRoot = path.resolve('public/audio/en');

async function readJson(filePath) {
  const contents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(contents);
}

async function listFilesRecursive(directoryPath) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFilesRecursive(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

async function ensureExists(filePath) {
  try {
    await fs.access(filePath);
  } catch {
    throw new Error(`Missing generated asset: ${path.relative(process.cwd(), filePath)}`);
  }
}

async function main() {
  const expectedRouteFingerprint = buildRouteSourceFingerprint({
    pois,
    routeWaypoints,
    routeWaypointLabels,
  });

  if (!routeData.sourceFingerprint) {
    throw new Error('src/data/routeData.json is missing sourceFingerprint. Run npm run generate:route.');
  }

  if (routeData.sourceFingerprint !== expectedRouteFingerprint) {
    throw new Error('src/data/routeData.json is out of date. Run npm run generate:route.');
  }

  if ((routeData.summary?.stepCount || 0) !== (routeData.steps?.length || 0)) {
    throw new Error('src/data/routeData.json has inconsistent stepCount metadata.');
  }

  await ensureExists(audioManifestPath);
  const manifest = await readJson(audioManifestPath);
  const expectedAudioFingerprint = buildAudioSourceFingerprint({
    pois,
    routeSteps: routeData.steps,
    voiceProfiles: {
      narration: { voice: 'en-US-AvaMultilingualNeural', rate: '-8%', pitch: '+0Hz' },
      preview: { voice: 'en-US-AvaMultilingualNeural', rate: '-8%', pitch: '+0Hz' },
      direction: { voice: 'en-US-AvaMultilingualNeural', rate: '-8%', pitch: '+0Hz' },
    },
  });

  if (manifest.routeFingerprint !== expectedRouteFingerprint) {
    throw new Error('Audio manifest route fingerprint is stale. Run npm run generate:audio -- --force after regenerating route data.');
  }

  if (manifest.audioFingerprint !== expectedAudioFingerprint) {
    throw new Error('Audio assets are out of date. Run npm run generate:audio -- --force.');
  }

  const expectedFiles = buildExpectedAudioFiles({
    pois,
    routeSteps: routeData.steps,
  }).map((relativePath) => path.resolve(relativePath));

  for (const filePath of expectedFiles) {
    await ensureExists(filePath);
  }

  const actualFiles = await listFilesRecursive(audioRoot);
  const expectedFileSet = new Set(expectedFiles.map((filePath) => path.normalize(filePath)));
  const unexpectedFiles = actualFiles.filter((filePath) => !expectedFileSet.has(path.normalize(filePath)));

  if (unexpectedFiles.length > 0) {
    const sample = unexpectedFiles.slice(0, 5).map((filePath) => path.relative(process.cwd(), filePath)).join(', ');
    throw new Error(`Unexpected generated audio files found: ${sample}. Regenerate assets and remove stale files.`);
  }

  process.stdout.write('Generated route and audio assets are present and up to date.\n');
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});