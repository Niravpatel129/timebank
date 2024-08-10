import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TasksContext = createContext();

export const useTasksContext = () => useContext(TasksContext);

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [timers, setTimers] = useState(() => {
    const storedTimers = localStorage.getItem('timers');
    return storedTimers ? JSON.parse(storedTimers) : {};
  });

  const [activeTaskId, setActiveTaskId] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('timers', JSON.stringify(timers));
  }, [timers]);

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
    setTimers((prevTimers) => {
      const { [taskId]: deletedTimer, ...rest } = prevTimers;
      return rest;
    });
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
    }
  };

  const startTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Pause the currently active task if there is one
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
        remainingTime: prevTimers[taskId]?.remainingTime || task.taskDuration * 1000,
      },
    }));
    setActiveTaskId(taskId);
  };

  const pauseTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, status: 'paused' } : task)),
    );
    setTimers((prevTimers) => ({
      ...prevTimers,
      [taskId]: {
        ...prevTimers[taskId],
        remainingTime: getRemainingTime(taskId),
        startTime: null,
      },
    }));
    setActiveTaskId(null);
  };

  const finishTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, status: 'completed' } : task)),
    );
    setTimers((prevTimers) => {
      const { [taskId]: finishedTimer, ...rest } = prevTimers;
      return rest;
    });
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
    }
  };

  const getRemainingTime = (taskId) => {
    const timer = timers[taskId];
    if (!timer) return 0;

    const elapsed = timer.startTime ? Date.now() - timer.startTime : 0;
    return Math.max(0, timer.remainingTime - elapsed);
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        startTask,
        pauseTask,
        finishTask,
        getRemainingTime,
        activeTaskId,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export default TasksProvider;
