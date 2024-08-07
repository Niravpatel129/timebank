import React, { createContext, useContext, useEffect, useState } from 'react';

const ScreenContext = createContext();

export const ScreenProvider = ({ children }) => {
  const [screen, setScreen] = useState('home');
  const [currentTask, setCurrentTask] = useState(() => {
    const savedTask = localStorage.getItem('currentTask');
    return savedTask ? JSON.parse(savedTask) : null;
  });
  const [isRunning, setIsRunning] = useState(false);
  const [taskHistory, setTaskHistory] = useState(() => {
    const savedHistory = localStorage.getItem('taskHistory');
    return savedHistory ? JSON.parse(savedHistory) : {};
  });

  useEffect(() => {
    let interval;
    if (isRunning && currentTask) {
      interval = setInterval(() => {
        setCurrentTask((prevTask) => {
          const updatedTask = prevTask.isCountingUp
            ? { ...prevTask, timeSpent: prevTask.timeSpent + 1 }
            : { ...prevTask, timeRemaining: Math.max(0, prevTask.timeRemaining - 1) };

          // Update task history
          setTaskHistory((prev) => ({
            ...prev,
            [prevTask.id]: {
              timeSpent: updatedTask.timeSpent,
              timeRemaining: updatedTask.timeRemaining,
              isCountingUp: updatedTask.isCountingUp,
            },
          }));

          if (updatedTask.timeRemaining === 0 && !updatedTask.isCountingUp) {
            setIsRunning(false);
          }

          return updatedTask;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (currentTask) {
      localStorage.setItem('currentTask', JSON.stringify(currentTask));
    } else {
      localStorage.removeItem('currentTask');
    }
  }, [currentTask]);

  useEffect(() => {
    localStorage.setItem('taskHistory', JSON.stringify(taskHistory));
  }, [taskHistory]);

  const startTimer = () => {
    if (currentTask) {
      setIsRunning(true);
    }
  };

  const stopTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    if (currentTask) {
      const resetTask = {
        ...currentTask,
        timeSpent: 0,
        timeRemaining: currentTask.originalDuration,
      };
      setCurrentTask(resetTask);
      setTaskHistory((prev) => ({
        ...prev,
        [currentTask.id]: {
          timeSpent: 0,
          timeRemaining: currentTask.originalDuration,
          isCountingUp: currentTask.isCountingUp,
        },
      }));
    }
  };

  const updateCurrentTask = (newTask) => {
    if (isRunning) {
      stopTimer();
    }

    let updatedTask;
    if (taskHistory[newTask.id]) {
      // If the task exists in history, use those values
      const historyData = taskHistory[newTask.id];
      updatedTask = {
        ...newTask,
        originalDuration: newTask.taskDuration || 0,
        timeRemaining: historyData.timeRemaining,
        timeSpent: historyData.timeSpent,
        isCountingUp: historyData.isCountingUp,
      };
    } else {
      // If it's a new task, set up new time values
      const taskDuration = newTask.taskDuration || 0;
      updatedTask = {
        ...newTask,
        originalDuration: taskDuration,
        timeRemaining: taskDuration,
        timeSpent: 0,
        isCountingUp: !taskDuration,
      };
    }

    setCurrentTask(updatedTask);
  };

  const finishCurrentTask = () => {
    if (currentTask) {
      stopTimer();
      const finishedTask = {
        ...currentTask,
        finishedAt: new Date().toISOString(),
        hours: String(Math.floor(currentTask.timeSpent / 3600)).padStart(2, '0'),
        minutes: String(Math.floor((currentTask.timeSpent % 3600) / 60)).padStart(2, '0'),
        seconds: String(currentTask.timeSpent % 60).padStart(2, '0'),
      };
      const finishedTasks = JSON.parse(localStorage.getItem('finishedTasks') || '[]');
      finishedTasks.push(finishedTask);
      localStorage.setItem('finishedTasks', JSON.stringify(finishedTasks));

      // Remove the task from history
      setTaskHistory((prev) => {
        const { [currentTask.id]: _, ...rest } = prev;
        return rest;
      });

      setCurrentTask(null);
    }
  };

  const getDisplayTime = () => {
    if (!currentTask) return 0;
    return currentTask.isCountingUp ? currentTask.timeSpent : currentTask.timeRemaining;
  };

  return (
    <ScreenContext.Provider
      value={{
        screen,
        setScreen,
        currentTask,
        setCurrentTask: updateCurrentTask,
        finishCurrentTask,
        isRunning,
        startTimer,
        stopTimer,
        resetTimer,
        getDisplayTime,
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
