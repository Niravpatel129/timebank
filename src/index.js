import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import 'react-tooltip/dist/react-tooltip.css';
import App from './App';
import { ScreenProvider } from './context/useScreenContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <ScreenProvider>
        <App />
      </ScreenProvider>
    </Router>
  </React.StrictMode>,
);
