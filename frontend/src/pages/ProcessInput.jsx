import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScheduler } from '../context/SchedulerContext';
import { saveProcesses } from '../api/schedulerApi';
import './styles/ProcessInput.css';

function ProcessInput() {
  const { state, dispatch } = useScheduler();
  const navigate = useNavigate();

  const [processes, setProcesses] = useState(
    state.processes.length > 0
      ? state.processes
      : [{ processId: 'P1', arrivalTime: 0, burstTime: 1 }]
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  const addProcess = () => {
    const nextId = `P${processes.length + 1}`;
    setProcesses([...processes, { processId: nextId, arrivalTime: 0, burstTime: 1 }]);
  };

  const removeProcess = (index) => {
    if (processes.length <= 1) return;
    setProcesses(processes.filter((_, i) => i !== index));
  };

  const updateProcess = (index, field, value) => {
    const updated = [...processes];
    if (field === 'processId') {
      updated[index] = { ...updated[index], [field]: value };
    } else {
      updated[index] = { ...updated[index], [field]: value === '' ? '' : Number(value) };
    }
    setProcesses(updated);

    // Clear field error
    const key = `${index}-${field}`;
    if (errors[key]) {
      const newErrors = { ...errors };
      delete newErrors[key];
      setErrors(newErrors);
    }
  };

  const validate = () => {
    const newErrors = {};
    const ids = new Set();

    processes.forEach((p, i) => {
      if (!p.processId || p.processId.trim() === '') {
        newErrors[`${i}-processId`] = 'Required';
      } else if (ids.has(p.processId)) {
        newErrors[`${i}-processId`] = 'Duplicate';
      } else {
        ids.add(p.processId);
      }

      if (p.arrivalTime === '' || p.arrivalTime < 0 || !Number.isInteger(Number(p.arrivalTime))) {
        newErrors[`${i}-arrivalTime`] = 'Must be >= 0';
      }

      if (p.burstTime === '' || p.burstTime < 1 || !Number.isInteger(Number(p.burstTime))) {
        newErrors[`${i}-burstTime`] = 'Must be >= 1';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    setApiError('');

    const cleanProcesses = processes.map((p) => ({
      processId: p.processId.trim(),
      arrivalTime: Number(p.arrivalTime),
      burstTime: Number(p.burstTime)
    }));

    try {
      const data = await saveProcesses(cleanProcesses);
      dispatch({ type: 'SET_PROCESSES', payload: cleanProcesses });
      dispatch({ type: 'SET_PROCESS_SET_ID', payload: data.id });
      navigate('/algorithms');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="process-input-page">
      <div className="page-header">
        <h1>Process Input</h1>
        <p>Add processes with their arrival times and burst times.</p>
      </div>

      {apiError && <div className="error-banner">{apiError}</div>}

      <div className="process-table">
        <div className="table-header">
          <div className="col col-id">Process ID</div>
          <div className="col col-at">Arrival Time</div>
          <div className="col col-bt">Burst Time</div>
          <div className="col col-action">Action</div>
        </div>

        {processes.map((p, i) => (
          <div key={i} className="table-row">
            <div className="col col-id">
              <input
                type="text"
                value={p.processId}
                onChange={(e) => updateProcess(i, 'processId', e.target.value)}
                className={errors[`${i}-processId`] ? 'input-error' : ''}
                placeholder="P1"
              />
              {errors[`${i}-processId`] && (
                <span className="field-error">{errors[`${i}-processId`]}</span>
              )}
            </div>
            <div className="col col-at">
              <input
                type="number"
                min="0"
                value={p.arrivalTime}
                onChange={(e) => updateProcess(i, 'arrivalTime', e.target.value)}
                className={errors[`${i}-arrivalTime`] ? 'input-error' : ''}
                placeholder="0"
              />
              {errors[`${i}-arrivalTime`] && (
                <span className="field-error">{errors[`${i}-arrivalTime`]}</span>
              )}
            </div>
            <div className="col col-bt">
              <input
                type="number"
                min="1"
                value={p.burstTime}
                onChange={(e) => updateProcess(i, 'burstTime', e.target.value)}
                className={errors[`${i}-burstTime`] ? 'input-error' : ''}
                placeholder="1"
              />
              {errors[`${i}-burstTime`] && (
                <span className="field-error">{errors[`${i}-burstTime`]}</span>
              )}
            </div>
            <div className="col col-action">
              <button
                className="btn-remove"
                onClick={() => removeProcess(i)}
                disabled={processes.length <= 1}
                title="Remove process"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="actions">
        <button className="btn btn-secondary" onClick={addProcess}>
          + Add Process
        </button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : 'Next: Select Algorithms'}
        </button>
      </div>
    </div>
  );
}

export default ProcessInput;
