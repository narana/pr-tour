import { createHash } from 'node:crypto';

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function buildRouteSourceFingerprint({ pois, routeWaypoints, routeWaypointLabels }) {
  return sha256(JSON.stringify({
    poiIds: pois.map((poi) => poi.id),
    routeWaypoints,
    routeWaypointLabels,
  }));
}

export function buildAudioSourceFingerprint({ pois, routeSteps, voiceProfiles }) {
  return sha256(JSON.stringify({
    pois: pois.map((poi) => ({
      id: poi.id,
      narration: poi.narration?.en || '',
      preview: poi.preview?.en || '',
      soundscape: poi.soundscape || null,
      audio: poi.audio?.en || '',
    })),
    routeSteps: routeSteps.map((step) => ({
      id: step.id,
      instruction: step.instruction,
      audioSrc: step.audioSrc,
    })),
    voiceProfiles,
    generatorVersion: 1,
  }));
}

export function buildExpectedAudioFiles({ pois, routeSteps }) {
  const files = new Set();

  for (const poi of pois) {
    if (poi.audio?.en) {
      files.add(`public${poi.audio.en}`);
    }
    if (poi.preview?.en) {
      files.add(`public/audio/en/previews/${poi.id}-preview.mp3`);
    }
    if (poi.soundscape?.en) {
      files.add(`public${poi.soundscape.en}`);
    }
  }

  for (const step of routeSteps) {
    if (step.audioSrc) {
      files.add(`public${step.audioSrc}`);
    }
  }

  files.add('public/audio/en/manifest.json');
  return Array.from(files).sort();
}