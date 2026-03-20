export const SYSTEM_NARRATION_KINDS = {
  intro: 'intro',
  welcomeBack: 'welcome-back',
};

function buildNextPoiTag(kind, nextPOI) {
  if (!nextPOI) {
    return kind === SYSTEM_NARRATION_KINDS.intro
      ? 'Your next narration beat will begin shortly along the route.'
      : 'The next tour narration is just ahead.';
  }

  return kind === SYSTEM_NARRATION_KINDS.intro
    ? `Up first is ${nextPOI.name}.`
    : `Up next is ${nextPOI.name}.`;
}

export function buildSystemNarrationText(kind, nextPOI = null) {
  const nextPoiTag = buildNextPoiTag(kind, nextPOI);

  if (kind === SYSTEM_NARRATION_KINDS.intro) {
    return `Welcome to the Puerto Rico Heritage and Nature Tour. Your GPS is now locked onto the route. This drive begins near San Juan, climbs inland through Caguas and the central mountains, crosses the drier southern side of the island, and returns north through waterfalls, karst, and wetlands. ${nextPoiTag}`;
  }

  return `Welcome back to the tour. You are back on the route and narration is live again. ${nextPoiTag}`;
}

export function buildSystemNarrationAudioSrc(kind, poiId = null) {
  const suffix = poiId || 'generic';
  return `/audio/en/system/${kind}-${suffix}.mp3`;
}

export function buildSystemNarrationVariants(pois) {
  const variants = [];
  const targets = [...pois, null];

  for (const kind of Object.values(SYSTEM_NARRATION_KINDS)) {
    for (const poi of targets) {
      variants.push({
        kind,
        poiId: poi?.id || null,
        text: buildSystemNarrationText(kind, poi),
        audioSrc: buildSystemNarrationAudioSrc(kind, poi?.id || null),
      });
    }
  }

  return variants;
}