import React, { createContext, useContext, useEffect, useState } from 'react';

const ScreenContext = createContext();

const defaultTasks = [
  {
    id: '1',
    name: 'Morning check-in',
    taskDuration: 900, // 15 minutes
    originalDuration: 900,
    timeRemaining: 900,
    timeSpent: 0,
    isCountingUp: false,
    status: 'not-started',
    category: 'Meetings',
    date: '2023-05-15',
  },
  {
    id: '2',
    name: 'Code review',
    taskDuration: 3600, // 1 hour
    originalDuration: 3600,
    timeRemaining: 3600,
    timeSpent: 0,
    isCountingUp: false,
    status: 'not-started',
    category: 'Development',
    date: '2023-05-15',
  },
];

export const ScreenProvider = ({ children }) => {
  const [screen, setScreen] = useState('home');
  const [currentTask, setCurrentTask] = useState(() => {
    const savedTask = localStorage.getItem('currentTask');
    return savedTask ? JSON.parse(savedTask) : null;
  });
  const [finishedTasks, setFinishedTasks] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [taskHistory, setTaskHistory] = useState(() => {
    const savedHistory = localStorage.getItem('taskHistory');
    return savedHistory ? JSON.parse(savedHistory) : {};
  });

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem('finishedTasks') || '[]');
    setFinishedTasks(tasks);
  }, []);

  useEffect(() => {
    if (Object.keys(taskHistory).length === 0) {
      const initialTaskHistory = {};
      defaultTasks.forEach((task) => {
        initialTaskHistory[task.id] = {
          timeSpent: task.timeSpent,
          timeRemaining: task.timeRemaining,
          isCountingUp: task.isCountingUp,
          status: task.status,
        };
      });
      setTaskHistory(initialTaskHistory);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning && currentTask) {
      interval = setInterval(() => {
        setCurrentTask((prevTask) => {
          const updatedTask = prevTask.isCountingUp
            ? { ...prevTask, timeSpent: prevTask.timeSpent + 1, status: 'in-progress' }
            : {
                ...prevTask,
                timeRemaining: Math.max(0, prevTask.timeRemaining - 1),
                status: 'in-progress',
              };

          // Update task history
          setTaskHistory((prev) => ({
            ...prev,
            [prevTask.id]: {
              timeSpent: updatedTask.timeSpent,
              timeRemaining: updatedTask.timeRemaining,
              isCountingUp: updatedTask.isCountingUp,
              status: updatedTask.status,
            },
          }));

          if (updatedTask.timeRemaining === 0 && !updatedTask.isCountingUp) {
            setIsRunning(false);
            updatedTask.status = 'completed';
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
      setCurrentTask((prevTask) => ({ ...prevTask, status: 'in-progress' }));
    }
  };

  const deleteTask = (taskId) => {
    const updatedTasks = finishedTasks.filter((task) => task.id !== taskId);
    setFinishedTasks(updatedTasks);
    localStorage.setItem('finishedTasks', JSON.stringify(updatedTasks));
  };

  const stopTimer = () => {
    setIsRunning(false);
    setCurrentTask((prevTask) => ({ ...prevTask, status: 'paused' }));
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (currentTask) {
      const resetTask = {
        ...currentTask,
        timeSpent: 0,
        timeRemaining: currentTask.originalDuration,
        status: 'not-started',
      };
      setCurrentTask(resetTask);
      setTaskHistory((prev) => ({
        ...prev,
        [currentTask.id]: {
          timeSpent: 0,
          timeRemaining: currentTask.originalDuration,
          isCountingUp: currentTask.isCountingUp,
          status: 'not-started',
        },
      }));
    }
  };

  const updateCurrentTask = (newTask) => {
    if (isRunning) {
      stopTimer();
    }
    if (!newTask) {
      setCurrentTask(null);
      return;
    }

    let updatedTask;
    if (taskHistory[newTask.id]) {
      // If the task exists in history, use those values
      const historyData = taskHistory[newTask.id];
      updatedTask = {
        ...newTask,
        originalDuration: newTask?.taskDuration || 0,
        timeRemaining: historyData.timeRemaining,
        timeSpent: historyData.timeSpent,
        isCountingUp: historyData.isCountingUp,
        status: historyData.status,
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
        status: 'not-started',
      };
    }

    setCurrentTask(updatedTask);
  };

  const finishCurrentTask = () => {
    if (currentTask) {
      stopTimer();
      const completedAt = new Date().toISOString();
      const finishedTask = {
        ...currentTask,
        completedAt,
        finishedAt: completedAt,
        hours: String(Math.floor(currentTask.timeSpent / 3600)).padStart(2, '0'),
        minutes: String(Math.floor((currentTask.timeSpent % 3600) / 60)).padStart(2, '0'),
        seconds: String(currentTask.timeSpent % 60).padStart(2, '0'),
        status: 'completed',
      };
      const finishedTasks = JSON.parse(localStorage.getItem('finishedTasks') || '[]');
      finishedTasks.push(finishedTask);
      localStorage.setItem('finishedTasks', JSON.stringify(finishedTasks));

      setTaskHistory((prev) => {
        const { [currentTask?.id]: _, ...rest } = prev;
        return rest;
      });

      setCurrentTask(null);

      // update finishedTasks
      setFinishedTasks((prev) => [...prev, finishedTask]);

      // update tasks
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const updatedTasks = tasks.map((task) => {
        if (task.id === finishedTask.id) {
          return finishedTask;
        }
        return task;
      });

      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
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
        deleteTask,
        finishedTasks,
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
