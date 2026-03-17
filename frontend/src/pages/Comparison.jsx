import { useNavigate } from 'react-router-dom';
import { useScheduler } from '../context/SchedulerContext';
import GanttChart from '../components/GanttChart';
import CPUUtilizationChart from '../components/CPUUtilizationChart';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './styles/Comparison.css';

function Comparison() {
  const { state, dispatch } = useScheduler();
  const navigate = useNavigate();

  if (!state.results || state.results.length < 2) {
    return (
      <div className='comparison-page'>
        <div className='empty-state'>
          <h2>Not Enough Data</h2>
          <p>
            You need at least 2 algorithm results to compare. Go back and select
            multiple algorithms.
          </p>
          <button
            className='btn btn-primary'
            onClick={() => navigate('/algorithms')}
          >
            Select Algorithms
          </button>
        </div>
      </div>
    );
  }

  const results = state.results;

  // Determine best for each metric (lowest is best for WT, TAT, RT; highest for throughput, utilization)
  const bestAvgWT = Math.min(...results.map((r) => r.averages.avgWaitingTime));
  const bestAvgTAT = Math.min(
    ...results.map((r) => r.averages.avgTurnaroundTime),
  );
  const bestAvgRT = Math.min(...results.map((r) => r.averages.avgResponseTime));
  const bestThroughput = Math.max(...results.map((r) => r.throughput));
  const bestUtilization = Math.max(...results.map((r) => r.cpuUtilization));

  // Overall best: count how many metrics each algorithm wins
  const scores = results.map((r) => {
    let score = 0;
    if (r.averages.avgWaitingTime === bestAvgWT) score++;
    if (r.averages.avgTurnaroundTime === bestAvgTAT) score++;
    if (r.averages.avgResponseTime === bestAvgRT) score++;
    if (r.throughput === bestThroughput) score++;
    if (r.cpuUtilization === bestUtilization) score++;
    return score;
  });
  const maxScore = Math.max(...scores);
  const bestIndex = scores.indexOf(maxScore);

  const exportJSON = () => {
    const blob = new Blob(
      [JSON.stringify({ processes: state.processes, results }, null, 2)],
      {
        type: 'application/json',
      },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cpu-scheduling-results.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
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
      body: state.processes.map((p) => [
        p.processId,
        p.arrivalTime,
        p.burstTime,
      ]),
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
        [
          'Avg Response Time',
          ...results.map((r) => r.averages.avgResponseTime),
        ],
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
          [
            'Process',
            'Arrival',
            'Burst',
            'Start',
            'Complete',
            'TAT',
            'WT',
            'RT',
          ],
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

  const handleReset = () => {
    dispatch({ type: 'RESET' });
    navigate('/');
  };

  return (
    <div className='comparison-page'>
      <div className='page-header'>
        <h1>Algorithm Comparison</h1>
        <p>Side-by-side comparison of all selected scheduling algorithms.</p>
      </div>

      {/* Best algorithm banner */}
      <div className='best-banner'>
        <span className='best-trophy'>&#9733;</span>
        <div>
          <strong>{results[bestIndex].algorithm}</strong> is the best-performing
          algorithm, winning {maxScore} out of 5 metrics.
        </div>
      </div>

      {/* Comparison table */}
      <div className='comparison-table-wrapper'>
        <table className='comparison-table'>
          <thead>
            <tr>
              <th>Metric</th>
              {results.map((r, i) => (
                <th key={i} className={i === bestIndex ? 'best-col' : ''}>
                  {r.algorithm}
                  {i === bestIndex && (
                    <span className='best-star'> &#9733;</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Avg Waiting Time</td>
              {results.map((r, i) => (
                <td
                  key={i}
                  className={
                    r.averages.avgWaitingTime === bestAvgWT ? 'highlight' : ''
                  }
                >
                  {r.averages.avgWaitingTime}
                </td>
              ))}
            </tr>
            <tr>
              <td>Avg Turnaround Time</td>
              {results.map((r, i) => (
                <td
                  key={i}
                  className={
                    r.averages.avgTurnaroundTime === bestAvgTAT
                      ? 'highlight'
                      : ''
                  }
                >
                  {r.averages.avgTurnaroundTime}
                </td>
              ))}
            </tr>
            <tr>
              <td>Avg Response Time</td>
              {results.map((r, i) => (
                <td
                  key={i}
                  className={
                    r.averages.avgResponseTime === bestAvgRT ? 'highlight' : ''
                  }
                >
                  {r.averages.avgResponseTime}
                </td>
              ))}
            </tr>
            <tr>
              <td>Throughput (p/unit)</td>
              {results.map((r, i) => (
                <td
                  key={i}
                  className={r.throughput === bestThroughput ? 'highlight' : ''}
                >
                  {r.throughput}
                </td>
              ))}
            </tr>
            <tr>
              <td>CPU Utilization (%)</td>
              {results.map((r, i) => (
                <td
                  key={i}
                  className={
                    r.cpuUtilization === bestUtilization ? 'highlight' : ''
                  }
                >
                  {r.cpuUtilization}%
                </td>
              ))}
            </tr>
            <tr>
              <td>Total Completion Time</td>
              {results.map((r, i) => (
                <td key={i}>{r.totalCompletionTime}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* CPU Utilization Line Graph */}
      <CPUUtilizationChart results={results} />

      {/* Side-by-side Gantt charts */}
      <h2 className='section-title'>Simultaneous Gantt Charts</h2>
      <div className='gantt-comparison-grid'>
        {results.map((result, idx) => (
          <div key={idx} className='gantt-comparison-item'>
            <GanttChart
              ganttChart={result.ganttChart}
              title={result.algorithm}
              animate={true}
              compact={results.length > 2}
            />
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className='comparison-actions'>
        <button className='btn btn-outline' onClick={exportJSON}>
          Export JSON
        </button>
        <button className='btn btn-outline' onClick={exportPDF}>
          Export PDF
        </button>
        <button className='btn btn-danger' onClick={handleReset}>
          Reset &amp; Restart
        </button>
      </div>
    </div>
  );
}

export default Comparison;
