import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';
import { GrDrag } from 'react-icons/gr';
import { useTasksContext } from '../../../context/useTasksContext';
import IconButton from './IconButton';
import Tag from './Tag';
import { commonStyles } from './sharedStyles/commonStyles';

const parseStatus = (status) => {
  if (status === 'inProgress') {
    return 'in progress';
  }

  if (status === 'completed') {
    return 'completed';
  }

  if (status === 'paused') {
    return 'paused';
  }

  return status;
};

const Checklist = ({
  id,
  title,
  tag,
  status,
  taskDuration,
  profileImage,
  tagBackgroundColor,
  moveTask,
  listType,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { startTask, pauseTask, finishTask, getRemainingTime, activeTaskId } = useTasksContext();
  const [remainingTime, setRemainingTime] = useState(taskDuration * 1000);

  const isDisabled = activeTaskId !== null && activeTaskId !== id;

  useEffect(() => {
    let intervalId;
    if (status === 'inProgress') {
      intervalId = setInterval(() => {
        const newRemainingTime = getRemainingTime(id);
        setRemainingTime(newRemainingTime);
        if (newRemainingTime <= 0) {
          finishTask(id);
        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [status, id, getRemainingTime, finishTask]);

  const handlePlay = () => {
    if (status === 'inProgress') {
      pauseTask(id);
    } else {
      startTask(id);
    }
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(
      seconds % 60
    )
      .toString()
      .padStart(2, '0')}`;
  };

  if (!taskDuration) {
    return null;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{
        ...commonStyles.taskItem,
        padding: '4px 0',
        borderBottom: '1px solid #eee',
        cursor: 'default',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={1}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.y) > 50) {
          moveTask(id, listType, listType === 'currentWeek' ? 'thingsToDo' : 'currentWeek');
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
        <div
          style={{
            width: '20px',
            marginRight: '0px',
            opacity: isHovered ? 1 : 0,
            position: 'absolute',
            left: '-16px',
          }}
        >
          <GrDrag style={{ cursor: 'move' }} />
        </div>
        <input
          type='checkbox'
          style={{
            marginRight: '10px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '2px solid #ddd',
            appearance: 'none',
            cursor: 'pointer',
            ':checked': {
              backgroundColor: '#341dc0',
              borderColor: '#341dc0',
            },
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span
            style={{
              flexGrow: 1,
              fontSize: '16px',
              fontWeight: '500',
              color: '#333',
            }}
          >
            {title}
          </span>
          {tag && (
            <Tag
              backgroundColor={tagBackgroundColor || commonStyles.primaryColor}
              color='white'
              style={{
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '10px',
                padding: '4px 8px',
              }}
            >
              {tag}
            </Tag>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span
          style={{
            color: commonStyles.secondaryColor,
            fontSize: '14px',
            marginRight: '10px',
            textTransform: 'capitalize',
          }}
        >
          {parseStatus(status)}
        </span>
        <span
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: status === 'inProgress' ? '#331db9' : '#d9dae3',
          }}
        >
          {formatTime(remainingTime)}
        </span>
        <IconButton
          onClick={handlePlay}
          Icon={status === 'inProgress' ? FaPause : FaPlay}
          color={isDisabled ? '#ffffff' : '#ffffff'}
          style={{
            backgroundColor: status === 'inProgress' ? '#331db9' : '#d9dae3',
            padding: '10px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '10px',
            height: '10px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            marginRight: '10px',
          }}
          disabled={isDisabled}
        />
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            overflow: 'hidden',
            marginLeft: '10px',
          }}
        >
          <img
            src={profileImage}
            alt='profile'
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Checklist;
