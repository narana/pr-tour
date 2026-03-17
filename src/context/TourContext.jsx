import { createContext, useContext, useReducer, useEffect } from 'react';
import pois from '../data/pois';
import { saveTourState, loadTourState, clearTourState } from '../utils/storage';

const TourContext = createContext(null);

const initialState = {
  screen: 'pre-tour',        // 'pre-tour' | 'active' | 'complete'
  isPaused: false,
  visitedPOIs: [],            // IDs of POIs marked as visited
  triggeredPOIs: [],          // IDs of POIs whose alert has been triggered this session
  activePOI: null,            // Currently displayed POI object (for alert overlay)
  currentSegment: 1,
  currentStepIndex: 0,
  elapsedSeconds: 0,
  startTime: null,
  pauseStartTime: null,
  userPosition: null,         // { lat, lng, accuracy }
  narrationPlaying: false,
  volumeOn: true,
  testMode: false,
};

function tourReducer(state, action) {
  switch (action.type) {
    case 'RESTORE_STATE':
      return { ...state, ...action.payload, activePOI: null, narrationPlaying: false };

    case 'START_TOUR':
      return {
        ...state,
        screen: 'active',
        startTime: Date.now(),
        isPaused: false,
        visitedPOIs: action.payload?.visitedPOIs || [],
        triggeredPOIs: action.payload?.triggeredPOIs || [],
        elapsedSeconds: 0,
        currentSegment: action.payload?.currentSegment || 1,
        currentStepIndex: action.payload?.currentStepIndex || 0,
        activePOI: null,
        narrationPlaying: false,
        testMode: Boolean(action.payload?.testMode),
      };

    case 'UPDATE_POSITION':
      return { ...state, userPosition: action.payload };

    case 'TRIGGER_POI':
      if (state.triggeredPOIs.includes(action.payload.id)) return state;
      return {
        ...state,
        activePOI: action.payload,
        triggeredPOIs: [...state.triggeredPOIs, action.payload.id],
        narrationPlaying: true,
      };

    case 'SHOW_POI':
      return {
        ...state,
        activePOI: action.payload,
        narrationPlaying: state.volumeOn,
      };

    case 'ADD_TRIGGERED_POI':
      return {
        ...state,
        triggeredPOIs: [...new Set([...state.triggeredPOIs, action.payload])],
      };

    case 'DISMISS_POI':
      return {
        ...state,
        activePOI: null,
        narrationPlaying: false,
        visitedPOIs: state.activePOI
          ? [...new Set([...state.visitedPOIs, state.activePOI.id])]
          : state.visitedPOIs,
      };

    case 'VISIT_POI':
      return {
        ...state,
        visitedPOIs: [...new Set([...state.visitedPOIs, action.payload])],
      };

    case 'PAUSE_TOUR':
      return { ...state, isPaused: true, pauseStartTime: Date.now() };

    case 'RESUME_TOUR':
      return { ...state, isPaused: false, pauseStartTime: null };

    case 'SET_NARRATION_PLAYING':
      return { ...state, narrationPlaying: action.payload };

    case 'TOGGLE_VOLUME':
      return { ...state, volumeOn: !state.volumeOn };

    case 'UPDATE_ELAPSED':
      return { ...state, elapsedSeconds: action.payload };

    case 'UPDATE_SEGMENT':
      return { ...state, currentSegment: action.payload };

    case 'UPDATE_CURRENT_STEP':
      return { ...state, currentStepIndex: action.payload };

    case 'COMPLETE_TOUR':
      return { ...state, screen: 'complete', isPaused: false, activePOI: null };

    case 'RESTART_TOUR':
      clearTourState();
      return { ...initialState };

    default:
      return state;
  }
}

export function TourProvider({ children }) {
  const [state, dispatch] = useReducer(tourReducer, initialState, (init) => {
    const saved = loadTourState();
    if (saved && saved.screen === 'active') {
      return { ...init, ...saved, activePOI: null, narrationPlaying: false };
    }
    return init;
  });

  // Persist state on meaningful changes
  useEffect(() => {
    if (state.screen === 'active') {
      saveTourState(state);
    }
  }, [
    state.visitedPOIs,
    state.triggeredPOIs,
    state.isPaused,
    state.currentSegment,
    state.currentStepIndex,
    state.screen,
  ]);

  // Elapsed time ticker
  useEffect(() => {
    if (state.screen !== 'active' || state.isPaused || !state.startTime) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
      dispatch({ type: 'UPDATE_ELAPSED', payload: elapsed });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.screen, state.isPaused, state.startTime]);

  useEffect(() => {
    if (typeof window === 'undefined' || import.meta.env.PROD || window.__E2E__ !== true) {
      return undefined;
    }

    window.__tourTestApi = {
      ...(window.__tourTestApi || {}),
      dispatch,
      getState: () => state,
    };

    return () => {
      if (window.__tourTestApi) {
        delete window.__tourTestApi;
      }
    };
  }, [state]);

  const totalPOIs = pois.length;
  const visitedCount = state.visitedPOIs.length;
  const progress = totalPOIs > 0 ? visitedCount / totalPOIs : 0;
  const saltoVisited = state.visitedPOIs.includes('salto-collores');

  const value = {
    state,
    dispatch,
    pois,
    totalPOIs,
    visitedCount,
    progress,
    saltoVisited,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used inside TourProvider');
  return ctx;
}
