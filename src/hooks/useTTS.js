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
  const isSupportedRef = useRef(typeof window !== 'undefined' && 'speechSynthesis' in window);

  // Cancel speech on unmount
  useEffect(() => {
    return () => {
      if (isSupportedRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text, { rate = 0.95, lang = 'en-US', onEnd } = {}) => {
    if (!isSupportedRef.current || !text) return;

    // Cancel any ongoing narration
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.lang = lang;
    utterance.pitch = 1;

    // Try to pick a natural-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith(lang.slice(0, 2)) && v.localService
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (isSupportedRef.current) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const isSpeaking = useCallback(() => {
    if (!isSupportedRef.current) return false;
    return window.speechSynthesis.speaking;
  }, []);

  return { speak, stop, isSpeaking, isSupported: isSupportedRef.current };
}
