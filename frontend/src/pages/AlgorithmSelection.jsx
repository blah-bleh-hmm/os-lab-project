import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScheduler } from '../context/SchedulerContext';
import { runSchedule } from '../api/schedulerApi';
import './styles/AlgorithmSelection.css';

const ALGORITHMS = [
  {
    id: 'FCFS',
    name: 'First Come First Serve',
    description:
      'Processes are executed in the order they arrive. Simple and fair, but can cause convoy effect.',
    color: '#6366f1',
  },
  {
    id: 'SJF',
    name: 'Shortest Job First',
    description:
      'Selects the process with the shortest burst time. Optimal for minimizing average waiting time.',
    color: '#22c55e',
  },
  {
    id: 'LJF',
    name: 'Longest Job First',
    description:
      'Selects the process with the longest burst time. Can cause starvation for short processes.',
    color: '#f59e0b',
  },
  {
    id: 'Round Robin',
    name: 'Round Robin',
    description:
      'Each process gets a fixed time quantum. Fair and bounded response time, but depends on quantum size.',
    color: '#f43f5e',
  },
  {
    id: 'Priority Scheduling',
    name: 'Priority Scheduling',
    description:
      'Selects the process with the highest priority (lowest priority number). Allows prioritizing important processes but can starve low-priority ones.',
    color: '#ec4899',
  },
  {
    id: 'SRTF',
    name: 'Shortest Remaining Time First',
    description:
      'Preemptive version of SJF. Selects the process with shortest remaining burst time. Minimizes waiting time but causes frequent context switches.',
    color: '#8b5cf6',
  },
  {
    id: 'HRTF',
    name: 'Highest Response Time First',
    description:
      'Selects the process that has been waiting the longest. Prevents starvation and improves fairness for long-running processes.',
    color: '#06b6d4',
  },
];

function AlgorithmSelection() {
  const { state, dispatch } = useScheduler();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(
    state.selectedAlgorithms.length > 0 ? state.selectedAlgorithms : [],
  );
  const [timeQuantum, setTimeQuantum] = useState(state.timeQuantum || 2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleAlgorithm = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      setError('Please select at least one algorithm');
      return;
    }

    if (
      selected.includes('Round Robin') &&
      (timeQuantum < 1 || !Number.isInteger(Number(timeQuantum)))
    ) {
      setError('Time quantum must be a positive integer');
      return;
    }

    if (!state.processSetId && state.processes.length === 0) {
      setError('No processes found. Please go back and add processes first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await runSchedule({
        processSetId: state.processSetId,
        processes: state.processes,
        algorithms: selected,
        timeQuantum: Number(timeQuantum),
      });

      dispatch({ type: 'SET_ALGORITHMS', payload: selected });
      dispatch({ type: 'SET_TIME_QUANTUM', payload: Number(timeQuantum) });
      dispatch({ type: 'SET_RESULTS', payload: data.results });
      navigate('/results');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='algorithm-page'>
      <div className='page-header'>
        <h1>Select Algorithms</h1>
        <p>
          Choose one or more scheduling algorithms to run on your{' '}
          <strong>{state.processes.length}</strong> processes.
        </p>
      </div>

      {error && <div className='error-banner'>{error}</div>}

      <div className='algo-grid'>
        {ALGORITHMS.map((algo) => {
          const isSelected = selected.includes(algo.id);
          return (
            <button
              key={algo.id}
              className={`algo-card ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleAlgorithm(algo.id)}
              style={{ '--algo-color': algo.color }}
            >
              <div className='algo-check'>{isSelected ? '\u2713' : ''}</div>
              <h3 className='algo-name'>{algo.name}</h3>
              <p className='algo-desc'>{algo.description}</p>
              <span className='algo-tag'>{algo.id}</span>
            </button>
          );
        })}
      </div>

      {selected.includes('Round Robin') && (
        <div className='quantum-input'>
          <label htmlFor='timeQuantum'>Time Quantum</label>
          <input
            id='timeQuantum'
            type='number'
            min='1'
            value={timeQuantum}
            onChange={(e) => setTimeQuantum(e.target.value)}
          />
        </div>
      )}

      <div className='actions'>
        <button className='btn btn-secondary' onClick={() => navigate('/')}>
          Back to Processes
        </button>
        <button
          className='btn btn-primary'
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? 'Running Algorithms...'
            : `Run ${selected.length} Algorithm${selected.length !== 1 ? 's' : ''}`}
        </button>
      </div>
    </div>
  );
}

export default AlgorithmSelection;
