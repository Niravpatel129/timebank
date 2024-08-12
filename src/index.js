import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { HashRouter as Router } from 'react-router-dom';
import 'react-tooltip/dist/react-tooltip.css';
import App from './App';
import { HistoryProvider } from './context/useHistoryContext';
import { ProjectProvider } from './context/useProjectContext';
import { ScreenProvider } from './context/useScreenContext';
import { TasksProvider } from './context/useTasksContext';
import { UserProvider } from './context/useUserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.Fragment>
    <div
      className='title-bar'
      style={{
        height: '3vh',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      {/* empty */}
    </div>
    <div style={{ paddingTop: '3vh', marginTop: '-3vh' }}>
      <Toaster />
      <Router>
        <ProjectProvider>
          <HistoryProvider>
            <ScreenProvider>
              <TasksProvider>
                <UserProvider>
                  <App />
                </UserProvider>
              </TasksProvider>
            </ScreenProvider>
          </HistoryProvider>
        </ProjectProvider>
      </Router>
    </div>
  </React.Fragment>,
);
