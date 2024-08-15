import React from 'react';

const BoardCard = () => {
  return (
    <div
      style={{
        userSelect: 'none',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFF3E0',
          color: '#FF9800',
          padding: '4px 8px',
          borderRadius: '16px',
          fontSize: '14px',
          display: 'inline-block',
          marginBottom: '8px',
        }}
      >
        UX stages
      </div>
      <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Wireframing</div>
      <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
        Create low-fidelity designs that outline the basic structure and layout of the product or
        service...
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              padding: '4px 8px',
              backgroundColor: '#f0f0f0',
              borderRadius: '16px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ marginRight: '4px' }}>☰</span>
            0/8
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', marginRight: '8px' }}>
            {['#8B4513', '#D2691E', '#A0522D'].map((color, index) => (
              <div
                key={index}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: '2px solid white',
                  marginLeft: index > 0 ? '-8px' : '0',
                }}
              />
            ))}
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#6200EA',
                color: 'white',
                fontSize: '12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: '-8px',
                border: '2px solid white',
              }}
            >
              +2
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#666' }}>
            <span style={{ marginRight: '8px' }}>👁 2</span>
            <span style={{ marginRight: '8px' }}>💬 0</span>
            <span>🔗 0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
