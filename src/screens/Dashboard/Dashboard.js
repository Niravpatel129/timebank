import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  FaCalendarAlt,
  FaCheck,
  FaChevronRight,
  FaClipboardList,
  FaListAlt,
  FaPlus,
  FaTags,
  FaTrash,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTasksContext } from '../../context/useTasksContext';
import './Dashboard.css';
import Bubble from './components/Bubble';
import DashboardAddTaskModal from './components/DashboardAddTaskModal';
import DashboardMiddleSection from './components/DashboardMiddleSection';
import EditTaskModal from './components/EditTaskModal';
import TimerTrack from './components/TimerTrack';
const { ipcRenderer } = window.require('electron');

const Dashboard = () => {
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const { tasks, editTask } = useTasksContext();
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setTaskToEdit(null);
  };

  const handleSaveEditedTask = (editedTask) => {
    editTask(editedTask);
    handleCloseEditModal();
  };

  useEffect(() => {
    ipcRenderer.send('get-dashboard-data');

    ipcRenderer.on('dashboard-data', (event, receivedData) => {
      setData(receivedData);
    });

    return () => {
      ipcRenderer.removeAllListeners('dashboard-data');
    };
  }, []);

  const handleAddTask = () => {
    console.log('Add new task');
  };

  const handleModalClose = () => {
    console.log('Modal closed');
  };

  const iconStyle = {
    fontSize: '24px',
    color: '#ffffff',
    opacity: 0.7,
    cursor: 'pointer',
  };

  return (
    <div
      className='dashboard'
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
      }}
    >
      {/* Left column - 80px wide, full height */}
      <motion.div
        style={{
          width: '80px',
          height: '100%',
          background: 'linear-gradient(to top, #212d8b, #1f2f8c)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          paddingTop: '20px',
        }}
      >
        {/* Bubbles */}
        <Bubble gradientColors={['#ffcc00', '#ff9900']} />
        <Bubble gradientColors={['#9933ff', '#6600cc']} />
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(to bottom, #ccccff, #9999cc)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <FaPlus style={{ color: '#666666', fontSize: '20px' }} />
        </motion.div>
      </motion.div>

      {/* Middle column - 80px wide, full height */}
      <div
        style={{
          width: '80px',
          height: '100%',
          background: '#1c207f',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '20px',
          gap: '30px',
        }}
      >
        <FaChevronRight style={iconStyle} />
        <FaListAlt style={iconStyle} /> {/* All Tasks */}
        <FaCalendarAlt style={iconStyle} /> {/* Calendar View */}
        <FaClipboardList style={iconStyle} /> {/* Projects or Lists */}
        <FaTags style={iconStyle} /> {/* Tags or Categories */}
        <FaCheck style={iconStyle} /> {/* Completed Tasks */}
        <FaTrash style={iconStyle} /> {/* Trash or Deleted Tasks */}
      </div>

      {/* Main content area - remaining width, full height */}
      <div style={{ flex: 1, height: '100%', display: 'flex' }}>
        {/* Left part of main content - flexible width */}
        <div style={{ flex: 1, height: '100%' }}>
          {/* Content for main area */}
          <DashboardMiddleSection
            handleTriggerAddTaskButton={() => setAddTaskModalOpen(true)}
            onEditTask={handleEditTask}
          />
        </div>

        {/* Right part of main content - 300px wide, full height */}
        <div style={{ width: '400px', height: '100%', backgroundColor: '#c0c0c0' }}>
          {/* Content for right column */}
          <TimerTrack />
        </div>
      </div>

      {addTaskModalOpen && (
        <DashboardAddTaskModal
          onClose={() => setAddTaskModalOpen(false)}
          onAddTask={handleAddTask}
        />
      )}
      {isEditModalOpen && taskToEdit && (
        <EditTaskModal
          task={taskToEdit}
          onClose={handleCloseEditModal}
          onSave={handleSaveEditedTask}
        />
      )}
    </div>
  );
};

export default Dashboard;
