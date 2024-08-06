import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaTasks } from 'react-icons/fa';

export default function AllTasksButton({ onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    // Handle button click
    console.log('All Tasks button clicked');
    onClick();
  };

  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'tween', duration: 0.2 }}
      style={{
        width: 'calc(100% - 32px)', // Adjust for margin
        margin: '16px',
        padding: '14px 20px',
        fontSize: '1rem',
        fontWeight: '500',
        background: 'rgba(255, 255, 255, 0.1)',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease-in-out',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <FaTasks style={{ marginRight: '8px' }} />
      View All Project & Task
    </motion.button>
  );
}
