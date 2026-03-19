import routeData from '../data/routeData.json';

export const ROUTE_LOCK_THRESHOLD_METERS = 250;

function clampIndex(index, max) {
  return Math.max(0, Math.min(index, max));
}

export function findNearestPointIndex(target, points) {
  if (!target || !points?.length) {
    return { index: 0, distanceMeters: Number.POSITIVE_INFINITY, point: null };
  }

  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];
    const latDistance = (target.lat - point.lat) * 111320;
    const lngDistance = (target.lng - point.lng) * 111320 * Math.cos(target.lat * Math.PI / 180);
    const distanceMeters = Math.sqrt((latDistance * latDistance) + (lngDistance * lngDistance));

    if (distanceMeters < nearestDistance) {
      nearestDistance = distanceMeters;
      nearestIndex = index;
    }
  }

  return {
    index: nearestIndex,
    distanceMeters: nearestDistance,
    point: points[nearestIndex],
  };
}

export function parseStepNumber(stepId) {
  if (!stepId) return 0;
  const value = Number.parseInt(String(stepId).replace('step-', ''), 10);
  return Number.isNaN(value) ? 0 : value;
}

export function segmentFromStepId(stepId) {
  return Math.floor(parseStepNumber(stepId) / 100) + 1;
}

export function getPOIProgress(pois, geometry = routeData.geometry) {
  return pois.map((poi) => ({
    ...poi,
    routeIndex: findNearestPointIndex(poi.coordinates, geometry).index,
  }));
}

export function getVisitedPOIIdsAtRouteIndex(poiProgress, routeIndex) {
  return poiProgress
    .filter((poi) => poi.routeIndex < routeIndex)
    .map((poi) => poi.id);
}

export function getStartConfigFromPosition(position, pois, options = {}) {
  const geometry = options.geometry || routeData.geometry || [];
  const steps = options.steps || routeData.steps || [];
  const routeLockThreshold = options.routeLockThreshold || ROUTE_LOCK_THRESHOLD_METERS;

  const nearestRoutePoint = findNearestPointIndex(position, geometry);
  const nearestStep = findNearestPointIndex(position, steps.map((step) => step.coordinates));
  const poiProgress = getPOIProgress(pois, geometry);
  const visitedPOIs = getVisitedPOIIdsAtRouteIndex(poiProgress, nearestRoutePoint.index);
  const nextPOI = poiProgress.find((poi) => poi.routeIndex >= nearestRoutePoint.index) || null;
  const nearestStepData = steps[clampIndex(nearestStep.index, steps.length - 1)] || null;

  return {
    onRoute: nearestRoutePoint.distanceMeters <= routeLockThreshold,
    nearestRouteIndex: nearestRoutePoint.index,
    routeDistanceMeters: nearestRoutePoint.distanceMeters,
    nearestRoutePoint: nearestRoutePoint.point,
    currentStepIndex: clampIndex(nearestStep.index, Math.max(steps.length - 1, 0)),
    currentSegment: nearestStepData ? segmentFromStepId(nearestStepData.id) : 1,
    visitedPOIs,
    nextPOI,
  };
}

export function buildRouteRecoveryLabel(startConfig) {
  if (!startConfig) return 'the route';
  return startConfig.nextPOI?.name || 'the nearest route entry point';
}

export function buildGoogleMapsDirectionsUrl(destination) {
  if (!destination) return null;
  const destinationParam = `${destination.lat},${destination.lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationParam)}&travelmode=driving&dir_action=navigate`;
}

export function buildGoogleMapsNativeNavigationUrl(destination) {
  if (!destination) return null;
  return `google.navigation:q=${destination.lat},${destination.lng}&mode=d`;
}

export function isAndroidDevice() {
  return typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent || '');
}

export function formatDestinationCoordinates(destination) {
  if (!destination) return '';
  return `${destination.lat.toFixed(5)}, ${destination.lng.toFixed(5)}`;
}

export function launchGoogleMapsNavigation(destination, options = {}) {
  if (!destination || typeof window === 'undefined') return;

  const {
    onAttempt,
    onFallback,
    onComplete,
  } = options;

  const nativeUrl = buildGoogleMapsNativeNavigationUrl(destination);
  const webUrl = buildGoogleMapsDirectionsUrl(destination);

  if (window.__E2E__ === true) {
    window.__openedUrls = window.__openedUrls || [];
    const url = isAndroidDevice() && nativeUrl ? nativeUrl : webUrl;
    window.__openedUrls.push(url);
    onAttempt?.(isAndroidDevice() && nativeUrl ? 'native' : 'web');
    onComplete?.(isAndroidDevice() && nativeUrl ? 'native' : 'web');
    return;
  }

  if (isAndroidDevice() && nativeUrl) {
    onAttempt?.('native');
    const fallbackTimer = window.setTimeout(() => {
      onFallback?.('web');
      window.location.href = webUrl;
    }, 1200);

    window.addEventListener('pagehide', () => {
      window.clearTimeout(fallbackTimer);
      onComplete?.('native');
    }, { once: true });
    window.location.href = nativeUrl;
    return;
  }

  onAttempt?.('web');
  window.open(webUrl, '_blank', 'noopener,noreferrer');
  onComplete?.('web');
}