import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { SchedulerProvider } from './context/SchedulerContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <SchedulerProvider>
          <App />
        </SchedulerProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
