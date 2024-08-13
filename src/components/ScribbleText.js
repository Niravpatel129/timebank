import { motion } from 'framer-motion';
import React from 'react';

const ScribbleText = ({ text, isCompleted, strokeGradient }) => {
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
          <defs>
            <linearGradient id='scribbleGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
              <stop offset='0%' stopColor={strokeGradient[0] || '#331db9'} />
              <stop offset='100%' stopColor={strokeGradient[1] || '#331db9'} />
            </linearGradient>
          </defs>
          <motion.path
            d={`M0,10 Q${pathLength / 4},5 ${pathLength / 2},10 T${pathLength},10`}
            fill='transparent'
            strokeWidth='2'
            stroke='url(#scribbleGradient)'
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
