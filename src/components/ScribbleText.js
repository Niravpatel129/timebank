import { motion } from 'framer-motion';
import React from 'react';

const ScribbleText = ({ text, isCompleted }) => {
  const pathLength = text.length * 15;

  return (
    <div style={{ position: 'relative' }}>
      <motion.span transition={{ duration: 0.5, delay: 0.5 }} style={{}}>
        {text}
      </motion.span>
      {isCompleted && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <motion.path
            d={`M0,10 Q${pathLength / 4},0 ${pathLength / 2},10 T${pathLength},10`}
            fill='transparent'
            strokeWidth='2'
            stroke='#331db9'
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
        </svg>
      )}
    </div>
  );
};

export default ScribbleText;
