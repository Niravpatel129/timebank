import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { FaCheck, FaPause, FaPlay } from 'react-icons/fa';
import { GrDrag } from 'react-icons/gr';
import ScribbleText from '../../../components/ScribbleText';
import { useProjectContext } from '../../../context/useProjectContext';
import { useTasksContext } from '../../../context/useTasksContext';
import { useTimerHook } from '../../../hooks/useTimerHook';
import IconButton from './IconButton';
import Tag from './Tag';
import { commonStyles } from './sharedStyles/commonStyles';
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
  onEditTask,
  timerState,
  assignee,
}) => {
  const [currentAssignee, setCurrentAssignee] = useState(assignee);
  const [isHovered, setIsHovered] = useState(false);
  const { selectedProject, colorGradients } = useProjectContext();
  const { startTask, pauseTask, finishTask, activeTaskId, updateTaskStatus, updateTaskAssignee } =
    useTasksContext();
  // const [remainingTime, setRemainingTime] = useState(timerState.remainingTime);
  const [isAssigneeSelectOpen, setIsAssigneeSelectOpen] = useState(false);
  const assigneeSelectRef = useRef(null);
  const [isPlayButtonHovered, setIsPlayButtonHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const isDisabled = activeTaskId !== null && activeTaskId !== id;
  const remainingTime = useTimerHook(id);

  // useEffect(() => {
  //   setRemainingTime(timerState.remainingTime);
  // }, [timerState]);

  // useEffect(() => {
  //   if (!timerState.remainingTime) {
  //     return;
  //   }

  //   let intervalId;
  //   if (timerState.isActive) {
  //     intervalId = setInterval(() => {
  //       const elapsedSeconds = Math.floor(
  //         (Date.now() - new Date(timerState.startTime).getTime()) / 1000,
  //       );
  //       // const newRemainingTime = Math.max(0, timerState.remainingTime - elapsedSeconds);
  //       // setRemainingTime(newRemainingTime);
  //       // if (newRemainingTime <= 0) {
  //       //   finishTask(id);
  //       // }
  //     }, 1000);
  //   }
  //   return () => clearInterval(intervalId);
  // }, [timerState, id, finishTask]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (assigneeSelectRef.current && !assigneeSelectRef.current.contains(event.target)) {
        setIsAssigneeSelectOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    updateTaskStatus(id, status === 'completed' ? 'not-started' : 'completed');
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    if (timerState.isActive) {
      pauseTask(id, remainingTime);
    } else {
      startTask(id, remainingTime);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!taskDuration) {
    return <>no task duration</>;
  }

  const assignees = [
    ...selectedProject.members.map((member) => ({
      value: member.user._id,
      _id: member.user._id,
      name: member.user.name || 'Member 1',
      image: null,
    })),
    { value: null, image: null, name: 'Unassigned', _id: null },
  ];

  const handleTaskClick = (e) => {
    // Only trigger onEditTask if the click is on the main task area and not dragging
    if ((e.target === e.currentTarget || e.target.tagName === 'SPAN') && !isDragging) {
      onEditTask(id);
    }
  };

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
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        const threshold = 100; // Adjust this value as needed
        if (Math.abs(info.offset.y) > threshold) {
          const newListType = listType === 'currentWeek' ? 'thingsToDo' : 'currentWeek';
          moveTask(id, newListType);
        }
      }}
      onClick={handleTaskClick}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
        <div
          style={{
            width: '20px',
            marginRight: '0px',
            opacity: isHovered ? 1 : 0,
            position: 'absolute',
            left: '-16px',
            zIndex: 1,
          }}
        >
          <GrDrag style={{ cursor: 'move' }} />
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleCheckboxChange(e);
          }}
          style={{
            marginRight: '5px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '2px solid #ddd',
            cursor: 'pointer',
            backgroundColor:
              status === 'completed' ? selectedProject?.projectColor?.gradient1 : 'transparent',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {status === 'completed' && <FaCheck color='white' size={12} />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ScribbleText
            text={title}
            isCompleted={status === 'completed'}
            strokeColor={colorGradients[0]}
          />
          {tag && (
            <Tag
              backgroundColor={tagBackgroundColor || colorGradients[0]}
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
          {status.replace('-', ' ')}
        </span>
        <span
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: timerState.isActive ? '#331db9' : '#d9dae3',
          }}
        >
          {formatTime(remainingTime)}
        </span>
        <IconButton
          onClick={handlePlay}
          Icon={timerState.isActive ? FaPause : FaPlay}
          color={isDisabled ? '#ffffff' : '#ffffff'}
          style={{
            backgroundColor: timerState.isActive
              ? isPlayButtonHovered
                ? '#4a34d3'
                : '#331db9'
              : isPlayButtonHovered
              ? '#c3c4cc'
              : '#d9dae3',
            padding: '10px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '10px',
            height: '10px',
            cursor: 'pointer',
            marginRight: '10px',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={() => setIsPlayButtonHovered(true)}
          onMouseLeave={() => setIsPlayButtonHovered(false)}
        />
        <div
          ref={assigneeSelectRef}
          style={{
            position: 'relative',
          }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsAssigneeSelectOpen(!isAssigneeSelectOpen);
            }}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              cursor: 'pointer',
              overflow: 'hidden',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colorGradients[0],
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt='profile'
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span>{currentAssignee?.name?.[0].toUpperCase() || 'U'}</span>
            )}
          </motion.div>
          {isAssigneeSelectOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                right: 0,
                top: '120%',
                zIndex: 1,
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                overflow: 'hidden',
                width: '200px',
              }}
            >
              {assignees.map((assignee) => (
                <motion.div
                  key={assignee.value}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  layout
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    cursor: 'pointer',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle assignee selection here
                    updateTaskAssignee(id, assignee.value);
                    setCurrentAssignee({
                      value: assignee.value,
                      name: assignee.name,
                      image: assignee.image,
                    });
                    setIsAssigneeSelectOpen(false);
                  }}
                >
                  {assignee.image ? (
                    <img
                      src={assignee.image}
                      alt={assignee.name}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        marginRight: '12px',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        marginRight: '12px',
                        backgroundColor:
                          (currentAssignee === undefined && assignee?.name === 'Unassigned') ||
                          assignee?.name === currentAssignee?.name
                            ? colorGradients[0]
                            : '#d9dae3',
                        color: '#ffffff',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      {assignee.name ? assignee.name?.[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <span style={{ fontSize: '14px' }}>{assignee.name || 'Unassigned'}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Checklist;
