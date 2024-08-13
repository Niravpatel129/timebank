// TimerTrack.js
import { motion } from 'framer-motion';
import React from 'react';
import toast from 'react-hot-toast';
import { FaPause, FaPlay } from 'react-icons/fa'; // Import play and pause icons
import { IoNotifications, IoTimerOutline } from 'react-icons/io5';
import { useProjectContext } from '../../../context/useProjectContext';
import { useTasksContext } from '../../../context/useTasksContext';
import { useTimerHook } from '../../../hooks/useTimerHook';
import LastActivity from './LastActivity/LastActivity';

export default function TimerTrack({ openNotificationModal }) {
  const { tasks, activeTaskId, getRemainingTime, pauseTask, finishTask, startTask } =
    useTasksContext();
  const { colorGradients } = useProjectContext();

  const activeTask = tasks.find((task) => task?._id === activeTaskId);
  const remainingTime = useTimerHook(activeTaskId);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlay = (e) => {
    if (!activeTask) {
      toast.error('No active task to start');
      return;
    }
    e.stopPropagation();
    if (activeTask?.timerState?.isActive) {
      pauseTask(activeTaskId, remainingTime);
    } else if (activeTask) {
      startTask(activeTaskId, remainingTime);
    }
  };

  const handleStop = () => {
    if (activeTaskId) {
      pauseTask(activeTaskId);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Top */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(to bottom, #f7f9ff, #ffffff)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          <div></div>
          <IoNotifications
            style={{ fontSize: '20px', color: '#bebfca', cursor: 'pointer' }}
            onClick={openNotificationModal}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              color: colorGradients[0],
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span>
              <IoTimerOutline
                style={{ fontSize: '16px', color: colorGradients[0], marginRight: '7px' }}
              />
            </span>
            <span>{activeTask ? 'Timer Running' : 'No Active Task'}</span>
          </h2>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'semibold',
              color: colorGradients[0],
              margin: '0px',
              padding: '0px',
            }}
          >
            {formatTime(remainingTime)}
          </div>
          <p
            style={{
              color: '#8f8f9d',
              fontSize: '16px',
              margin: '0px',
              padding: '0px',
              fontWeight: 200,
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              maxWidth: '550px',
              width: '90%',
              textAlign: 'center',
            }}
          >
            {activeTask ? `Task: ${activeTask.name}` : 'Start a task to begin tracking'}
          </p>
          <div>
            <motion.div
              whileHover={{ scale: activeTask ? 1.1 : 1 }}
              whileTap={{ scale: activeTask ? 0.9 : 1 }}
              onClick={handlePlay}
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: activeTask
                  ? 'linear-gradient(to bottom, #ff0d15, #ff0087)'
                  : 'linear-gradient(to bottom, #ccc, #999)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginTop: '20px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                opacity: activeTask ? 1 : 0.5,
                // pointerEvents: activeTask ? 'auto' : 'none',
              }}
            >
              {activeTask?.timerState?.isActive ? (
                <FaPause style={{ color: 'white', fontSize: '24px' }} />
              ) : (
                <FaPlay style={{ color: 'white', fontSize: '24px' }} />
              )}
            </motion.div>
          </div>
        </div>
        <div
          style={{
            width: '100%',
            height: '1px',
            backgroundColor: '#e0e0e0',
            marginTop: '20px',
            marginBottom: '20px',
          }}
        />
        <div style={{ paddingRight: '20px', paddingLeft: '20px', height: '100%' }}>
          <div style={{}}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <div style={{ color: '#8f8f9d', fontSize: '14px', fontWeight: 400 }}>Category</div>
                <div style={{ color: '#000000', fontSize: '15px', fontWeight: 500 }}>
                  {activeTask?.category || 'No task'}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '20px',
                  gap: '10px',
                }}
              >
                <div style={{ color: '#8f8f9d', fontSize: '14px', fontWeight: 400 }}>Duration</div>
                <div style={{ color: '#000000', fontSize: '15px', fontWeight: 500 }}>
                  {Math.floor(activeTask?.taskDuration / 60) || 30} minutes
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#f0f4ff',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <LastActivity colorGradients={colorGradients} />
      </div>
    </div>
  );
}
