import { useEffect, useState } from 'react';
import { useTasksContext } from '../context/useTasksContext';
const { ipcRenderer } = window.require('electron');

export const useTimerHook = (taskId) => {
  const { tasks, finishTask, activeTaskId } = useTasksContext();
  const task = tasks.find((t) => t._id === taskId);
  const [remainingTime, setRemainingTime] = useState(task?.timerState.remainingTime || 0);

  useEffect(() => {
    console.log('my task updated');
    if (task?.timerState.remainingTime) {
      setRemainingTime(task.timerState.remainingTime);
    }
  }, [task]);

  useEffect(() => {
    // if the taskId is the same as the active task, just return here
    if (task && task._id !== activeTaskId) {
      return;
    }

    if (!task?.timerState.remainingTime) {
      return;
    }

    setRemainingTime(task.timerState.remainingTime);

    // Start the timer in the main process
    if (task.timerState.isActive) {
      ipcRenderer.send('start-timer', task);
    }

    // Listen for timer updates from the main process
    const handleTimerUpdate = (event, updatedTime) => {
      setRemainingTime(updatedTime);
    };

    ipcRenderer.on('timer-update', handleTimerUpdate);

    // Listen for timer finished event
    const handleTimerFinished = (event, finishedTaskId) => {
      if (finishedTaskId === taskId) {
        finishTask(taskId);
      }
    };

    ipcRenderer.on('timer-finished', handleTimerFinished);

    // Clean up
    return () => {
      ipcRenderer.removeListener('timer-update', handleTimerUpdate);
      ipcRenderer.removeListener('timer-finished', handleTimerFinished);
      ipcRenderer.send('stop-timer', taskId);
    };
  }, [task, taskId, finishTask, activeTaskId]);

  return remainingTime;
};
