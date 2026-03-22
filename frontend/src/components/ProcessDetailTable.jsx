function ProcessDetailTable({ result }) {
  const showPriority = result.algorithm === 'Priority Scheduling';

  return (
    <div className='detail-table-wrapper'>
      <table className='detail-table'>
        <thead>
          <tr>
            <th>Process</th>
            <th>Arrival</th>
            <th>Burst</th>
            {showPriority && <th>Priority</th>}
            <th>Start</th>
            <th>Completion</th>
            <th>Turnaround</th>
            <th>Waiting</th>
            <th>Response</th>
          </tr>
        </thead>
        <tbody>
          {result.processResults.map((pr) => (
            <tr key={pr.processId}>
              <td className='process-cell'>{pr.processId}</td>
              <td>{pr.arrivalTime}</td>
              <td>{pr.burstTime}</td>
              {showPriority && (
                <td>{pr.priority !== undefined ? pr.priority : '—'}</td>
              )}
              <td>{pr.startTime}</td>
              <td>{pr.completionTime}</td>
              <td>{pr.turnaroundTime}</td>
              <td>{pr.waitingTime}</td>
              <td>{pr.responseTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProcessDetailTable;
