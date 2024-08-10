import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TasksContext = createContext();

export const useTasksContext = () => useContext(TasksContext);

// Custom hook to handle localStorage
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [timers, setTimers] = useLocalStorage('timers', {});
  const [activeTaskId, setActiveTaskId] = useState(null);

  const addTask = useCallback(
    (task) => {
      const newTask = { ...task, id: uuidv4(), timeSpent: 0 };
      setTasks((prevTasks) => [...prevTasks, newTask]);
    },
    [setTasks],
  );

  const pauseTask = useCallback(
    (taskId) => {
      const elapsedTime = Date.now() - timers[taskId].startTime;
      const remainingTime = Math.max(0, timers[taskId].remainingTime - elapsedTime);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: 'paused',
                timeSpent: (task.timeSpent || 0) + elapsedTime,
                taskDuration: Math.max(0, remainingTime / 1000),
              }
            : task,
        ),
      );
      setTimers((prevTimers) => ({
        ...prevTimers,
        [taskId]: {
          ...prevTimers[taskId],
          remainingTime: remainingTime,
          startTime: null,
        },
      }));
      setActiveTaskId(null);
    },
    [setTasks, setTimers],
  );

  const updateTask = useCallback(
    (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
      );
    },
    [setTasks],
  );

  const deleteTask = useCallback(
    (taskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setTimers((prevTimers) => {
        const { [taskId]: deletedTimer, ...rest } = prevTimers;
        return rest;
      });
      if (activeTaskId === taskId) {
        setActiveTaskId(null);
      }
    },
    [setTasks, setTimers, activeTaskId],
  );

  const startTask = useCallback(
    (taskId) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      if (activeTaskId && activeTaskId !== taskId) {
        pauseTask(activeTaskId);
      }

      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === taskId ? { ...t, status: 'inProgress' } : t)),
      );
      setTimers((prevTimers) => ({
        ...prevTimers,
        [taskId]: {
          startTime: Date.now(),
          remainingTime: task.taskDuration * 1000, // Reset to full duration when starting
        },
      }));
      setActiveTaskId(taskId);
    },
    [tasks, activeTaskId, setTasks, setTimers, pauseTask],
  );

  const finishTask = useCallback(
    (taskId) => {
      const elapsedTime = timers[taskId]?.startTime ? Date.now() - timers[taskId].startTime : 0;
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: 'completed',
                timeSpent: (task.timeSpent || 0) + elapsedTime,
                taskDuration: 0,
              }
            : task,
        ),
      );
      setTimers((prevTimers) => {
        const { [taskId]: finishedTimer, ...rest } = prevTimers;
        return rest;
      });
      if (activeTaskId === taskId) {
        setActiveTaskId(null);
      }
    },
    [setTasks, setTimers, activeTaskId],
  );

  const getRemainingTime = useCallback(
    (taskId) => {
      const timer = timers[taskId];
      if (!timer) return 0;

      const elapsed = timer.startTime ? Date.now() - timer.startTime : 0;
      return Math.max(0, timer.remainingTime - elapsed);
    },
    [timers],
  );

  // New function to edit a task
  const editTask = useCallback(
    (editedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === editedTask.id ? { ...task, ...editedTask } : task)),
      );
    },
    [setTasks],
  );

  // Load data from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    const storedTimers = localStorage.getItem('timers');
    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedTimers) setTimers(JSON.parse(storedTimers));
  }, []);

  const contextValue = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    startTask,
    pauseTask,
    finishTask,
    getRemainingTime,
    activeTaskId,
    editTask, // Add the new editTask function to the context
  };

  return <TasksContext.Provider value={contextValue}>{children}</TasksContext.Provider>;
};

export default TasksProvider;
