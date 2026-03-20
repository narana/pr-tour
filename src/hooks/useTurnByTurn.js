import { useEffect, useMemo, useRef } from 'react';
import routeData from '../data/routeData.json';
import { formatDistance, haversineDistance } from '../utils/geo';
import useTTS from './useTTS';

const ANNOUNCE_DISTANCE_METERS = 180;
const PASS_DISTANCE_METERS = 35;
const LOOKAHEAD_STEPS = 5;

export default function useTurnByTurn({ position, volumeOn, isPaused, currentStepIndex, onStepChange, voiceGuidanceEnabled = true, systemNarrationPlaying = false, systemNarrationPending = false }) {
  const { speak, stop, isSupported } = useTTS();
  const announcedRef = useRef(new Set());

  const steps = routeData.steps || [];

  const nextStep = useMemo(() => steps[currentStepIndex] || null, [steps, currentStepIndex]);
  const distanceToNextStep = useMemo(() => {
    if (!position || !nextStep) return null;
    return haversineDistance(position, nextStep.coordinates);
  }, [position, nextStep]);

  useEffect(() => {
    if (!position || !steps.length || isPaused || systemNarrationPlaying || systemNarrationPending) return;

    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    const currentDistance = haversineDistance(position, currentStep.coordinates);

    // Recover gracefully if GPS skips past a maneuver.
    for (let offset = 1; offset <= LOOKAHEAD_STEPS; offset += 1) {
      const candidate = steps[currentStepIndex + offset];
      if (!candidate) break;

      const candidateDistance = haversineDistance(position, candidate.coordinates);
      if (candidateDistance <= PASS_DISTANCE_METERS) {
        onStepChange(currentStepIndex + offset + 1);
        return;
      }
    }

    if (
      voiceGuidanceEnabled
      &&
      volumeOn
      && isSupported
      && currentDistance <= ANNOUNCE_DISTANCE_METERS
      && !announcedRef.current.has(currentStep.id)
    ) {
      announcedRef.current.add(currentStep.id);
      speak(currentStep.instruction, {
        audioSrc: currentStep.audioSrc,
        onEnd: undefined,
      });
    }

    if (currentDistance <= PASS_DISTANCE_METERS) {
      if (voiceGuidanceEnabled && announcedRef.current.has(currentStep.id)) {
        stop();
      }
      onStepChange(currentStepIndex + 1);
    }
  }, [currentStepIndex, isPaused, isSupported, onStepChange, position, speak, steps, stop, systemNarrationPending, systemNarrationPlaying, voiceGuidanceEnabled, volumeOn]);

  return {
    nextStep,
    distanceToNextStep,
    remainingSteps: Math.max(steps.length - currentStepIndex, 0),
    summary: routeData.summary,
    formatStepDistance: distanceToNextStep == null ? null : formatDistance(distanceToNextStep),
  };
}