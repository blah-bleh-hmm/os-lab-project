// Process manipulation utilities

export const addProcess = (processes) => {
  const nextId = `P${processes.length + 1}`;
  return [
    ...processes,
    { processId: nextId, arrivalTime: 0, burstTime: 1, priority: 0 },
  ];
};

export const removeProcess = (processes, index) => {
  if (processes.length <= 1) return processes;
  return processes.filter((_, i) => i !== index);
};

export const updateProcess = (processes, errors, index, field, value) => {
  const updated = [...processes];
  if (field === 'processId') {
    updated[index] = { ...updated[index], [field]: value };
  } else {
    updated[index] = {
      ...updated[index],
      [field]: value === '' ? '' : Number(value),
    };
  }

  // Clear field error
  const key = `${index}-${field}`;
  let newErrors = errors;
  if (errors[key]) {
    newErrors = { ...errors };
    delete newErrors[key];
  }

  return { processes: updated, errors: newErrors };
};

export const validateProcesses = (processes) => {
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

    if (
      p.arrivalTime === '' ||
      p.arrivalTime < 0 ||
      !Number.isInteger(Number(p.arrivalTime))
    ) {
      newErrors[`${i}-arrivalTime`] = 'Must be >= 0';
    }

    if (
      p.burstTime === '' ||
      p.burstTime < 1 ||
      !Number.isInteger(Number(p.burstTime))
    ) {
      newErrors[`${i}-burstTime`] = 'Must be >= 1';
    }

    if (
      p.priority === undefined ||
      p.priority === '' ||
      !Number.isInteger(Number(p.priority)) ||
      Number(p.priority) < 0
    ) {
      newErrors[`${i}-priority`] = 'Must be >= 0';
    }
  });

  return { errors: newErrors, isValid: Object.keys(newErrors).length === 0 };
};

export const cleanProcesses = (processes) => {
  return processes.map((p) => ({
    processId: p.processId.trim(),
    arrivalTime: Number(p.arrivalTime),
    burstTime: Number(p.burstTime),
    priority: Number(p.priority),
  }));
};
