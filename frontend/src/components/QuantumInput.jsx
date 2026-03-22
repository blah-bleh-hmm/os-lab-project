function QuantumInput({ value, onChange }) {
  return (
    <div className='quantum-input'>
      <label htmlFor='timeQuantum'>Time Quantum</label>
      <input
        id='timeQuantum'
        type='number'
        min='1'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default QuantumInput;
