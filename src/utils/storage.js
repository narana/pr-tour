const STORAGE_KEY = 'pr-driving-tour-state';

/**
 * Save tour state to localStorage.
 */
export function saveTourState(state) {
  try {
    const serializable = {
      screen: state.screen,
      isPaused: state.isPaused,
      visitedPOIs: state.visitedPOIs,
      triggeredPOIs: state.triggeredPOIs,
      currentSegment: state.currentSegment,
      currentStepIndex: state.currentStepIndex,
      elapsedSeconds: state.elapsedSeconds,
      startTime: state.startTime,
      pauseStartTime: state.pauseStartTime,
      testMode: state.testMode,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch {
    // localStorage may be unavailable (private browsing, full storage)
  }
}

/**
 * Load saved tour state from localStorage.
 * Returns null if no saved state exists.
 */
export function loadTourState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Clear saved tour state.
 */
export function clearTourState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}
