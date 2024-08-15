import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import { FaWandMagicSparkles } from 'react-icons/fa6';
import Select from 'react-select';
import newRequest from '../../../api/newReqest';
import { useProjectContext } from '../../../context/useProjectContext';
import { useTasksContext } from '../../../context/useTasksContext';

export default function DashboardAddTaskModal({ onClose, isOpen }) {
  const { selectedProject, colorGradients } = useProjectContext();
  const { addTask } = useTasksContext();
  const modalRef = useRef(null);
  const [showAI, setShowAI] = useState(false);
  const [aiTaskDescription, setAiTaskDescription] = useState('');
  const [disableAiSubmit, setDisableAiSubmit] = useState(false);

  const [taskData, setTaskData] = useState({
    taskName: '',
    duration: '30m',
    showCustomDuration: false,
    customHours: 0,
    customMinutes: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    assignee: null,
    timerType: 'countdown',
  });

  const submitAiTaskGenerate = async () => {
    setDisableAiSubmit(true);
    try {
      const response = await newRequest.post('/tasks/ai-generate-task', {
        projectId: selectedProject._id,
        taskDescription: aiTaskDescription,
      });
      console.log('🚀  response:', response);
      if (response.task) {
        const task = response.task;
        // Convert duration from seconds to appropriate format
        const durationInSeconds = task.taskDuration;
        let duration;
        if (durationInSeconds < 3600) {
          const minutes = Math.round(durationInSeconds / 60);
          duration = [5, 15, 30, 45].includes(minutes) ? `${minutes}m` : 'custom';
        } else {
          const hours = Math.round(durationInSeconds / 3600);
          duration = hours === 1 ? '1h' : 'custom';
        }

        setTaskData((prev) => ({
          ...prev,
          taskName: task.name,
          duration: duration,
          showCustomDuration: duration === 'custom',
          customHours: duration === 'custom' ? Math.floor(durationInSeconds / 3600) : 0,
          customMinutes: duration === 'custom' ? Math.round((durationInSeconds % 3600) / 60) : 0,
          category: task.category,
          date: new Date().toISOString().split('T')[0],
          timerType: task.timerType,
        }));
      }
      setAiTaskDescription('');
      setShowAI(false);
    } catch (error) {
      toast.error('Error generating task, try again later');
    } finally {
      setDisableAiSubmit(false);
    }
  };

  useEffect(() => {
    if (selectedProject?.members.length > 0) {
      const firstMember = selectedProject.members[0].user;
      if (firstMember._id && firstMember.name) {
        setTaskData((prev) => ({
          ...prev,
          assignee: {
            value: firstMember._id,
            _id: firstMember._id,
            name: firstMember.name,
            email: firstMember.email,
            avatar: null,
          },
        }));
      }
    }
  }, [selectedProject]);

  const resetForm = () => {
    setTaskData({
      taskName: '',
      duration: '30m',
      showCustomDuration: false,
      customHours: 0,
      customMinutes: 0,
      category: '',
      date: new Date().toISOString().split('T')[0],
      assignee: null,
      timerType: 'countdown',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskDurationInSeconds = calculateDurationInSeconds(taskData.duration);
    const newTask = {
      name: taskData.taskName,
      status: 'not-started',
      taskDuration: taskData.timerType === 'countup' ? 0 : taskDurationInSeconds,
      hours: taskDurationInSeconds / 3600,
      category: taskData.category || null,
      dateDue: taskData.date,
      dateCreated: new Date().toISOString(),
      assignee: taskData.assignee?.value,
      assigneeDetails: taskData.assignee,
      timerType: taskData.timerType,
    };
    addTask({ ...newTask, project: selectedProject._id });
    resetForm();
    onClose();
  };

  const calculateDurationInSeconds = (durationString) => {
    if (durationString === 'custom') {
      return parseInt(taskData.customHours) * 3600 + parseInt(taskData.customMinutes) * 60;
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

  const handleInputChange = (field, value) => {
    setTaskData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDurationClick = (time) => {
    if (time === 'Other') {
      handleInputChange('showCustomDuration', true);
      handleInputChange('duration', 'custom');
    } else {
      handleInputChange('showCustomDuration', false);
      handleInputChange('duration', time);
    }
  };

  const handleCustomDurationChange = (type, value) => {
    handleInputChange(type === 'hours' ? 'customHours' : 'customMinutes', value);
    handleInputChange('duration', 'custom');
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

  const formatOptionLabel = ({ name, avatar }) => (
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

  const renderInputField = (id, label, value, onChange, placeholder = '') => (
    <div style={{ marginBottom: '15px' }}>
      <label htmlFor={id}>{label}</label>
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
          type={id === 'date' ? 'date' : 'text'}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
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
          onClick={() => onChange('')}
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
  );

  const renderRegularForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        {renderInputField(
          'taskName',
          'Add task',
          taskData.taskName,
          (value) => handleInputChange('taskName', value),
          'Morning check-in',
        )}

        <div style={{ marginBottom: '15px' }}>
          <label>Do you know how long this task will take?</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
            {['countdown', 'countup'].map((type) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type='button'
                onClick={() => handleInputChange('timerType', type)}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '20px',
                  backgroundColor: taskData.timerType === type ? colorGradients[0] : '#e0e0e0',
                  color: taskData.timerType === type ? 'white' : 'black',
                  cursor: 'pointer',
                }}
              >
                {type === 'countdown' ? 'Yes, I know' : 'Not sure'}
              </motion.button>
            ))}
          </div>
        </div>

        {taskData.timerType === 'countdown' && (
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
                      taskData.duration === time ||
                      (time === 'Other' && taskData.duration === 'custom')
                        ? colorGradients[0]
                        : '#e0e0e0',
                    color:
                      taskData.duration === time ||
                      (time === 'Other' && taskData.duration === 'custom')
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
        )}

        {taskData.showCustomDuration && taskData.timerType === 'countdown' && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Custom Duration</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type='number'
                min='0'
                value={taskData.customHours}
                onChange={(e) => handleCustomDurationChange('hours', e.target.value)}
                style={{ width: '50px', padding: '5px' }}
              />
              <span>h</span>
              <input
                type='number'
                min='0'
                max='59'
                value={taskData.customMinutes}
                onChange={(e) => handleCustomDurationChange('minutes', e.target.value)}
                style={{ width: '50px', padding: '5px' }}
              />
              <span>m</span>
            </div>
          </div>
        )}

        {renderInputField(
          'category',
          'Category',
          taskData.category,
          (value) => handleInputChange('category', value),
          'e.g. Development, Design',
        )}
        {renderInputField('date', 'Date Due', taskData.date, (value) =>
          handleInputChange('date', value),
        )}

        {selectedProject?.members.length > 0 && (
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor='assignee'>Assignee</label>
            <Select
              id='assignee'
              value={taskData.assignee}
              onChange={(value) => handleInputChange('assignee', value)}
              options={[
                ...selectedProject?.members.map((member) => ({
                  value: member.user?._id,
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
    );
  };

  const renderAIForm = () => {
    return (
      <div style={{ width: '100%' }}>
        <div
          style={{
            marginBottom: '15px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <label htmlFor='aiTaskDescription'>Describe your task</label>
          <textarea
            value={aiTaskDescription}
            onChange={(e) => setAiTaskDescription(e.target.value)}
            id='aiTaskDescription'
            rows='4'
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              resize: 'vertical',
            }}
            placeholder='Enter your task description here...'
          ></textarea>
        </div>
        <motion.button
          onClick={submitAiTaskGenerate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type='button'
          disabled={disableAiSubmit}
          style={{
            padding: '15px',
            backgroundColor: colorGradients[0],
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: disableAiSubmit ? 'not-allowed' : 'pointer',
            backgroundColor: disableAiSubmit ? '#ccc' : colorGradients[0],
            opacity: disableAiSubmit ? 0.5 : 1,
            width: '100%',
          }}
        >
          Generate with AI
        </motion.button>
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
              <h2 style={{ margin: 0 }}>Add Task</h2>
              <div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAI(!showAI)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <FaWandMagicSparkles />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <FaTimes />
                </motion.button>
              </div>
            </div>
            {showAI ? renderAIForm() : renderRegularForm()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
