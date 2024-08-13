import { useEffect, useState } from 'react';
import secondsToTime from '../helpers/secondsToTime';

const { ipcRenderer } = window.require('electron');

export function useTrayTracking() {
  const [currentTask, setCurrentTask] = useState(null);
  const [trayOpenCount, setTrayOpenCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const getCurrentTask = () => {
      ipcRenderer.send('get-current-task');
    };

    getCurrentTask();

    ipcRenderer.on('current-task', (event, task) => {
      console.log('🚀  task:', task);
      setCurrentTask(task);
    });

    ipcRenderer.on('tray-opened', () => {
      setTrayOpenCount((prev) => prev + 1);
    });

    return () => {
      ipcRenderer.removeAllListeners('current-task');
      ipcRenderer.removeAllListeners('tray-opened');
    };
  }, [trayOpenCount]);

  const displayTime = secondsToTime(currentTask?.taskDuration || 0);
  const status = currentTask
    ? currentTask?.timerState?.isActive
      ? 'running'
      : 'paused'
    : 'not-started';

  const getStatusColor = () => {
    switch (status) {
      case 'running':
        return '#4CAF50';
      case 'paused':
        return '#FFC107';
      default:
        return '#9E9E9E';
    }
  };

  return {
    currentTask,
    displayTime,
    status,
    getStatusColor,
    isHovered,
    setIsHovered,
  };
}