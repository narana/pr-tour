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
  const pendingPlaybackTimerRef = useRef(null);
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
    if (pendingPlaybackTimerRef.current) {
      window.clearTimeout(pendingPlaybackTimerRef.current);
      pendingPlaybackTimerRef.current = null;
    }
  }, []);

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

  const startAmbience = useCallback((src, volume = 0.16) => {
    if (!src || !ambienceRef.current) return;

    ambienceRef.current.src = resolveMediaUrl(src);
    ambienceRef.current.volume = volume;
    ambienceRef.current.playsInline = true;
    ambienceRef.current.loop = true;
    ambienceRef.current.currentTime = 0;
    ambienceRef.current.play().catch(() => {});
  }, []);

  const stop = useCallback(() => {
    clearPendingPlayback();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
    }

    stopAmbience();
  }, [clearPendingPlayback, stopAmbience]);

  // Cancel speech on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const speak = useCallback((text, {
    audioSrc,
    onEnd,
    ambienceSrc,
    ambienceVolume = 0.16,
    leadInMs,
  } = {}) => {
    if (!isSupportedRef.current || !text || !audioSrc) return;

    const resolvedLeadInMs = leadInMs ?? (state.externalNavigationMode ? EXTERNAL_NAVIGATION_AUDIO_LEAD_IN_MS : 0);

    stop();

    const handlePlaybackComplete = () => {
      stopAmbience();
      onEnd?.();
    };

    const startAudioPlayback = () => {
      if (ambienceSrc) {
        startAmbience(ambienceSrc, ambienceVolume);
      }
      audioRef.current.src = resolveMediaUrl(audioSrc);
      audioRef.current.preload = 'auto';
      audioRef.current.playsInline = true;
      audioRef.current.playbackRate = 1;
      audioRef.current.onended = handlePlaybackComplete;
      audioRef.current.onerror = handlePlaybackComplete;

      audioRef.current.play().catch(() => {
        handlePlaybackComplete();
      });
    };

    if (resolvedLeadInMs > 0) {
      pendingPlaybackTimerRef.current = window.setTimeout(() => {
        pendingPlaybackTimerRef.current = null;
        startAudioPlayback();
      }, resolvedLeadInMs);
    } else {
      startAudioPlayback();
    }
  }, [startAmbience, state.externalNavigationMode, stop, stopAmbience]);

  const isSpeaking = useCallback(() => {
    if (!isSupportedRef.current) return false;

    const audioPlaying = Boolean(audioRef.current && !audioRef.current.paused && !audioRef.current.ended);
    return Boolean(pendingPlaybackTimerRef.current) || audioPlaying;
  }, []);

  return { speak, stop, isSpeaking, isSupported: isSupportedRef.current, primePlayback };
}
