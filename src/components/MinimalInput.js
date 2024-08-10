import React from 'react';

export default function MinimalInput({ type = 'text', placeholder, value, onChange, style }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        padding: '10px 0',
        fontSize: '16px',
        border: 'none',
        borderBottom: '2px solid #333',
        borderRadius: '0',
        outline: 'none',
        transition: 'border-color 0.3s ease',
        backgroundColor: 'transparent',
        color: '#333',
        ...style,
      }}
      onFocus={(e) => (e.target.style.borderBottomColor = '#000')}
      onBlur={(e) => (e.target.style.borderBottomColor = '#333')}
    />
  );
}
