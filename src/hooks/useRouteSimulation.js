import { useCallback, useEffect, useMemo, useState } from 'react';
import routeData from '../data/routeData.json';
import { findNearestPointIndex } from '../utils/route';

const TICK_MS = 700;
const SPEED_STEPS = [1, 2, 4, 8];

export default function useRouteSimulation({ enabled, initialPosition, initialStepIndex = 0 }) {
  const geometry = routeData.geometry || [];
  const steps = routeData.steps || [];
  const initialRouteIndex = useMemo(() => {
    if (!geometry.length) return 0;

    if (initialPosition) {
      return findNearestPointIndex(initialPosition, geometry).index;
    }

    const step = steps[initialStepIndex];
    if (!step) return 0;

    return findNearestPointIndex(step.coordinates, geometry).index;
  }, [geometry, initialPosition, initialStepIndex, steps]);

  const [routeIndex, setRouteIndex] = useState(initialRouteIndex);
  const [isRunning, setIsRunning] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1);

  useEffect(() => {
    if (!enabled) {
      setIsRunning(false);
      return;
    }

    setRouteIndex(initialRouteIndex);
  }, [enabled, initialRouteIndex]);

  useEffect(() => {
    if (!enabled || !isRunning || geometry.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setRouteIndex((currentIndex) => {
        const nextIndex = Math.min(currentIndex + SPEED_STEPS[speedIndex], geometry.length - 1);
        if (nextIndex >= geometry.length - 1) {
          setIsRunning(false);
        }
        return nextIndex;
      });
    }, TICK_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [enabled, geometry.length, isRunning, speedIndex]);

  const jumpToRouteIndex = useCallback((index) => {
    if (!geometry.length) return;
    setRouteIndex(Math.max(0, Math.min(index, geometry.length - 1)));
    setIsRunning(false);
  }, [geometry.length]);

  const jumpToCoordinate = useCallback((coordinate) => {
    if (!coordinate || !geometry.length) return;
    jumpToRouteIndex(findNearestPointIndex(coordinate, geometry).index);
  }, [geometry, jumpToRouteIndex]);

  const cycleSpeed = useCallback(() => {
    setSpeedIndex((current) => (current + 1) % SPEED_STEPS.length);
  }, []);

  return {
    position: enabled ? (geometry[routeIndex] || null) : null,
    routeIndex,
    isRunning,
    speedMultiplier: SPEED_STEPS[speedIndex],
    setIsRunning,
    cycleSpeed,
    jumpToRouteIndex,
    jumpToCoordinate,
  };
}