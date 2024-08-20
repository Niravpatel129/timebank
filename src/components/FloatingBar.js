import React from 'react';
import { FiCheckSquare, FiFlag } from 'react-icons/fi';

const FloatingBar = ({ onOpenPanel, currentPanel }) => {
  const handlePanelClick = (panel) => {
    if (currentPanel === panel) {
      onOpenPanel(null);
    } else {
      onOpenPanel(panel);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '5px',
        background: 'white',
        padding: '5px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      <IconButton
        onClick={() => handlePanelClick('epic')}
        Icon={FiFlag}
        label='Epic'
        isActive={currentPanel === 'epic'}
      />
      <IconButton
        onClick={() => handlePanelClick('task')}
        Icon={FiCheckSquare}
        label='Task'
        isActive={currentPanel === 'task'}
      />
    </div>
  );
};

const IconButton = ({ onClick, Icon, label, isActive }) => (
  <button
    onClick={onClick}
    style={{
      ...iconButtonStyle,
      background: isActive ? '#e6f2ff' : 'transparent',
      boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
    }}
  >
    <Icon size={18} color={isActive ? '#007bff' : '#555'} />
    <span
      style={{
        ...labelStyle,
        color: isActive ? '#007bff' : '#555',
        fontWeight: isActive ? '800' : '400',
      }}
    >
      {label}
    </span>
  </button>
);

const iconButtonStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '8px 12px',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  transition: 'all 0.2s ease-in-out',
};

const labelStyle = {
  fontSize: '12px',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

export default FloatingBar;
