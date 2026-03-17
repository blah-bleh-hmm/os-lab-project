/**
 * Round Robin (RR) Scheduling Algorithm
 *
 * Logic: Each process is given a fixed time slice (quantum).
 * - Maintain a ready queue of arrived processes.
 * - Dequeue the front process: execute for min(quantum, remainingTime).
 * - If the process isn't finished, push it to the back of the queue.
 * - Newly arriving processes (during execution) are enqueued before
 *   the current process is re-enqueued (so they get a chance first).
 *
 * Characteristics:
 * - Preemptive (time-sliced)
 * - Fair: every process gets CPU time regularly
 * - Response time is bounded by (n-1) * quantum
 * - Performance depends heavily on quantum choice:
 *     Too small → excessive context switching
 *     Too large → degenerates to FCFS
 */
function roundRobin(processes, timeQuantum) {
  const procs = [...processes]
    .map((p) => ({
      ...p,
      remainingTime: p.burstTime,
      startTime: -1,
      completionTime: 0
    }))
    .sort((a, b) => {
      if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
      return a.processId.localeCompare(b.processId);
    });

  const n = procs.length;
  const queue = [];
  const inQueue = new Array(n).fill(false);
  let currentTime = 0;
  let idx = 0; // next process to check for arrival
  let completed = 0;
  const ganttChart = [];

  // Jump to first arrival if needed
  if (n > 0) currentTime = Math.max(currentTime, procs[0].arrivalTime);

  // Enqueue all processes that have arrived at currentTime
  while (idx < n && procs[idx].arrivalTime <= currentTime) {
    queue.push(idx);
    inQueue[idx] = true;
    idx++;
  }

  while (completed < n) {
    if (queue.length === 0) {
      // CPU idle — jump to next arrival
      const prevTime = currentTime;
      currentTime = procs[idx].arrivalTime;
      ganttChart.push({ processId: 'Idle', start: prevTime, end: currentTime });
      while (idx < n && procs[idx].arrivalTime <= currentTime) {
        queue.push(idx);
        inQueue[idx] = true;
        idx++;
      }
      continue;
    }

    const i = queue.shift();
    inQueue[i] = false;

    // Record first response
    if (procs[i].startTime === -1) {
      procs[i].startTime = currentTime;
    }

    const execTime = Math.min(timeQuantum, procs[i].remainingTime);
    const start = currentTime;
    procs[i].remainingTime -= execTime;
    currentTime += execTime;

    ganttChart.push({ processId: procs[i].processId, start, end: currentTime });

    // Enqueue newly arrived processes (they go before the current process if it re-enters)
    while (idx < n && procs[idx].arrivalTime <= currentTime) {
      if (!inQueue[idx] && procs[idx].remainingTime > 0) {
        queue.push(idx);
        inQueue[idx] = true;
      }
      idx++;
    }

    if (procs[i].remainingTime === 0) {
      procs[i].completionTime = currentTime;
      completed++;
    } else {
      queue.push(i);
      inQueue[i] = true;
    }
  }

  // Build results
  const results = procs.map((p) => {
    const turnaroundTime = p.completionTime - p.arrivalTime;
    const waitingTime = turnaroundTime - p.burstTime;
    const responseTime = p.startTime - p.arrivalTime;
    return {
      processId: p.processId,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      startTime: p.startTime,
      completionTime: p.completionTime,
      turnaroundTime,
      waitingTime,
      responseTime
    };
  });

  return buildOutput('Round Robin', results, ganttChart, timeQuantum);
}

function buildOutput(algorithm, results, ganttChart, timeQuantum) {
  const n = results.length;
  const totalWT = results.reduce((s, r) => s + r.waitingTime, 0);
  const totalTAT = results.reduce((s, r) => s + r.turnaroundTime, 0);
  const totalRT = results.reduce((s, r) => s + r.responseTime, 0);
  const totalBurst = results.reduce((s, r) => s + r.burstTime, 0);

  const firstArrival = Math.min(...results.map((r) => r.arrivalTime));
  const lastCompletion = Math.max(...results.map((r) => r.completionTime));
  const totalTime = lastCompletion - firstArrival;

  const output = {
    algorithm,
    processResults: results,
    ganttChart,
    averages: {
      avgWaitingTime: parseFloat((totalWT / n).toFixed(2)),
      avgTurnaroundTime: parseFloat((totalTAT / n).toFixed(2)),
      avgResponseTime: parseFloat((totalRT / n).toFixed(2))
    },
    throughput: parseFloat((totalTime > 0 ? n / totalTime : n).toFixed(4)),
    cpuUtilization: parseFloat((totalTime > 0 ? (totalBurst / totalTime) * 100 : 100).toFixed(2)),
    totalCompletionTime: lastCompletion
  };

  if (timeQuantum !== undefined) {
    output.timeQuantum = timeQuantum;
  }

  return output;
}

module.exports = roundRobin;
