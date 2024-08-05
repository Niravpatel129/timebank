import React, { useEffect, useState } from 'react';
import { FaCirclePause, FaCirclePlay } from 'react-icons/fa6';
import PrimaryButton from './PrimaryButton';
import TimeText from './TimeText';

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
        // marginTop: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      <TimeText time={time} />
      <PrimaryButton onClick={toggleTimer} icon={isRunning ? <FaCirclePause /> : <FaCirclePlay />}>
        {isRunning ? 'Pause' : 'Start'}
      </PrimaryButton>
    </div>
  );
}
