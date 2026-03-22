/**
 * Highest Response Time First (HRTF) Non-Preemptive Scheduling Algorithm
 *
 * Logic: At each scheduling decision point, pick the process with the
 * highest response time (longest waiting time) among all processes that have already arrived.
 * - The selected process runs to completion (non-preemptive).
 * - If no process has arrived, the CPU idles until the next arrival.
 * - Response time = current time - arrival time (time waiting for CPU).
 * - Tie-breaker: earlier arrival time, then processId.
 *
 * Characteristics:
 * - Prevents starvation by prioritizing long-waiting processes
 * - Improves fairness in scheduling
 * - May not minimize average waiting time
 * - Good for interactive systems where responsiveness matters
 */
function hrtf(processes) {
  const procs = [...processes].map((p) => ({ ...p }));
  const n = procs.length;
  const done = new Array(n).fill(false);
  let currentTime = 0;
  let completed = 0;
  const results = [];
  const ganttChart = [];

  // Sort by arrival for easier next-arrival lookup
  procs.sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
    return a.processId.localeCompare(b.processId);
  });

  while (completed < n) {
    // Find the process with highest response time (longest waiting) among arrived ones
    let candidate = -1;
    let maxResponseTime = -Infinity;

    for (let i = 0; i < n; i++) {
      if (done[i]) continue;
      if (procs[i].arrivalTime <= currentTime) {
        const responseTime = currentTime - procs[i].arrivalTime;
        if (
          responseTime > maxResponseTime ||
          (responseTime === maxResponseTime &&
            candidate !== -1 &&
            (procs[i].arrivalTime < procs[candidate].arrivalTime ||
              (procs[i].arrivalTime === procs[candidate].arrivalTime &&
                procs[i].processId.localeCompare(procs[candidate].processId) <
                  0)))
        ) {
          maxResponseTime = responseTime;
          candidate = i;
        }
      }
    }

    if (candidate === -1) {
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
    const startTime = Math.max(currentTime, proc.arrivalTime);

    if (startTime > currentTime) {
      ganttChart.push({
        processId: 'Idle',
        start: currentTime,
        end: startTime,
      });
    }

    const completionTime = startTime + proc.burstTime;
    const turnaroundTime = completionTime - proc.arrivalTime;
    const waitingTime = turnaroundTime - proc.burstTime;
    const responseTime = startTime - proc.arrivalTime;

    results.push({
      processId: proc.processId,
      arrivalTime: proc.arrivalTime,
      burstTime: proc.burstTime,
      ...(proc.priority !== undefined && { priority: proc.priority }),
      startTime,
      completionTime,
      turnaroundTime,
      waitingTime,
      responseTime,
    });

    ganttChart.push({
      processId: proc.processId,
      start: startTime,
      end: completionTime,
    });
    currentTime = completionTime;
    done[candidate] = true;
    completed++;
  }

  return buildOutput('Highest Response Time First', results, ganttChart);
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

module.exports = hrtf;
