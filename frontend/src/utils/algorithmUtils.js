// Algorithm selection utilities

export const validateSelection = (selected, timeQuantum) => {
  if (selected.length === 0) {
    return { isValid: false, error: 'Please select at least one algorithm' };
  }

  if (
    selected.includes('Round Robin') &&
    (timeQuantum < 1 || !Number.isInteger(Number(timeQuantum)))
  ) {
    return {
      isValid: false,
      error: 'Time quantum must be a positive integer',
    };
  }

  return { isValid: true, error: '' };
};

export const validateProcesses = (processSetId, processes) => {
  if (!processSetId && processes.length === 0) {
    return {
      isValid: false,
      error: 'No processes found. Please go back and add processes first.',
    };
  }

  return { isValid: true, error: '' };
};
