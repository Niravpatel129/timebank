import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import 'react-tooltip/dist/react-tooltip.css';
import App from './App';
import { ScreenProvider } from './context/useScreenContext';
import { TasksProvider } from './context/useTasksContext';
import { UserProvider } from './context/useUserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <ScreenProvider>
        <TasksProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </TasksProvider>
      </ScreenProvider>
    </Router>
  </React.StrictMode>,
);
