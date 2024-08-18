import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaPause, FaPlay, FaStop } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '../../context/useProjectContext';
import { useTasksContext } from '../../context/useTasksContext';
import { useTimerHook } from '../../hooks/useTimerHook';
import MusicPlayer from '../Dashboard/components/MusicPlayer/MusicPlayer';

export default function Focus() {
  const navigate = useNavigate();
  const { tasks, activeTaskId, pauseTask, startTask, completeTask } = useTasksContext();
  const remainingTime = useTimerHook(activeTaskId);
  const [isActive, setIsActive] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const { colorGradients } = useProjectContext();

  const activeTask = tasks.find((task) => task?._id === activeTaskId);

  useEffect(() => {
    if (activeTask) {
      setIsActive(activeTask.timerState?.isActive || false);
    }

    // Check if it's night time (between 6 PM and 6 AM)
    const currentHour = new Date().getHours();
    setIsNight(currentHour >= 18 || currentHour < 6);
  }, [activeTask]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (isActive) {
      pauseTask(activeTaskId, remainingTime);
    } else {
      startTask(activeTaskId, remainingTime);
    }
    setIsActive(!isActive);
  };

  const handleStop = () => {
    completeTask(activeTaskId);
    navigate('/dashboard');
  };

  const handleClose = () => {
    navigate('/dashboard');
  };

  const toggleMusicPlayer = () => {
    setShowMusicPlayer(!showMusicPlayer);
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: isNight
          ? 'linear-gradient(to bottom, #1c2331, #0f172a)'
          : 'linear-gradient(to bottom, #f7f9ff, #ffffff)',
        position: 'relative',
      }}
    >
      <IoMdClose
        style={{
          fontSize: '24px',
          color: '#bebfca',
          cursor: 'pointer',
          position: 'absolute',
          top: '20px',
          right: '20px',
        }}
        onClick={handleClose}
      />

      <h2
        style={{
          color: colorGradients[0],
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '30px',
          textAlign: 'center',
        }}
      >
        {activeTask ? activeTask.name : 'No Active Task'}
      </h2>

      <div
        style={{
          fontSize: '96px',
          fontWeight: 'bold',
          color: colorGradients[0],
          marginBottom: '50px',
        }}
      >
        {formatTime(remainingTime)}
      </div>

      <div style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePlayPause}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: isActive
              ? 'linear-gradient(to bottom, #ff0d15, #ff0087)'
              : 'linear-gradient(to bottom, #2ecc71, #27ae60)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
          }}
        >
          {isActive ? (
            <FaPause style={{ color: 'white', fontSize: '30px' }} />
          ) : (
            <FaPlay style={{ color: 'white', fontSize: '30px' }} />
          )}
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleStop}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(to bottom, #f39c12, #e67e22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
          }}
        >
          <FaStop style={{ color: 'white', fontSize: '30px' }} />
        </motion.div>
      </div>

      <button
        onClick={toggleMusicPlayer}
        style={{
          background: 'none',
          border: `2px solid ${colorGradients[0]}`,
          color: colorGradients[0],
          padding: '10px 20px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'all 0.3s ease',
        }}
      >
        {showMusicPlayer ? 'Hide Music Player' : 'Show Music Player'}
      </button>

      {showMusicPlayer && (
        <div style={{ marginTop: '30px', width: '80%', maxWidth: '400px' }}>
          <MusicPlayer colorGradients={colorGradients} />
        </div>
      )}
    </div>
  );
}
