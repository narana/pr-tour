import { useEffect, useMemo, useRef } from 'react';
import routeData from '../data/routeData.json';
import { useTour } from '../context/TourContext';
import { buildSystemNarrationAudioSrc, buildSystemNarrationText, SYSTEM_NARRATION_KINDS } from '../data/systemNarration';
import useTTS from './useTTS';
import { findNearestPointIndex, getPOIProgress, ROUTE_LOCK_THRESHOLD_METERS } from '../utils/route';

function getUpcomingPOI(poiProgress, routeIndex, state) {
  const remainingPOIs = poiProgress.filter((poi) => {
    return !state.visitedPOIs.includes(poi.id) && !state.triggeredPOIs.includes(poi.id);
  });

  return remainingPOIs.find((poi) => poi.routeIndex >= routeIndex) || remainingPOIs[0] || null;
}

export default function useTourEntryNarration(position) {
  const { state, dispatch, pois } = useTour();
  const { speak, cancel, isSupported, isSpeaking } = useTTS();
  const previousOnRouteRef = useRef(null);
  const geometry = routeData.geometry || [];

  const nearestRoutePoint = useMemo(() => {
    if (!position || geometry.length === 0) {
      return null;
    }

    return findNearestPointIndex(position, geometry);
  }, [geometry, position]);

  const onRoute = Boolean(nearestRoutePoint && nearestRoutePoint.distanceMeters <= ROUTE_LOCK_THRESHOLD_METERS);

  const poiProgress = useMemo(() => {
    return getPOIProgress(pois, geometry).sort((left, right) => left.routeIndex - right.routeIndex);
  }, [geometry, pois]);

  const upcomingPOI = useMemo(() => {
    if (!nearestRoutePoint) {
      return null;
    }

    return getUpcomingPOI(poiProgress, nearestRoutePoint.index, state);
  }, [nearestRoutePoint, poiProgress, state]);

  useEffect(() => {
    if (state.screen !== 'active' || !position || geometry.length === 0) {
      previousOnRouteRef.current = null;
      return;
    }

    if (previousOnRouteRef.current === null) {
      previousOnRouteRef.current = onRoute;
      return;
    }

    if (previousOnRouteRef.current && !onRoute && state.hasRouteIntroPlayed) {
      dispatch({ type: 'SET_WELCOME_BACK_PENDING', payload: true });
    }

    previousOnRouteRef.current = onRoute;
  }, [dispatch, geometry.length, onRoute, position, state.hasRouteIntroPlayed, state.screen]);

  useEffect(() => {
    if (!state.systemNarrationPlaying) {
      return;
    }

    if (state.screen === 'active' && !state.isPaused && !state.activePOI) {
      return;
    }

    cancel({ kind: 'system' });
    dispatch({ type: 'SET_SYSTEM_NARRATION_PLAYING', payload: false });
  }, [cancel, dispatch, state.activePOI, state.isPaused, state.screen, state.systemNarrationPlaying]);

  useEffect(() => {
    if (
      state.screen !== 'active'
      || state.isPaused
      || !position
      || !onRoute
      || state.activePOI
      || state.systemNarrationPlaying
      || !state.volumeOn
      || !isSupported
      || isSpeaking()
    ) {
      return;
    }

    const shouldPlayIntro = !state.hasRouteIntroPlayed;
    const shouldPlayWelcomeBack = state.hasRouteIntroPlayed && state.needsWelcomeBackNarration;

    if (!shouldPlayIntro && !shouldPlayWelcomeBack) {
      return;
    }

    const narrationKind = shouldPlayIntro
      ? SYSTEM_NARRATION_KINDS.intro
      : SYSTEM_NARRATION_KINDS.welcomeBack;
    const narrationText = buildSystemNarrationText(narrationKind, upcomingPOI);
    const audioSrc = buildSystemNarrationAudioSrc(narrationKind, upcomingPOI?.id || null);

    if (shouldPlayIntro) {
      dispatch({ type: 'MARK_ROUTE_INTRO_PLAYED' });
    } else {
      dispatch({ type: 'SET_WELCOME_BACK_PENDING', payload: false });
    }

    dispatch({ type: 'SET_SYSTEM_NARRATION_PLAYING', payload: true });

    speak(narrationText, {
      audioSrc,
      kind: 'system',
      key: `${narrationKind}-${upcomingPOI?.id || 'generic'}`,
      onEnd: () => {
        dispatch({ type: 'SET_SYSTEM_NARRATION_PLAYING', payload: false });
      },
    });
  }, [dispatch, isSpeaking, isSupported, onRoute, position, speak, state.activePOI, state.hasRouteIntroPlayed, state.isPaused, state.needsWelcomeBackNarration, state.screen, state.systemNarrationPlaying, state.volumeOn, upcomingPOI]);
}