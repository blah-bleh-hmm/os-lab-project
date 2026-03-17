const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function saveProcesses(processes) {
  const res = await fetch(`${API_BASE}/processes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ processes }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to save processes');
  }
  return res.json();
}

export async function getProcesses(id) {
  const res = await fetch(`${API_BASE}/processes/${id}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to fetch processes');
  }
  return res.json();
}

export async function runSchedule({
  processSetId,
  processes,
  algorithms,
  timeQuantum,
}) {
  const body = { algorithms };
  if (processSetId) {
    body.processSetId = processSetId;
  } else {
    body.processes = processes;
  }
  if (algorithms.includes('Round Robin')) {
    body.timeQuantum = timeQuantum;
  }
  const res = await fetch(`${API_BASE}/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to run scheduling');
  }
  return res.json();
}
