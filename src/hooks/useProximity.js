import { useEffect, useMemo, useRef } from 'react';
import { haversineDistance } from '../utils/geo';
import { useTour } from '../context/TourContext';
import routeData from '../data/routeData.json';
import { findNearestPointIndex, getPOIProgress, getVisitedPOIIdsAtRouteIndex } from '../utils/route';

/**
 * Monitors user position against all POI geofences.
 * Dispatches TRIGGER_POI when the user enters a POI's trigger radius.
 * Suppressed while the tour is paused.
 *
 * Also suppresses re-trigger for POIs already triggered this session
 * (handled by the reducer, but checked here for efficiency).
 */
export default function useProximity(position) {
  const { state, dispatch, pois } = useTour();
  const lastTriggerTimeRef = useRef({});
  const geometry = routeData.geometry || [];
  const poiProgress = useMemo(() => getPOIProgress(pois, geometry), [geometry, pois]);

  useEffect(() => {
    if (!position || state.isPaused || state.screen !== 'active') return;

    const now = Date.now();
    const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes between re-triggers (PRD POI-07)
    const nearestRoutePoint = geometry.length ? findNearestPointIndex(position, geometry) : null;

    if (nearestRoutePoint) {
      const passedPOIIds = getVisitedPOIIdsAtRouteIndex(poiProgress, nearestRoutePoint.index);
      const untrackedPassedPOIIds = passedPOIIds.filter((poiId) => !state.visitedPOIs.includes(poiId));

      if (untrackedPassedPOIIds.length > 0) {
        dispatch({ type: 'VISIT_POIS', payload: untrackedPassedPOIIds });
      }
    }

    for (const poi of pois) {
      // Skip already triggered this session
      if (state.triggeredPOIs.includes(poi.id) || state.visitedPOIs.includes(poi.id)) continue;

      // Cooldown check
      const lastTrigger = lastTriggerTimeRef.current[poi.id];
      if (lastTrigger && now - lastTrigger < COOLDOWN_MS) continue;

      const dist = haversineDistance(position, poi.coordinates);

      if (dist <= poi.triggerRadiusMeters) {
        lastTriggerTimeRef.current[poi.id] = now;
        dispatch({ type: 'TRIGGER_POI', payload: poi });
        break; // Only trigger one POI at a time
      }
    }
  }, [dispatch, geometry, poiProgress, pois, position, state.isPaused, state.screen, state.triggeredPOIs, state.visitedPOIs]);
}
