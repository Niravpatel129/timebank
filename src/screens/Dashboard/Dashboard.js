import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import {
  FaBook,
  FaCalendarAlt,
  FaChartLine,
  FaCheck,
  FaChevronRight,
  FaClipboardList,
  FaCog,
  FaGift,
  FaListAlt,
  FaPlus,
  FaPrint,
  FaSignOutAlt,
  FaStar,
  FaSync,
  FaTags,
  FaTrash,
  FaUserPlus,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '../../context/useProjectContext';
import { useTasksContext } from '../../context/useTasksContext';
import './Dashboard.css';
import Bubble from './components/Bubble';
import DashboardAddTaskModal from './components/DashboardAddTaskModal';
import DashboardCreateProjectModal from './components/DashboardCreateProjectModal/DashboardCreateProjectModal';
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
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const {
    projects,
    selectedProject,
    setSelectedProject,
    isModalOpen,
    openModal,
    closeModal,
    deleteProject,
  } = useProjectContext();

  const handleEditTask = (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
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

    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      ipcRenderer.removeAllListeners('dashboard-data');
      document.removeEventListener('mousedown', handleClickOutside);
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

  const profileDropdownItems = [
    { icon: FaCog, text: 'Settings', shortcut: '⌘,' },
    { icon: FaUserPlus, text: 'Add a team', shortcut: '⌘T' },
    { icon: FaChartLine, text: 'Activity log', shortcut: 'G then A' },
    { icon: FaPrint, text: 'Print', shortcut: '⌘P' },
    { icon: FaBook, text: 'Resources' },
    { icon: FaGift, text: "What's new" },
    { icon: FaStar, text: 'Upgrade to Pro' },
    { icon: FaSync, text: 'Sync', subtext: '7 seconds ago' },
    { icon: FaSignOutAlt, text: 'Log out' },
  ];

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
          justifyContent: 'space-between',
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      >
        {/* Top section */}
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
        >
          {/* Project Bubbles */}
          {projects.map((project, index) => {
            return (
              <div key={index}>
                <Bubble
                  gradientColors={
                    [
                      project.projectColor?.gradient1 || '#ffcc00',
                      project.projectColor?.gradient2 || '#ff9900',
                    ] || ['#ffcc00', '#ff9900']
                  }
                  onClick={() => setSelectedProject(project)}
                  selected={selectedProject?._id === project._id}
                  onDelete={() => deleteProject(project._id)}
                />
              </div>
            );
          })}
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
            onClick={() => openModal()}
          >
            <FaPlus style={{ color: '#666666', fontSize: '20px' }} />
          </motion.div>
        </div>

        {/* Avatar at the bottom */}
        <motion.div
          ref={profileDropdownRef}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginBottom: '40px',
            position: 'relative',
          }}
          onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
        >
          <img
            src={'https://i.chzbgr.com/full/9836262144/h2E0CB29F'}
            alt='Avatar'
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px solid #ffffff',
            }}
          />
          {isProfileDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                position: 'absolute',
                bottom: '100%',
                left: '100%',
                width: '250px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                padding: '10px',
                zIndex: 1000,
              }}
            >
              <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                <div style={{ fontWeight: 'bold' }}>Nirav</div>
                <div style={{ color: '#888', fontSize: '0.9em' }}>0/5 tasks</div>
              </div>
              {profileDropdownItems.map((item, index) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px',
                    cursor: 'pointer',
                    borderBottom:
                      index === profileDropdownItems.length - 2 ? '1px solid #eee' : 'none',
                  }}
                >
                  <item.icon style={{ marginRight: '10px', color: '#666' }} />
                  <div style={{ flex: 1 }}>
                    <div>{item.text}</div>
                    {item.subtext && (
                      <div style={{ fontSize: '0.8em', color: '#888' }}>{item.subtext}</div>
                    )}
                  </div>
                  {item.shortcut && (
                    <div style={{ fontSize: '0.8em', color: '#888' }}>{item.shortcut}</div>
                  )}
                </motion.div>
              ))}
              <div style={{ padding: '10px', color: '#888', fontSize: '0.9em' }}>
                v6494 · Changelog
              </div>
            </motion.div>
          )}
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

      {isModalOpen && <DashboardCreateProjectModal isOpen={isModalOpen} />}
    </div>
  );
};

export default Dashboard;
