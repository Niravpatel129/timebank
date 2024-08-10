import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import newRequest from '../api/newReqest';

const TasksContext = createContext();

export const useTasksContext = () => useContext(TasksContext);

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [dailyTimeSpent, setDailyTimeSpent] = useState({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await newRequest.get('/tasks');
        setTasks(response.data);
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
      const newTask = { ...task, _id: uuidv4(), timeSpent: 0 };
      const response = await newRequest.post('/tasks', newTask);
      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }, []);

  const updateTask = useCallback(async (updatedTask) => {
    try {
      const response = await newRequest.put(`/tasks/${updatedTask._id}`, updatedTask);
      console.log('🚀  response:', response);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task?._id === updatedTask._id ? response.data : task)),
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }, []);

  const deleteTask = useCallback(
    async (taskId) => {
      try {
        await newRequest.delete(`/tasks/${taskId}`);
        setTasks((prevTasks) => prevTasks.filter((task) => task?._id !== taskId));
        if (activeTaskId === taskId) {
          setActiveTaskId(null);
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    },
    [activeTaskId],
  );

  const editTask = useCallback(async (editedTask) => {
    try {
      const response = await newRequest.put(`/tasks/${editedTask._id}`, editedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task?._id === editedTask._id ? response : task)),
      );
      setTotalTimeSpent(response.totalTimeSpent);
      setDailyTimeSpent(response.dailyTimeSpent);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  }, []);

  const startTask = useCallback(async (taskId) => {
    if (!taskId) return;
    try {
      const response = await newRequest.post(`/tasks/${taskId}/start`);
      console.log('🚀  response 2:', response);
      setTasks((prevTasks) => prevTasks.map((task) => (task?._id === taskId ? response : task)));
      setActiveTaskId(taskId);
    } catch (error) {
      console.error('Error starting task:', error);
    }
  }, []);

  const pauseTask = useCallback(async (taskId) => {
    try {
      const response = await newRequest.post(`/tasks/${taskId}/pause`);
      console.log('🚀  response:', response);
      setTasks((prevTasks) => prevTasks.map((task) => (task?._id === taskId ? response : task)));
      setActiveTaskId(null);
      setTotalTimeSpent(response.totalTimeSpent);
      setDailyTimeSpent(response.dailyTimeSpent);
    } catch (error) {
      console.error('Error pausing task:', error);
    }
  }, []);

  const resumeTask = useCallback(async (taskId) => {
    try {
      const response = await newRequest.post(`/tasks/${taskId}/resume`);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task?._id === taskId ? response.data : task)),
      );
      setActiveTaskId(taskId);
    } catch (error) {
      console.error('Error resuming task:', error);
    }
  }, []);

  const finishTask = useCallback(async (taskId) => {
    try {
      const response = await newRequest.post(`/tasks/${taskId}/finish`);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task?._id === taskId ? response.data : task)),
      );
      setActiveTaskId(null);
      setTotalTimeSpent(response.totalTimeSpent);
      setDailyTimeSpent(response.dailyTimeSpent);
    } catch (error) {
      console.error('Error finishing task:', error);
    }
  }, []);

  const updateTaskStatus = useCallback(async (taskId, status) => {
    try {
      const response = await newRequest.patch(`/tasks/${taskId}/status`, { status });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task?._id === taskId ? response.data : task)),
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  }, []);

  const getRemainingTime = useCallback(
    (taskId) => {
      const task = tasks.find((t) => t._id === taskId);
      if (!task || !task.timerState.isActive) return task?.timerState.remainingTime || 0;

      const elapsed = Date.now() - new Date(task.timerState.startTime).getTime();
      return Math.max(0, task.timerState.remainingTime - elapsed);
    },
    [tasks],
  );

  const contextValue = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    startTask,
    pauseTask,
    resumeTask,
    finishTask,
    getRemainingTime,
    activeTaskId,
    totalTimeSpent,
    dailyTimeSpent,
    updateTaskStatus,
    setTasks,
    editTask,
  };

  return <TasksContext.Provider value={contextValue}>{children}</TasksContext.Provider>;
};

export default TasksProvider;
