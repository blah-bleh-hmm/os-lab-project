import { createContext, useContext, useReducer } from 'react';

const SchedulerContext = createContext();

const initialState = {
  processes: [],
  processSetId: null,
  selectedAlgorithms: [],
  timeQuantum: 2,
  results: [],
  loading: false,
  error: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PROCESSES':
      return { ...state, processes: action.payload };
    case 'SET_PROCESS_SET_ID':
      return { ...state, processSetId: action.payload };
    case 'SET_ALGORITHMS':
      return { ...state, selectedAlgorithms: action.payload };
    case 'SET_TIME_QUANTUM':
      return { ...state, timeQuantum: action.payload };
    case 'SET_RESULTS':
      return { ...state, results: action.payload, loading: false, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

export function SchedulerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <SchedulerContext.Provider value={{ state, dispatch }}>
      {children}
    </SchedulerContext.Provider>
  );
}

export function useScheduler() {
  const context = useContext(SchedulerContext);
  if (!context) {
    throw new Error('useScheduler must be used within a SchedulerProvider');
  }
  return context;
}
