import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HashRouter as Router } from 'react-router-dom';
import 'react-tooltip/dist/react-tooltip.css';
import App from './App';
import { HistoryProvider } from './context/useHistoryContext';
import { ModalsProvider } from './context/useModalsContext';
import { NotificationProvider } from './context/useNotificationContext';
import { ProjectProvider } from './context/useProjectContext';
import { ScreenProvider } from './context/useScreenContext';
import { TasksProvider } from './context/useTasksContext';
import { UserProvider } from './context/useUserContext';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.Fragment>
    <QueryClientProvider client={queryClient}>
      <div
        className='title-bar'
        style={{
          height: '2vh',
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
          <UserProvider>
            <ProjectProvider>
              <HistoryProvider>
                <ScreenProvider>
                  <ModalsProvider>
                    <TasksProvider>
                      <NotificationProvider>
                        <App />
                      </NotificationProvider>
                    </TasksProvider>
                  </ModalsProvider>
                </ScreenProvider>
              </HistoryProvider>
            </ProjectProvider>
          </UserProvider>
        </Router>
      </div>
    </QueryClientProvider>
  </React.Fragment>,
);
