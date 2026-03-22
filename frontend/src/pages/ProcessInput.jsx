import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScheduler } from '../context/SchedulerContext';
import { saveProcesses } from '../api/schedulerApi';
import { SAMPLE_PROCESSES } from '../constants/sampleData';
import ProcessTable from '../components/ProcessTable';
import {
  addProcess as addProcessUtil,
  removeProcess as removeProcessUtil,
  updateProcess as updateProcessUtil,
  validateProcesses,
  cleanProcesses,
} from '../utils/processUtils';
import './styles/ProcessInput.css';

function ProcessInput() {
  const { state, dispatch } = useScheduler();
  const navigate = useNavigate();

  const [processes, setProcesses] = useState(
    state.processes.length > 0
      ? state.processes
      : [{ processId: 'P1', arrivalTime: 0, burstTime: 1, priority: 0 }],
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  const addProcess = () => {
    setProcesses(addProcessUtil(processes));
  };

  const removeProcess = (index) => {
    setProcesses(removeProcessUtil(processes, index));
  };

  const updateProcess = (index, field, value) => {
    const { processes: updated, errors: updatedErrors } = updateProcessUtil(
      processes,
      errors,
      index,
      field,
      value,
    );
    setProcesses(updated);
    setErrors(updatedErrors);
  };

  const validate = () => {
    const { errors: newErrors, isValid } = validateProcesses(processes);
    setErrors(newErrors);
    return isValid;
  };

  const loadSampleData = () => {
    setProcesses(SAMPLE_PROCESSES);
    setErrors({});
    setApiError('');
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    setApiError('');

    const cleanedProcesses = cleanProcesses(processes);

    try {
      const data = await saveProcesses(cleanedProcesses);
      dispatch({ type: 'SET_PROCESSES', payload: cleanedProcesses });
      dispatch({ type: 'SET_PROCESS_SET_ID', payload: data.id });
      navigate('/algorithms');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='process-input-page'>
      <div className='page-header'>
        <h1>Process Input</h1>
        <p>Add processes with their arrival times and burst times.</p>
      </div>

      {apiError && <div className='error-banner'>{apiError}</div>}

      <ProcessTable
        processes={processes}
        errors={errors}
        onUpdate={updateProcess}
        onRemove={removeProcess}
      />

      <div className='actions'>
        <button className='btn btn-secondary' onClick={addProcess}>
          + Add Process
        </button>
        <button className='btn btn-secondary' onClick={loadSampleData}>
          📋 Load Sample Data
        </button>
        <button
          className='btn btn-primary'
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Next: Select Algorithms'}
        </button>
      </div>
    </div>
  );
}

export default ProcessInput;
