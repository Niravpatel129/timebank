// TimerTrack.js
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { CiClock1 } from 'react-icons/ci';
import { IoSettingsOutline, IoTimerOutline } from 'react-icons/io5';
import { useTasksContext } from '../../../context/useTasksContext';

export default function TimerTrack() {
  const { tasks, activeTaskId, getRemainingTime, pauseTask, finishTask } = useTasksContext();

  const [remainingTime, setRemainingTime] = useState(0);
  const activeTask = tasks.find((task) => task.id === activeTaskId);

  useEffect(() => {
    let interval;
    if (activeTaskId) {
      setRemainingTime(getRemainingTime(activeTaskId));
      interval = setInterval(() => {
        const newRemainingTime = getRemainingTime(activeTaskId);
        setRemainingTime(newRemainingTime);
        if (newRemainingTime <= 0) {
          clearInterval(interval);
          finishTask(activeTaskId);
        }
      }, 1000);
    } else {
      setRemainingTime(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [activeTaskId, getRemainingTime, finishTask]);

  const formatTime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
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
          <IoSettingsOutline style={{ fontSize: '20px', color: '#bebfca', cursor: 'pointer' }} />
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
              color: '#3a23c4',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span>
              <IoTimerOutline style={{ fontSize: '16px', color: '#3a23c4', marginRight: '7px' }} />
            </span>
            <span>{activeTask ? 'Timer Running' : 'No Active Task'}</span>
          </h2>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'semibold',
              color: '#3a23c4',
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
            }}
          >
            {activeTask ? `Task: ${activeTask.name}` : 'Start a task to begin tracking'}
          </p>
          <div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleStop}
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'linear-gradient(to bottom, #ff0d15, #ff0087)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginTop: '20px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: 'white',
                  borderRadius: '2px',
                }}
              />
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
          {activeTask && (
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
                {activeTask.category && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '10px',
                    }}
                  >
                    <div style={{ color: '#8f8f9d', fontSize: '14px', fontWeight: 400 }}>
                      Category
                    </div>
                    <div style={{ color: '#000000', fontSize: '15px', fontWeight: 500 }}>
                      {activeTask.category}
                    </div>
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '20px',
                    gap: '10px',
                  }}
                >
                  <div style={{ color: '#8f8f9d', fontSize: '14px', fontWeight: 400 }}>Project</div>
                  <div style={{ color: '#000000', fontSize: '15px', fontWeight: 500 }}>
                    {activeTask.projectName || 'N/A'}
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
                  <div style={{ color: '#8f8f9d', fontSize: '14px', fontWeight: 400 }}>
                    Duration
                  </div>
                  <div style={{ color: '#000000', fontSize: '15px', fontWeight: 500 }}>
                    {Math.floor(activeTask.taskDuration / 60)} minutes
                  </div>
                </div>
              </div>
            </div>
          )}
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
        <div style={{ padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h3
              style={{
                color: '#3a23c4',
                fontSize: '18px',
                fontWeight: 'bold',
                margin: 0,
              }}
            >
              Your last activity
            </h3>
            <div style={{ color: '#8f8f9d', fontSize: '14px' }}>Complete today 4 tasks</div>
          </div>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, padding: '0 20px 20px' }}>
          {[
            { task: 'Setup GitHub repository', category: 'Current Week', time: '02:36' },
            { task: 'Configure Vue Boilerplate', category: 'Things to do', time: '00:18' },
            { task: 'Create atomic components', category: 'Current Week', time: '00:12' },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    color: '#2d2c31',
                    fontSize: '16px',
                    fontWeight: '400',
                    marginBottom: '5px',
                  }}
                >
                  {item.task}
                </div>
                <div style={{ color: '#8f8f9d', fontSize: '14px' }}>in {item.category}</div>
              </div>
              <div
                style={{
                  color: '#3a23c4',
                  fontSize: '16px',
                  fontWeight: 400,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    marginRight: '5px',
                    fontSize: '16px',
                    paddingTop: '2px',
                    color: '#cbccd5',
                  }}
                >
                  <CiClock1 />
                </span>
                <span>{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
