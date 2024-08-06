import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTimerContext } from './useTimerContext';

const ScreenContext = createContext();

export const ScreenProvider = ({ children }) => {
  const [screen, setScreen] = useState('home');
  const [currentTask, setCurrentTask] = useState(() => {
    const savedTask = localStorage.getItem('currentTask');
    return savedTask ? JSON.parse(savedTask) : null;
  });
  const { startTimer, stopTimer, resetTimer, time, setTime } = useTimerContext();

  useEffect(() => {
    localStorage.setItem('currentTask', JSON.stringify(currentTask));
  }, [currentTask]);

  useEffect(() => {
    if (currentTask && currentTask.timeSpent) {
      setTime(currentTask.timeSpent);
    }
  }, [currentTask, setTime]);

  const updateCurrentTask = (newTask) => {
    if (currentTask) {
      stopTimer();
    }
    setCurrentTask(newTask);
    localStorage.setItem('currentTask', JSON.stringify(newTask));
    if (newTask) {
      resetTimer();
      setTime(newTask.timeSpent || 0);
      startTimer();
    }
  };

  const finishCurrentTask = () => {
    if (currentTask) {
      stopTimer();
      const finishedTask = {
        ...currentTask,
        finishedAt: new Date().toISOString(),
        timeSpent: time,
        hours: String(Math.floor(time / 3600)).padStart(2, '0'),
        minutes: String(Math.floor((time % 3600) / 60)).padStart(2, '0'),
        seconds: String(time % 60).padStart(2, '0'),
      };
      // Save finished task to localStorage or send to a backend API
      const finishedTasks = JSON.parse(localStorage.getItem('finishedTasks') || '[]');
      finishedTasks.push(finishedTask);
      localStorage.setItem('finishedTasks', JSON.stringify(finishedTasks));

      setCurrentTask(null);
      localStorage.removeItem('currentTask');
      resetTimer(0);
    }
  };

  return (
    <ScreenContext.Provider
      value={{
        screen,
        setScreen,
        currentTask,
        setCurrentTask: updateCurrentTask,
        finishCurrentTask,
      }}
    >
      {children}
    </ScreenContext.Provider>
  );
};

export const useScreenContext = () => {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error('useScreenContext must be used within a ScreenProvider');
  }
  return context;
};
