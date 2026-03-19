import { useTour } from '../context/TourContext';
import useTTS from '../hooks/useTTS';

export default function ResetTourButton({
  className = '',
  label = 'Clear Progress',
  confirmMessage = 'Clear the current tour progress and return to the start screen?',
  testId,
}) {
  const { state, dispatch } = useTour();
  const { stop } = useTTS();

  const hasResettableState = state.screen !== 'pre-tour'
    || state.visitedPOIs.length > 0
    || state.triggeredPOIs.length > 0
    || state.currentStepIndex > 0
    || state.elapsedSeconds > 0
    || state.testMode;

  if (!hasResettableState) {
    return null;
  }

  const handleReset = () => {
    if (typeof window !== 'undefined' && !window.confirm(confirmMessage)) {
      return;
    }

    stop();
    dispatch({ type: 'RESTART_TOUR' });
  };

  return (
    <button className={className} onClick={handleReset} data-testid={testId}>
      {label}
    </button>
  );
}