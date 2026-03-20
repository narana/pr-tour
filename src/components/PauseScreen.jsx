import React, { useState, useEffect } from 'react';
import { useTour } from '../context/TourContext';
import useTTS from '../hooks/useTTS';
import ResetTourButton from './ResetTourButton';
import { formatDuration } from '../utils/geo';

export default function PauseScreen() {
  const { state, dispatch, pois } = useTour();
  const { speak, stop, isSupported } = useTTS();
  const [pauseElapsed, setPauseElapsed] = useState(0);

  // Find the most recently visited POI to display context
  const lastVisitedId = state.visitedPOIs[state.visitedPOIs.length - 1];
  const lastVisitedPOI = pois.find((p) => p.id === lastVisitedId);

  // Pause duration timer
  useEffect(() => {
    if (!state.isPaused || !state.pauseStartTime) return;
    const interval = setInterval(() => {
      setPauseElapsed(Math.floor((Date.now() - state.pauseStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [state.isPaused, state.pauseStartTime]);

  const handleResume = () => {
    stop();
    dispatch({ type: 'RESUME_TOUR' });
  };

  const handleReplay = () => {
    if (!lastVisitedPOI || !isSupported || !state.volumeOn) return;
    const text = lastVisitedPOI.narration?.en || '';
    speak(text, {
      audioSrc: lastVisitedPOI.audio?.en,
      ambienceSrc: lastVisitedPOI.soundscape?.en,
      interrupt: true,
      kind: 'replay',
      key: lastVisitedPOI.id,
    });
  };

  if (!state.isPaused) return null;

  return (
    <div className="pause-screen" data-testid="pause-screen">
      <div className="pause-screen__card">
        <div className="pause-screen__icon">&#x23F8;</div>
        <h2 className="pause-screen__title">Tour Paused</h2>

        {lastVisitedPOI && (
          <p className="pause-screen__poi-name">{lastVisitedPOI.name}</p>
        )}

        <div className="pause-screen__timer">{formatDuration(pauseElapsed)}</div>

        <button className="pause-screen__resume-btn" onClick={handleResume} data-testid="pause-screen-resume-button">
          Resume Tour
        </button>

        {lastVisitedPOI && (
          <button className="pause-screen__replay-btn" onClick={handleReplay} data-testid="pause-screen-replay-button">
            Replay Last Narration
          </button>
        )}

        <ResetTourButton
          className="pause-screen__reset-btn"
          label="Clear Tour Progress"
          confirmMessage="Clear the paused tour and return to the start screen?"
          testId="pause-screen-reset-button"
        />
      </div>
    </div>
  );
}
