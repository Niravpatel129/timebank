// Tasks.js
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaCheckCircle, FaHourglassHalf, FaPlus } from 'react-icons/fa';
import { GoTag } from 'react-icons/go';
import { LuUsers2 } from 'react-icons/lu';
import AddTaskModal from '../components/AddTaskModal';

export default function Tasks({ setScreen }) {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Load tasks from localStorage when component mounts
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);

  const handleBack = () => {
    setScreen('home');
  };

  const handleAddTask = (newTask) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    // Save to localStorage
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setShowAddTaskModal(false);
  };

  const handleCloseModal = () => {
    setShowAddTaskModal(false);
  };

  return (
    <div>
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
      <div style={{ padding: '50px 20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h1 style={{ color: '#fff' }}>All Tasks</h1>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              cursor: 'pointer',
              zIndex: 1000,
            }}
            onClick={() => setShowAddTaskModal(true)}
          >
            <FaPlus style={{ color: '#8c82c6', fontSize: '24px' }} />
          </motion.div>
        </div>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '10px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#15093d',
              border: '0.1px solid #483776',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <span style={{ color: '#fff', fontSize: '1rem', fontWeight: '500' }}>
                {task.name}
              </span>
              {task.status === 'completed' ? (
                <FaCheckCircle style={{ color: '#4CAF50' }} />
              ) : (
                <FaHourglassHalf style={{ color: '#FFC107' }} />
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <GoTag style={{ color: '#8c82c6', fontSize: '0.9rem', marginRight: '5px' }} />
                <span style={{ color: '#8c82c6', fontSize: '0.9rem' }}>{task.category}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <LuUsers2 style={{ color: '#8c82c6', fontSize: '0.9rem', marginRight: '5px' }} />
                <span style={{ color: '#8c82c6', fontSize: '0.9rem' }}>{task.hours}h</span>
              </div>
              {task.date && (
                <span style={{ color: '#8c82c6', fontSize: '0.9rem' }}>{task.date}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ margin: '20px' }}>
        {showAddTaskModal && <AddTaskModal onClose={handleCloseModal} onAddTask={handleAddTask} />}
      </div>
    </div>
  );
}
