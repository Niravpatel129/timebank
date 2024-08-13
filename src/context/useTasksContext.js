import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import newRequest from '../api/newReqest';
import { useHistoryContext } from './useHistoryContext';
import { useProjectContext } from './useProjectContext';
const { ipcRenderer } = window.require('electron');

const TasksContext = createContext();

export const useTasksContext = () => useContext(TasksContext);

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedProject, projects } = useProjectContext();
  const { addHistoryEntry } = useHistoryContext();

  useEffect(() => {
    if (!tasks.length || !activeTaskId) return;
    const activeTask = tasks.find((task) => task?._id === activeTaskId);

    if (!activeTask) return;

    ipcRenderer.send('set-current-task', activeTask);
  }, [activeTaskId, tasks]);

  useEffect(() => {
    // listen for start, pause
    ipcRenderer.on('start-active-task', (event, task) => {
      startTask(task._id);
    });

    ipcRenderer.on('pause-active-task', (event, task) => {
      console.log('hey we got pause task request');
      if (!task) return;

      // get timeRemainging from task.timerState.startTime and now date

      pauseTask(task._id, task.time);
    });

    return () => {
      ipcRenderer.removeAllListeners('start-active-task');
      ipcRenderer.removeAllListeners('pause-active-task');
    };
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        if (!selectedProject) {
          setTasks([]);
          setTotalTimeSpent(0);
          // setActiveTaskId(null);
          return;
        }

        const response = await newRequest.get(`/tasks/${selectedProject?._id}`);
        setTasks(response.tasks);
        setTotalTimeSpent(response.totalTimeSpent);

        // Pause all active tasks on initial render
        const activeTasks = response.tasks.filter((task) => task.timerState.isActive);
        for (const task of activeTasks) {
          await pauseTask(task._id, task.timerState.remainingTime);
        }

        // setActiveTaskId(null);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('Failed to load tasks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [projects, selectedProject]);

  const addTask = useCallback(
    async (task) => {
      try {
        const newTask = { ...task, _id: uuidv4(), timeSpent: 0 };
        const response = await newRequest.post('/tasks', newTask);
        setTasks((prevTasks) => [...prevTasks, response.task]);

        // add history entry
        if (!selectedProject._id) return;

        addHistoryEntry({
          entityType: 'task',
          entityId: response.task._id,
          entityName: response.task.name || 'New Task',
          action: 'add',
          projectId: selectedProject._id,
          details: {
            name: response.task.name,
            status: response.task.status,
            taskDuration: response.task.taskDuration,
            hours: response.task.hours,
            category: response.task.category,
            dateDue: response.task.dateDue,
            dateCreated: response.task.dateCreated,
            assignee: response.task.assignee,
            assigneeDetails: response.task.assigneeDetails,
            project: response.task.project,
          },
        });
      } catch (error) {
        console.error('Error adding task:', error);
        toast.error('Failed to add task. Please try again.');
      }
    },
    [addHistoryEntry, selectedProject],
  );

  const updateTask = useCallback(async (updatedTask) => {
    try {
      const response = await newRequest.put(`/tasks/${updatedTask._id}`, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task?._id === updatedTask._id ? response : task)),
      );
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task. Please try again.');
    }
  }, []);

  const updateTaskAssignee = useCallback(async (taskId, assignee) => {
    try {
      const response = await newRequest.patch(`/tasks/${taskId}/assignee`, { assignee });
      // update the task in the state
      setTasks((prevTasks) => prevTasks.map((task) => (task?._id === taskId ? response : task)));
    } catch (error) {
      console.error('Error updating task assignee:', error);
      toast.error('Error updating task assignee. Please try again.');
    }
  }, []);

  const deleteTask = useCallback(
    async (taskId) => {
      try {
        await newRequest.delete(`/tasks/${taskId}`);
        setTasks((prevTasks) => prevTasks.filter((task) => task?._id !== taskId));
        if (activeTaskId === taskId) {
          // setActiveTaskId(null);
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task. Please try again.');
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
      toast.error('Failed to edit task. Please try again.');
    }
  }, []);

  const startTask = useCallback(
    async (taskId) => {
      if (!taskId) return;
      // toast error if another task is active
      if (tasks.some((task) => task.timerState.isActive)) {
        toast.error('Another task timer is active, please pause it before starting another one.');
        return;
      }

      try {
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            if (task?._id === taskId) {
              return {
                ...task,
                timerState: {
                  ...task.timerState,
                  isActive: true,
                  startTime: new Date(),
                  remainingTime:
                    task.timerState.remainingTime === 0
                      ? task.taskDuration * 60 * 1000 + 1
                      : task.timerState.remainingTime,
                },
                status: 'in-progress',
              };
            }
            return task;
          }),
        );
        setActiveTaskId(taskId);

        await newRequest.post(`/tasks/${taskId}/start`);

        const activeTask = tasks.find((task) => task?._id === taskId);
        ipcRenderer.send('set-current-task', activeTask);
      } catch (error) {
        console.error('Error starting task:', error);
        toast.error('Failed to start task. Please try again.');
      }
    },
    [tasks],
  );

  const pauseTask = useCallback(async (taskId, remainingTime) => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task?._id === taskId) {
            return {
              ...task,
              timerState: {
                ...task.timerState,
                remainingTime,
                isActive: false,
              },
              status: 'paused',
            };
          }
          return task;
        }),
      );
      // setActiveTaskId(null);
      await newRequest.post(`/tasks/${taskId}/pause`, {
        remainingTime,
      });
    } catch (error) {
      console.error('Error pausing task:', error);
      toast.error('Failed to pause task. Please try again.');
    }
  }, []);

  const resumeTask = useCallback(async (taskId) => {
    try {
      const response = await newRequest.post(`/tasks/${taskId}/resume`);
      setTasks((prevTasks) => prevTasks.map((task) => (task?._id === taskId ? response : task)));
      setActiveTaskId(taskId);
    } catch (error) {
      console.error('Error resuming task:', error);
      toast.error('Failed to resume task. Please try again.');
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
      toast.error('Failed to finish task. Please try again.');
    }
  }, []);

  const updateTaskStatus = useCallback(async (taskId, status) => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task?._id === taskId ? { ...task, status } : task)),
      );
      const response = await newRequest.patch(`/tasks/${taskId}/status`, { status });
      // find the task in the state and update it with status, dont use response.task
      // setTasks((prevTasks) =>
      //   prevTasks.map((task) => (task?._id === taskId ? { ...task, status } : task)),
      // );
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status. Please try again.');
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
    isLoading,
  };

  return <TasksContext.Provider value={contextValue}>{children}</TasksContext.Provider>;
};

export default TasksProvider;
