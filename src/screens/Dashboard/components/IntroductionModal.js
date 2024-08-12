import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { FaTimes } from 'react-icons/fa';

const SetupProfileModal = ({ isOpen, onClose }) => {
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
                  src={
                    'https://global.discourse-cdn.com/business7/uploads/glideapps/original/3X/d/e/dee19e27e6a3c21a5ccba3474d9e7920321695b8.gif'
                  }
                  alt='Profile Setup'
                />
              </div>
              <h2 style={{ marginBottom: '15px', fontSize: '28px' }}>Setup your profile</h2>
              <p style={{ color: '#666', marginBottom: '30px', fontSize: '18px' }}>
                Develop your profile with a diverse range of offerings, we cater to all types of
                lessons to suit your needs.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
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
                  Explore
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SetupProfileModal;
