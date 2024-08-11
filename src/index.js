import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { HashRouter as Router } from 'react-router-dom';
import 'react-tooltip/dist/react-tooltip.css';
import App from './App';
import { ProjectProvider } from './context/useProjectContext';
import { ScreenProvider } from './context/useScreenContext';
import { TasksProvider } from './context/useTasksContext';
import { UserProvider } from './context/useUserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Toaster />
    <Router>
      <ProjectProvider>
        <ScreenProvider>
          <TasksProvider>
            <UserProvider>
              <App />
            </UserProvider>
          </TasksProvider>
        </ScreenProvider>
      </ProjectProvider>
    </Router>
  </React.StrictMode>,
);
