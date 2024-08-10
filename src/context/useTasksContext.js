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
  const [totalTimeSpent, setTotalTimeSpent] = useLocalStorage('totalTimeSpent', 0);
  const [dailyTimeSpent, setDailyTimeSpent] = useLocalStorage('dailyTimeSpent', {});

  useEffect(() => {
    // Calculate initial totalTimeSpent when component mounts
    const initialTotalTimeSpent = tasks.reduce((total, task) => total + (task.timeSpent || 0), 0);
    setTotalTimeSpent(Math.floor(initialTotalTimeSpent / 1000)); // Convert milliseconds to seconds

    // Initialize daily time spent
    const today = new Date().toISOString().split('T')[0];
    if (!dailyTimeSpent[today]) {
      setDailyTimeSpent((prev) => ({ ...prev, [today]: 0 }));
    }
  }, []);

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
      const elapsedSeconds = Math.floor(elapsedTime / 1000);
      setTotalTimeSpent((prevTotal) => prevTotal + elapsedSeconds);
      const today = new Date().toISOString().split('T')[0];
      setDailyTimeSpent((prev) => ({
        ...prev,
        [today]: (prev[today] || 0) + elapsedSeconds,
      }));
    },
    [setTasks, setTimers, setTotalTimeSpent, setDailyTimeSpent],
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
      setTasks((prevTasks) => {
        const taskToDelete = prevTasks.find((task) => task.id === taskId);
        if (taskToDelete) {
          const timeSpentSeconds = Math.floor((taskToDelete.timeSpent || 0) / 1000);
          setTotalTimeSpent((prevTotal) => Math.max(0, prevTotal - timeSpentSeconds));
          const today = new Date().toISOString().split('T')[0];
          setDailyTimeSpent((prev) => ({
            ...prev,
            [today]: Math.max(0, (prev[today] || 0) - timeSpentSeconds),
          }));
        }
        return prevTasks.filter((task) => task.id !== taskId);
      });
      setTimers((prevTimers) => {
        const { [taskId]: deletedTimer, ...rest } = prevTimers;
        return rest;
      });
      if (activeTaskId === taskId) {
        setActiveTaskId(null);
      }
    },
    [setTasks, setTimers, activeTaskId, setTotalTimeSpent, setDailyTimeSpent],
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
      const elapsedSeconds = Math.floor(elapsedTime / 1000);
      setTotalTimeSpent((prevTotal) => prevTotal + elapsedSeconds);
      const today = new Date().toISOString().split('T')[0];
      setDailyTimeSpent((prev) => ({
        ...prev,
        [today]: (prev[today] || 0) + elapsedSeconds,
      }));
    },
    [setTasks, setTimers, activeTaskId, setTotalTimeSpent, setDailyTimeSpent],
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
        prevTasks.map((task) => {
          if (task.id === editedTask.id) {
            const timeDifference = (editedTask.timeSpent || 0) - (task.timeSpent || 0);
            const timeDifferenceSeconds = Math.floor(timeDifference / 1000);
            setTotalTimeSpent((prevTotal) => prevTotal + timeDifferenceSeconds);
            const today = new Date().toISOString().split('T')[0];
            setDailyTimeSpent((prev) => ({
              ...prev,
              [today]: (prev[today] || 0) + timeDifferenceSeconds,
            }));
            return { ...task, ...editedTask };
          }
          return task;
        }),
      );
    },
    [setTasks, setTotalTimeSpent, setDailyTimeSpent],
  );

  // Load data from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    const storedTimers = localStorage.getItem('timers');
    const storedTotalTimeSpent = localStorage.getItem('totalTimeSpent');
    const storedDailyTimeSpent = localStorage.getItem('dailyTimeSpent');
    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedTimers) setTimers(JSON.parse(storedTimers));
    if (storedTotalTimeSpent) setTotalTimeSpent(parseInt(JSON.parse(storedTotalTimeSpent), 10));
    if (storedDailyTimeSpent) setDailyTimeSpent(JSON.parse(storedDailyTimeSpent));
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
    editTask,
    totalTimeSpent,
    dailyTimeSpent,
  };

  return <TasksContext.Provider value={contextValue}>{children}</TasksContext.Provider>;
};

export default TasksProvider;
