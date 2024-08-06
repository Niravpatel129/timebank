import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function AddTaskModal({ onClose }) {
  const [taskName, setTaskName] = useState('');
  const [duration, setDuration] = useState('30m');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const modalRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ taskName, duration, startTime, endTime });
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
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
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          //   width: '90%',
          //   maxWidth: '400px',
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
          <h2 style={{ margin: 0 }}>Add activity</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <FaTimes />
          </motion.button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor='taskName'>Add task</label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '4px',
                marginTop: '5px',
              }}
            >
              <input
                type='text'
                id='taskName'
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder='Morning check-in'
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  padding: '8px',
                }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type='button'
                onClick={() => setTaskName('')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <FaTimes />
              </motion.button>
            </div>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>How long?</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              {['5m', '15m', '30m', '45m', '1h', 'Other'].map((time) => (
                <motion.button
                  key={time}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type='button'
                  onClick={() => setDuration(time)}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '20px',
                    backgroundColor: duration === time ? 'black' : '#e0e0e0',
                    color: duration === time ? 'white' : 'black',
                    cursor: 'pointer',
                  }}
                >
                  {time}
                </motion.button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Add time</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
              <input
                type='time'
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{ padding: '8px' }}
              />
              <span>to</span>
              <input
                type='time'
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{ padding: '8px' }}
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type='submit'
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Add activity
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
