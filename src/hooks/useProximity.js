import { useEffect, useRef } from 'react';
import { haversineDistance } from '../utils/geo';
import { useTour } from '../context/TourContext';

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

  useEffect(() => {
    if (!position || state.isPaused || state.screen !== 'active') return;

    const now = Date.now();
    const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes between re-triggers (PRD POI-07)

    for (const poi of pois) {
      // Skip already triggered this session
      if (state.triggeredPOIs.includes(poi.id)) continue;

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
  }, [position, state.isPaused, state.screen, state.triggeredPOIs, dispatch, pois]);
}
