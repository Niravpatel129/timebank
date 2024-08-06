import React, { createContext, useContext, useEffect, useState } from 'react';

const ScreenContext = createContext();

export const ScreenProvider = ({ children }) => {
  const [screen, setScreen] = useState('home');
  const [currentTask, setCurrentTask] = useState(() => {
    const savedTask = localStorage.getItem('currentTask');
    return savedTask ? JSON.parse(savedTask) : null;
  });

  useEffect(() => {
    localStorage.setItem('currentTask', JSON.stringify(currentTask));
  }, [currentTask]);

  const updateCurrentTask = (newTask) => {
    setCurrentTask(newTask);
    localStorage.setItem('currentTask', JSON.stringify(newTask));
  };

  return (
    <ScreenContext.Provider
      value={{ screen, setScreen, currentTask, setCurrentTask: updateCurrentTask }}
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
