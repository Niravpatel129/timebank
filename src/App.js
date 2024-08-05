import React from 'react';
import './App.css'; // We'll create this file for global styles
import Time from './components/Time';

function App() {
  return (
    <div
      style={{
        background: '#1c084a', // Dark purple background
        backgroundImage:
          'radial-gradient(circle at top center, rgba(255,255,255,0.2) 0%, rgba(28,8,74,1) 70%)', // Spotlight effect at the top
        backdropFilter: 'blur(10px)', // Keeping the blur effect
        WebkitBackdropFilter: 'blur(10px)',
        padding: '1rem',
        margin: '0',
        height: '100vh',
        width: '100vw',
        boxSizing: 'border-box',
        WebkitAppRegion: 'drag', // Make the entire window draggable
      }}
    >
      <div style={{ WebkitAppRegion: 'no-drag' }}>
        <Time />
      </div>
    </div>
  );
}

export default App;
