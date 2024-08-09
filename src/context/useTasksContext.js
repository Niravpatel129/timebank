import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TasksContext = createContext();

export const useTasksContext = () => useContext(TasksContext);

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  console.log('🚀  tasks:', tasks);

  useEffect(() => {
    // Load tasks from local storage on component mount
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    // Save tasks to local storage whenever they change
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    const newTask = { ...task, id: uuidv4() };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const updateTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};
