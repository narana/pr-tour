import { useEffect, useState } from 'react';
import { useTour } from '../context/TourContext';
import useGeolocation from '../hooks/useGeolocation';
import useProximity from '../hooks/useProximity';
import useTurnByTurn from '../hooks/useTurnByTurn';
import TourMap from './TourMap';
import POIAlert from './POIAlert';
import PauseScreen from './PauseScreen';
import ReplayDrawer from './ReplayDrawer';
import { formatDuration } from '../utils/geo';

export default function Navigation() {
  const { state, dispatch, totalPOIs, visitedCount, progress, pois } = useTour();
  const { position, error } = useGeolocation(state.screen === 'active');
  const [replayOpen, setReplayOpen] = useState(false);

  // Push GPS position into tour state
  useEffect(() => {
    if (position) {
      dispatch({ type: 'UPDATE_POSITION', payload: position });
    }
  }, [position, dispatch]);

  // Proximity detection — monitors position against POI geofences
  useProximity(position);

  const { nextStep, formatStepDistance, summary } = useTurnByTurn({
    position,
    volumeOn: state.volumeOn,
    isPaused: state.isPaused,
    currentStepIndex: state.currentStepIndex,
    onStepChange: (stepIndex) => dispatch({ type: 'UPDATE_CURRENT_STEP', payload: stepIndex }),
  });

  // Check for tour completion: user returned near San Juan start after visiting at least half the POIs
  useEffect(() => {
    if (!position || state.isPaused || visitedCount < Math.ceil(totalPOIs / 2)) return;

    // San Juan endpoint (roughly the start)
    const sjLat = 18.4655;
    const sjLng = -66.1057;
    const distToEnd = Math.sqrt(
      Math.pow((position.lat - sjLat) * 111320, 2) +
      Math.pow((position.lng - sjLng) * 111320 * Math.cos(sjLat * Math.PI / 180), 2)
    );

    // Within 2km of start and visited at least half POIs
    if (distToEnd < 2000 && state.elapsedSeconds > 600) {
      dispatch({ type: 'COMPLETE_TOUR' });
    }
  }, [position, visitedCount, totalPOIs, state.isPaused, state.elapsedSeconds, dispatch]);

  const handlePause = () => {
    dispatch({ type: 'PAUSE_TOUR' });
  };

  const handleResume = () => {
    dispatch({ type: 'RESUME_TOUR' });
  };

  const handleToggleVolume = () => {
    dispatch({ type: 'TOGGLE_VOLUME' });
  };

  // Find next unvisited POI for the "next stop" display
  const nextPOI = pois.find((p) => !state.visitedPOIs.includes(p.id) && !state.triggeredPOIs.includes(p.id));

  // Estimated remaining time (rough: based on fraction of route remaining)
  const totalEstimatedSeconds = 3 * 3600; // ~3 hours total drive
  const remainingSeconds = Math.max(0, Math.round(totalEstimatedSeconds * (1 - progress)) - state.elapsedSeconds);

  return (
    <div className="navigation">
      {/* Top bar — next stop info */}
      <div className="navigation__top-bar">
        {nextPOI ? (
          <>
            <div className="navigation__next-turn">
              {nextStep ? `Next maneuver${formatStepDistance ? ` • ${formatStepDistance}` : ''}` : 'Next stop'}
            </div>
            <div className="navigation__turn-instruction">
              {nextStep?.instruction || nextPOI.name}
            </div>
            {nextStep?.roadName && nextStep.roadName !== 'the road' && (
              <div className="navigation__turn-detail">Road: {nextStep.roadName}</div>
            )}
          </>
        ) : (
          <>
            <div className="navigation__next-turn">Heading back to</div>
            <div className="navigation__turn-instruction">San Juan</div>
          </>
        )}
      </div>

      {/* Map */}
      <div className="navigation__map">
        <TourMap
          userPosition={position}
          interactive={true}
          showRoute={true}
          followUser={!state.isPaused}
        />
      </div>

      {/* POI alert overlay */}
      <POIAlert />

      {/* Pause overlay */}
      <PauseScreen />

      {/* Replay drawer */}
      <ReplayDrawer open={replayOpen} onClose={() => setReplayOpen(false)} />

      {/* Bottom bar — progress + controls */}
      <div className="navigation__bottom-bar">
        {error && (
          <p style={{ color: '#d94040', fontSize: '0.8rem', marginBottom: 8 }}>{error}</p>
        )}

        <div className="navigation__progress">
          <span>{visitedCount}/{totalPOIs}</span>
          <div className="navigation__progress-bar">
            <div
              className="navigation__progress-fill"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <span>~{formatDuration(remainingSeconds > 0 ? remainingSeconds : 0)} left</span>
        </div>

        {summary && (
          <div className="navigation__route-summary">
            <span>{Math.round(summary.distanceMeters / 1000)} km route</span>
            <span>{summary.stepCount} maneuvers stored locally</span>
          </div>
        )}

        <div className="navigation__controls">
          {state.isPaused ? (
            <button
              className="navigation__pause-btn navigation__pause-btn--resume"
              onClick={handleResume}
            >
              Resume Tour
            </button>
          ) : (
            <button className="navigation__pause-btn" onClick={handlePause}>
              Pause Tour
            </button>
          )}
          <button
            className="navigation__replay-btn"
            onClick={() => setReplayOpen(true)}
            disabled={state.triggeredPOIs.length === 0}
            aria-label="Replay visited stop narrations"
          >
            &#x1F504;
          </button>
          <button className="navigation__volume-btn" onClick={handleToggleVolume}>
            {state.volumeOn ? '\u{1F50A}' : '\u{1F507}'}
          </button>
        </div>
      </div>
    </div>
  );
}
