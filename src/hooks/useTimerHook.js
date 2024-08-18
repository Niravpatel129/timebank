import { useEffect, useRef, useState } from 'react';
import { useTasksContext } from '../context/useTasksContext';
const { ipcRenderer } = window.require('electron');

export const useTimerHook = (taskId) => {
  const { tasks, finishTask, activeTaskId } = useTasksContext();
  const task = tasks.find((t) => t._id === taskId);
  const [remainingTime, setRemainingTime] = useState(0);
  const initializedRef = useRef(false);
  const previousActiveTaskIdRef = useRef(null);

  useEffect(() => {
    if (task && !initializedRef.current) {
      setRemainingTime(task.timerState.remainingTime || 0);
      initializedRef.current = true;
    }
  }, [task]);

  useEffect(() => {
    if (task && task._id !== activeTaskId) {
      return;
    }

    if (!task?.timerState.remainingTime) {
      return;
    }

    if (task.timerState.isActive) {
      if (previousActiveTaskIdRef.current && previousActiveTaskIdRef.current !== taskId) {
        ipcRenderer.send('stop-timer', previousActiveTaskIdRef.current);
      }
      ipcRenderer.send('start-timer', task);
      previousActiveTaskIdRef.current = taskId;
    }

    const handleTimerUpdate = (event, updatedTime) => {
      setRemainingTime(updatedTime);
    };

    ipcRenderer.on('timer-update', handleTimerUpdate);

    const handleTimerFinished = (event, finishedTaskId) => {
      if (finishedTaskId === taskId) {
        finishTask(taskId);
      }
    };

    ipcRenderer.on('timer-finished', handleTimerFinished);

    return () => {
      ipcRenderer.removeListener('timer-update', handleTimerUpdate);
      ipcRenderer.removeListener('timer-finished', handleTimerFinished);
      ipcRenderer.send('stop-timer', taskId);
    };
  }, [task, taskId, finishTask, activeTaskId]);

  return remainingTime;
};
