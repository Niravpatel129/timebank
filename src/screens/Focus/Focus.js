import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import FocusMain from '../../components/FocusMain';
import { useProjectContext } from '../../context/useProjectContext';
import { useTasksContext } from '../../context/useTasksContext';
import { useTimerHook } from '../../hooks/useTimerHook';

export default function Focus() {
  const navigate = useNavigate();
  const { tasks, activeTaskId, pauseTask, startTask, updateTaskStatus } = useTasksContext();
  const remainingTime = useTimerHook(activeTaskId);
  const [isActive, setIsActive] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const { colorGradients } = useProjectContext();

  const activeTask = tasks.find((task) => task?._id === activeTaskId);

  useEffect(() => {
    if (activeTask) {
      setIsActive(activeTask.timerState?.isActive || false);
    }
  }, [activeTask]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return [hours, minutes, remainingSeconds]
      .map((unit) => unit.toString().padStart(2, '0'))
      .join(':');
  };

  const handlePlayPause = (e) => {
    e.stopPropagation();
    const action = isActive ? pauseTask : startTask;
    action(activeTaskId, remainingTime);
    setIsActive(!isActive);
  };

  const handleAddMoreTime = () => {
    // do nothing
  };

  const handleStop = () => {
    navigate('/dashboard');
  };

  const handleClose = () => navigate('/dashboard');

  const toggleMusicPlayer = () => setShowMusicPlayer(!showMusicPlayer);

  const handleEsc = () => {
    navigate('/dashboard');
  };

  const handleMarkComplete = () => {
    // pause task, update task state to complete
    pauseTask(activeTaskId);
    updateTaskStatus(activeTaskId, 'completed');
    navigate('/dashboard');
    toast.success('Task marked as complete');
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleEsc();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <FocusMain
      title={activeTask ? activeTask.name : 'No Active Task'}
      time={formatTime(remainingTime)}
      onClickTimeAction={handlePlayPause}
      isActive={isActive}
      onStop={handleStop}
      onClose={handleClose}
      showMusicPlayer={showMusicPlayer}
      toggleMusicPlayer={toggleMusicPlayer}
      colorGradients={colorGradients}
      closeFocus={handleClose}
      fillAmount={activeTask?.taskDuration}
      currentFillAmount={remainingTime}
      handleMarkComplete={handleMarkComplete}
      handleAddMoreTime={handleAddMoreTime}
    />
  );
}
