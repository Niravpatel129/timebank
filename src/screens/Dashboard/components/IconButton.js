import React from 'react';

const IconButton = ({ Icon, color, style, marginLeft = '10px', ...props }) => (
  <div style={{ marginLeft, ...style }} {...props}>
    <Icon style={{ color, width: '10px', height: '10px' }} />
  </div>
);

export default IconButton;
