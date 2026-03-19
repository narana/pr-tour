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
  const utteranceRef = useRef(null);
  const audioRef = useRef(sharedNarrationAudio);
  const ambienceRef = useRef(sharedAmbienceAudio);
  const pendingPlaybackTimerRef = useRef(null);
  const isSpeechSupportedRef = useRef(typeof window !== 'undefined' && 'speechSynthesis' in window);
  const isSupportedRef = useRef(Boolean(audioRef.current) || isSpeechSupportedRef.current);

  const normalizePronunciationHints = useCallback((text) => {
    if (!text) return text;

    const replacements = [
      [/\bJardin Botanico y Cultural de Caguas William Miranda Marin\b/gi, 'Jardín Botánico y Cultural de Caguas William Miranda Marín'],
      [/\bSan Ramon Nonato\b/gi, 'San Ramón Nonato'],
      [/\bCarretera Patillas - Cayey\b/gi, 'Carretera Patillas, Cayey'],
      [/\bCarretera Ciales - Jayuya\b/gi, 'Carretera Ciales, Jayuya'],
      [/\bCarretera Jacaguas\b/gi, 'Carretera Jacaguas'],
      [/\bTainos\b/gi, 'Taínos'],
      [/\bTaino\b/gi, 'Taíno'],
      [/\bBoriquen\b/gi, 'Borinquén'],
      [/\bBoriken\b/gi, 'Borikén'],
      [/\bBoricua\b/gi, 'Boricua'],
      [/\bcoquis\b/gi, 'coquís'],
      [/\bcoqui\b/gi, 'coquí'],
      [/\bCaguas\b/gi, 'Cáguas'],
      [/\bCayey\b/gi, 'Ca-yey'],
      [/\bGuavate\b/gi, 'Gua-vah-teh'],
      [/\bCoamo\b/gi, 'Coámo'],
      [/\bJayuya\b/gi, 'Ha-yú-ya'],
      [/\bCoabey\b/gi, 'Coa-bey'],
      [/\bCiales\b/gi, 'Ciáles'],
      [/\bCollores\b/gi, 'Coyores'],
      [/\bJuana Diaz\b/gi, 'Juana Díaz'],
      [/\bLuis Llorens Torres\b/gi, 'Luis Yórens Torres'],
      [/\bPonce de Leon\b/gi, 'Ponce de León'],
      [/\bRincon\b/gi, 'Rincón'],
      [/\bhuracan\b/gi, 'huracán'],
      [/\bRio\b/gi, 'Río'],
    ];

    return replacements.reduce((current, [pattern, replacement]) => {
      return current.replace(pattern, replacement);
    }, text);
  }, []);

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

    if (isSpeechSupportedRef.current) {
      window.speechSynthesis.cancel();
    }

    stopAmbience();
  }, [clearPendingPlayback, stopAmbience]);

  // Cancel speech on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const speakWithSpeechSynthesis = useCallback((text, {
    rate = 0.95,
    lang = 'en-US',
    onEnd,
    ambienceSrc,
    ambienceVolume = 0.16,
    leadInMs = 0,
  } = {}) => {
    if (!isSpeechSupportedRef.current || !text) return false;

    const normalizedText = normalizePronunciationHints(text);

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(normalizedText);
    utterance.rate = rate;
    utterance.lang = lang;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((voice) => {
      return (
        voice.lang.startsWith(lang.slice(0, 2))
        && /(ava|jenny|aria|samantha|zira|female)/i.test(voice.name)
      );
    }) || voices.find(
      (voice) => voice.lang.startsWith(lang.slice(0, 2)) && voice.localService
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      stopAmbience();
      onEnd?.();
    };
    utterance.onerror = () => {
      stopAmbience();
    };

    utteranceRef.current = utterance;

    const startSpeech = () => {
      if (ambienceSrc) {
        startAmbience(ambienceSrc, ambienceVolume);
      }
      window.speechSynthesis.speak(utterance);
    };

    if (leadInMs > 0) {
      pendingPlaybackTimerRef.current = window.setTimeout(() => {
        pendingPlaybackTimerRef.current = null;
        startSpeech();
      }, leadInMs);
    } else {
      startSpeech();
    }

    return true;
  }, [normalizePronunciationHints, startAmbience, stopAmbience]);

  const speak = useCallback((text, {
    audioSrc,
    rate = 0.92,
    lang = 'en-US',
    onEnd,
    ambienceSrc,
    ambienceVolume = 0.16,
    leadInMs,
  } = {}) => {
    if (!isSupportedRef.current || !text) return;

    const resolvedLeadInMs = leadInMs ?? (state.externalNavigationMode ? EXTERNAL_NAVIGATION_AUDIO_LEAD_IN_MS : 0);

    stop();

    if (audioSrc && audioRef.current) {
      const startAudioPlayback = () => {
        if (ambienceSrc) {
          startAmbience(ambienceSrc, ambienceVolume);
        }
        audioRef.current.src = resolveMediaUrl(audioSrc);
        audioRef.current.preload = 'auto';
        audioRef.current.playsInline = true;
        audioRef.current.playbackRate = 1;
        audioRef.current.onended = () => {
          stopAmbience();
          onEnd?.();
        };
        audioRef.current.onerror = () => {
          stopAmbience();
          speakWithSpeechSynthesis(text, { rate, lang, onEnd, ambienceSrc, ambienceVolume, leadInMs: 0 });
        };

        audioRef.current.play().catch((error) => {
          stopAmbience();

          if (error?.name === 'NotAllowedError') {
            return;
          }

          speakWithSpeechSynthesis(text, { rate, lang, onEnd, ambienceSrc, ambienceVolume, leadInMs: 0 });
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
      return;
    }

    speakWithSpeechSynthesis(text, { rate, lang, onEnd, ambienceSrc, ambienceVolume, leadInMs: resolvedLeadInMs });
  }, [speakWithSpeechSynthesis, startAmbience, state.externalNavigationMode, stop, stopAmbience]);

  const isSpeaking = useCallback(() => {
    if (!isSupportedRef.current) return false;

    const audioPlaying = Boolean(audioRef.current && !audioRef.current.paused && !audioRef.current.ended);
    return Boolean(pendingPlaybackTimerRef.current) || audioPlaying || (isSpeechSupportedRef.current && window.speechSynthesis.speaking);
  }, []);

  return { speak, stop, isSpeaking, isSupported: isSupportedRef.current, primePlayback };
}
