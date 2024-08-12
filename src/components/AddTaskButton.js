import React from 'react';
import { FaPlus } from 'react-icons/fa';

export default function AddTaskButton({ handleTriggerAddTaskButton, colorGradients }) {
  return (
    <div
      style={{
        backgroundColor: colorGradients[0] || '#000',
        color: 'white',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      onClick={handleTriggerAddTaskButton}
    >
      <FaPlus />
    </div>
  );
}
