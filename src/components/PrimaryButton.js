import React from 'react';

export default function PrimaryButton({ children, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px', // Increased horizontal padding
        fontSize: '1.1rem', // Slightly increased font size
        fontWeight: '500',
        background: 'linear-gradient(to bottom, #d1cef5, #c5c1f0, #8580cc)',
        color: '#241c53',
        border: '1px solid #40366d', // Added outline
        outline: '2px solid #2f2152',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'background 0.2s ease, border-color 0.2s ease',
        minWidth: '120px', // Added minimum width
      }}
    >
      {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
      {children}
    </button>
  );
}
