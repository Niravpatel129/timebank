import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useScreenContext } from '../context/useScreenContext';

export default function QuickAlarmModal({ isOpen, toggleAddTimeModal }) {
  const [minutes, setMinutes] = useState(0);
  const modalRef = useRef(null);
  const { currentTask, setCurrentTask } = useScreenContext();

  const presetTimes = [
    { label: '+1min', value: 1 },
    { label: '+5min', value: 5 },
    { label: '+10min', value: 10 },
    { label: '+15min', value: 15 },
    { label: '+30min', value: 30 },
    { label: '+1h', value: 60 },
  ];

  const handlePresetClick = (value) => {
    setMinutes(minutes + value);
  };

  const handleDone = () => {
    if (currentTask) {
      const updatedTask = {
        ...currentTask,
        taskDuration: currentTask.taskDuration + minutes * 60,
        timeRemaining: currentTask.timeRemaining + minutes * 60,
      };
      setCurrentTask(updatedTask);
      // update local storage
      setMinutes(0);
    }
    toggleAddTimeModal();
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      toggleAddTimeModal();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='modal-overlay'
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        ref={modalRef}
        className='modal-content'
        style={{
          backgroundColor: '#1c1c1e',
          padding: '20px',
          borderRadius: '10px',
          width: '90%',
          maxWidth: '300px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ margin: 0, color: '#fff' }}>Quick Add</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleAddTimeModal}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <FaTimes style={{ color: '#fff', fontSize: '24px' }} />
          </motion.button>
        </div>
        <div style={{ textAlign: 'center', fontSize: '48px', color: '#fff', marginBottom: '20px' }}>
          +{minutes} mins
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          {presetTimes.map((preset) => (
            <motion.button
              key={preset.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePresetClick(preset.value)}
              style={{
                padding: '10px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: '#2c2c2e',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              {preset.label}
            </motion.button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMinutes(0)}
            style={{
              padding: '10px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: '#2c2c2e',
              color: '#fff',
              cursor: 'pointer',
              width: '48%',
            }}
          >
            Reset
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDone}
            style={{
              padding: '10px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: '#0a84ff',
              color: '#fff',
              cursor: 'pointer',
              width: '48%',
            }}
          >
            Done
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
