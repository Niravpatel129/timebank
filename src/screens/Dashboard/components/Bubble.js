import { motion } from 'framer-motion';
import React from 'react';

const Bubble = ({ gradientColors }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    style={{
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: `linear-gradient(to bottom, ${gradientColors[0]}, ${gradientColors[1]})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    }}
  >
    <div
      style={{
        width: '20px',
        height: '20px',
        backgroundColor: 'white',
        borderRadius: '50%',
      }}
    ></div>
  </motion.div>
);

export default Bubble;
