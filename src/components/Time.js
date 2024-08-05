import React, { useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron');

export default function Time() {
  const [time, setTime] = useState('00:00:00');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        ipcRenderer.send('update-timer');
      }, 1000);

      ipcRenderer.on('timer-updated', (event, newTime) => {
        setTime(newTime);
      });
    }
    return () => {
      clearInterval(interval);
      ipcRenderer.removeAllListeners('timer-updated');
    };
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    ipcRenderer.send('toggle-timer');
  };

  return (
    <div
      style={{
        marginTop: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      <div
        style={{
          fontSize: '3rem',
          fontWeight: '100',
          marginBottom: '20px',
        }}
      >
        {time}
      </div>
      <button
        onClick={toggleTimer}
        style={{
          padding: '10px 20px',
          fontSize: '1.2rem',
          backgroundColor: '#6c5ce7',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          WebkitAppRegion: 'no-drag', // This prevents the button from being part of the draggable area in Electron
        }}
      >
        {isRunning ? 'Pause' : 'Start'}
      </button>
    </div>
  );
}
