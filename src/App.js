import React from 'react';
import './App.css';
import { useScreenContext } from './context/useScreenContext';
import Home from './screens/Home';
import Results from './screens/Results';
import Tasks from './screens/Tasks';
function App() {
  const { screen, setScreen, currentTask, setCurrentTask } = useScreenContext();

  return (
    <div
      style={{
        background: '#1c084a',
        backgroundImage:
          'radial-gradient(circle at top center, rgba(255,255,255,0.2) 0%, rgba(28,8,74,1) 70%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        margin: '0',
        height: '100vh',
        width: '100vw',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {screen === 'home' && (
        <Home setScreen={setScreen} currentTask={currentTask} setCurrentTask={setCurrentTask} />
      )}
      {screen === 'tasks' && <Tasks setScreen={setScreen} currentTask={currentTask} />}

      {screen === 'results' && <Results setScreen={setScreen} currentTask={currentTask} />}
    </div>
  );
}

export default App;
