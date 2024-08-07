import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { FaChartBar, FaCog } from 'react-icons/fa';
import AllTasksButton from '../components/AllTasksButton';
import Time from '../components/Time';
import TrackingCard from '../components/TrackingCard';
import TrackingCardsBeno from '../components/TrackingCardsBeno';

const { ipcRenderer } = window.require('electron');

export default function Home({ setScreen, currentTask, setCurrentTask }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleQuit = () => {
    ipcRenderer.send('quit-app');
  };

  const handleShowSettings = () => {
    ipcRenderer.send('show-settings');
  };

  const handleShowAllTasks = () => {
    setScreen('tasks');
  };

  const handleTrackingCardClick = () => {
    setScreen('tasks');
  };

  const handleShowResults = () => {
    setScreen('results');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    ipcRenderer.on('quit-app-response', () => {
      window.close();
    });

    return () => {
      ipcRenderer.removeAllListeners('quit-app-response');
    };
  }, []);

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
        onClick={toggleMenu}
      >
        <FaCog style={{ color: '#8c82c6', fontSize: '24px' }} />
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
        onClick={handleShowResults}
      >
        <FaChartBar style={{ color: '#8c82c6', fontSize: '24px' }} />
      </motion.div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '40px',
              left: '10px',
              background: '#15093d',
              borderRadius: '8px',
              padding: '10px',
              zIndex: 1000,
            }}
          >
            <motion.div
              whileHover={{ backgroundColor: '#2a1a5e' }}
              style={{
                color: 'white',
                cursor: 'pointer',
                marginBottom: '5px',
                padding: '5px',
                borderRadius: '4px',
              }}
              onClick={handleShowSettings}
            >
              Settings
            </motion.div>
            <motion.div
              whileHover={{ backgroundColor: '#2a1a5e' }}
              style={{ color: 'white', cursor: 'pointer', padding: '5px', borderRadius: '4px' }}
              onClick={handleQuit}
            >
              Quit
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ width: '100%' }}>
        <Time />
        <div style={{ height: '1px', background: '#40366d' }} />

        <div
          onClick={handleTrackingCardClick}
          style={{ cursor: currentTask ? 'pointer' : 'default' }}
        >
          <TrackingCard currentTask={currentTask} setCurrentTask={setCurrentTask} />
        </div>
        <TrackingCardsBeno />

        <AllTasksButton onClick={handleShowAllTasks} />
      </div>
    </>
  );
}
