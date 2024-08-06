import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-tooltip/dist/react-tooltip.css';
import App from './App';
import { ScreenProvider } from './context/useScreenContext';
import { TimerProvider } from './context/useTimerContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TimerProvider>
      <ScreenProvider>
        <App />
      </ScreenProvider>
    </TimerProvider>
  </React.StrictMode>,
);
