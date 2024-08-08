import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaCheckCircle, FaHourglassHalf, FaPlus, FaTrash } from 'react-icons/fa';
import { GoTag } from 'react-icons/go';
import { LuUsers2 } from 'react-icons/lu';
import AddTaskModal from '../components/AddTaskModal';
import { useScreenContext } from '../context/useScreenContext';
import secondsToTime from '../helpers/secondsToTime';

export default function Tasks({ setScreen }) {
  const { setCurrentTask, currentTask, updateUncompletedTasksCount } = useScreenContext();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [uncompletedTasksCount, setUncompletedTasksCount] = useState(0);

  useEffect(() => {
    // Load tasks from localStorage when component mounts
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks.reverse()); // Reverse the order of tasks

    // Update uncompleted tasks count
    const uncompletedCount = savedTasks.filter((task) => task.status !== 'completed').length;
    setUncompletedTasksCount(uncompletedCount);
    updateUncompletedTasksCount(uncompletedCount);
  }, []);

  const handleBack = () => {
    setScreen('home');
  };

  const handleAddTask = (newTask) => {
    const updatedTasks = [newTask, ...tasks]; // Add new task to the beginning
    setTasks(updatedTasks);
    // Save to localStorage
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setShowAddTaskModal(false);

    // Increment uncompleted tasks count
    const newUncompletedCount = uncompletedTasksCount + 1;
    setUncompletedTasksCount(newUncompletedCount);
    updateUncompletedTasksCount(newUncompletedCount);
  };

  const handleCloseModal = () => {
    setShowAddTaskModal(false);
  };

  const handleDeleteTask = (taskId) => {
    if (currentTask && currentTask?.id === taskId) {
      setCurrentTask(null);
    }

    const taskToDelete = tasks.find((task) => task.id === taskId);
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);

    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    // Decrement uncompleted tasks count if the deleted task was not completed
    if (taskToDelete && taskToDelete.status !== 'completed') {
      const newUncompletedCount = uncompletedTasksCount - 1;
      setUncompletedTasksCount(newUncompletedCount);
      updateUncompletedTasksCount(newUncompletedCount);
    }
  };

  // Filter tasks based on the current filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'not-started') return task.status === 'not-started';
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
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
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
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
        </motion.div>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          {['all', 'completed', 'not-started'].map((filterOption) => (
            <motion.div
              key={filterOption}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: filter === filterOption ? '#483776' : '#15093d',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '20px',
                margin: '0 5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
              onClick={() => setFilter(filterOption)}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </motion.div>
          ))}
        </div>
        <div style={{ maxHeight: '60vh', overflowY: 'auto', minHeight: '20vh' }}>
          <AnimatePresence>
            {filteredTasks.map((task, index) => (
              <motion.div
                layout
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  cursor: task.status !== 'completed' ? 'pointer' : 'default',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#15093d',
                  border: '0.1px solid #483776',
                  position: 'relative',
                }}
                onMouseEnter={() => setHoveredTaskId(task.id)}
                onMouseLeave={() => setHoveredTaskId(null)}
                onClick={() => {
                  if (task.status !== 'completed') {
                    setCurrentTask(task);
                    setScreen('home');
                  }
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
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <AnimatePresence>
                      {hoveredTaskId === task.id && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          style={{ marginRight: '10px', cursor: 'pointer' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task.id);
                          }}
                        >
                          <FaTrash style={{ color: '#ff6b6b', fontSize: '16px' }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {task.status === 'completed' ? (
                      <FaCheckCircle style={{ color: '#4CAF50' }} />
                    ) : (
                      <FaHourglassHalf style={{ color: '#FFC107' }} />
                    )}
                  </div>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <GoTag style={{ color: '#8c82c6', fontSize: '0.9rem', marginRight: '5px' }} />
                    <span style={{ color: '#8c82c6', fontSize: '0.9rem' }}>{task.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <LuUsers2
                      style={{ color: '#8c82c6', fontSize: '0.9rem', marginRight: '5px' }}
                    />
                    <span style={{ color: '#8c82c6', fontSize: '0.9rem' }}>
                      {secondsToTime(task.taskDuration)}
                    </span>
                  </div>
                  {task.date && (
                    <span style={{ color: '#8c82c6', fontSize: '0.9rem' }}>{task.date}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              color: '#8c82c6',
              fontSize: '1rem',
              textAlign: 'center',
              marginTop: '50px',
            }}
          >
            No tasks found.{' '}
            {filter === 'all'
              ? 'Click the plus icon to add a new task!'
              : 'Try changing the filter.'}
          </motion.div>
        )}
      </div>
      <div>
        <AnimatePresence>
          {showAddTaskModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ margin: '100px', padding: '20px' }}
            >
              <AddTaskModal onClose={handleCloseModal} onAddTask={handleAddTask} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
