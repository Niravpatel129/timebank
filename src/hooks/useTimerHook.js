import { useEffect, useState } from 'react';
import { useTasksContext } from '../context/useTasksContext';

export const useTimerHook = (taskId) => {
  const { tasks, finishTask } = useTasksContext();
  const task = tasks.find((t) => t._id === taskId);
  const [remainingTime, setRemainingTime] = useState(task?.timerState.remainingTime || 0);

  useEffect(() => {
    if (!task?.timerState.remainingTime) {
      return;
    }

    setRemainingTime(task.timerState.remainingTime);

    let intervalId;
    if (task.timerState.isActive) {
      intervalId = setInterval(() => {
        const elapsedSeconds = Math.floor(
          (Date.now() - new Date(task.timerState.startTime).getTime()) / 1000,
        );
        const newRemainingTime = Math.max(0, task.timerState.remainingTime - elapsedSeconds);
        setRemainingTime(newRemainingTime);
        if (newRemainingTime <= 0) {
          finishTask(taskId);
        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [task, taskId, finishTask]);

  return remainingTime;
};
