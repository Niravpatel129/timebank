import React, { useState } from 'react';
import './App.css';
import AddTask from './screens/AddTask';
import Home from './screens/Home';
import Tasks from './screens/Tasks';
function App() {
  const [screen, setScreen] = useState('home');

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
      {screen === 'home' && <Home setScreen={setScreen} />}
      {screen === 'tasks' && <Tasks setScreen={setScreen} />}
      {screen === 'addTask' && <AddTask setScreen={setScreen} />}
    </div>
  );
}

export default App;
