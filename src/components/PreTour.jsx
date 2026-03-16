import { useState } from 'react';
import { useTour } from '../context/TourContext';
import useGeolocation from '../hooks/useGeolocation';
import TourMap from './TourMap';
import pois from '../data/pois';

export default function PreTour() {
  const { dispatch } = useTour();
  const { error, requestPermission } = useGeolocation(false);
  const [gpsReady, setGpsReady] = useState(false);
  const [gpsRequesting, setGpsRequesting] = useState(false);

  const handleRequestGPS = async () => {
    setGpsRequesting(true);
    const granted = await requestPermission();
    setGpsReady(granted);
    setGpsRequesting(false);
  };

  const handleStart = () => {
    dispatch({ type: 'START_TOUR' });
  };

  const totalStops = pois.length;

  return (
    <div className="pre-tour">
      <div className="pre-tour__header">
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
            <span>Old San Juan — Spanish colonial forts</span>
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
          Do not interact with the screen while driving.
          A passenger is recommended to manage the device.
        </p>

        {error && <p style={{ color: '#d94040', fontSize: '0.85rem', textAlign: 'center', marginBottom: 10 }}>{error}</p>}

        {!gpsReady ? (
          <button
            className="pre-tour__start-btn"
            onClick={handleRequestGPS}
            disabled={gpsRequesting}
          >
            {gpsRequesting ? 'Requesting GPS...' : 'Enable GPS & Prepare Tour'}
          </button>
        ) : (
          <button className="pre-tour__start-btn" onClick={handleStart}>
            Start Tour
          </button>
        )}
      </div>
    </div>
  );
}
