import React from 'react';

const Tag = ({ backgroundColor, color = 'white', children, style }) => (
  <span
    style={{
      backgroundColor,
      color,
      borderRadius: '10px',
      fontSize: '12px',
      marginRight: '10px',
      ...style,
    }}
  >
    {children}
  </span>
);

export default Tag;
