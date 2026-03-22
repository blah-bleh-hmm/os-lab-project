function EmptyState({ title, message, buttonText, onButtonClick }) {
  return (
    <div className='empty-state'>
      <h2>{title}</h2>
      <p>{message}</p>
      <button className='btn btn-primary' onClick={onButtonClick}>
        {buttonText}
      </button>
    </div>
  );
}

export default EmptyState;
