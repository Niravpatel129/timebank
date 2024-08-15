import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiTrash } from 'react-icons/fi';

const BoardCard = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    toast.success('Coming soon!');
  };

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
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            cursor: 'pointer',
          }}
          onClick={handleDelete}
        >
          <FiTrash color='#c9c9c9' />
        </div>
      )}
      <div
        style={{
          backgroundColor: '#FFF3E0',
          color: '#FF9800',
          padding: '6px 12px',
          borderRadius: '16px',
          fontSize: '13px',
          display: 'inline-block',
          marginBottom: '8px',
          fontWeight: 500,
        }}
      >
        UX stages
      </div>
      <div style={{ fontSize: '16px', fontWeight: 400, marginBottom: '8px', color: '#16213a' }}>
        Wireframing
      </div>
      <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
        Create low-fidelity designs that outline the basic structure and layout of the product or
        service...
      </div>
      <div style={{ display: 'flex', alignItems: 'center', color: '#aeb2c2' }}>
        <div
          style={{
            padding: '6px 12px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #c5c9d9',
            marginBottom: '8px',
            fontWeight: 500,
          }}
        >
          <span style={{ marginRight: '4px' }}>☰</span>
          0/8
        </div>
      </div>
      {/* line across */}
      <div style={{ borderBottom: '1px solid #c5c9d9', margin: '8px -16px' }} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '8px',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', marginRight: '8px' }}>
            {['#87deb8', '#2d1ed2', '#cd3fb8'].map((color, index) => (
              <div
                key={index}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: '2px solid white',
                  marginLeft: index > 0 ? '-8px' : '0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                A
              </div>
            ))}
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#6200EA',
                color: 'white',
                fontSize: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: '-8px',
                border: '2px solid white',
                fontWeight: 500,
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
