import { useCallback, useRef, useEffect } from 'react';
import { useTour } from '../context/TourContext';

const SILENT_AUDIO_DATA_URI = 'data:audio/wav;base64,UklGRl4AAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YToAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
export const EXTERNAL_NAVIGATION_AUDIO_LEAD_IN_MS = 5000;

function createSharedAudio() {
  if (typeof Audio === 'undefined') return null;

  const audio = new Audio();
  audio.preload = 'auto';
  audio.playsInline = true;
  return audio;
}

const sharedNarrationAudio = createSharedAudio();
const sharedAmbienceAudio = createSharedAudio();
let sharedAudioUnlocked = false;
let sharedAudioUnlockPromise = null;
const sharedPlaybackState = {
  queue: [],
  currentRequest: null,
  pendingTimerId: null,
  nextRequestId: 1,
};

function matchesRequest(request, matcher = {}) {
  if (!request) return false;
  if (matcher.requestId != null && request.requestId !== matcher.requestId) return false;
  if (matcher.kind && request.kind !== matcher.kind) return false;
  if (matcher.key && request.key !== matcher.key) return false;
  return true;
}

function resolveMediaUrl(src) {
  if (!src) return src;
  if (/^(data:|blob:|https?:)/i.test(src)) return src;

  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedSrc = src.startsWith('/') ? src.slice(1) : src;
  return `${normalizedBase}${normalizedSrc}`;
}

/**
 * Text-to-Speech narration hook using the Web Speech API (SpeechSynthesis).
 *
 * Provides speak(text), stop(), and a way to check if currently speaking.
 *
 * FOLLOW-UP: For production, replace Web Speech API with pre-cached audio
 * files generated via OpenAI TTS / ElevenLabs per PRD §3.3.1.
 * Web Speech API quality varies significantly across devices and browsers.
 */
export default function useTTS() {
  const { state } = useTour();
  const audioRef = useRef(sharedNarrationAudio);
  const ambienceRef = useRef(sharedAmbienceAudio);
  const isSupportedRef = useRef(Boolean(audioRef.current));

  const stopAmbience = useCallback(() => {
    if (ambienceRef.current) {
      ambienceRef.current.pause();
      ambienceRef.current.currentTime = 0;
      ambienceRef.current.onended = null;
      ambienceRef.current.onerror = null;
      ambienceRef.current.loop = false;
    }
  }, []);

  const clearPendingPlayback = useCallback(() => {
    if (sharedPlaybackState.pendingTimerId) {
      window.clearTimeout(sharedPlaybackState.pendingTimerId);
      sharedPlaybackState.pendingTimerId = null;
    }
  }, []);

  const finalizeRequest = useCallback((matcher, { invokeOnEnd = true } = {}) => {
    const currentRequest = sharedPlaybackState.currentRequest;
    if (!currentRequest || (matcher && !matchesRequest(currentRequest, matcher))) {
      return null;
    }

    clearPendingPlayback();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
    }

    stopAmbience();
    sharedPlaybackState.currentRequest = null;

    if (invokeOnEnd) {
      currentRequest.onEnd?.();
    }

    return currentRequest;
  }, [clearPendingPlayback, stopAmbience]);

  const startAmbience = useCallback((src, volume = 0.16) => {
    if (!src || !ambienceRef.current) return;

    ambienceRef.current.src = resolveMediaUrl(src);
    ambienceRef.current.volume = volume;
    ambienceRef.current.playsInline = true;
    ambienceRef.current.loop = true;
    ambienceRef.current.currentTime = 0;
    ambienceRef.current.play().catch(() => {});
  }, []);

  const pumpQueue = useCallback(() => {
    if (
      !audioRef.current
      || sharedPlaybackState.currentRequest
      || sharedPlaybackState.pendingTimerId
      || sharedPlaybackState.queue.length === 0
    ) {
      return;
    }

    const nextRequest = sharedPlaybackState.queue.shift();
    sharedPlaybackState.currentRequest = nextRequest;

    const completeCurrentRequest = () => {
      const completedRequest = finalizeRequest({ requestId: nextRequest.requestId });
      if (completedRequest) {
        pumpQueue();
      }
    };

    const startAudioPlayback = () => {
      if (!matchesRequest(sharedPlaybackState.currentRequest, { requestId: nextRequest.requestId })) {
        return;
      }

      nextRequest.onStart?.();

      if (nextRequest.ambienceSrc) {
        startAmbience(nextRequest.ambienceSrc, nextRequest.ambienceVolume);
      }

      audioRef.current.src = resolveMediaUrl(nextRequest.audioSrc);
      audioRef.current.preload = 'auto';
      audioRef.current.playsInline = true;
      audioRef.current.playbackRate = 1;
      audioRef.current.onended = completeCurrentRequest;
      audioRef.current.onerror = completeCurrentRequest;
      audioRef.current.play().catch(() => {
        completeCurrentRequest();
      });
    };

    if (nextRequest.leadInMs > 0) {
      sharedPlaybackState.pendingTimerId = window.setTimeout(() => {
        sharedPlaybackState.pendingTimerId = null;
        startAudioPlayback();
      }, nextRequest.leadInMs);
      return;
    }

    startAudioPlayback();
  }, [finalizeRequest, startAmbience]);

  const primePlayback = useCallback(async () => {
    if (!audioRef.current) return false;
    if (sharedAudioUnlocked) return true;
    if (sharedAudioUnlockPromise) return sharedAudioUnlockPromise;

    sharedAudioUnlockPromise = (async () => {
      const audio = audioRef.current;
      const previousSrc = audio.src;
      const previousMuted = audio.muted;
      const previousVolume = audio.volume;
      const previousPlaybackRate = audio.playbackRate;

      try {
        audio.src = SILENT_AUDIO_DATA_URI;
        audio.muted = true;
        audio.volume = 0;
        audio.playbackRate = 1;
        await audio.play();
        audio.pause();
        audio.currentTime = 0;
        sharedAudioUnlocked = true;
        return true;
      } catch {
        return false;
      } finally {
        audio.pause();
        audio.currentTime = 0;
        audio.src = previousSrc;
        audio.muted = previousMuted;
        audio.volume = previousVolume;
        audio.playbackRate = previousPlaybackRate;
        sharedAudioUnlockPromise = null;
      }
    })();

    return sharedAudioUnlockPromise;
  }, []);

  const stop = useCallback(() => {
    sharedPlaybackState.queue = [];
    clearPendingPlayback();
    const finalizedRequest = finalizeRequest(null);

    if (!finalizedRequest) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
      }

      stopAmbience();
    }
  }, [clearPendingPlayback, finalizeRequest, stopAmbience]);

  const cancel = useCallback((matcher) => {
    if (!matcher) return;

    sharedPlaybackState.queue = sharedPlaybackState.queue.filter((request) => !matchesRequest(request, matcher));

    const canceledCurrentRequest = finalizeRequest(matcher);
    if (canceledCurrentRequest) {
      pumpQueue();
    }
  }, [finalizeRequest, pumpQueue]);

  const speak = useCallback((text, {
    audioSrc,
    onEnd,
    onStart,
    ambienceSrc,
    ambienceVolume = 0.16,
    leadInMs,
    interrupt = false,
    kind = 'generic',
    key,
  } = {}) => {
    if (!isSupportedRef.current || !text || !audioSrc) return;

    const resolvedLeadInMs = leadInMs ?? (state.externalNavigationMode ? EXTERNAL_NAVIGATION_AUDIO_LEAD_IN_MS : 0);

    const queueKey = key || audioSrc;
    const request = {
      requestId: sharedPlaybackState.nextRequestId,
      text,
      audioSrc,
      onEnd,
      onStart,
      ambienceSrc,
      ambienceVolume,
      leadInMs: resolvedLeadInMs,
      kind,
      key: queueKey,
    };

    sharedPlaybackState.nextRequestId += 1;

    if (interrupt) {
      sharedPlaybackState.queue = [];
      finalizeRequest(null);
    } else {
      sharedPlaybackState.queue = sharedPlaybackState.queue.filter((queuedRequest) => {
        return !(queuedRequest.kind === request.kind && queuedRequest.key === request.key);
      });

      if (matchesRequest(sharedPlaybackState.currentRequest, { kind: request.kind, key: request.key })) {
        return request.requestId;
      }
    }

    sharedPlaybackState.queue.push(request);
    pumpQueue();
    return request.requestId;
  }, [finalizeRequest, pumpQueue, state.externalNavigationMode]);

  const isSpeaking = useCallback(() => {
    if (!isSupportedRef.current) return false;

    const audioPlaying = Boolean(audioRef.current && !audioRef.current.paused && !audioRef.current.ended);
    return Boolean(sharedPlaybackState.pendingTimerId) || audioPlaying || Boolean(sharedPlaybackState.currentRequest) || sharedPlaybackState.queue.length > 0;
  }, []);

  return { speak, stop, cancel, isSpeaking, isSupported: isSupportedRef.current, primePlayback };
}
