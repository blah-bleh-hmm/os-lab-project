import { useNavigate } from 'react-router-dom';
import { useScheduler } from '../context/SchedulerContext';
import CPUUtilizationChart from '../components/CPUUtilizationChart';
import EmptyState from '../components/EmptyState';
import BestBanner from '../components/BestBanner';
import ComparisonTable from '../components/ComparisonTable';
import GanttComparisonGrid from '../components/GanttComparisonGrid';
import ComparisonActions from '../components/ComparisonActions';
import {
  calculateBestMetrics,
  calculateBestAlgorithm,
  exportJSON,
  exportPDF,
} from '../utils/comparisonUtils';
import './styles/Comparison.css';

function Comparison() {
  const { state, dispatch } = useScheduler();
  const navigate = useNavigate();

  if (!state.results || state.results.length < 2) {
    return (
      <div className='comparison-page'>
        <EmptyState
          title='Not Enough Data'
          message='You need at least 2 algorithm results to compare. Go back and select multiple algorithms.'
          buttonText='Select Algorithms'
          onButtonClick={() => navigate('/algorithms')}
        />
      </div>
    );
  }

  const results = state.results;
  const bestMetrics = calculateBestMetrics(results);
  const { bestIndex, maxScore } = calculateBestAlgorithm(results, bestMetrics);

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

      <BestBanner algorithm={results[bestIndex].algorithm} score={maxScore} />

      <ComparisonTable
        results={results}
        bestMetrics={bestMetrics}
        bestIndex={bestIndex}
      />

      <CPUUtilizationChart results={results} />

      <GanttComparisonGrid results={results} />

      <ComparisonActions
        onExportJSON={() => exportJSON(state.processes, results)}
        onExportPDF={() => exportPDF(state.processes, results, bestIndex)}
        onReset={handleReset}
      />
    </div>
  );
}

export default Comparison;
