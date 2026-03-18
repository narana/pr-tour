import { useEffect, useMemo, useRef } from 'react';
import routeData from '../data/routeData.json';
import { useTour } from '../context/TourContext';
import useTTS from './useTTS';
import { haversineDistance } from '../utils/geo';
import { findNearestPointIndex, getPOIProgress } from '../utils/route';

const MIN_PREVIEW_LEAD_METERS = 120;

function buildPreviewAudioSrc(id) {
  return `/audio/en/previews/${id}-preview.mp3`;
}

export default function useUpcomingWaypointPreview(position) {
  const { state, pois } = useTour();
  const { speak, isSupported } = useTTS();
  const announcedPreviewsRef = useRef(new Set());
  const geometry = routeData.geometry || [];

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
    const previewRadiusMeters = nextWaypoint.previewRadiusMeters
      || Math.max((nextWaypoint.triggerRadiusMeters || 450) * 3, 1500);
    const minimumDistance = (nextWaypoint.triggerRadiusMeters || 450) + MIN_PREVIEW_LEAD_METERS;

    if (distanceMeters > previewRadiusMeters || distanceMeters <= minimumDistance) {
      return;
    }

    announcedPreviewsRef.current.add(nextWaypoint.id);
    speak(nextWaypoint.preview.en, {
      audioSrc: buildPreviewAudioSrc(nextWaypoint.id),
    });
  }, [geometry, isSupported, poiProgress, position, speak, state.activePOI, state.isPaused, state.screen, state.triggeredPOIs, state.visitedPOIs, state.volumeOn]);
}
