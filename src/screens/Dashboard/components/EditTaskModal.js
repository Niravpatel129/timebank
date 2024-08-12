import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';
import Select from 'react-select';

export default function EditTaskModal({ onClose, task, onSave, onDelete }) {
  const [taskName, setTaskName] = useState(task.name || '');
  const [duration, setDuration] = useState('');
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(0);
  const [category, setCategory] = useState(task.category || '');
  const [date, setDate] = useState(task.dateDue || new Date().toISOString().split('T')[0]);
  const [assignee, setAssignee] = useState(task.assignee || null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (task.taskDuration) {
      const hours = Math.floor(task.taskDuration / 3600);
      const minutes = Math.floor((task.taskDuration % 3600) / 60);
      if (hours === 0 && minutes === 5) setDuration('5m');
      else if (hours === 0 && minutes === 15) setDuration('15m');
      else if (hours === 0 && minutes === 30) setDuration('30m');
      else if (hours === 0 && minutes === 45) setDuration('45m');
      else if (hours === 1 && minutes === 0) setDuration('1h');
      else {
        setDuration('custom');
        setShowCustomDuration(true);
        setCustomHours(hours);
        setCustomMinutes(minutes);
      }
    } else {
      setDuration('45m');
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let taskDuration;
    if (duration === 'custom') {
      taskDuration = customHours * 3600 + customMinutes * 60;
    } else {
      const match = duration.match(/(\d+)([mh])/);
      if (match) {
        const [, value, unit] = match;
        taskDuration = unit === 'h' ? parseInt(value) * 3600 : parseInt(value) * 60;
      }
    }
    const updatedTask = {
      ...task,
      name: taskName,
      duration: duration,
      taskDuration: taskDuration,
      timeSpent: 0,
      category: category,
      date: date,
      assignee: assignee,
    };

    onSave(updatedTask);
  };

  // Mock data for assignees, replace with actual data in your implementation
  const assignees = [
    {
      value: '1',
      label: 'John Doe',
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKK1zSX_YjOvNSHlqwuy84X_WMWRSHNigzpA&s',
    },
    {
      value: '2',
      label: 'Jane Smith',
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKK1zSX_YjOvNSHlqwuy84X_WMWRSHNigzpA&s',
    },
    {
      value: '3',
      label: 'Bob Johnson',
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKK1zSX_YjOvNSHlqwuy84X_WMWRSHNigzpA&s',
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleDurationClick = (time) => {
    if (time === 'Other') {
      setShowCustomDuration(true);
      setDuration('custom');
    } else {
      setShowCustomDuration(false);
      setDuration(time);
    }
  };

  const handleCustomDurationChange = (type, value) => {
    if (type === 'hours') {
      setCustomHours(value);
    } else {
      setCustomMinutes(value);
    }
    setDuration('custom');
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '4px',
      boxShadow: 'none',
    }),
    option: (provided, state) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      padding: '8px',
    }),
    singleValue: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
    }),
  };

  const formatOptionLabel = ({ label, avatar }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={avatar}
        alt={label}
        style={{ width: '24px', height: '24px', borderRadius: '50%', marginRight: '8px' }}
      />
      <span>{label}</span>
    </div>
  );

  return (
    <div
      className='modal-overlay'
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        ref={modalRef}
        className='modal-content'
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          width: '90%',
          maxWidth: '400px',
          margin: '10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ margin: 0 }}>Edit activity</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <FaTimes />
          </motion.button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Task Name Input */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor='taskName'>Edit task</label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '4px',
                marginTop: '5px',
              }}
            >
              <input
                type='text'
                id='taskName'
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder='Morning check-in'
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  padding: '8px',
                }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type='button'
                onClick={() => setTaskName('')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <FaTimes />
              </motion.button>
            </div>
          </div>

          {/* Duration Selection */}
          <div style={{ marginBottom: '15px' }}>
            <label>How long will this take?</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '5px' }}>
              {['5m', '15m', '30m', '45m', '1h', 'Other'].map((time) => (
                <motion.button
                  key={time}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type='button'
                  onClick={() => handleDurationClick(time)}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '20px',
                    backgroundColor:
                      duration === time || (time === 'Other' && duration === 'custom')
                        ? 'black'
                        : '#e0e0e0',
                    color:
                      duration === time || (time === 'Other' && duration === 'custom')
                        ? 'white'
                        : 'black',
                    cursor: 'pointer',
                  }}
                >
                  {time}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom Duration Input */}
          {showCustomDuration && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Custom Duration</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type='number'
                  min='0'
                  value={customHours}
                  onChange={(e) => handleCustomDurationChange('hours', e.target.value)}
                  style={{ width: '50px', padding: '5px' }}
                />
                <span>h</span>
                <input
                  type='number'
                  min='0'
                  max='59'
                  value={customMinutes}
                  onChange={(e) => handleCustomDurationChange('minutes', e.target.value)}
                  style={{ width: '50px', padding: '5px' }}
                />
                <span>m</span>
              </div>
            </div>
          )}

          {/* Category Input */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor='category'>Category</label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '4px',
                marginTop: '5px',
              }}
            >
              <input
                type='text'
                id='category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder='e.g. Development, Design'
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  padding: '8px',
                }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type='button'
                onClick={() => setCategory('')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <FaTimes />
              </motion.button>
            </div>
          </div>

          {/* Date Input */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor='date'>Date Due</label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '4px',
                marginTop: '5px',
              }}
            >
              <input
                type='date'
                id='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  padding: '8px',
                }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type='button'
                onClick={() => setDate('')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <FaTimes />
              </motion.button>
            </div>
          </div>

          {/* Assignee Select Dropdown */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor='assignee'>Assignee</label>
            <Select
              id='assignee'
              value={assignee}
              onChange={setAssignee}
              options={assignees}
              styles={customStyles}
              formatOptionLabel={formatOptionLabel}
              placeholder='Select an assignee'
              isClearable
            />
          </div>

          {/* Submit and Delete Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type='submit'
              style={{
                padding: '10px',
                backgroundColor: 'black',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Save changes
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type='button'
              onClick={() => onDelete(task._id)}
              style={{
                padding: '10px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <FaTrash /> Delete
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
