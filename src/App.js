import React from 'react';
import './App.css';
import Time from './components/Time';

function App() {
  return (
    <div
      style={{
        background: '#1c084a',
        backgroundImage:
          'radial-gradient(circle at top center, rgba(255,255,255,0.2) 0%, rgba(28,8,74,1) 70%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '1rem',
        margin: '0',
        height: '100vh',
        width: '100vw',
        boxSizing: 'border-box',
      }}
    >
      <Time />
    </div>
  );
}

export default App;
