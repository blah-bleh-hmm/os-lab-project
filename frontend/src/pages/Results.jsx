import { useNavigate } from 'react-router-dom';
import { useScheduler } from '../context/SchedulerContext';
import EmptyState from '../components/EmptyState';
import ResultSection from '../components/ResultSection';
import ResultActions from '../components/ResultActions';
import './styles/Results.css';

function Results() {
  const { state } = useScheduler();
  const navigate = useNavigate();

  if (!state.results || state.results.length === 0) {
    return (
      <div className='results-page'>
        <EmptyState
          title='No Results'
          message='Please go back and run the scheduling algorithms first.'
          buttonText='Select Algorithms'
          onButtonClick={() => navigate('/algorithms')}
        />
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
        <ResultSection key={idx} result={result} />
      ))}

      <ResultActions
        onBackClick={() => navigate('/algorithms')}
        onCompareClick={() => navigate('/comparison')}
        showCompare={state.results.length > 1}
      />
    </div>
  );
}

export default Results;
