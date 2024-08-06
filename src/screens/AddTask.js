import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaArrowLeft, FaMinus, FaPlus } from 'react-icons/fa';

export default function AddTask({ setScreen }) {
  const [taskName, setTaskName] = useState('');
  const [tags, setTags] = useState([]);
  const [colorTag, setColorTag] = useState('#000000');
  const [assignee, setAssignee] = useState('Me');
  const [dueDate, setDueDate] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const handleBack = () => {
    setScreen('tasks');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log({
      taskName,
      tags,
      colorTag,
      assignee,
      dueDate,
      timeAssigned: `${hours}:${minutes}`,
    });
    // Reset form or navigate back to tasks
    setScreen('tasks');
  };

  const incrementTime = (type) => {
    if (type === 'hours') {
      setHours((prev) => (prev + 1) % 24);
    } else {
      setMinutes((prev) => (prev + 15) % 60);
    }
  };

  const decrementTime = (type) => {
    if (type === 'hours') {
      setHours((prev) => (prev - 1 + 24) % 24);
    } else {
      setMinutes((prev) => (prev - 15 + 60) % 60);
    }
  };

  return (
    <div style={{ padding: '50px 20px' }}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
        onClick={handleBack}
      >
        <FaArrowLeft style={{ color: '#8c82c6', fontSize: '24px' }} />
      </motion.div>
      <h1 style={{ color: '#fff', marginBottom: '20px' }}>Add New Task</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
      >
        <label style={{ color: '#fff' }}>
          Task Name:
          <input
            type='text'
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: 'none',
              width: 'calc(100% - 20px)',
            }}
          />
        </label>
        <label style={{ color: '#fff' }}>
          Tags (comma-separated):
          <input
            type='text'
            value={tags.join(', ')}
            onChange={(e) => setTags(e.target.value.split(',').map((tag) => tag.trim()))}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: 'none',
              width: 'calc(100% - 20px)',
            }}
          />
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor='colorTag' style={{ color: '#fff' }}>
            Color Tag:
          </label>
          <input
            type='color'
            id='colorTag'
            value={colorTag}
            onChange={(e) => setColorTag(e.target.value)}
            style={{ width: '50px', height: '30px', border: 'none', borderRadius: '5px' }}
          />
        </div>
        <label style={{ color: '#fff' }}>
          Assignee:
          <input
            type='text'
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: 'none',
              width: 'calc(100% - 20px)',
            }}
          />
        </label>
        <label style={{ color: '#fff' }}>
          Due Date:
          <input
            type='date'
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: 'none',
              width: 'calc(100% - 20px)',
            }}
          />
        </label>
        <label style={{ color: '#fff' }}>
          Time Assigned:
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => incrementTime('hours')}
                type='button'
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <FaPlus />
              </motion.button>
              <span>{hours.toString().padStart(2, '0')}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => decrementTime('hours')}
                type='button'
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <FaMinus />
              </motion.button>
            </div>
            <span>:</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => incrementTime('minutes')}
                type='button'
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <FaPlus />
              </motion.button>
              <span>{minutes.toString().padStart(2, '0')}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => decrementTime('minutes')}
                type='button'
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <FaMinus />
              </motion.button>
            </div>
          </div>
        </label>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '10px',
            backgroundColor: '#8c82c6',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
          type='submit'
        >
          <FaPlus /> Add Task
        </motion.button>
      </form>
    </div>
  );
}
