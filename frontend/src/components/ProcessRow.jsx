function ProcessRow({
  process,
  index,
  errors,
  onUpdate,
  onRemove,
  totalProcesses,
}) {
  return (
    <div className='table-row'>
      <div className='col col-id'>
        <input
          type='text'
          value={process.processId}
          onChange={(e) => onUpdate(index, 'processId', e.target.value)}
          className={errors[`${index}-processId`] ? 'input-error' : ''}
          placeholder='P1'
        />
        {errors[`${index}-processId`] && (
          <span className='field-error'>{errors[`${index}-processId`]}</span>
        )}
      </div>
      <div className='col col-at'>
        <input
          type='number'
          min='0'
          value={process.arrivalTime}
          onChange={(e) => onUpdate(index, 'arrivalTime', e.target.value)}
          className={errors[`${index}-arrivalTime`] ? 'input-error' : ''}
          placeholder='0'
        />
        {errors[`${index}-arrivalTime`] && (
          <span className='field-error'>{errors[`${index}-arrivalTime`]}</span>
        )}
      </div>
      <div className='col col-bt'>
        <input
          type='number'
          min='1'
          value={process.burstTime}
          onChange={(e) => onUpdate(index, 'burstTime', e.target.value)}
          className={errors[`${index}-burstTime`] ? 'input-error' : ''}
          placeholder='1'
        />
        {errors[`${index}-burstTime`] && (
          <span className='field-error'>{errors[`${index}-burstTime`]}</span>
        )}
      </div>
      <div className='col col-pri'>
        <input
          type='number'
          min='0'
          value={process.priority !== undefined ? process.priority : 0}
          onChange={(e) => onUpdate(index, 'priority', e.target.value)}
          className={errors[`${index}-priority`] ? 'input-error' : ''}
          placeholder='0'
        />
        {errors[`${index}-priority`] && (
          <span className='field-error'>{errors[`${index}-priority`]}</span>
        )}
      </div>
      <div className='col col-action'>
        <button
          className='btn-remove'
          onClick={() => onRemove(index)}
          disabled={totalProcesses <= 1}
          title='Remove process'
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default ProcessRow;
