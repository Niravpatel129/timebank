import { motion } from 'framer-motion';
import React, { useState } from 'react';

export default function PrimaryButton({ children, onClick, icon, disabled }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => !disabled && setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: 'tween', duration: 0.2 }}
      style={{
        padding: '10px 20px',
        fontSize: '1.1rem',
        fontWeight: '500',
        background: disabled
          ? 'linear-gradient(to bottom, #e0e0e0, #d0d0d0, #c0c0c0)'
          : isActive
          ? 'linear-gradient(to bottom, #b8b5e0, #aca8db, #6e69b7)'
          : isHovered
          ? 'linear-gradient(to bottom, #e0defa, #d4d0f5, #9490d6)'
          : 'linear-gradient(to bottom, #d1cef5, #c5c1f0, #8580cc)',
        color: disabled ? '#888888' : '#241c53',
        border: disabled ? '1px solid #b0b0b0' : '1px solid #40366d',
        outline: disabled ? 'none' : isHovered ? '2px solid #3f2c6e' : '2px solid #2f2152',
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: disabled
          ? 'none'
          : isActive
          ? 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
          : '0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        minWidth: '120px',
        transition: 'all 0.2s ease-in-out',
        opacity: disabled ? 0.6 : 1,
      }}
      disabled={disabled}
    >
      {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
      {children}
    </motion.button>
  );
}
