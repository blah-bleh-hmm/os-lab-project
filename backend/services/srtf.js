/**
 * Shortest Remaining Time First (SRTF) Preemptive Scheduling Algorithm
 *
 * Logic: At each scheduling decision point (or arrival), pick the process with the
 * shortest remaining burst time among all processes that have already arrived.
 * - If a new process arrives with fewer remaining time than the current process,
 *   preempt the current process and switch to the new one.
 * - If no process has arrived, the CPU idles until the next arrival.
 * - Tie-breaker: earlier arrival time, then processId.
 *
 * Characteristics:
 * - Preemptive version of SJF
 * - Minimizes average waiting time and turnaround time
 * - Can cause frequent context switching
 * - Requires knowledge of burst times in advance
 * - Can starve long processes
 */
function srtf(processes) {
  const procs = [...processes].map((p) => ({
    ...p,
    remainingTime: p.burstTime,
    startTime: -1,
    completionTime: 0,
  }));

  const n = procs.length;
  const done = new Array(n).fill(false);
  let currentTime = 0;
  let completed = 0;
  const results = [];
  const ganttChart = [];
  const processStartTimes = new Array(n).fill(-1);

  // Sort by arrival time
  procs.sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
    return a.processId.localeCompare(b.processId);
  });

  while (completed < n) {
    // Find process with minimum remaining time among arrived processes
    let candidate = -1;
    let minRemaining = Infinity;

    for (let i = 0; i < n; i++) {
      if (done[i]) continue;
      if (procs[i].arrivalTime <= currentTime) {
        if (
          procs[i].remainingTime < minRemaining ||
          (procs[i].remainingTime === minRemaining &&
            candidate !== -1 &&
            (procs[i].arrivalTime < procs[candidate].arrivalTime ||
              (procs[i].arrivalTime === procs[candidate].arrivalTime &&
                procs[i].processId.localeCompare(procs[candidate].processId) <
                  0)))
        ) {
          minRemaining = procs[i].remainingTime;
          candidate = i;
        }
      }
    }

    if (candidate === -1) {
      // No process has arrived, jump to next arrival
      let nextArrival = Infinity;
      for (let i = 0; i < n; i++) {
        if (!done[i]) nextArrival = Math.min(nextArrival, procs[i].arrivalTime);
      }
      ganttChart.push({
        processId: 'Idle',
        start: currentTime,
        end: nextArrival,
      });
      currentTime = nextArrival;
      continue;
    }

    const proc = procs[candidate];

    // Record start time if this is the first time this process runs
    if (processStartTimes[candidate] === -1) {
      processStartTimes[candidate] = currentTime;
    }

    // Check if next event is an arrival or process completion
    let nextEventTime = currentTime + proc.remainingTime;

    // Find next arrival time after currentTime
    let nextArrival = Infinity;
    for (let i = 0; i < n; i++) {
      if (!done[i] && procs[i].arrivalTime > currentTime) {
        nextArrival = Math.min(nextArrival, procs[i].arrivalTime);
      }
    }

    // Execute until next event (whichever comes first)
    const executeUntil = Math.min(nextEventTime, nextArrival);
    const executionTime = executeUntil - currentTime;

    ganttChart.push({
      processId: proc.processId,
      start: currentTime,
      end: executeUntil,
    });

    proc.remainingTime -= executionTime;
    currentTime = executeUntil;

    // If process is complete
    if (proc.remainingTime === 0) {
      const completionTime = currentTime;
      const arrivalTime = proc.arrivalTime;
      const startTime = processStartTimes[candidate];
      const burstTime = proc.burstTime;
      const turnaroundTime = completionTime - arrivalTime;
      const waitingTime = turnaroundTime - burstTime;
      const responseTime = startTime - arrivalTime;

      results.push({
        processId: proc.processId,
        arrivalTime,
        burstTime,
        ...(proc.priority !== undefined && { priority: proc.priority }),
        startTime,
        completionTime,
        turnaroundTime,
        waitingTime,
        responseTime,
      });

      done[candidate] = true;
      completed++;
    }
  }

  return buildOutput('Shortest Remaining Time First', results, ganttChart);
}

function buildOutput(algorithm, results, ganttChart) {
  const n = results.length;
  const totalWT = results.reduce((s, r) => s + r.waitingTime, 0);
  const totalTAT = results.reduce((s, r) => s + r.turnaroundTime, 0);
  const totalRT = results.reduce((s, r) => s + r.responseTime, 0);
  const totalBurst = results.reduce((s, r) => s + r.burstTime, 0);

  const firstArrival = Math.min(...results.map((r) => r.arrivalTime));
  const lastCompletion = Math.max(...results.map((r) => r.completionTime));
  const totalTime = lastCompletion - firstArrival;

  const cpuUtilization = totalTime > 0 ? (totalBurst / totalTime) * 100 : 100;

  return {
    algorithm,
    processResults: results,
    ganttChart,
    averages: {
      avgWaitingTime: parseFloat((totalWT / n).toFixed(2)),
      avgTurnaroundTime: parseFloat((totalTAT / n).toFixed(2)),
      avgResponseTime: parseFloat((totalRT / n).toFixed(2)),
    },
    throughput: parseFloat((totalTime > 0 ? n / totalTime : n).toFixed(4)),
    cpuUtilization: parseFloat(cpuUtilization.toFixed(2)),
    totalCompletionTime: lastCompletion,
  };
}

module.exports = srtf;
