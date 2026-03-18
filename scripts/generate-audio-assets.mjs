import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import pois from '../src/data/pois.js';
import routeData from '../src/data/routeData.json' with { type: 'json' };
import { buildAudioSourceFingerprint, buildExpectedAudioFiles } from './asset-fingerprints.mjs';

const outputRoot = path.resolve('public/audio/en');
const MAX_RETRIES = 5;
const force = process.argv.includes('--force');
const narrationRendererScript = path.resolve('scripts/render_tts_asset.py');
const ambienceRendererScript = path.resolve('scripts/render_ambience_asset.py');
const audioManifestPath = path.join(outputRoot, 'manifest.json');
const SINGLE_VOICE_PROFILE = {
  voice: 'en-US-AvaMultilingualNeural',
  rate: '-8%',
  pitch: '+0Hz',
};

const VOICES = {
  narration: SINGLE_VOICE_PROFILE,
  preview: SINGLE_VOICE_PROFILE,
  direction: SINGLE_VOICE_PROFILE,
};

async function readExistingManifest() {
  try {
    const raw = await fs.readFile(audioManifestPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function ensureDirectories() {
  await fs.mkdir(path.join(outputRoot, 'pois'), { recursive: true });
  await fs.mkdir(path.join(outputRoot, 'directions'), { recursive: true });
  await fs.mkdir(path.join(outputRoot, 'previews'), { recursive: true });
  await fs.mkdir(path.join(outputRoot, 'ambience'), { recursive: true });
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

async function pruneUnexpectedGeneratedFiles(expectedFiles) {
  const expectedFileSet = new Set(expectedFiles.map((filePath) => path.resolve(filePath)));
  const actualFiles = await listFilesRecursive(outputRoot);
  const staleFiles = actualFiles.filter((filePath) => !expectedFileSet.has(path.resolve(filePath)));

  await Promise.all(staleFiles.map((filePath) => fs.rm(filePath, { force: true })));
}

function runPython(args, errorMessage) {
  const result = spawnSync('python', args, {
    encoding: 'utf8',
    stdio: 'pipe',
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || errorMessage);
  }
}

function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function ensureEdgeTTSInstalled() {
  const probe = spawnSync('python', ['-m', 'pip', 'show', 'edge-tts'], {
    encoding: 'utf8',
    stdio: 'pipe',
  });

  if (probe.status === 0) {
    return;
  }

  runPython(['-m', 'pip', 'install', 'edge-tts', '--quiet'], 'Failed to install edge-tts.');
}

async function synthesizeMp3(text, destination, profile) {
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      runPython(
        [
          narrationRendererScript,
          '--output',
          destination,
          '--text',
          text,
          '--voice',
          profile.voice,
          '--rate',
          profile.rate,
          '--pitch',
          profile.pitch,
        ],
        `Failed to generate ${destination}`,
      );
      return;
    } catch (error) {
      lastError = error;
      if (attempt === MAX_RETRIES) {
        break;
      }

      await sleep(1500 * attempt);
    }
  }

  throw lastError;
}

async function synthesizeAmbience(soundscape) {
  if (!soundscape?.en || !soundscape.type) return;

  const destination = path.resolve(`public${soundscape.en}`.replaceAll('/', path.sep));
  if (!force) {
    try {
      await fs.access(destination);
      return;
    } catch {
      // File does not exist yet.
    }
  }

  runPython(
    [
      ambienceRendererScript,
      '--type',
      soundscape.type,
      '--output',
      destination,
      '--duration',
      String(soundscape.durationSeconds || 18),
    ],
    `Failed to generate ambience ${destination}`,
  );
}

async function main() {
  await ensureDirectories();
  ensureEdgeTTSInstalled();

  const previewCount = pois.filter((poi) => poi.preview?.en).length;
  const expectedFiles = buildExpectedAudioFiles({
    pois,
    routeSteps: routeData.steps,
  });
  const nextManifest = {
    generatedAt: new Date().toISOString(),
    routeFingerprint: routeData.sourceFingerprint || null,
    audioFingerprint: buildAudioSourceFingerprint({
      pois,
      routeSteps: routeData.steps,
      voiceProfiles: VOICES,
    }),
    expectedFiles,
    counts: {
      poiNarrations: pois.length,
      previewClips: previewCount,
      directionClips: routeData.steps.length,
    },
  };
  const existingManifest = await readExistingManifest();
  const regenerateAll = force
    || !existingManifest
    || existingManifest.routeFingerprint !== nextManifest.routeFingerprint
    || existingManifest.audioFingerprint !== nextManifest.audioFingerprint;

  await pruneUnexpectedGeneratedFiles(expectedFiles);

  for (const poi of pois) {
    const destination = path.join(outputRoot, 'pois', `${poi.id}.mp3`);
    if (!regenerateAll) {
      try {
        await fs.access(destination);
        continue;
      } catch {
        // File does not exist yet.
      }
    }

    await synthesizeMp3(poi.narration.en, destination, VOICES.narration);
    await synthesizeAmbience(poi.soundscape);
  }

  for (const poi of pois) {
    if (!poi.preview?.en) continue;

    const destination = path.join(outputRoot, 'previews', `${poi.id}-preview.mp3`);
    if (!regenerateAll) {
      try {
        await fs.access(destination);
        continue;
      } catch {
        // File does not exist yet.
      }
    }

    await synthesizeMp3(poi.preview.en, destination, VOICES.preview);
  }

  for (const step of routeData.steps) {
    const destination = path.join(outputRoot, 'directions', `${step.id}.mp3`);
    if (!regenerateAll) {
      try {
        await fs.access(destination);
        continue;
      } catch {
        // File does not exist yet.
      }
    }

    await synthesizeMp3(step.instruction, destination, VOICES.direction);
  }

  nextManifest.generatedAt = new Date().toISOString();
  await fs.writeFile(audioManifestPath, `${JSON.stringify(nextManifest, null, 2)}\n`, 'utf8');
  process.stdout.write(`Generated ${pois.length} POI narrations, ${previewCount} preview clips, and ${routeData.steps.length} direction clips.\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack}\n`);
  process.exitCode = 1;
});