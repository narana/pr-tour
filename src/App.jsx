import { TourProvider, useTour } from './context/TourContext';
import { useEffect } from 'react';
import PreTour from './components/PreTour';
import Navigation from './components/Navigation';
import TourComplete from './components/TourComplete';
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

function TourRouter() {
  const { state } = useTour();

  switch (state.screen) {
    case 'pre-tour':
      return <PreTour />;
    case 'active':
      return <Navigation />;
    case 'complete':
      return <TourComplete />;
    default:
      return <PreTour />;
  }
}

export default function App() {
  return (
    <TourProvider>
      <AudioPrimingBoundary />
      <ScreenWakeLockBoundary />
      <TourRouter />
    </TourProvider>
  );
}
