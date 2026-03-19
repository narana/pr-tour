import React from 'react';
import { useTour } from '../context/TourContext';
import routeData from '../data/routeData.json';
import { HeritageArtCluster } from './HeritageArt';
import { formatDuration } from '../utils/geo';

export default function TourComplete() {
  const { state, dispatch, totalPOIs, visitedCount, saltoVisited } = useTour();
  const routeKilometers = Math.round((routeData.summary?.distanceMeters || 0) / 1000);

  const handleRestart = () => {
    dispatch({ type: 'RESTART_TOUR' });
  };

  return (
    <div className="tour-complete">
      <HeritageArtCluster className="tour-complete__art" />
      <div className="tour-complete__icon">&#x1F389;</div>
      <h1 className="tour-complete__title">Tour Complete!</h1>
      <p className="tour-complete__subtitle">
        You've explored Puerto Rico's heritage and natural beauty
      </p>

      <div className="tour-complete__stats">
        <div className="tour-complete__stat">
          <div className="tour-complete__stat-value">{visitedCount}/{totalPOIs}</div>
          <div className="tour-complete__stat-label">POIs Visited</div>
        </div>
        <div className="tour-complete__stat">
          <div className="tour-complete__stat-value">{formatDuration(state.elapsedSeconds)}</div>
          <div className="tour-complete__stat-label">Total Time</div>
        </div>
        <div className="tour-complete__stat">
          <div className="tour-complete__stat-value">~{routeKilometers}</div>
          <div className="tour-complete__stat-label">Km Driven</div>
        </div>
        <div className="tour-complete__stat">
          <div className="tour-complete__stat-value">{state.visitedPOIs.length}</div>
          <div className="tour-complete__stat-label">Stops Made</div>
        </div>
      </div>

      {saltoVisited && (
        <div className="tour-complete__salto-badge">
          Salto Collores Visited
        </div>
      )}

      {!saltoVisited && (
        <p style={{ color: '#d94040', marginBottom: 16, fontWeight: 600 }}>
          Note: Salto Collores was not visited — the mandatory stop was missed.
        </p>
      )}

      <button className="tour-complete__restart-btn" onClick={handleRestart}>
        Start New Tour
      </button>
    </div>
  );
}
