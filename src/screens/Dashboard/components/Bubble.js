import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import formatDistanceToNow from '../../../../utils/formatDistanceToNow';

const Bubble = ({ gradientColors, selected, onClick, onDelete, name, updatedAt }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const dropdownRef = useRef(null);
  const bubbleRef = useRef(null);

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

  // Function to get a random shape
  const getRandomShape = () => {
    const shapes = ['circle', 'square', 'triangle', 'pentagon', 'hexagon', 'star'];
    return shapes[Math.floor(Math.random() * shapes.length)];
  };

  // State to store the random shape
  const [shape, setShape] = useState(getRandomShape());

  // Function to render the shape
  const renderShape = () => {
    switch (shape) {
      case 'circle':
        return (
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              borderRadius: '50%',
            }}
          ></div>
        );
      case 'square':
        return (
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
            }}
          ></div>
        );
      case 'triangle':
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderBottom: '20px solid white',
            }}
          ></div>
        );
      case 'pentagon':
        return (
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
            }}
          ></div>
        );
      case 'hexagon':
        return (
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
            }}
          ></div>
        );
      case 'star':
        return (
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              clipPath:
                'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            }}
          ></div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <motion.div
        ref={bubbleRef}
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
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {renderShape()}
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
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: 'calc(100% + 15px)',
              transform: 'translateY(-50%)',
              background: 'white',
              color: 'black',
              padding: '8px 12px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'capitalize',
                marginBottom: '4px',
              }}
            >
              {name}
            </span>
            <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
              {formatDistanceToNow(updatedAt)}
            </span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Bubble;
