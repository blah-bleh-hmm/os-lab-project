function ComparisonTable({ results, bestMetrics, bestIndex }) {
  const renderCell = (value, isBest) => (
    <td className={isBest ? 'highlight' : ''}>{value}</td>
  );

  return (
    <div className='comparison-table-wrapper'>
      <table className='comparison-table'>
        <thead>
          <tr>
            <th>Metric</th>
            {results.map((r, i) => (
              <th key={i} className={i === bestIndex ? 'best-col' : ''}>
                {r.algorithm}
                {i === bestIndex && <span className='best-star'> &#9733;</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Avg Waiting Time</td>
            {results.map((r, i) =>
              renderCell(
                r.averages.avgWaitingTime,
                r.averages.avgWaitingTime === bestMetrics.bestAvgWT,
              ),
            )}
          </tr>
          <tr>
            <td>Avg Turnaround Time</td>
            {results.map((r, i) =>
              renderCell(
                r.averages.avgTurnaroundTime,
                r.averages.avgTurnaroundTime === bestMetrics.bestAvgTAT,
              ),
            )}
          </tr>
          <tr>
            <td>Avg Response Time</td>
            {results.map((r, i) =>
              renderCell(
                r.averages.avgResponseTime,
                r.averages.avgResponseTime === bestMetrics.bestAvgRT,
              ),
            )}
          </tr>
          <tr>
            <td>Throughput (p/unit)</td>
            {results.map((r, i) =>
              renderCell(
                r.throughput,
                r.throughput === bestMetrics.bestThroughput,
              ),
            )}
          </tr>
          <tr>
            <td>CPU Utilization (%)</td>
            {results.map((r, i) =>
              renderCell(
                `${r.cpuUtilization}%`,
                r.cpuUtilization === bestMetrics.bestUtilization,
              ),
            )}
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
  );
}

export default ComparisonTable;
