import { useEffect, useMemo, useState } from 'react';
import { useTour } from '../context/TourContext';
import useGeolocation from '../hooks/useGeolocation';
import useProximity from '../hooks/useProximity';
import useTurnByTurn from '../hooks/useTurnByTurn';
import useRouteSimulation from '../hooks/useRouteSimulation';
import useTTS from '../hooks/useTTS';
import TourMap from './TourMap';
import POIAlert from './POIAlert';
import PauseScreen from './PauseScreen';
import ReplayDrawer from './ReplayDrawer';
import { formatDuration } from '../utils/geo';
import {
  buildGoogleMapsDirectionsUrl,
  formatDestinationCoordinates,
  getPOIProgress,
  isAndroidDevice,
  launchGoogleMapsNavigation,
} from '../utils/route';

export default function Navigation() {
  const { state, dispatch, totalPOIs, visitedCount, progress, pois } = useTour();
  const { position, error } = useGeolocation(state.screen === 'active');
  const { speak, stop } = useTTS();
  const [replayOpen, setReplayOpen] = useState(false);
  const [followUser, setFollowUser] = useState(true);
  const [drivingView, setDrivingView] = useState(true);
  const [androidOptimized] = useState(() => isAndroidDevice());
  const [navigationHandoffMessage, setNavigationHandoffMessage] = useState('');
  const [navigationHandoffVariant, setNavigationHandoffVariant] = useState('neutral');
  const poiProgress = useMemo(() => getPOIProgress(pois), [pois]);
  const [selectedTestPOIIndex, setSelectedTestPOIIndex] = useState(0);

  const simulation = useRouteSimulation({
    enabled: state.testMode,
    initialPosition: position,
    initialStepIndex: state.currentStepIndex,
  });
  const effectivePosition = state.testMode ? (simulation.position || position) : position;

  // Push GPS position into tour state
  useEffect(() => {
    if (effectivePosition) {
      dispatch({ type: 'UPDATE_POSITION', payload: effectivePosition });
    }
  }, [effectivePosition, dispatch]);

  // Proximity detection — monitors position against POI geofences
  useProximity(effectivePosition);

  const { nextStep, formatStepDistance, summary } = useTurnByTurn({
    position: effectivePosition,
    volumeOn: state.volumeOn,
    isPaused: state.isPaused,
    currentStepIndex: state.currentStepIndex,
    onStepChange: (stepIndex) => dispatch({ type: 'UPDATE_CURRENT_STEP', payload: stepIndex }),
  });

  // Check for tour completion: user returned near San Juan start after visiting at least half the POIs
  useEffect(() => {
    if (!effectivePosition || state.isPaused || state.testMode || visitedCount < Math.ceil(totalPOIs / 2)) return;

    // San Juan endpoint (roughly the start)
    const sjLat = 18.4655;
    const sjLng = -66.1057;
    const distToEnd = Math.sqrt(
      Math.pow((effectivePosition.lat - sjLat) * 111320, 2) +
      Math.pow((effectivePosition.lng - sjLng) * 111320 * Math.cos(sjLat * Math.PI / 180), 2)
    );

    // Within 2km of start and visited at least half POIs
    if (distToEnd < 2000 && state.elapsedSeconds > 600) {
      dispatch({ type: 'COMPLETE_TOUR' });
    }
  }, [effectivePosition, visitedCount, totalPOIs, state.isPaused, state.elapsedSeconds, state.testMode, dispatch]);

  useEffect(() => {
    if (!state.testMode) return;

    const nextUpcomingIndex = poiProgress.findIndex((poi) => !state.visitedPOIs.includes(poi.id));
    if (nextUpcomingIndex >= 0) {
      setSelectedTestPOIIndex(nextUpcomingIndex);
    }
  }, [poiProgress, state.testMode, state.visitedPOIs]);

  const handlePause = () => {
    dispatch({ type: 'PAUSE_TOUR' });
  };

  const handleResume = () => {
    dispatch({ type: 'RESUME_TOUR' });
  };

  const handleToggleVolume = () => {
    dispatch({ type: 'TOGGLE_VOLUME' });
  };

  useEffect(() => {
    if (!navigationHandoffMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setNavigationHandoffMessage('');
      setNavigationHandoffVariant('neutral');
    }, 2800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [navigationHandoffMessage]);

  const handleLaunchGoogleMaps = () => {
    if (!nextDestination) return;

    launchGoogleMapsNavigation(nextDestination, {
      onAttempt: (mode) => {
        setNavigationHandoffVariant('info');
        setNavigationHandoffMessage(
          mode === 'native'
            ? `Opening Google Maps turn-by-turn for ${nextDestinationLabel}.`
            : `Opening ${nextDestinationLabel} in Google Maps.`
        );
      },
      onFallback: () => {
        setNavigationHandoffVariant('warning');
        setNavigationHandoffMessage('Google Maps app did not open, so the route was sent to the browser instead.');
      },
      onComplete: (mode) => {
        if (mode === 'web') {
          setNavigationHandoffVariant('info');
          setNavigationHandoffMessage(`Google Maps opened for ${nextDestinationLabel}.`);
        }
      },
    });
  };

  const handleCopyDestination = async () => {
    if (!nextDestinationCoordinates || typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      setNavigationHandoffVariant('warning');
      setNavigationHandoffMessage('Clipboard access is unavailable in this browser.');
      return;
    }

    try {
      await navigator.clipboard.writeText(`${nextDestinationLabel} - ${nextDestinationCoordinates}`);
      setNavigationHandoffVariant('success');
      setNavigationHandoffMessage(`Copied ${nextDestinationLabel} coordinates.`);
    } catch {
      setNavigationHandoffVariant('warning');
      setNavigationHandoffMessage('Could not copy the destination coordinates.');
    }
  };

  // Find next unvisited POI for the "next stop" display
  const nextPOI = pois.find((p) => !state.visitedPOIs.includes(p.id) && !state.triggeredPOIs.includes(p.id));
  const selectedTestPOI = poiProgress[selectedTestPOIIndex] || null;
  const nextDestination = nextPOI?.coordinates || nextStep?.coordinates || effectivePosition || pois[0]?.coordinates || null;
  const googleMapsUrl = buildGoogleMapsDirectionsUrl(nextDestination);
  const nextDestinationLabel = nextPOI?.name || nextStep?.roadName || 'Next waypoint';
  const nextDestinationCoordinates = formatDestinationCoordinates(nextDestination);

  // Estimated remaining time (rough: based on fraction of route remaining)
  const totalEstimatedSeconds = 3 * 3600; // ~3 hours total drive
  const remainingSeconds = Math.max(0, Math.round(totalEstimatedSeconds * (1 - progress)) - state.elapsedSeconds);

  const handlePreviewPOI = () => {
    if (!selectedTestPOI) return;
    if (!state.isPaused) {
      dispatch({ type: 'PAUSE_TOUR' });
    }
    stop();
    dispatch({ type: 'ADD_TRIGGERED_POI', payload: selectedTestPOI.id });
    dispatch({ type: 'VISIT_POI', payload: selectedTestPOI.id });
    dispatch({ type: 'SHOW_POI', payload: selectedTestPOI });
    speak(selectedTestPOI.narration?.en || '', { audioSrc: selectedTestPOI.audio?.en });
    simulation.jumpToCoordinate(selectedTestPOI.coordinates);
  };

  const handleChangeTestPOI = (direction) => {
    const nextIndex = Math.max(0, Math.min(selectedTestPOIIndex + direction, poiProgress.length - 1));
    setSelectedTestPOIIndex(nextIndex);
    if (poiProgress[nextIndex]) {
      simulation.jumpToCoordinate(poiProgress[nextIndex].coordinates);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || import.meta.env.PROD || window.__E2E__ !== true) {
      return undefined;
    }

    window.__tourNavigationTestApi = {
      openReplayDrawer: () => setReplayOpen(true),
      closeReplayDrawer: () => setReplayOpen(false),
    };

    return () => {
      if (window.__tourNavigationTestApi) {
        delete window.__tourNavigationTestApi;
      }
    };
  }, []);

  return (
    <div className={`navigation${drivingView ? ' navigation--driving' : ''}`} data-testid="navigation-screen">
      {/* Top bar — next stop info */}
      <div className="navigation__top-bar">
        {nextPOI ? (
          <>
            <div className="navigation__next-turn">
              {nextStep ? `Next maneuver${formatStepDistance ? ` • ${formatStepDistance}` : ''}` : 'Next stop'}
            </div>
            <div className="navigation__turn-instruction" data-testid="turn-instruction">
              {nextStep?.instruction || nextPOI.name}
            </div>
            {nextStep?.roadName && nextStep.roadName !== 'the road' && (
              <div className="navigation__turn-detail">Road: {nextStep.roadName}</div>
            )}
            {drivingView && (
              <div className="navigation__driving-actions">
                <button className="navigation__mode-btn" onClick={() => setDrivingView(false)} data-testid="standard-view-button">
                  Standard View
                </button>
                {googleMapsUrl && (
                  <a className="navigation__google-btn" href={googleMapsUrl} target="_blank" rel="noreferrer" data-testid="google-maps-link">
                    Open in Google Maps
                  </a>
                )}
              </div>
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
          userPosition={effectivePosition}
          interactive={true}
          showRoute={true}
          followUser={!state.isPaused && followUser}
          onUserPan={() => setFollowUser(false)}
        />
        {!followUser && (
          <button className="navigation__recenter-btn" onClick={() => setFollowUser(true)} data-testid="recenter-button">
            Recenter
          </button>
        )}
      </div>

      {nextDestination && (
        <div className="navigation__android-dock" data-testid="android-navigation-dock">
          <div className="navigation__android-summary">
            <div className="navigation__android-summary-label">Google Maps handoff</div>
            <div className="navigation__android-summary-destination" data-testid="google-maps-destination">
              {nextDestinationLabel}
            </div>
            <div className="navigation__android-summary-copy">{nextDestinationCoordinates}</div>
            {navigationHandoffMessage && (
              <div
                className={`navigation__android-status navigation__android-status--${navigationHandoffVariant}`}
                data-testid="google-maps-status"
              >
                {navigationHandoffMessage}
              </div>
            )}
          </div>
          <button
            className="navigation__android-primary"
            onClick={handleLaunchGoogleMaps}
            data-testid="google-maps-native-button"
          >
            {androidOptimized ? 'Start Google Maps Navigation' : 'Launch Google Maps'}
          </button>
          {googleMapsUrl && (
            <a
              className="navigation__android-secondary"
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              data-testid="google-maps-overview-link"
            >
              Open Route Overview
            </a>
          )}
          <button
            className="navigation__android-secondary navigation__android-secondary--button"
            onClick={handleCopyDestination}
            data-testid="copy-destination-button"
          >
            Copy Destination Coordinates
          </button>
        </div>
      )}

      {/* POI alert overlay */}
      <POIAlert />

      {/* Pause overlay */}
      <PauseScreen />

      {/* Replay drawer */}
      <ReplayDrawer open={replayOpen} onClose={() => setReplayOpen(false)} />

      {/* Bottom bar — progress + controls */}
      <div className="navigation__bottom-bar">
        {error && (
          <p style={{ color: '#d94040', fontSize: '0.8rem', marginBottom: 8 }} data-testid="navigation-error">{error}</p>
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

        {state.testMode && (
          <div className="navigation__harness" data-testid="test-harness">
            <div className="navigation__harness-header">
              <span>Test harness</span>
              <button className="navigation__mode-btn" onClick={() => setDrivingView((current) => !current)} data-testid="harness-driving-toggle">
                {drivingView ? 'Driving View' : 'Driving UI'}
              </button>
            </div>
            <div className="navigation__harness-copy">
              {simulation.isRunning
                ? `Simulating route traversal at ${simulation.speedMultiplier}x point speed.`
                : 'Simulation paused. Use the POI controls to jump and preview narration.'}
            </div>
            <div className="navigation__harness-controls">
              <button className="navigation__secondary-chip" onClick={() => simulation.setIsRunning(!simulation.isRunning)} data-testid="harness-run-button">
                {simulation.isRunning ? 'Pause Sim' : 'Run Sim'}
              </button>
              <button className="navigation__secondary-chip" onClick={simulation.cycleSpeed} data-testid="harness-speed-button">
                Speed {simulation.speedMultiplier}x
              </button>
              <button className="navigation__secondary-chip" onClick={() => setReplayOpen(true)} data-testid="harness-open-replay">
                Open Replay
              </button>
              <button className="navigation__secondary-chip" onClick={() => setFollowUser(false)} data-testid="harness-pan-map">
                Simulate Pan
              </button>
              <button className="navigation__secondary-chip" onClick={() => handleChangeTestPOI(-1)} disabled={selectedTestPOIIndex === 0} data-testid="harness-prev-poi">
                Prev POI
              </button>
              <button className="navigation__secondary-chip" onClick={() => handleChangeTestPOI(1)} disabled={selectedTestPOIIndex >= poiProgress.length - 1} data-testid="harness-next-poi">
                Next POI
              </button>
              <button className="navigation__secondary-chip" onClick={handlePreviewPOI} disabled={!selectedTestPOI} data-testid="harness-preview-poi">
                Preview POI
              </button>
            </div>
            {selectedTestPOI && (
              <div className="navigation__harness-selected" data-testid="harness-selected-poi">
                Selected: {selectedTestPOI.name}
              </div>
            )}
          </div>
        )}

        <div className="navigation__controls">
          {state.isPaused ? (
            <button
              className="navigation__pause-btn navigation__pause-btn--resume"
              onClick={handleResume}
              data-testid="resume-tour-button"
            >
              Resume Tour
            </button>
          ) : (
            <button className="navigation__pause-btn" onClick={handlePause} data-testid="pause-tour-button">
              Pause Tour
            </button>
          )}
          <button
            className="navigation__replay-btn"
            onClick={() => setReplayOpen(true)}
            disabled={state.triggeredPOIs.length === 0 && state.visitedPOIs.length === 0}
            aria-label="Replay visited stop narrations"
            data-testid="open-replay-drawer-button"
          >
            &#x1F504;
          </button>
          <button className="navigation__volume-btn" onClick={handleToggleVolume} data-testid="toggle-volume-button">
            {state.volumeOn ? '\u{1F50A}' : '\u{1F507}'}
          </button>
          {!state.testMode && (
            <button className="navigation__mode-btn" onClick={() => setDrivingView((current) => !current)}>
              {drivingView ? 'Map View' : 'Driving View'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
