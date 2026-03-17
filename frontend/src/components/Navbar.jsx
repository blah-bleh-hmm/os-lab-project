import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './styles/Navbar.css';

const steps = [
  { path: '/', label: 'Processes', step: 1 },
  { path: '/algorithms', label: 'Algorithms', step: 2 },
  { path: '/results', label: 'Results', step: 3 },
  { path: '/comparison', label: 'Compare', step: 4 },
];

function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const currentStep = steps.findIndex((s) => s.path === location.pathname);

  return (
    <nav className='navbar'>
      <div className='navbar-inner'>
        <Link to='/' className='navbar-brand'>
          <span className='brand-icon'>&#9881;</span>
          CPU Scheduler
        </Link>
        <div className='navbar-steps'>
          {steps.map((s, i) => (
            <Link
              key={s.path}
              to={s.path}
              className={`step-item ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}
            >
              <span className='step-number'>{s.step}</span>
              <span className='step-label'>{s.label}</span>
            </Link>
          ))}
        </div>
        <button
          className='theme-toggle'
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-label='Toggle theme'
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
