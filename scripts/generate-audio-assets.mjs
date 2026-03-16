import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import pois from '../src/data/pois.js';
import routeData from '../src/data/routeData.json' with { type: 'json' };

const outputRoot = path.resolve('public/audio/en');
const MAX_RETRIES = 5;

async function ensureDirectories() {
  await fs.mkdir(path.join(outputRoot, 'pois'), { recursive: true });
  await fs.mkdir(path.join(outputRoot, 'directions'), { recursive: true });
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

async function synthesizeMp3(text, destination) {
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      runPython(
        ['-m', 'edge_tts', '--voice', 'en-US-AriaNeural', '--text', text, '--write-media', destination],
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

async function main() {
  await ensureDirectories();
  ensureEdgeTTSInstalled();

  for (const poi of pois) {
    const destination = path.join(outputRoot, 'pois', `${poi.id}.mp3`);
    try {
      await fs.access(destination);
      continue;
    } catch {
      // File does not exist yet.
    }

    await synthesizeMp3(poi.narration.en, destination);
  }

  for (const step of routeData.steps) {
    const destination = path.join(outputRoot, 'directions', `${step.id}.mp3`);
    try {
      await fs.access(destination);
      continue;
    } catch {
      // File does not exist yet.
    }

    await synthesizeMp3(step.instruction, destination);
  }

  process.stdout.write(`Generated ${pois.length} POI narrations and ${routeData.steps.length} direction clips.\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack}\n`);
  process.exitCode = 1;
});