import GanttChart from './GanttChart';
import MetricsGrid from './MetricsGrid';
import ProcessDetailTable from './ProcessDetailTable';

function ResultSection({ result }) {
  return (
    <div className='result-section'>
      <div className='result-header'>
        <h2>{result.algorithm}</h2>
        {result.timeQuantum && (
          <span className='quantum-badge'>Quantum = {result.timeQuantum}</span>
        )}
      </div>

      <MetricsGrid metrics={result} />
      <ProcessDetailTable result={result} />
      <GanttChart
        ganttChart={result.ganttChart}
        title={`${result.algorithm} — Gantt Chart`}
        animate={true}
      />
    </div>
  );
}

export default ResultSection;
