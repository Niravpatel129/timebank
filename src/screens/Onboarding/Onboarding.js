import { motion } from 'framer-motion';
import React, { useState } from 'react';

const Onboarding = () => {
  const [selectedTools, setSelectedTools] = useState([]);

  const categories = [
    { id: 'work', name: 'Work', icon: '💼' },
    { id: 'personal', name: 'Personal', icon: '🏠' },
    { id: 'health', name: 'Health', icon: '🏋️' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'finance', name: 'Finance', icon: '💰' },
    { id: 'social', name: 'Social', icon: '🎉' },
  ];

  const handleToolSelect = (toolId) => {
    setSelectedTools((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId],
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#fff',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h1
        style={{
          marginBottom: '20px',
          color: '#333',
          fontSize: '2.5rem',
          fontWeight: '700',
          background: '#fff',
          WebkitBackgroundClip: 'text',
        }}
      >
        Tell us more about you
      </h1>
      <p
        style={{
          marginBottom: '30px',
          color: '#555',
          fontSize: '1.2rem',
          maxWidth: '600px',
          textAlign: 'center',
          lineHeight: '1.6',
        }}
      >
        What areas are you most interested in improving? Select all that apply:
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '30px',
          maxWidth: '800px',
        }}
      >
        {categories.map((tool) => (
          <motion.div
            key={tool.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '30px',
              border: `2px solid ${selectedTools.includes(tool.id) ? '#341dc0' : '#e0e0e0'}`,
              borderRadius: '15px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(to bottom, #ffffff, #f8f9ff)',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease',
            }}
            onClick={() => handleToolSelect(tool.id)}
          >
            <span style={{ fontSize: '48px', marginBottom: '15px' }}>{tool.icon}</span>
            <span
              style={{
                fontSize: '20px',
                textAlign: 'center',
                fontWeight: '600',
                color: '#333',
              }}
            >
              {tool.name}
            </span>
          </motion.div>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          marginTop: '50px',
          padding: '15px 40px',
          background: 'linear-gradient(45deg, #341dc0, #5339ce)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          fontSize: '20px',
          fontWeight: '600',
          boxShadow: '0 10px 20px rgba(83, 57, 206, 0.2)',
          transition: 'all 0.3s ease',
        }}
      >
        Continue
      </motion.button>
    </div>
  );
};

export default Onboarding;
