import { TourProvider, useTour } from './context/TourContext';
import PreTour from './components/PreTour';
import Navigation from './components/Navigation';
import TourComplete from './components/TourComplete';

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
      <TourRouter />
    </TourProvider>
  );
}
