import { useEffect, useRef } from 'react';

export default function useScreenWakeLock(enabled) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!enabled || typeof navigator === 'undefined' || !navigator.wakeLock?.request) {
      return undefined;
    }

    let disposed = false;

    const releaseWakeLock = async () => {
      if (!sentinelRef.current) return;

      try {
        await sentinelRef.current.release();
      } catch {
        // Ignore release failures from unsupported or already released locks.
      } finally {
        sentinelRef.current = null;
      }
    };

    const requestWakeLock = async () => {
      if (disposed || document.visibilityState !== 'visible' || sentinelRef.current) {
        return;
      }

      try {
        const sentinel = await navigator.wakeLock.request('screen');
        if (disposed) {
          await sentinel.release();
          return;
        }

        sentinelRef.current = sentinel;
        sentinel.addEventListener?.('release', () => {
          if (sentinelRef.current === sentinel) {
            sentinelRef.current = null;
          }
        });
      } catch {
        // Wake Lock API may reject on unsupported devices, low battery, or policy restrictions.
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void requestWakeLock();
        return;
      }

      void releaseWakeLock();
    };

    void requestWakeLock();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      void releaseWakeLock();
    };
  }, [enabled]);
}
