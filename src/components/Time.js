import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaFeather } from 'react-icons/fa6';
import TimeText from './TimeText';
const { ipcRenderer } = window.require('electron');

export default function Time({ trayTrackingData }) {
  const { currentTask, status, toggleTask } = trayTrackingData;
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    setTimeRemaining(currentTask?.timerState?.remainingTime || 0);
  }, [currentTask]);

  useEffect(() => {
    const handleTimerUpdate = (event, updatedTimeRemaining) => {
      setTimeRemaining(updatedTimeRemaining);
    };

    ipcRenderer.on('timer-update', handleTimerUpdate);

    return () => {
      ipcRenderer.removeListener('timer-update', handleTimerUpdate);
    };
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleToggleTask = async () => {
    setIsToggling(true);
    await toggleTask();
    // wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsToggling(false);
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
          onClick={() => {
            ipcRenderer.send('show-dashboard');
          }}
        >
          <FaFeather style={{ color: '#c5c1f0', fontSize: '20px' }} />
        </motion.div>
        <motion.div
          layout
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => {}}
          style={{ cursor: 'pointer' }}
        >
          <AnimatePresence mode='wait'>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <TimeText variation={2} time={formatTime(timeRemaining)} />
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
          {/* <AnimatePresence>
            {currentTask && status === 'running' && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PrimaryButton onClick={() => finishTask(currentTask._id)} icon={<FaCheck />}>
                  Complete
                </PrimaryButton>
              </motion.div>
            )}
          </AnimatePresence> */}
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
}
