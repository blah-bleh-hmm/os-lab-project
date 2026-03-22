/**
 * First Come First Serve (FCFS) Scheduling Algorithm
 *
 * Logic: Processes are executed in the order they arrive.
 * - Sort all processes by arrival time (tie-break by processId).
 * - Execute each process to completion before moving to the next.
 * - If the CPU is idle (current time < next arrival), jump forward to that arrival.
 *
 * Characteristics:
 * - Non-preemptive
 * - Simple and fair (no starvation)
 * - Can cause "convoy effect" where short processes wait behind long ones
 */
function fcfs(processes) {
  // Deep copy and sort by arrival time, then by processId
  const sorted = [...processes]
    .map((p) => ({ ...p }))
    .sort((a, b) => {
      if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
      return a.processId.localeCompare(b.processId);
    });

  let currentTime = 0;
  const results = [];
  const ganttChart = [];

  for (const proc of sorted) {
    const startTime = Math.max(currentTime, proc.arrivalTime);

    // If CPU was idle, record idle block
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
  }

  return buildOutput('First Come First Serve', results, ganttChart);
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
    cpuUtilization: parseFloat(
      (totalTime > 0 ? (totalBurst / totalTime) * 100 : 100).toFixed(2),
    ),
    totalCompletionTime: lastCompletion,
  };
}

module.exports = fcfs;
