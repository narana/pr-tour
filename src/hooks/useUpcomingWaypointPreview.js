import { useEffect, useMemo, useRef } from 'react';
import routeData from '../data/routeData.json';
import { useTour } from '../context/TourContext';
import useTTS, { EXTERNAL_NAVIGATION_AUDIO_LEAD_IN_MS } from './useTTS';
import { haversineDistance } from '../utils/geo';
import { findNearestPointIndex, getPOIProgress } from '../utils/route';

const MIN_PREVIEW_LEAD_METERS = 120;
const PREVIEW_COMPLETION_BUFFER_SECONDS = 8;
const SIMULATION_BENCHMARK_MULTIPLIER = 2;

function buildCumulativeRouteDistances(geometry) {
  const cumulativeDistances = [0];

  for (let index = 1; index < geometry.length; index += 1) {
    cumulativeDistances[index] = cumulativeDistances[index - 1] + haversineDistance(geometry[index - 1], geometry[index]);
  }

  return cumulativeDistances;
}

function estimatePreviewRunwayMeters(text, externalNavigationMode, benchmarkSpeedMetersPerSecond) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const spokenSeconds = Math.max(8, words / 2.4);
  const leadInSeconds = externalNavigationMode ? EXTERNAL_NAVIGATION_AUDIO_LEAD_IN_MS / 1000 : 0;
  const totalSeconds = spokenSeconds + leadInSeconds + PREVIEW_COMPLETION_BUFFER_SECONDS;
  return Math.ceil(totalSeconds * benchmarkSpeedMetersPerSecond);
}

function buildPreviewAudioSrc(id) {
  return `/audio/en/previews/${id}-preview.mp3`;
}

export default function useUpcomingWaypointPreview(position) {
  const { state, pois } = useTour();
  const { speak, isSupported } = useTTS();
  const announcedPreviewsRef = useRef(new Set());
  const geometry = routeData.geometry || [];
  const benchmarkSpeedMetersPerSecond = useMemo(() => {
    const routeDurationSeconds = routeData.summary?.durationSeconds || 1;
    const routeDistanceMeters = routeData.summary?.distanceMeters || 0;
    return (routeDistanceMeters / routeDurationSeconds) * SIMULATION_BENCHMARK_MULTIPLIER;
  }, []);
  const cumulativeRouteDistances = useMemo(() => buildCumulativeRouteDistances(geometry), [geometry]);

  const poiProgress = useMemo(() => {
    return getPOIProgress(pois, geometry).sort((left, right) => left.routeIndex - right.routeIndex);
  }, [geometry, pois]);

  useEffect(() => {
    if (state.screen !== 'active') {
      announcedPreviewsRef.current.clear();
    }
  }, [state.screen]);

  useEffect(() => {
    if (
      !position
      || state.screen !== 'active'
      || state.isPaused
      || state.activePOI
      || !state.volumeOn
      || !isSupported
      || geometry.length === 0
    ) {
      return;
    }

    const nearestRoutePoint = findNearestPointIndex(position, geometry);
    const nextWaypoint = poiProgress.find((poi) => {
      return (
        poi.routeIndex >= nearestRoutePoint.index
        && !state.triggeredPOIs.includes(poi.id)
        && !state.visitedPOIs.includes(poi.id)
        && poi.preview?.en
      );
    });

    if (!nextWaypoint || announcedPreviewsRef.current.has(nextWaypoint.id)) {
      return;
    }

    const distanceMeters = haversineDistance(position, nextWaypoint.coordinates);
    const remainingRouteDistanceMeters = Math.max(
      0,
      (cumulativeRouteDistances[nextWaypoint.routeIndex] || 0) - (cumulativeRouteDistances[nearestRoutePoint.index] || 0),
    );
    const requiredRunwayMeters = estimatePreviewRunwayMeters(
      nextWaypoint.preview.en,
      state.externalNavigationMode,
      benchmarkSpeedMetersPerSecond,
    );
    const previewRadiusMeters = nextWaypoint.previewRadiusMeters
      || Math.max((nextWaypoint.triggerRadiusMeters || 450) * 5, requiredRunwayMeters + 400, 2600);
    const minimumDistance = (nextWaypoint.triggerRadiusMeters || 450) + Math.max(MIN_PREVIEW_LEAD_METERS, requiredRunwayMeters);

    if (remainingRouteDistanceMeters > previewRadiusMeters || remainingRouteDistanceMeters <= minimumDistance || distanceMeters <= (nextWaypoint.triggerRadiusMeters || 450)) {
      return;
    }

    announcedPreviewsRef.current.add(nextWaypoint.id);
    speak(nextWaypoint.preview.en, {
      audioSrc: buildPreviewAudioSrc(nextWaypoint.id),
      ambienceSrc: nextWaypoint.soundscape?.en,
    });
  }, [benchmarkSpeedMetersPerSecond, cumulativeRouteDistances, geometry, isSupported, poiProgress, position, speak, state.activePOI, state.externalNavigationMode, state.isPaused, state.screen, state.triggeredPOIs, state.visitedPOIs, state.volumeOn]);
}
