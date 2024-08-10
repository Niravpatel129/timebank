import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import newRequest from '../api/newReqest';

const TasksContext = createContext();

export const useTasksContext = () => useContext(TasksContext);

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [timers, setTimers] = useState({});
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [dailyTimeSpent, setDailyTimeSpent] = useState({});

  useEffect(() => {
    // Fetch initial data from the API
    const fetchInitialData = async () => {
      try {
        const response = await newRequest.get('/tasks');
        setTasks(response.data);
        setTimers(response.timers);
        setTotalTimeSpent(response.totalTimeSpent);
        setDailyTimeSpent(response.dailyTimeSpent);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchInitialData();
  }, []);

  const addTask = useCallback(async (task) => {
    try {
      const newTask = { ...task, id: uuidv4(), timeSpent: 0 };
      const response = await newRequest.post('/tasks', newTask);
      console.log('🚀  response:', response);
      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }, []);

  const pauseTask = useCallback(async (taskId) => {
    try {
      const response = await newRequest.post(`/tasks/${taskId}/pause`);
      setTasks(response.tasks);
      setTimers(response.timers);
      setActiveTaskId(null);
      setTotalTimeSpent(response.totalTimeSpent);
      setDailyTimeSpent(response.dailyTimeSpent);
    } catch (error) {
      console.error('Error pausing task:', error);
    }
  }, []);

  const updateTask = useCallback(async (updatedTask) => {
    try {
      const response = await newRequest.put(`/tasks/${updatedTask.id}`, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? response : task)),
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }, []);

  const updateTaskStatus = useCallback(async (taskId, status) => {
    try {
      const response = await newRequest.patch(`/tasks/${taskId}/status`, { status });
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? response : task)));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  }, []);

  const deleteTask = useCallback(
    async (taskId) => {
      try {
        await newRequest.delete(`/tasks/${taskId}`);
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        setTimers((prevTimers) => {
          const { [taskId]: deletedTimer, ...rest } = prevTimers;
          return rest;
        });
        if (activeTaskId === taskId) {
          setActiveTaskId(null);
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    },
    [activeTaskId],
  );

  const startTask = useCallback(async (taskId) => {
    try {
      const response = await newRequest.post(`/tasks/${taskId}/start`);
      setTasks(response.tasks);
      setTimers(response.timers);
      setActiveTaskId(taskId);
    } catch (error) {
      console.error('Error starting task:', error);
    }
  }, []);

  const finishTask = useCallback(async (taskId) => {
    try {
      const response = await newRequest.post(`/tasks/${taskId}/finish`);
      setTasks(response.tasks);
      setTimers(response.timers);
      setActiveTaskId(null);
      setTotalTimeSpent(response.totalTimeSpent);
      setDailyTimeSpent(response.dailyTimeSpent);
    } catch (error) {
      console.error('Error finishing task:', error);
    }
  }, []);

  const getRemainingTime = useCallback(
    (taskId) => {
      const timer = timers[taskId];
      if (!timer) return 0;

      const elapsed = timer.startTime ? Date.now() - timer.startTime : 0;
      return Math.max(0, timer.remainingTime - elapsed);
    },
    [timers],
  );

  const editTask = useCallback(async (editedTask) => {
    try {
      const response = await newRequest.put(`/tasks/${editedTask.id}`, editedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === editedTask.id ? response : task)),
      );
      setTotalTimeSpent(response.totalTimeSpent);
      setDailyTimeSpent(response.dailyTimeSpent);
    } catch (error) {
      console.error('Error editing task:', error);
    }
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
    updateTaskStatus,
  };

  return <TasksContext.Provider value={contextValue}>{children}</TasksContext.Provider>;
};

export default TasksProvider;
