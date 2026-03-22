import AlgorithmCard from './AlgorithmCard';

function AlgorithmGrid({ algorithms, selected, onToggle }) {
  return (
    <div className='algo-grid'>
      {algorithms.map((algo) => (
        <AlgorithmCard
          key={algo.id}
          algorithm={algo}
          isSelected={selected.includes(algo.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

export default AlgorithmGrid;
