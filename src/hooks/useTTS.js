import { useCallback, useRef, useEffect } from 'react';

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
  const utteranceRef = useRef(null);
  const audioRef = useRef(typeof Audio !== 'undefined' ? new Audio() : null);
  const ambienceRef = useRef(typeof Audio !== 'undefined' ? new Audio() : null);
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

  const startAmbience = useCallback((src, volume = 0.16) => {
    if (!src || !ambienceRef.current) return;

    ambienceRef.current.src = src;
    ambienceRef.current.volume = volume;
    ambienceRef.current.loop = true;
    ambienceRef.current.currentTime = 0;
    ambienceRef.current.play().catch(() => {});
  }, []);

  const stop = useCallback(() => {
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
  }, [stopAmbience]);

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
  } = {}) => {
    if (!isSpeechSupportedRef.current || !text) return false;

    const normalizedText = normalizePronunciationHints(text);

    window.speechSynthesis.cancel();
    if (ambienceSrc) {
      startAmbience(ambienceSrc, ambienceVolume);
    }

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
    window.speechSynthesis.speak(utterance);
    return true;
  }, [normalizePronunciationHints, startAmbience, stopAmbience]);

  const speak = useCallback((text, {
    audioSrc,
    rate = 0.92,
    lang = 'en-US',
    onEnd,
    ambienceSrc,
    ambienceVolume = 0.16,
  } = {}) => {
    if (!isSupportedRef.current || !text) return;

    stop();

    if (audioSrc && audioRef.current) {
      if (ambienceSrc) {
        startAmbience(ambienceSrc, ambienceVolume);
      }
      audioRef.current.src = audioSrc;
      audioRef.current.playbackRate = 1;
      audioRef.current.onended = () => {
        stopAmbience();
        onEnd?.();
      };
      audioRef.current.onerror = () => {
        stopAmbience();
        speakWithSpeechSynthesis(text, { rate, lang, onEnd, ambienceSrc, ambienceVolume });
      };

      audioRef.current.play().catch(() => {
        stopAmbience();
        speakWithSpeechSynthesis(text, { rate, lang, onEnd, ambienceSrc, ambienceVolume });
      });
      return;
    }

    speakWithSpeechSynthesis(text, { rate, lang, onEnd, ambienceSrc, ambienceVolume });
  }, [speakWithSpeechSynthesis, startAmbience, stop, stopAmbience]);

  const isSpeaking = useCallback(() => {
    if (!isSupportedRef.current) return false;

    const audioPlaying = Boolean(audioRef.current && !audioRef.current.paused && !audioRef.current.ended);
    return audioPlaying || (isSpeechSupportedRef.current && window.speechSynthesis.speaking);
  }, []);

  return { speak, stop, isSpeaking, isSupported: isSupportedRef.current };
}
