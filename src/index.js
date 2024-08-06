import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-tooltip/dist/react-tooltip.css';
import App from './App';
import { ScreenProvider } from './context/useScreenContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ScreenProvider>
      <App />
    </ScreenProvider>
  </React.StrictMode>,
);
