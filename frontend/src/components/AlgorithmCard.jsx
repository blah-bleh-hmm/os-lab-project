function AlgorithmCard({ algorithm, isSelected, onToggle }) {
  return (
    <button
      className={`algo-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onToggle(algorithm.id)}
      style={{ '--algo-color': algorithm.color }}
    >
      <div className='algo-check'>{isSelected ? '\u2713' : ''}</div>
      <h3 className='algo-name'>{algorithm.name}</h3>
      <p className='algo-desc'>{algorithm.description}</p>
      <span className='algo-tag algo-type'>{algorithm.type}</span>
    </button>
  );
}

export default AlgorithmCard;
