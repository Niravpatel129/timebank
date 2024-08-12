import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { FaTimes } from 'react-icons/fa';

const IntroductionModal = ({ isOpen, onClose }) => {
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial='hidden'
          animate='visible'
          exit='hidden'
          variants={overlayVariants}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }}
        >
          <motion.div
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={modalVariants}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div
              style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '15px',
                maxWidth: '500px',
                width: '95%',
                position: 'relative',
                textAlign: 'center',
                background: 'white',
              }}
            >
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <FaTimes />
              </button>
              <div style={{ marginBottom: '30px' }}>
                <img
                  style={{ width: '50%' }}
                  src={'https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif'}
                  alt='Todo App Introduction'
                />
              </div>
              <h2 style={{ marginBottom: '15px', fontSize: '28px' }}>Welcome to Your Todo App!</h2>
              <p style={{ color: '#666', marginBottom: '30px', fontSize: '18px' }}>
                Stay organized and boost your productivity with our easy-to-use todo app. Create,
                manage, and complete tasks effortlessly.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: '12px 25px',
                    backgroundColor: '#4153AF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroductionModal;
