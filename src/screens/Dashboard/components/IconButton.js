import React from 'react';

const IconButton = ({ Icon, color, style, marginLeft = '10px' }) => (
  <div style={{ marginLeft, ...style }}>
    <Icon style={{ color }} />
  </div>
);

export default IconButton;
