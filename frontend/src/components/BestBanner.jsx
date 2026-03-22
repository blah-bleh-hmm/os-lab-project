function BestBanner({ algorithm, score }) {
  return (
    <div className='best-banner'>
      <span className='best-trophy'>&#9733;</span>
      <div>
        <strong>{algorithm}</strong> is the best-performing algorithm, winning{' '}
        {score} out of 5 metrics.
      </div>
    </div>
  );
}

export default BestBanner;
