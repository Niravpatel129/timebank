import { motion } from 'framer-motion';
import React from 'react';
import { FaCirclePause, FaCirclePlay, FaFeather } from 'react-icons/fa6';
import { useScreenContext } from '../context/useScreenContext';
import { useTimerContext } from '../context/useTimerContext';
import secondsToTime from '../helpers/secondsToTime';
import PrimaryButton from './PrimaryButton';
import TimeText from './TimeText';

export default function Time() {
  const { currentTask, finishCurrentTask } = useScreenContext();
  const { isRunning, time, startTimer, stopTimer } = useTimerContext();
  const parsedTime = secondsToTime(currentTask.taskDuration || 100);

  const toggleTimer = () => {
    if (isRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  const formatTime = (timeInSeconds) => {
    const hours = String(Math.floor(timeInSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((timeInSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(timeInSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        paddingTop: '20px',
        paddingBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          marginBottom: '20px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#40366d',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          border: '1px solid #40366d',
          cursor: 'pointer',
        }}
        onClick={finishCurrentTask}
      >
        <FaFeather style={{ color: '#c5c1f0', fontSize: '20px' }} />
      </motion.div>
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
        <TimeText time={parsedTime} />
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <PrimaryButton
          onClick={toggleTimer}
          icon={isRunning ? <FaCirclePause /> : <FaCirclePlay />}
        >
          {currentTask ? (isRunning ? 'Pause' : 'Start') : 'Set Task'}
        </PrimaryButton>
      </motion.div>
    </motion.div>
  );
}
