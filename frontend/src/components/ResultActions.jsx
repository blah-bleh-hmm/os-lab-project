function ResultActions({ onBackClick, onCompareClick, showCompare }) {
  return (
    <div className='actions'>
      <button className='btn btn-secondary' onClick={onBackClick}>
        Back to Algorithms
      </button>
      {showCompare && (
        <button className='btn btn-primary' onClick={onCompareClick}>
          Compare Algorithms
        </button>
      )}
    </div>
  );
}

export default ResultActions;
