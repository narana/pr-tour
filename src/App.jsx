import { TourProvider, useTour } from './context/TourContext';
import { useEffect } from 'react';
import PreTour from './components/PreTour';
import Navigation from './components/Navigation';
import TourComplete from './components/TourComplete';
import useAssetPreload from './hooks/useAssetPreload';
import useTTS from './hooks/useTTS';
import useScreenWakeLock from './hooks/useScreenWakeLock';

function AudioPrimingBoundary() {
  const { state } = useTour();
  const { isSupported, primePlayback } = useTTS();

  useEffect(() => {
    if (!isSupported || typeof window === 'undefined') {
      return undefined;
    }

    let disposed = false;

    const tryPrimePlayback = async () => {
      if (disposed) return;

      const unlocked = await primePlayback();
      if (!unlocked || disposed) return;

      window.removeEventListener('pointerdown', handleInteraction, true);
      window.removeEventListener('touchend', handleInteraction, true);
      window.removeEventListener('keydown', handleInteraction, true);
      window.removeEventListener('click', handleInteraction, true);
    };

    const handleInteraction = () => {
      void tryPrimePlayback();
    };

    window.addEventListener('pointerdown', handleInteraction, true);
    window.addEventListener('touchend', handleInteraction, true);
    window.addEventListener('keydown', handleInteraction, true);
    window.addEventListener('click', handleInteraction, true);

    if (state.screen === 'active') {
      void tryPrimePlayback();
    }

    return () => {
      disposed = true;
      window.removeEventListener('pointerdown', handleInteraction, true);
      window.removeEventListener('touchend', handleInteraction, true);
      window.removeEventListener('keydown', handleInteraction, true);
      window.removeEventListener('click', handleInteraction, true);
    };
  }, [isSupported, primePlayback, state.screen]);

  return null;
}

function ScreenWakeLockBoundary() {
  const { state } = useTour();
  useScreenWakeLock(state.screen === 'active');
  return null;
}

function TourRouter({ assetPreload }) {
  const { state } = useTour();

  switch (state.screen) {
    case 'pre-tour':
      return <PreTour assetPreload={assetPreload} />;
    case 'active':
      return <Navigation assetPreload={assetPreload} />;
    case 'complete':
      return <TourComplete />;
    default:
      return <PreTour assetPreload={assetPreload} />;
  }
}

function AppShell() {
  const { state } = useTour();
  const assetPreload = useAssetPreload();
  const { startPreloading } = assetPreload;

  useEffect(() => {
    if (state.screen === 'active') {
      void startPreloading();
    }
  }, [startPreloading, state.screen]);

  return (
    <>
      <AudioPrimingBoundary />
      <ScreenWakeLockBoundary />
      <TourRouter assetPreload={assetPreload} />
    </>
  );
}

export default function App() {
  return (
    <TourProvider>
      <AppShell />
    </TourProvider>
  );
}
