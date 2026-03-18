import { useState } from 'react';
import { useTour } from '../context/TourContext';
import useTTS from '../hooks/useTTS';

/**
 * Slide-up drawer listing all triggered/visited POIs.
 * Each entry has a replay button to re-read its narration via TTS.
 */
export default function ReplayDrawer({ open, onClose }) {
  const { state, pois } = useTour();
  const { speak, stop, isSupported } = useTTS();
  const [playingId, setPlayingId] = useState(null);

  // POIs that have been triggered or visited this session, in encounter order
  const replayablePOIs = [...new Set([...state.triggeredPOIs, ...state.visitedPOIs])]
    .map((id) => pois.find((p) => p.id === id))
    .filter(Boolean);

  const handlePlay = (poi) => {
    const text = poi.narration?.en || '';
    if (!text || !isSupported) return;

    stop();
    setPlayingId(poi.id);
    speak(text, {
      audioSrc: poi.audio?.en,
      ambienceSrc: poi.soundscape?.en,
      onEnd: () => setPlayingId(null),
    });
  };

  const handleStop = () => {
    stop();
    setPlayingId(null);
  };

  if (!open) return null;

  return (
    <div className="replay-drawer" data-testid="replay-drawer">
      <div className="replay-drawer__backdrop" onClick={onClose} />
      <div className="replay-drawer__panel">
        <div className="replay-drawer__header">
          <h3 className="replay-drawer__title">Visited Stops</h3>
          <button className="replay-drawer__close" onClick={onClose} data-testid="close-replay-drawer-button">&times;</button>
        </div>

        {replayablePOIs.length === 0 ? (
          <p className="replay-drawer__empty">
            No stops visited yet. Narrations will appear here as you pass each point of interest.
          </p>
        ) : (
          <ul className="replay-drawer__list">
            {replayablePOIs.map((poi) => (
              <li key={poi.id} className="replay-drawer__item">
                <div className="replay-drawer__item-info">
                  <span className="replay-drawer__item-name">{poi.name}</span>
                  <span className="replay-drawer__item-type">{poi.type}</span>
                </div>
                {playingId === poi.id ? (
                  <button
                    className="replay-drawer__play-btn replay-drawer__play-btn--active"
                    onClick={handleStop}
                    aria-label={`Stop narration for ${poi.name}`}
                    data-testid={`replay-stop-${poi.id}`}
                  >
                    &#9632;
                  </button>
                ) : (
                  <button
                    className="replay-drawer__play-btn"
                    onClick={() => handlePlay(poi)}
                    aria-label={`Replay narration for ${poi.name}`}
                    data-testid={`replay-play-${poi.id}`}
                  >
                    &#9654;
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
