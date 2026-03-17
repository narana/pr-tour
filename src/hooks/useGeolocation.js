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
  const [permissionState, setPermissionState] = useState('prompt');
  const watchIdRef = useRef(null);

  const setErrorFromGeolocation = useCallback((err) => {
    switch (err.code) {
      case err.PERMISSION_DENIED:
        setPermissionState('denied');
        setError('Location permission denied. Please enable GPS access in your browser settings.');
        break;
      case err.POSITION_UNAVAILABLE:
        setError('Location information unavailable. Check that GPS is enabled and try again.');
        break;
      case err.TIMEOUT:
        setError('Location request timed out. Move to an area with a clearer GPS signal and try again.');
        break;
      default:
        setError('An unknown GPS error occurred.');
    }
  }, []);

  const updatePermissionState = useCallback(async () => {
    if (!navigator.permissions?.query) {
      return permissionState;
    }

    try {
      const status = await navigator.permissions.query({ name: 'geolocation' });
      setPermissionState(status.state);
      status.onchange = () => {
        setPermissionState(status.state);
      };
      return status.state;
    } catch {
      return permissionState;
    }
  }, [permissionState]);

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

    updatePermissionState();

    const onError = (err) => {
      setErrorFromGeolocation(err);
    };

    const options = {
      enableHighAccuracy: true,
      maximumAge: 3000,       // Accept cached positions up to 3s old
      timeout: 10000,         // 10s timeout per fix
    };

    watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, options);

    return clearWatch;
  }, [enabled, clearWatch, setErrorFromGeolocation, updatePermissionState]);

  const requestPermission = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return false;
    }

    const currentPermission = await updatePermissionState();
    if (currentPermission === 'denied') {
      setError('Location permission denied. Please enable GPS access in your browser settings.');
      return false;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setAccuracy(pos.coords.accuracy);
          setPermissionState('granted');
          setError(null);
          resolve(true);
        },
        (err) => {
          setErrorFromGeolocation(err);
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }, [setErrorFromGeolocation, updatePermissionState]);

  return {
    position,
    error,
    accuracy,
    permissionState,
    isTracking: watchIdRef.current !== null,
    requestPermission,
  };
}
