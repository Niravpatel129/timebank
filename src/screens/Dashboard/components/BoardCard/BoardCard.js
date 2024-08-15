import React from 'react';

const BoardCard = ({ task }) => {
  return (
    <div
      style={{
        userSelect: 'none',
        padding: '16px',
        margin: '0 0 10px 0',
        minHeight: '100px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {task.stage && (
        <div
          style={{
            backgroundColor: '#FFF3E0',
            color: '#FF9800',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            display: 'inline-block',
            marginBottom: '8px',
          }}
        >
          {task.stage}
        </div>
      )}
      <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
        {task.content}
      </div>
      {task.progress && (
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>{task.progress}</div>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#ddd',
              marginRight: '4px',
            }}
          ></div>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#ddd',
              marginRight: '4px',
            }}
          ></div>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#ddd',
              marginRight: '4px',
            }}
          ></div>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#4285f4',
              color: 'white',
              fontSize: '12px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            +2
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
          <span style={{ marginRight: '8px' }}>👁 2</span>
          <span style={{ marginRight: '8px' }}>💬 0</span>
          <span>🔗 0</span>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
