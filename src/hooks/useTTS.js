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
  const isSpeechSupportedRef = useRef(typeof window !== 'undefined' && 'speechSynthesis' in window);
  const isSupportedRef = useRef(Boolean(audioRef.current) || isSpeechSupportedRef.current);

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
  }, []);

  // Cancel speech on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const speakWithSpeechSynthesis = useCallback((text, { rate = 0.95, lang = 'en-US', onEnd } = {}) => {
    if (!isSpeechSupportedRef.current || !text) return false;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.lang = lang;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (voice) => voice.lang.startsWith(lang.slice(0, 2)) && voice.localService
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  }, []);

  const speak = useCallback((text, { audioSrc, rate = 0.95, lang = 'en-US', onEnd } = {}) => {
    if (!isSupportedRef.current || !text) return;

    stop();

    if (audioSrc && audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.playbackRate = 1;
      audioRef.current.onended = onEnd || null;
      audioRef.current.onerror = () => {
        speakWithSpeechSynthesis(text, { rate, lang, onEnd });
      };

      audioRef.current.play().catch(() => {
        speakWithSpeechSynthesis(text, { rate, lang, onEnd });
      });
      return;
    }

    speakWithSpeechSynthesis(text, { rate, lang, onEnd });
  }, [speakWithSpeechSynthesis, stop]);

  const isSpeaking = useCallback(() => {
    if (!isSupportedRef.current) return false;

    const audioPlaying = Boolean(audioRef.current && !audioRef.current.paused && !audioRef.current.ended);
    return audioPlaying || (isSpeechSupportedRef.current && window.speechSynthesis.speaking);
  }, []);

  return { speak, stop, isSpeaking, isSupported: isSupportedRef.current };
}
