import React from 'react';

export default function TimeText({ time }) {
  return (
    <div
      style={{
        fontSize: '3rem',
        fontWeight: '300',
        marginBottom: '20px',
        background: 'linear-gradient(to bottom, #e4e1e4, #e4e1e4, #8779ab)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {time}
    </div>
  );
}
