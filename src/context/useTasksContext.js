import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import newRequest from '../api/newReqest';
import { useProjectContext } from './useProjectContext';

const TasksContext = createContext();

export const useTasksContext = () => useContext(TasksContext);

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const { selectedProject, projects } = useProjectContext();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (!selectedProject) return;

        const response = await newRequest.get(`/tasks/${selectedProject?._id}`);
        setTasks(response.tasks);
        setTotalTimeSpent(response.totalTimeSpent);

        // if any task is active, set it as active
        const activeTask = response.tasks.find((task) => task.timerState.isActive);
        if (activeTask) {
          setActiveTaskId(activeTask._id);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchInitialData();
  }, [projects, selectedProject]);

  const addTask = useCallback(async (task) => {
    try {
      const newTask = { ...task, _id: uuidv4(), timeSpent: 0 };
      const response = await newRequest.post('/tasks', newTask);
      setTasks((prevTasks) => [...prevTasks, response.task]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }, []);

  const updateTask = useCallback(async (updatedTask) => {
    try {
      const response = await newRequest.put(`/tasks/${updatedTask._id}`, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task?._id === updatedTask._id ? response : task)),
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }, []);

  const updateTaskAssignee = useCallback(async (taskId, assignee) => {
    try {
      const response = await newRequest.patch(`/tasks/${taskId}/assignee`, { assignee });
      // update the task in the state
      setTasks((prevTasks) => prevTasks.map((task) => (task?._id === taskId ? response : task)));
    } catch (error) {
      console.error('Error updating task assignee:', error);
      toast.error('Error updating task assignee:', error);
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
    } catch (error) {
      console.error('Error editing task:', error);
    }
  }, []);

  const startTask = useCallback(async (taskId) => {
    if (!taskId) return;

    try {
      const response = await newRequest.post(`/tasks/${taskId}/start`);

      setTasks((prevTasks) => prevTasks.map((task) => (task?._id === taskId ? response : task)));
      setActiveTaskId(taskId);
    } catch (error) {
      console.error('Error starting task:', error);
    }
  }, []);

  const pauseTask = useCallback(async (taskId, remainingTime) => {
    try {
      const response = await newRequest.post(`/tasks/${taskId}/pause`, {
        remainingTime,
      });
      setTasks((prevTasks) => prevTasks.map((task) => (task?._id === taskId ? response : task)));
      // setActiveTaskId(null);
    } catch (error) {
      console.error('Error pausing task:', error);
    }
  }, []);

  const resumeTask = useCallback(async (taskId) => {
    try {
      const response = await newRequest.post(`/tasks/${taskId}/resume`);
      setTasks((prevTasks) => prevTasks.map((task) => (task?._id === taskId ? response : task)));
      setActiveTaskId(taskId);
    } catch (error) {
      console.error('Error resuming task:', error);
    }
  }, []);

  const finishTask = useCallback(async (taskId) => {
    return;
    try {
      const response = await newRequest.post(`/tasks/${taskId}/finish`);
      setTasks((prevTasks) => prevTasks.map((task) => (task?._id === taskId ? response : task)));
      setActiveTaskId(null);
    } catch (error) {
      console.error('Error finishing task:', error);
    }
  }, []);

  const updateTaskStatus = useCallback(async (taskId, status) => {
    try {
      const response = await newRequest.patch(`/tasks/${taskId}/status`, { status });
      // find the task in the state and update it with status, dont use response.task
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task?._id === taskId ? { ...task, status } : task)),
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
    updateTaskStatus,
    setTasks,
    editTask,
    updateTaskAssignee,
  };

  return <TasksContext.Provider value={contextValue}>{children}</TasksContext.Provider>;
};

export default TasksProvider;
