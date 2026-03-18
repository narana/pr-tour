import { useMemo, useState } from 'react';
import { useTour } from '../context/TourContext';
import useGeolocation from '../hooks/useGeolocation';
import TourMap from './TourMap';
import { HeritageArtCluster } from './HeritageArt';
import pois from '../data/pois';
import { formatDistance } from '../utils/geo';
import { buildRouteRecoveryLabel, getStartConfigFromPosition, launchGoogleMapsNavigation } from '../utils/route';

export default function PreTour() {
  const { dispatch } = useTour();
  const { error, requestPermission, position, accuracy, permissionState } = useGeolocation(false);
  const [gpsReady, setGpsReady] = useState(false);
  const [gpsRequesting, setGpsRequesting] = useState(false);
  const [routeRecoveryStatus, setRouteRecoveryStatus] = useState('');
  const [testMode, setTestMode] = useState(false);

  const startConfig = useMemo(() => {
    if (!position) return null;
    return getStartConfigFromPosition(position, pois);
  }, [position]);

  const handleRequestGPS = async () => {
    setGpsRequesting(true);
    const granted = await requestPermission();
    setGpsReady(granted);
    setGpsRequesting(false);
  };

  const handleGuideToRoute = () => {
    if (!startConfig?.nearestRoutePoint) return;

    launchGoogleMapsNavigation(startConfig.nearestRoutePoint, {
      onAttempt: (mode) => {
        setRouteRecoveryStatus(mode === 'native'
          ? 'Opening Google Maps driving navigation...'
          : 'Opening Google Maps directions in your browser...');
      },
      onFallback: () => {
        setRouteRecoveryStatus('Google Maps app did not respond. Opening browser directions instead.');
      },
      onComplete: () => {
        setRouteRecoveryStatus(`Google Maps launched for ${buildRouteRecoveryLabel(startConfig)}.`);
      },
    });
  };

  const handleStart = () => {
    dispatch({ type: 'START_TOUR', payload: { testMode } });
  };

  const handleStartFromHere = () => {
    if (!startConfig?.onRoute) return;

    dispatch({
      type: 'START_TOUR',
      payload: {
        currentStepIndex: startConfig.currentStepIndex,
        currentSegment: startConfig.currentSegment,
        visitedPOIs: startConfig.visitedPOIs,
        testMode,
      },
    });
  };

  const handleLaunchHarness = () => {
    dispatch({ type: 'START_TOUR', payload: { testMode: true } });
  };

  const totalStops = pois.length;
  const routeRecoveryLabel = buildRouteRecoveryLabel(startConfig);

  return (
    <div className="pre-tour">
      <div className="pre-tour__header">
        <HeritageArtCluster className="pre-tour__hero-art" />
        <h1 className="pre-tour__title">Puerto Rico Heritage &amp; Nature Tour</h1>
        <p className="pre-tour__subtitle">A self-guided driving tour through history and natural beauty</p>
      </div>

      <div className="pre-tour__map-container">
        <TourMap interactive={false} showRoute={true} />
      </div>

      <div className="pre-tour__info">
        <div className="pre-tour__stats">
          <div className="pre-tour__stat">
            <div className="pre-tour__stat-value">~208</div>
            <div className="pre-tour__stat-label">Kilometers</div>
          </div>
          <div className="pre-tour__stat">
            <div className="pre-tour__stat-value">2-4</div>
            <div className="pre-tour__stat-label">Hours</div>
          </div>
          <div className="pre-tour__stat">
            <div className="pre-tour__stat-value">{totalStops}</div>
            <div className="pre-tour__stat-label">Stops</div>
          </div>
        </div>

        <div className="pre-tour__highlights">
          <h3>Route Highlights</h3>
          <div className="pre-tour__highlight-item">
            <span className="pre-tour__highlight-icon">&#x1F3F0;</span>
            <span>Caparra and the northern colonial corridor</span>
          </div>
          <div className="pre-tour__highlight-item">
            <span className="pre-tour__highlight-icon">&#x26F0;</span>
            <span>Cayey — Cordillera Central mountain views</span>
          </div>
          <div className="pre-tour__highlight-item">
            <span className="pre-tour__highlight-icon">&#x1F4A7;</span>
            <span>Salto Collores — Hidden waterfall (mandatory stop)</span>
          </div>
          <div className="pre-tour__highlight-item">
            <span className="pre-tour__highlight-icon">&#x1F426;</span>
            <span>Laguna de Tortuguero — Coastal wildlife refuge</span>
          </div>
        </div>

        <p className="pre-tour__disclaimer">
          For your safety, audio narration will guide you hands-free.
          Turn-by-turn directions and narration are bundled locally for low-connectivity stretches.
          Do not interact with the screen while driving.
          A passenger is recommended to manage the device.
        </p>

        <label className="pre-tour__test-toggle">
          <input
            type="checkbox"
            data-testid="test-mode-checkbox"
            checked={testMode}
            onChange={(event) => setTestMode(event.target.checked)}
          />
          <span>Enable test mode controls after launch</span>
        </label>

        {gpsReady && position && startConfig && (
          <div className="pre-tour__route-lock" data-testid="route-lock-card">
            <div className="pre-tour__route-lock-title" data-testid="route-lock-title">
              {startConfig.onRoute ? 'GPS locked to route' : 'GPS not yet on route'}
            </div>
            <div className="pre-tour__route-lock-copy">
              {startConfig.onRoute
                ? `You are about ${formatDistance(startConfig.routeDistanceMeters)} from the path. The tour can begin near ${startConfig.nextPOI?.name || 'the next waypoint'}.`
                : `You are about ${formatDistance(startConfig.routeDistanceMeters)} from the planned route. Use Google Maps to drive to ${routeRecoveryLabel} and then start from your current location.`}
            </div>
            {accuracy != null && (
              <div className="pre-tour__route-lock-meta">GPS accuracy: {Math.round(accuracy)} m</div>
            )}
            {!startConfig.onRoute && (
              <div className="pre-tour__route-lock-actions">
                <button
                  className="pre-tour__secondary-btn pre-tour__secondary-btn--recovery"
                  onClick={handleGuideToRoute}
                  data-testid="guide-to-route-button"
                >
                  Guide Me To Route Entry
                </button>
                <div className="pre-tour__route-lock-meta" data-testid="route-recovery-status">
                  {routeRecoveryStatus || `Nearest route entry: ${routeRecoveryLabel}`}
                </div>
              </div>
            )}
          </div>
        )}

        {error && <p style={{ color: '#d94040', fontSize: '0.85rem', textAlign: 'center', marginBottom: 10 }}>{error}</p>}

        {permissionState === 'denied' && (
          <p className="pre-tour__permission-help" data-testid="permission-help">
            GPS permission is blocked in this browser. Re-enable location access for this site and try again.
          </p>
        )}

        {!gpsReady ? (
          <button
            className="pre-tour__start-btn"
            onClick={handleRequestGPS}
            disabled={gpsRequesting}
            data-testid="enable-gps-button"
          >
            {gpsRequesting ? 'Requesting GPS...' : 'Enable GPS & Prepare Tour'}
          </button>
        ) : (
          <div className="pre-tour__actions">
            <button className="pre-tour__start-btn" onClick={handleStart} data-testid="start-tour-button">
              Start From Beginning
            </button>
            <button
              className="pre-tour__secondary-btn"
              onClick={handleStartFromHere}
              disabled={!startConfig?.onRoute}
              data-testid="start-from-current-button"
            >
              Start From Current Location
            </button>
          </div>
        )}

        <button className="pre-tour__secondary-btn pre-tour__secondary-btn--harness" onClick={handleLaunchHarness} data-testid="launch-harness-button">
          Launch Test Harness
        </button>
      </div>
    </div>
  );
}
