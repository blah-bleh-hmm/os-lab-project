function ComparisonActions({ onExportJSON, onExportPDF, onReset }) {
  return (
    <div className='comparison-actions'>
      <button className='btn btn-outline' onClick={onExportJSON}>
        Export JSON
      </button>
      <button className='btn btn-outline' onClick={onExportPDF}>
        Export PDF
      </button>
      <button className='btn btn-danger' onClick={onReset}>
        Reset &amp; Restart
      </button>
    </div>
  );
}

export default ComparisonActions;
