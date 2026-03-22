import { useNavigate } from 'react-router-dom';
import { useScheduler } from '../context/SchedulerContext';
import GanttChart from '../components/GanttChart';
import './styles/Results.css';

function Results() {
  const { state } = useScheduler();
  const navigate = useNavigate();

  if (!state.results || state.results.length === 0) {
    return (
      <div className='results-page'>
        <div className='empty-state'>
          <h2>No Results</h2>
          <p>Please go back and run the scheduling algorithms first.</p>
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

  return (
    <div className='results-page'>
      <div className='page-header'>
        <h1>Scheduling Results</h1>
        <p>
          Results for <strong>{state.processes.length}</strong> processes across{' '}
          <strong>{state.results.length}</strong> algorithm
          {state.results.length !== 1 ? 's' : ''}.
        </p>
      </div>

      {state.results.map((result, idx) => (
        <div key={idx} className='result-section'>
          <div className='result-header'>
            <h2>{result.algorithm}</h2>
            {result.timeQuantum && (
              <span className='quantum-badge'>
                Quantum = {result.timeQuantum}
              </span>
            )}
          </div>

          {/* Metrics summary cards */}
          <div className='metrics-grid'>
            <div className='metric-card'>
              <div className='metric-value'>
                {result.averages.avgWaitingTime}
              </div>
              <div className='metric-label'>Avg Waiting Time</div>
            </div>
            <div className='metric-card'>
              <div className='metric-value'>
                {result.averages.avgTurnaroundTime}
              </div>
              <div className='metric-label'>Avg Turnaround Time</div>
            </div>
            <div className='metric-card'>
              <div className='metric-value'>
                {result.averages.avgResponseTime}
              </div>
              <div className='metric-label'>Avg Response Time</div>
            </div>
            <div className='metric-card'>
              <div className='metric-value'>{result.throughput}</div>
              <div className='metric-label'>Throughput (p/unit)</div>
            </div>
            <div className='metric-card'>
              <div className='metric-value'>{result.cpuUtilization}%</div>
              <div className='metric-label'>CPU Utilization</div>
            </div>
            <div className='metric-card'>
              <div className='metric-value'>{result.totalCompletionTime}</div>
              <div className='metric-label'>Total Completion</div>
            </div>
          </div>

          {/* Process detail table */}
          <div className='detail-table-wrapper'>
            <table className='detail-table'>
              <thead>
                <tr>
                  <th>Process</th>
                  <th>Arrival</th>
                  <th>Burst</th>
                  {result.algorithm === 'Priority Scheduling' && (
                    <th>Priority</th>
                  )}

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
                    {result.algorithm === 'Priority Scheduling' && (
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

          {/* Animated Gantt Chart */}
          <GanttChart
            ganttChart={result.ganttChart}
            title={`${result.algorithm} — Gantt Chart`}
            animate={true}
          />
        </div>
      ))}

      <div className='actions'>
        <button
          className='btn btn-secondary'
          onClick={() => navigate('/algorithms')}
        >
          Back to Algorithms
        </button>
        {state.results.length > 1 && (
          <button
            className='btn btn-primary'
            onClick={() => navigate('/comparison')}
          >
            Compare Algorithms
          </button>
        )}
      </div>
    </div>
  );
}

export default Results;
