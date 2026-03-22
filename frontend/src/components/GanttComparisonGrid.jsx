import GanttChart from './GanttChart';

function GanttComparisonGrid({ results }) {
  return (
    <>
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
    </>
  );
}

export default GanttComparisonGrid;
