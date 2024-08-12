import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

export default function AddTaskButton({ handleTriggerAddTaskButton, colorGradients, showNudge }) {
  const [isHovered, setIsHovered] = useState(false);

  const buttonVariants = {
    idle: { scale: 1, y: 0 },
    hover: { scale: 1.1, y: 0 },
    nudge: {
      y: [0, -10, 0],
      transition: {
        y: {
          repeat: Infinity,
          duration: 1,
          ease: 'easeInOut',
        },
      },
    },
  };

  return (
    <motion.div
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
      initial='idle'
      animate={showNudge ? 'nudge' : isHovered ? 'hover' : 'idle'}
      variants={buttonVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div
        style={{
          backgroundColor: colorGradients[0] || '#000',
          color: 'white',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={handleTriggerAddTaskButton}
      >
        <FaPlus />
      </div>
      {showNudge && (
        <motion.div
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: '-120px',
            backgroundColor: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            whiteSpace: 'nowrap',
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Click here to add your first task!
        </motion.div>
      )}
    </motion.div>
  );
}
