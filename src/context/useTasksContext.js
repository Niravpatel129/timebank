import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { v4 as uuidv4 } from 'uuid';
import newRequest from '../api/newReqest';
import { useHistoryContext } from './useHistoryContext';
import { useProjectContext } from './useProjectContext';
const { ipcRenderer } = window.require('electron');

const TasksContext = createContext();

export const useTasksContext = () => useContext(TasksContext);

export const TasksProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { selectedProject, projects } = useProjectContext();
  const { addHistoryEntry } = useHistoryContext();
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [taskOrders, setTaskOrders] = useState({});

  const { data: tasksData, isLoading } = useQuery(
    ['tasks', selectedProject?._id],
    () => newRequest.get(`/tasks/${selectedProject?._id}`),
    {
      enabled: !!selectedProject,
      onError: (error) => {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to load tasks. Please try again.');
      },
    },
  );

  const tasks = tasksData?.tasks || [];
  const totalTimeSpent = tasksData?.totalTimeSpent || 0;

  const getTaskOrder = useCallback(
    (listType) => {
      return taskOrders[listType] || [];
    },
    [taskOrders],
  );

  const setTaskOrder = useCallback((listType, order) => {
    setTaskOrders((prev) => ({ ...prev, [listType]: order }));
  }, []);

  useEffect(() => {
    if (!tasks.length || !activeTaskId) return;
    const activeTask = tasks.find((task) => task?._id === activeTaskId);
    if (!activeTask) return;
    ipcRenderer.send('set-current-task', activeTask);
  }, [activeTaskId, tasks]);

  useEffect(() => {
    ipcRenderer.on('start-active-task', (event, task) => {
      startTask(task._id);
    });

    ipcRenderer.on('pause-active-task', (event, task) => {
      if (!task) return;
      pauseTask(task._id, task.time);
    });

    return () => {
      ipcRenderer.removeAllListeners('start-active-task');
      ipcRenderer.removeAllListeners('pause-active-task');
    };
  }, []);

  const moveTaskMutation = useMutation(
    ({ taskId, targetList }) => newRequest.patch(`/tasks/${taskId}/move`, { listType: targetList }),
    {
      onMutate: ({ taskId, targetList, newIndex }) => {
        // Optimistic update
        queryClient.setQueryData(['tasks', selectedProject?._id], (oldData) => {
          const updatedTasks = oldData.tasks.map((task) =>
            task._id === taskId ? { ...task, listType: targetList } : task,
          );

          // Update the order
          const listTasks = updatedTasks.filter((t) => t.listType === targetList);
          const newOrder = getTaskOrder(targetList).filter((id) => id !== taskId);
          newOrder.splice(newIndex, 0, taskId);
          setTaskOrder(targetList, newOrder);

          return { ...oldData, tasks: updatedTasks };
        });
      },
      onError: (error, { taskId, targetList }, context) => {
        console.error('Error moving task:', error);
        // Revert the optimistic update on error
        queryClient.invalidateQueries(['tasks', selectedProject?._id]);
      },
      onSettled: () => {
        // Refetch to ensure server-client consistency
        queryClient.invalidateQueries(['tasks', selectedProject?._id]);
      },
    },
  );

  const addTaskMutation = useMutation((newTask) => newRequest.post('/tasks', newTask), {
    onSuccess: (response) => {
      queryClient.setQueryData(['tasks', selectedProject?._id], (oldData) => ({
        ...oldData,
        tasks: [...(oldData?.tasks || []), response.task],
      }));
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
    },
    onError: (error) => {
      console.error('Error adding task:', error);
      toast.error('Failed to add task. Please try again.');
    },
  });

  const updateTaskMutation = useMutation(
    (updatedTask) => newRequest.put(`/tasks/${updatedTask._id}`, updatedTask),
    {
      onMutate: (updatedTask) => {
        queryClient.setQueryData(['tasks', selectedProject?._id], (oldData) => {
          console.log('🚀  oldData updatedTask:', oldData, updatedTask);
          return {
            ...oldData,
            tasks: oldData.tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)),
          };
        });
      },
      onError: (error) => {
        console.error('Error updating task:', error);
        toast.error('Failed to update task on the server. Please try again.');
        queryClient.invalidateQueries(['tasks', selectedProject?._id]);
      },
    },
  );

  const deleteTaskMutation = useMutation((taskId) => newRequest.delete(`/tasks/${taskId}`), {
    onSuccess: (_, taskId) => {
      queryClient.setQueryData(['tasks', selectedProject?._id], (oldData) => ({
        ...oldData,
        tasks: oldData.tasks.filter((task) => task._id !== taskId),
      }));
      if (activeTaskId === taskId) {
        setActiveTaskId(null);
      }
    },
    onError: (error) => {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task. Please try again.');
    },
  });

  const startTaskMutation = useMutation((taskId) => newRequest.post(`/tasks/${taskId}/start`), {
    onMutate: (taskId) => {
      queryClient.setQueryData(['tasks', selectedProject?._id], (oldData) => ({
        ...oldData,
        tasks: oldData.tasks.map((task) =>
          task._id === taskId
            ? {
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
              }
            : task,
        ),
      }));
      setActiveTaskId(taskId);
      const activeTask = tasks.find((task) => task._id === taskId);
      ipcRenderer.send('set-current-task', activeTask);
    },
    onError: (error) => {
      console.error('Error starting task:', error);
      toast.error('Failed to start task. Please try again.');
      queryClient.invalidateQueries(['tasks', selectedProject?._id]);
    },
  });

  const pauseTaskMutation = useMutation(
    ({ taskId, remainingTime }) => newRequest.post(`/tasks/${taskId}/pause`, { remainingTime }),
    {
      onMutate: ({ taskId, remainingTime }) => {
        queryClient.setQueryData(['tasks', selectedProject?._id], (oldData) => ({
          ...oldData,
          tasks: oldData.tasks.map((task) =>
            task._id === taskId
              ? {
                  ...task,
                  timerState: {
                    ...task.timerState,
                    remainingTime,
                    isActive: false,
                  },
                  status: 'paused',
                }
              : task,
          ),
        }));
      },
      onError: (error) => {
        console.error('Error pausing task:', error);
        toast.error('Failed to pause task. Please try again.');
        queryClient.invalidateQueries(['tasks', selectedProject?._id]);
      },
    },
  );

  const resumeTaskMutation = useMutation((taskId) => newRequest.post(`/tasks/${taskId}/resume`), {
    onSuccess: (response, taskId) => {
      queryClient.setQueryData(['tasks', selectedProject?._id], (oldData) => ({
        ...oldData,
        tasks: oldData.tasks.map((task) => (task._id === taskId ? response : task)),
      }));
      setActiveTaskId(taskId);
    },
    onError: (error) => {
      console.error('Error resuming task:', error);
      toast.error('Failed to resume task. Please try again.');
    },
  });

  const finishTaskMutation = useMutation((taskId) => newRequest.post(`/tasks/${taskId}/finish`), {
    onSuccess: (response, taskId) => {
      queryClient.setQueryData(['tasks', selectedProject?._id], (oldData) => ({
        ...oldData,
        tasks: oldData.tasks.map((task) => (task._id === taskId ? response : task)),
      }));
      setActiveTaskId(null);
    },
    onError: (error) => {
      console.error('Error finishing task:', error);
      toast.error('Failed to finish task. Please try again.');
    },
  });

  const updateTaskStatusMutation = useMutation(
    ({ taskId, status }) => newRequest.patch(`/tasks/${taskId}/status`, { status }),
    {
      onMutate: ({ taskId, status }) => {
        queryClient.setQueryData(['tasks', selectedProject?._id], (oldData) => ({
          ...oldData,
          tasks: oldData.tasks.map((task) => (task._id === taskId ? { ...task, status } : task)),
        }));
      },
      onError: (error) => {
        console.error('Error updating task status:', error);
        toast.error('Failed to update task status. Please try again.');
        queryClient.invalidateQueries(['tasks', selectedProject?._id]);
      },
    },
  );

  const updateTaskAssigneeMutation = useMutation(
    ({ taskId, assignee }) => newRequest.patch(`/tasks/${taskId}/assignee`, { assignee }),
    {
      onSuccess: (response, { taskId }) => {
        queryClient.setQueryData(['tasks', selectedProject?._id], (oldData) => ({
          ...oldData,
          tasks: oldData.tasks.map((task) => (task._id === taskId ? response : task)),
        }));
      },
      onError: (error) => {
        console.error('Error updating task assignee:', error);
        toast.error('Error updating task assignee. Please try again.');
      },
    },
  );

  const addTask = useCallback(
    (task) => {
      const newTask = { ...task, _id: uuidv4(), timeSpent: 0 };
      addTaskMutation.mutate(newTask);
    },
    [addTaskMutation],
  );

  const updateTask = useCallback(
    (updatedTask) => {
      updateTaskMutation.mutate(updatedTask);
    },
    [updateTaskMutation],
  );

  const deleteTask = useCallback(
    (taskId) => {
      deleteTaskMutation.mutate(taskId);
    },
    [deleteTaskMutation],
  );

  const editTask = useCallback(
    (editedTask) => {
      updateTaskMutation.mutate(editedTask);
    },
    [updateTaskMutation],
  );

  const startTask = useCallback(
    (taskId) => {
      if (!taskId) return;

      // if (tasks.some((task) => task.timerState.isActive)) {
      //   toast.error('Another task timer is active, please pause it before starting another one.');
      //   return;
      // }

      startTaskMutation.mutate(taskId);
    },
    [tasks, startTaskMutation],
  );

  const pauseTask = useCallback(
    (taskId, remainingTime) => {
      pauseTaskMutation.mutate({ taskId, remainingTime });
    },
    [pauseTaskMutation],
  );

  const resumeTask = useCallback(
    (taskId) => {
      resumeTaskMutation.mutate(taskId);
    },
    [resumeTaskMutation],
  );

  const finishTask = useCallback(
    (taskId) => {
      finishTaskMutation.mutate(taskId);
    },
    [finishTaskMutation],
  );

  const updateTaskStatus = useCallback(
    (taskId, status) => {
      updateTaskStatusMutation.mutate({ taskId, status });
    },
    [updateTaskStatusMutation],
  );

  const updateTaskAssignee = useCallback(
    (taskId, assignee) => {
      updateTaskAssigneeMutation.mutate({ taskId, assignee });
    },
    [updateTaskAssigneeMutation],
  );

  const getRemainingTime = useCallback(
    (taskId) => {
      const task = tasks.find((t) => t._id === taskId);
      if (!task || !task.timerState.isActive) return task?.timerState.remainingTime || 0;

      const elapsed = Date.now() - new Date(task.timerState.startTime).getTime();
      return Math.max(0, task.timerState.remainingTime - elapsed);
    },
    [tasks],
  );

  const moveTask = useCallback(
    (taskId, targetList, newIndex) => {
      moveTaskMutation.mutate({ taskId, targetList, newIndex });
    },
    [moveTaskMutation],
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
    moveTask,
    updateTaskStatus,
    editTask,
    updateTaskAssignee,
    isLoading,
  };

  return <TasksContext.Provider value={contextValue}>{children}</TasksContext.Provider>;
};

export default TasksProvider;
