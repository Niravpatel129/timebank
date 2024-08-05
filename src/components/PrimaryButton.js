import React, { useState } from 'react';

export default function PrimaryButton({ children, onClick, icon }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      style={{
        padding: '10px 20px',
        fontSize: '1.1rem',
        fontWeight: '500',
        background: isActive
          ? 'linear-gradient(to bottom, #b8b5e0, #aca8db, #6e69b7)'
          : isHovered
          ? 'linear-gradient(to bottom, #e0defa, #d4d0f5, #9490d6)'
          : 'linear-gradient(to bottom, #d1cef5, #c5c1f0, #8580cc)',
        color: '#241c53',
        border: '1px solid #40366d',
        outline: isHovered ? '2px solid #3f2c6e' : '2px solid #2f2152',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isActive ? 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease',
        minWidth: '120px',
        transform: isActive ? 'scale(0.98)' : 'scale(1)',
      }}
    >
      {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
      {children}
    </button>
  );
}
