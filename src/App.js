import React from 'react';
import './App.css';
import Time from './components/Time';
import TrackingCard from './components/TrackingCard';

function App() {
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
      }}
    >
      <div style={{ width: '100%' }}>
        <Time />
        <div style={{ height: '1px', background: '#40366d' }} />

        <TrackingCard />
      </div>
      {/* line break */}
      <div style={{ height: '1px', background: '#40366d' }} />
    </div>
  );
}

export default App;
