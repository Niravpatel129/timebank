import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FocusMain from '../../components/FocusMain';
import { useProjectContext } from '../../context/useProjectContext';
import { useTasksContext } from '../../context/useTasksContext';
import { useTimerHook } from '../../hooks/useTimerHook';

export default function Focus() {
  const navigate = useNavigate();
  const { tasks, activeTaskId, pauseTask, startTask, completeTask } = useTasksContext();
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

  const handleStop = () => {
    completeTask(activeTaskId);
    navigate('/dashboard');
  };

  const handleClose = () => navigate('/dashboard');

  const toggleMusicPlayer = () => setShowMusicPlayer(!showMusicPlayer);

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
    />
  );
}
