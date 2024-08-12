import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { FaTimes } from 'react-icons/fa';

const IntroductionModal = ({ isOpen, onClose }) => {
  const modalVariants = {
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
          variants={modalVariants}
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
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <div
              style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '10px',
                maxWidth: '500px',
                width: '90%',
                position: 'relative',
              }}
            >
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <FaTimes />
              </button>
              <h2 style={{ marginBottom: '20px' }}>Welcome to Your Task Manager!</h2>
              <p>
                This task manager is designed to help you organize your work efficiently. Here are
                some key features:
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
                <li>Create and manage tasks</li>
                <li>Organize tasks into projects</li>
                <li>Track time spent on tasks</li>
                <li>Set priorities and due dates</li>
                <li>Collaborate with team members</li>
              </ul>
              <p>
                We hope this tool helps you boost your productivity. If you have any questions,
                please don't hesitate to reach out to our support team.
              </p>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '20px',
                }}
              >
                Get Started
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroductionModal;
