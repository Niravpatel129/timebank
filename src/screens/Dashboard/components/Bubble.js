import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const Bubble = ({ gradientColors, selected, onClick, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleRightClick = (e) => {
    e.preventDefault();
    setShowDropdown(true);
  };

  const handleDelete = () => {
    onDelete();
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: `linear-gradient(to bottom, ${gradientColors[0]}, ${gradientColors[1]})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: selected ? '2px solid white' : 'none',
        position: 'relative',
      }}
      onClick={onClick}
      onContextMenu={handleRightClick}
    >
      <div
        style={{
          width: '20px',
          height: '20px',
          backgroundColor: 'white',
          borderRadius: '50%',
        }}
      ></div>
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              zIndex: 1000,
              minWidth: '150px',
              overflow: 'hidden',
            }}
          >
            <motion.button
              onClick={handleDelete}
              whileHover={{ scale: 1.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                color: '#e74c3c',
              }}
            >
              <FaTrash style={{ marginRight: '12px' }} />
              Delete Project
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Bubble;
