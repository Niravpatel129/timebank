import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import React, { useState } from 'react';
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

  const [timeDisplayMode, setTimeDisplayMode] = useState('normal');

  const toggleTimer = () => {
    if (isRunning) {
      stopTimer();
    } else if (currentTask) {
      // dont allow starting a timer if there is no time on the task
      if (currentTask.taskDuration === 0) {
        // alert the user to set the time on the task
        return;
      }
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

  const toggleTimeDisplay = () => {
    setTimeDisplayMode((prevMode) => {
      switch (prevMode) {
        case 'normal':
          return 'countdown';
        case 'countdown':
          return 'percentage';
        default:
          return 'normal';
      }
    });
  };

  const renderTimeDisplay = () => {
    switch (timeDisplayMode) {
      case 'normal':
        return <TimeText variation={2} time={formatTime(displayTime)} />;
      case 'countdown':
        const remainingTime = currentTask ? currentTask.taskDuration - displayTime : 0;
        return <TimeText variation={2} time={formatTime(remainingTime)} />;
      case 'percentage':
        const percentage = currentTask
          ? Math.max(0, 100 - Math.round((displayTime / currentTask.taskDuration) * 100))
          : 100;
        return <TimeText variation={3} time={`${percentage}% progress`} />;
      default:
        return <TimeText variation={1} time={formatTime(displayTime)} />;
    }
  };

  return (
    <LayoutGroup>
      <motion.div
        layout
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
          layout
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
        <motion.div
          layout
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          onClick={toggleTimeDisplay}
          style={{ cursor: 'pointer' }}
        >
          <AnimatePresence mode='wait'>
            <motion.div
              key={timeDisplayMode}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {renderTimeDisplay()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <motion.div
          layout
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <motion.div layout whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <PrimaryButton
              onClick={toggleTimer}
              icon={currentTask ? isRunning ? <FaCirclePause /> : <FaCirclePlay /> : null}
            >
              {currentTask ? (isRunning ? 'Pause' : 'Start') : 'Set Task'}
            </PrimaryButton>
          </motion.div>
          <AnimatePresence>
            s
            {currentTask && isRunning && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PrimaryButton onClick={finishCurrentTask} icon={<FaCheck />}>
                  Complete
                </PrimaryButton>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
}
