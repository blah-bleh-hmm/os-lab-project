export const calculateBestMetrics = (results) => {
  const bestAvgWT = Math.min(...results.map((r) => r.averages.avgWaitingTime));
  const bestAvgTAT = Math.min(
    ...results.map((r) => r.averages.avgTurnaroundTime),
  );
  const bestAvgRT = Math.min(...results.map((r) => r.averages.avgResponseTime));
  const bestThroughput = Math.max(...results.map((r) => r.throughput));
  const bestUtilization = Math.max(...results.map((r) => r.cpuUtilization));

  return { bestAvgWT, bestAvgTAT, bestAvgRT, bestThroughput, bestUtilization };
};

export const calculateBestAlgorithm = (results, bestMetrics) => {
  const scores = results.map((r) => {
    let score = 0;
    if (r.averages.avgWaitingTime === bestMetrics.bestAvgWT) score++;
    if (r.averages.avgTurnaroundTime === bestMetrics.bestAvgTAT) score++;
    if (r.averages.avgResponseTime === bestMetrics.bestAvgRT) score++;
    if (r.throughput === bestMetrics.bestThroughput) score++;
    if (r.cpuUtilization === bestMetrics.bestUtilization) score++;
    return score;
  });
  const maxScore = Math.max(...scores);
  return { bestIndex: scores.indexOf(maxScore), maxScore };
};

export const exportJSON = (processes, results) => {
  const blob = new Blob([JSON.stringify({ processes, results }, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cpu-scheduling-results.json';
  a.click();
  URL.revokeObjectURL(url);
};

export const exportPDF = (processes, results, bestIndex) => {
  const { jsPDF } = require('jspdf');
  require('jspdf-autotable');

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('CPU Scheduling — Comparison Report', 14, 20);

  let y = 35;

  // Input processes table
  doc.setFontSize(12);
  doc.text('Input Processes', 14, y);
  y += 6;
  doc.autoTable({
    startY: y,
    head: [['Process', 'Arrival', 'Burst']],
    body: processes.map((p) => [p.processId, p.arrivalTime, p.burstTime]),
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241] },
    margin: { left: 14 },
  });

  y = doc.lastAutoTable.finalY + 14;

  // Comparison table
  doc.text('Algorithm Comparison', 14, y);
  y += 6;
  doc.autoTable({
    startY: y,
    head: [['Metric', ...results.map((r) => r.algorithm)]],
    body: [
      ['Avg Waiting Time', ...results.map((r) => r.averages.avgWaitingTime)],
      [
        'Avg Turnaround Time',
        ...results.map((r) => r.averages.avgTurnaroundTime),
      ],
      ['Avg Response Time', ...results.map((r) => r.averages.avgResponseTime)],
      ['Throughput', ...results.map((r) => r.throughput)],
      ['CPU Utilization (%)', ...results.map((r) => r.cpuUtilization)],
      ['Total Completion', ...results.map((r) => r.totalCompletionTime)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241] },
    margin: { left: 14 },
  });

  y = doc.lastAutoTable.finalY + 14;
  doc.setFontSize(13);
  doc.text(`Best Algorithm: ${results[bestIndex].algorithm}`, 14, y);

  // Detail tables for each algorithm
  results.forEach((result) => {
    y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 16 : y + 16;
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(12);
    doc.text(`${result.algorithm} — Process Details`, 14, y);
    y += 6;
    doc.autoTable({
      startY: y,
      head: [
        ['Process', 'Arrival', 'Burst', 'Start', 'Complete', 'TAT', 'WT', 'RT'],
      ],
      body: result.processResults.map((pr) => [
        pr.processId,
        pr.arrivalTime,
        pr.burstTime,
        pr.startTime,
        pr.completionTime,
        pr.turnaroundTime,
        pr.waitingTime,
        pr.responseTime,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] },
      margin: { left: 14 },
      styles: { fontSize: 8 },
    });
  });

  doc.save('cpu-scheduling-report.pdf');
};
