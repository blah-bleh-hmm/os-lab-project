function MetricsGrid({ metrics }) {
  const cardConfigs = [
    {
      value: metrics.averages.avgWaitingTime,
      label: 'Avg Waiting Time',
    },
    {
      value: metrics.averages.avgTurnaroundTime,
      label: 'Avg Turnaround Time',
    },
    {
      value: metrics.averages.avgResponseTime,
      label: 'Avg Response Time',
    },
    { value: metrics.throughput, label: 'Throughput (p/unit)' },
    { value: `${metrics.cpuUtilization}%`, label: 'CPU Utilization' },
    { value: metrics.totalCompletionTime, label: 'Total Completion' },
  ];

  return (
    <div className='metrics-grid'>
      {cardConfigs.map((config, idx) => (
        <div key={idx} className='metric-card'>
          <div className='metric-value'>{config.value}</div>
          <div className='metric-label'>{config.label}</div>
        </div>
      ))}
    </div>
  );
}

export default MetricsGrid;
