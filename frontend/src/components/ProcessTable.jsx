import ProcessRow from './ProcessRow';

function ProcessTable({ processes, errors, onUpdate, onRemove }) {
  return (
    <div className='process-table'>
      <div className='table-header'>
        <div className='col col-id'>Process ID</div>
        <div className='col col-at'>Arrival Time</div>
        <div className='col col-bt'>Burst Time</div>
        <div className='col col-pri'>Priority</div>
        <div className='col col-action'>Action</div>
      </div>

      {processes.map((p, i) => (
        <ProcessRow
          key={i}
          process={p}
          index={i}
          errors={errors}
          onUpdate={onUpdate}
          onRemove={onRemove}
          totalProcesses={processes.length}
        />
      ))}
    </div>
  );
}

export default ProcessTable;
