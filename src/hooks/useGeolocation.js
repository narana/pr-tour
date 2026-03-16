import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * GPS tracking hook using Browser Geolocation API.
 *
 * Returns { position, error, accuracy, isTracking, requestPermission }.
 * position: { lat, lng } or null
 * accuracy: number (meters) or null
 */
export default function useGeolocation(enabled = false) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const watchIdRef = useRef(null);

  const clearWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      clearWatch();
      return;
    }

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    const onSuccess = (pos) => {
      setPosition({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      setAccuracy(pos.coords.accuracy);
      setError(null);
    };

    const onError = (err) => {
      switch (err.code) {
        case err.PERMISSION_DENIED:
          setError('Location permission denied. Please enable GPS access in your browser settings.');
          break;
        case err.POSITION_UNAVAILABLE:
          setError('Location information unavailable.');
          break;
        case err.TIMEOUT:
          setError('Location request timed out.');
          break;
        default:
          setError('An unknown GPS error occurred.');
      }
    };

    const options = {
      enableHighAccuracy: true,
      maximumAge: 3000,       // Accept cached positions up to 3s old
      timeout: 10000,         // 10s timeout per fix
    };

    watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, options);

    return clearWatch;
  }, [enabled, clearWatch]);

  const requestPermission = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return false;
    }
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setAccuracy(pos.coords.accuracy);
          setError(null);
          resolve(true);
        },
        (err) => {
          setError('Location permission denied.');
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }, []);

  return { position, error, accuracy, isTracking: watchIdRef.current !== null, requestPermission };
}
