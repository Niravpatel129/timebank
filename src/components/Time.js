import React, { useEffect, useState } from 'react';

export default function Time() {
  const [time, setTime] = useState('00:00:00');
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime + elapsedTime;
        const seconds = Math.floor(elapsed / 1000) % 60;
        const minutes = Math.floor(elapsed / 60000) % 60;
        const hours = Math.floor(elapsed / 3600000);
        setTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`,
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime, elapsedTime]);

  const toggleTimer = () => {
    if (isRunning) {
      setElapsedTime((prevElapsedTime) => prevElapsedTime + Date.now() - startTime);
    } else {
      setStartTime(Date.now());
    }
    setIsRunning((prevIsRunning) => !prevIsRunning);
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
