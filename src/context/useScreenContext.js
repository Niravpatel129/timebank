import React, { createContext, useContext, useState } from 'react';

const ScreenContext = createContext();

export const ScreenProvider = ({ children }) => {
  const [screen, setScreen] = useState('home');
  const [currentTask, setCurrentTask] = useState(null);

  return (
    <ScreenContext.Provider value={{ screen, setScreen, currentTask, setCurrentTask }}>
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
