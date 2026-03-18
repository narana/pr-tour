import fs from 'node:fs/promises';
import path from 'node:path';
import poisModule, { routeWaypoints, routeWaypointLabels } from '../src/data/pois.js';

const pois = poisModule;
const outputPath = path.resolve('src/data/routeData.json');

function formatModifier(modifier) {
  if (!modifier) return 'Continue';

  const map = {
    left: 'Turn left',
    right: 'Turn right',
    slight_left: 'Bear left',
    slight_right: 'Bear right',
    sharp_left: 'Make a sharp left',
    sharp_right: 'Make a sharp right',
    straight: 'Continue straight',
    uturn: 'Make a U-turn',
  };

  return map[modifier] || 'Continue';
}

function ordinal(value) {
  const ordinals = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
  return ordinals[value - 1] || `${value}th`;
}

function buildInstruction(step, legIndex, stepIndex, totalSteps) {
  const roadName = step.name?.trim() || 'the road';
  const { type, modifier, exit } = step.maneuver;

  if (type === 'depart') {
    return `Start driving on ${roadName}.`;
  }

  if (type === 'arrive') {
    const label = routeWaypointLabels[legIndex] || 'your destination';
    return `Arrive near ${label}.`;
  }

  if (type === 'roundabout' || type === 'rotary') {
    const exitText = exit ? `Take the ${ordinal(exit)} exit` : 'Proceed through the roundabout';
    return `${exitText} onto ${roadName}.`;
  }

  if (type === 'merge') {
    return `Merge onto ${roadName}.`;
  }

  if (type === 'fork') {
    return `Keep ${modifier === 'left' ? 'left' : 'right'} onto ${roadName}.`;
  }

  if (type === 'end of road') {
    return `${formatModifier(modifier)} onto ${roadName}.`;
  }

  if (type === 'continue' && stepIndex === totalSteps - 1) {
    return `Continue on ${roadName}.`;
  }

  return `${formatModifier(modifier)} onto ${roadName}.`;
}

async function main() {
  const coordinates = routeWaypoints.map(({ lat, lng }) => `${lng},${lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?alternatives=false&annotations=false&continue_straight=true&geometries=geojson&overview=full&steps=true`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'GitHub Copilot route generator' },
  });

  if (!response.ok) {
    throw new Error(`OSRM request failed with ${response.status}`);
  }

  const payload = await response.json();
  const route = payload.routes?.[0];
  if (!route) {
    throw new Error('OSRM did not return a route.');
  }

  const steps = route.legs.flatMap((leg, legIndex) => (
    leg.steps.map((step, stepIndex) => ({
      id: `step-${String(stepsIndex(legIndex, stepIndex)).padStart(3, '0')}`,
      instruction: buildInstruction(step, legIndex, stepIndex, leg.steps.length),
      roadName: step.name?.trim() || 'the road',
      distanceMeters: Math.round(step.distance),
      durationSeconds: Math.round(step.duration),
      maneuver: {
        type: step.maneuver.type,
        modifier: step.maneuver.modifier || null,
      },
      coordinates: {
        lat: step.maneuver.location[1],
        lng: step.maneuver.location[0],
      },
      audioSrc: `/audio/en/directions/step-${String(stepsIndex(legIndex, stepIndex)).padStart(3, '0')}.mp3`,
    }))
  ));

  const geometry = route.geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));

  const routeData = {
    generatedAt: new Date().toISOString(),
    summary: {
      distanceMeters: Math.round(route.distance),
      durationSeconds: Math.round(route.duration),
      stepCount: steps.length,
    },
    geometry,
    steps,
  };

  await fs.writeFile(outputPath, `${JSON.stringify(routeData, null, 2)}\n`, 'utf8');
  process.stdout.write(`Wrote ${steps.length} local maneuvers to ${outputPath}\n`);
}

function stepsIndex(legIndex, stepIndex) {
  return legIndex * 100 + stepIndex;
}

main().catch((error) => {
  process.stderr.write(`${error.stack}\n`);
  process.exitCode = 1;
});