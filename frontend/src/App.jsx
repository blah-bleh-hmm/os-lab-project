import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProcessInput from './pages/ProcessInput';
import AlgorithmSelection from './pages/AlgorithmSelection';
import Results from './pages/Results';
import Comparison from './pages/Comparison';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ProcessInput />} />
          <Route path="/algorithms" element={<AlgorithmSelection />} />
          <Route path="/results" element={<Results />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
