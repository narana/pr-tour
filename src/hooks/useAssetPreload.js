import { useCallback, useEffect, useRef, useState } from 'react';

const AUDIO_MANIFEST_PATH = '/audio/en/manifest.json';
const CACHE_PREFIX = 'pr-driving-tour-assets';
const PRELOAD_STORAGE_KEY = 'pr-driving-tour-preload';
const PRELOAD_CONCURRENCY = 6;
const PROGRESS_MILESTONE_PERCENT = 10;

function resolveAssetUrl(src) {
  if (!src) return src;
  if (/^(data:|blob:|https?:)/i.test(src)) return src;

  const publicPath = src.replace(/^public\//, '').replace(/^\//, '');
  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${publicPath}`;
}

function readStoredPreloadFingerprint() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(PRELOAD_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.audioFingerprint || null;
  } catch {
    return null;
  }
}

function writeStoredPreloadFingerprint(audioFingerprint) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(PRELOAD_STORAGE_KEY, JSON.stringify({
      audioFingerprint,
      cachedAt: Date.now(),
    }));
  } catch {
    // Ignore storage write failures.
  }
}

async function fetchManifest() {
  const response = await fetch(resolveAssetUrl(AUDIO_MANIFEST_PATH), {
    cache: 'no-cache',
    credentials: 'same-origin',
  });

  if (!response.ok) {
    throw new Error(`Could not load audio manifest (${response.status}).`);
  }

  return response.json();
}

async function cleanupStaleCaches(activeCacheName) {
  if (typeof window === 'undefined' || !('caches' in window)) return;

  const cacheNames = await window.caches.keys();
  await Promise.all(cacheNames
    .filter((cacheName) => cacheName.startsWith(CACHE_PREFIX) && cacheName !== activeCacheName)
    .map((cacheName) => window.caches.delete(cacheName)));
}

export default function useAssetPreload() {
  const [status, setStatus] = useState({ phase: 'idle', loaded: 0, total: 0, audioFingerprint: null });
  const [toast, setToast] = useState(null);
  const preloadPromiseRef = useRef(null);
  const lastProgressMilestoneRef = useRef(0);

  useEffect(() => {
    if (!toast?.message || toast.persist) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setToast((currentToast) => (currentToast === toast ? null : currentToast));
    }, 3200);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const startPreloading = useCallback(async () => {
    if (preloadPromiseRef.current) {
      return preloadPromiseRef.current;
    }

    preloadPromiseRef.current = (async () => {
      try {
        const manifest = await fetchManifest();
        const assetUrls = (manifest.expectedFiles || [])
          .filter((filePath) => filePath !== 'public/audio/en/manifest.json')
          .map((filePath) => resolveAssetUrl(filePath));
        const total = assetUrls.length;
        const audioFingerprint = manifest.audioFingerprint || null;
        const cacheName = audioFingerprint ? `${CACHE_PREFIX}-${audioFingerprint}` : `${CACHE_PREFIX}-default`;
        const storedFingerprint = readStoredPreloadFingerprint();

        if (storedFingerprint && audioFingerprint && storedFingerprint === audioFingerprint) {
          setStatus({ phase: 'complete', loaded: total, total, audioFingerprint });
          return { skipped: true, total, audioFingerprint };
        }

        setStatus({ phase: 'loading', loaded: 0, total, audioFingerprint });
        setToast({
          message: `Preloading ${total} tour audio assets for low-signal stretches.`,
          variant: 'info',
          persist: true,
        });

        let cache = null;
        if (typeof window !== 'undefined' && 'caches' in window) {
          cache = await window.caches.open(cacheName);
          await cleanupStaleCaches(cacheName);
        }

        let loaded = 0;
        lastProgressMilestoneRef.current = 0;

        const updateProgress = () => {
          const percent = total > 0 ? Math.floor((loaded / total) * 100) : 100;
          const milestone = Math.floor(percent / PROGRESS_MILESTONE_PERCENT) * PROGRESS_MILESTONE_PERCENT;

          setStatus({ phase: 'loading', loaded, total, audioFingerprint });

          if (milestone >= lastProgressMilestoneRef.current + PROGRESS_MILESTONE_PERCENT && loaded < total) {
            lastProgressMilestoneRef.current = milestone;
            setToast({
              message: `Preloading tour assets: ${loaded}/${total} ready (${percent}%).`,
              variant: 'info',
              persist: true,
            });
          }
        };

        let nextIndex = 0;
        const workers = Array.from({ length: Math.min(PRELOAD_CONCURRENCY, total || 1) }, async () => {
          while (nextIndex < assetUrls.length) {
            const currentIndex = nextIndex;
            nextIndex += 1;
            const assetUrl = assetUrls[currentIndex];

            if (cache) {
              const existing = await cache.match(assetUrl, { ignoreSearch: true });
              if (existing) {
                loaded += 1;
                updateProgress();
                continue;
              }
            }

            const response = await fetch(assetUrl, {
              cache: 'reload',
              credentials: 'same-origin',
            });

            if (!response.ok) {
              throw new Error(`Could not preload ${assetUrl} (${response.status}).`);
            }

            if (cache) {
              await cache.put(assetUrl, response.clone());
            } else {
              await response.blob();
            }

            loaded += 1;
            updateProgress();
          }
        });

        await Promise.all(workers);

        writeStoredPreloadFingerprint(audioFingerprint);
        setStatus({ phase: 'complete', loaded: total, total, audioFingerprint });
        setToast({
          message: `Tour assets cached. ${total} files are ready for low-signal stretches.`,
          variant: 'success',
          persist: false,
        });

        return { skipped: false, total, audioFingerprint };
      } catch (error) {
        const fallbackMessage = 'Some assets could not be preloaded. The tour will use any files already cached and stream the rest if connectivity allows.';
        setStatus((currentStatus) => ({ ...currentStatus, phase: 'error' }));
        setToast({
          message: error instanceof Error ? `${fallbackMessage}` : fallbackMessage,
          variant: 'warning',
          persist: false,
        });
        return { skipped: false, error: error instanceof Error ? error.message : String(error) };
      } finally {
        preloadPromiseRef.current = null;
      }
    })();

    return preloadPromiseRef.current;
  }, []);

  return {
    status,
    toast,
    dismissToast,
    startPreloading,
    isPreloading: status.phase === 'loading',
    isComplete: status.phase === 'complete',
  };
}