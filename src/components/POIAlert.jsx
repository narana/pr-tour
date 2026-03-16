import React from 'react';
import { useTour } from '../context/TourContext';
import useTTS from '../hooks/useTTS';

export default function POIAlert() {
  const { state, dispatch } = useTour();
  const { speak, stop, isSupported } = useTTS();
  const poi = state.activePOI;

  if (!poi) return null;

  const narrationText = poi.narration?.en || '';

  const handlePlayNarration = () => {
    if (!state.volumeOn || !isSupported) return;
    speak(narrationText, {
      onEnd: () => dispatch({ type: 'SET_NARRATION_PLAYING', payload: false }),
    });
    dispatch({ type: 'SET_NARRATION_PLAYING', payload: true });
  };

  const handleDismiss = () => {
    stop();
    dispatch({ type: 'DISMISS_POI' });
  };

  const handlePauseAndExplore = () => {
    stop();
    dispatch({ type: 'VISIT_POI', payload: poi.id });
    dispatch({ type: 'DISMISS_POI' });
    dispatch({ type: 'PAUSE_TOUR' });
  };

  const handleSkip = () => {
    stop();
    dispatch({ type: 'DISMISS_POI' });
  };

  // Auto-play narration when POI triggers
  React.useEffect(() => {
    if (poi && state.volumeOn && isSupported) {
      speak(narrationText, {
        onEnd: () => dispatch({ type: 'SET_NARRATION_PLAYING', payload: false }),
      });
    }
  }, [poi?.id]);

  return (
    <div className="poi-alert">
      <div className="poi-alert__name">
        {poi.name}
        {poi.mandatory && <span className="poi-alert__mandatory">Required Stop</span>}
      </div>
      <div className="poi-alert__type">{poi.type}</div>

      <p className="poi-alert__summary">{poi.summary?.en || ''}</p>

      {state.narrationPlaying && (
        <div className="poi-alert__narration-status">
          <span>&#9654;</span> Playing narration...
        </div>
      )}

      <div className="poi-alert__controls">
        {poi.pausePrompt && (
          <button className="poi-alert__btn poi-alert__btn--primary" onClick={handlePauseAndExplore}>
            Pause &amp; Explore
          </button>
        )}
        <button className="poi-alert__btn poi-alert__btn--secondary" onClick={handlePlayNarration}>
          Replay
        </button>
        {!poi.mandatory && (
          <button className="poi-alert__btn poi-alert__btn--skip" onClick={handleSkip}>
            Skip
          </button>
        )}
        {poi.mandatory && (
          <button className="poi-alert__btn poi-alert__btn--secondary" onClick={handleDismiss}>
            Continue
          </button>
        )}
        {!poi.mandatory && (
          <button className="poi-alert__btn poi-alert__btn--secondary" onClick={handleDismiss}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
