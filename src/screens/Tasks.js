import { motion } from 'framer-motion';
import React from 'react';
import { FaArrowLeft, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';

export default function Tasks({ setScreen }) {
  const handleBack = () => {
    setScreen('home');
  };

  const fakeTasks = [
    { id: 1, name: 'Design new logo', status: 'completed' },
    { id: 2, name: 'Implement user authentication', status: 'in-progress' },
    { id: 3, name: 'Write API documentation', status: 'in-progress' },
    { id: 4, name: 'Fix responsive layout issues', status: 'completed' },
    { id: 5, name: 'Optimize database queries', status: 'in-progress' },
  ];

  return (
    <div>
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
        onClick={handleBack}
      >
        <FaArrowLeft style={{ color: '#8c82c6', fontSize: '24px' }} />
      </motion.div>
      <div style={{ padding: '50px 20px' }}>
        <h1 style={{ color: '#fff', marginBottom: '20px' }}>All Tasks</h1>
        {fakeTasks.map((task) => (
          <div
            key={task.id}
            style={{
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ color: '#fff' }}>{task.name}</span>
            {task.status === 'completed' ? (
              <FaCheckCircle style={{ color: '#4CAF50' }} />
            ) : (
              <FaHourglassHalf style={{ color: '#FFC107' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
