import { motion } from 'framer-motion';
import React from 'react';
import { FaCheck, FaCirclePause, FaCirclePlay, FaFeather } from 'react-icons/fa6';
import { useScreenContext } from '../context/useScreenContext';
import PrimaryButton from './PrimaryButton';
import TimeText from './TimeText';

export default function Time() {
  const {
    currentTask,
    finishCurrentTask,
    isRunning,
    startTimer,
    stopTimer,
    getDisplayTime,
    setScreen,
  } = useScreenContext();

  const toggleTimer = () => {
    if (isRunning) {
      stopTimer();
    } else if (currentTask) {
      startTimer();
    } else {
      setScreen('tasks');
    }
  };

  const formatTime = (timeInSeconds) => {
    const absTime = Math.abs(timeInSeconds);
    const hours = String(Math.floor(absTime / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((absTime % 3600) / 60)).padStart(2, '0');
    const seconds = String(absTime % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const displayTime = getDisplayTime();

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
        <TimeText time={formatTime(displayTime)} />
      </motion.div>
      <motion.div
        style={{
          display: 'flex',
          gap: '10px',
        }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <PrimaryButton
            onClick={toggleTimer}
            icon={currentTask ? isRunning ? <FaCirclePause /> : <FaCirclePlay /> : null}
          >
            {currentTask ? (isRunning ? 'Pause' : 'Start') : 'Set Task'}
          </PrimaryButton>
        </motion.div>
        {currentTask && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <PrimaryButton onClick={finishCurrentTask} icon={<FaCheck />}>
              Complete
            </PrimaryButton>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
