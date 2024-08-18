import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { useScreenContext } from './context/useScreenContext';
import { useUserContext } from './context/useUserContext.js';
import Dashboard from './screens/Dashboard/Dashboard.js';
import Focus from './screens/Focus/Focus.js';
import Home from './screens/Home';
import Onboarding from './screens/Onboarding/Onboarding.js';
import Results from './screens/Results';
import Tasks from './screens/Tasks';

function App() {
  const { currentTask, setCurrentTask } = useScreenContext();
  const { isLoggedIn } = useUserContext();

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
      <Routes>
        <Route
          path='/'
          element={<Home currentTask={currentTask} setCurrentTask={setCurrentTask} />}
        />
        <Route path='/tasks' element={<Tasks currentTask={currentTask} />} />
        <Route path='/results' element={<Results currentTask={currentTask} />} />
        <Route path='/dashboard' element={isLoggedIn ? <Dashboard /> : <Onboarding />} />
        <Route path='/focus' element={<Focus />} />
      </Routes>
    </div>
  );
}

export default App;
