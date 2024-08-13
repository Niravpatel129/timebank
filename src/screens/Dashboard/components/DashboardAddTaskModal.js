import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Select from 'react-select';
import { useProjectContext } from '../../../context/useProjectContext';
import { useTasksContext } from '../../../context/useTasksContext';

export default function DashboardAddTaskModal({ onClose, isOpen }) {
  const { selectedProject, colorGradients } = useProjectContext();
  const [taskName, setTaskName] = useState('');
  const [duration, setDuration] = useState('30m');
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(0);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [assignee, setAssignee] = useState(null);
  const modalRef = useRef(null);
  const { addTask } = useTasksContext();

  useEffect(() => {
    // pick the first assignee
    if (selectedProject?.members.length > 0) {
      if (selectedProject.members[0].user._id && selectedProject.members[0].user.name) {
        setAssignee({
          value: selectedProject.members[0].user._id,
          _id: selectedProject.members[0].user._id,
          name: selectedProject.members[0].user.name,
          email: selectedProject.members[0].user.email,
          avatar: null,
        });
      }
    }
  }, [selectedProject]);

  const resetForm = () => {
    setTaskName('');
    setDuration('30m');
    setShowCustomDuration(false);
    setCustomHours(0);
    setCustomMinutes(0);
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setAssignee(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskDurationInSeconds = calculateDurationInSeconds(duration);
    const newTask = {
      name: taskName,
      status: 'not-started',
      taskDuration: taskDurationInSeconds,
      hours: taskDurationInSeconds / 3600,
      category: category || null,
      dateDue: date,
      dateCreated: new Date().toISOString(),
      assignee: assignee?.value,
      assigneeDetails: assignee,
    };
    addTask({ ...newTask, project: selectedProject._id });
    resetForm();
    onClose();
  };

  const calculateDurationInSeconds = (durationString) => {
    if (durationString === 'custom') {
      return parseInt(customHours) * 3600 + parseInt(customMinutes) * 60;
    }
    const match = durationString.match(/(\d+)([hm])/);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2];
      return unit === 'h' ? value * 3600 : value * 60;
    }
    return 0;
  };

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

  const formatOptionLabel = ({ name, avatar }) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            style={{ width: '24px', height: '24px', borderRadius: '50%', marginRight: '8px' }}
          />
        ) : (
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#ccc',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '8px',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            {name?.charAt(0).toUpperCase()}
          </div>
        )}
        <span>{name}</span>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='modal-overlay'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
              <h2 style={{ margin: 0 }}>Add activity</h2>
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
                <label htmlFor='taskName'>Add task</label>
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
                            ? colorGradients[0]
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
              {selectedProject?.members.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <label htmlFor='assignee'>Assignee</label>
                  <Select
                    id='assignee'
                    value={assignee}
                    onChange={setAssignee}
                    options={[
                      ...selectedProject?.members.map((member) => ({
                        value: member.user._id,
                        label: member.user?.name,
                        name: member.user?.name,
                        avatar: null,
                      })),
                      { value: null, label: 'Unassigned', name: 'Unassigned' },
                    ]}
                    styles={customStyles}
                    formatOptionLabel={formatOptionLabel}
                    placeholder='Select an assignee'
                    isClearable
                  />
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type='submit'
                style={{
                  padding: '15px',
                  backgroundColor: colorGradients[0],
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Add activity
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
