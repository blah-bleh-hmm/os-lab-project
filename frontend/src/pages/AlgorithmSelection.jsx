import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScheduler } from '../context/SchedulerContext';
import { runSchedule } from '../api/schedulerApi';
import { ALGORITHMS } from '../constants/algorithms';
import { validateSelection, validateProcesses } from '../utils/algorithmUtils';
import AlgorithmGrid from '../components/AlgorithmGrid';
import QuantumInput from '../components/QuantumInput';
import './styles/AlgorithmSelection.css';

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

  const selectAll = () => {
    setSelected(ALGORITHMS.map((algo) => algo.id));
  };

  const handleSubmit = async () => {
    const selectionValidation = validateSelection(selected, timeQuantum);
    if (!selectionValidation.isValid) {
      setError(selectionValidation.error);
      return;
    }

    const processValidation = validateProcesses(
      state.processSetId,
      state.processes,
    );
    if (!processValidation.isValid) {
      setError(processValidation.error);
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

      <AlgorithmGrid
        algorithms={ALGORITHMS}
        selected={selected}
        onToggle={toggleAlgorithm}
      />

      {selected.includes('Round Robin') && (
        <QuantumInput value={timeQuantum} onChange={setTimeQuantum} />
      )}

      <div className='actions'>
        <button className='btn btn-secondary' onClick={() => navigate('/')}>
          Back to Processes
        </button>
        <button className='btn btn-secondary' onClick={selectAll}>
          ✓ Select All
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
