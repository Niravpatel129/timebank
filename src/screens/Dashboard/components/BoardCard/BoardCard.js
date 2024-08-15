import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CiClock2 } from 'react-icons/ci';
import { FaCheck, FaPause, FaPlay } from 'react-icons/fa';
import { FiTrash } from 'react-icons/fi';

const BoardCard = ({ task, onEditTask, colorGradients }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    toast.success('Coming soon!');
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!task) return null;

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
      onClick={() => onEditTask(task._id)}
    >
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <FiTrash color='#c9c9c9' />
        </div>
      )}
      <div
        style={{
          backgroundColor: colorGradients[0],
          color: '#FFFFFF',
          padding: '6px 12px',
          borderRadius: '16px',
          fontSize: '13px',
          display: 'inline-block',
          marginBottom: '8px',
          fontWeight: 500,
        }}
      >
        {task.category || 'Uncategorized'}
      </div>
      <div style={{ fontSize: '16px', fontWeight: 400, marginBottom: '8px', color: '#16213a' }}>
        {task.name}
      </div>
      <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
        {task.description || 'No description'}
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
          {task.status}
        </div>
      </div>
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
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: colorGradients[0],
                border: '2px solid white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '10px',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              {task.assignee?.name?.[0].toUpperCase() || 'U'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#666' }}>
            <span style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}>
              <CiClock2 style={{ marginRight: '4px' }} />
              {formatTime(task.timerState.remainingTime)}
            </span>
            <span style={{ marginRight: '8px' }}>
              {task.timerState.isActive ? <FaPause /> : <FaPlay />}
            </span>
            <span>{task.status === 'completed' ? <FaCheck /> : null}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
