import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { CiClock2 } from 'react-icons/ci';
import { FaCheck, FaFire, FaPause, FaPlay } from 'react-icons/fa';
import { FiTrash } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import { useModalsContext } from '../../../../context/useModalsContext';
import { useProjectContext } from '../../../../context/useProjectContext';
import { useTasksContext } from '../../../../context/useTasksContext';

const BoardCard = ({ task, onEditTask, colorGradients }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAssigneeMenuOpen, setIsAssigneeMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { deleteTask, updateTask } = useTasksContext();
  const { selectedProject } = useProjectContext();
  const { openEditTaskModal } = useModalsContext();
  const assigneeMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (assigneeMenuRef.current && !assigneeMenuRef.current.contains(event.target)) {
        setIsAssigneeMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDelete = () => {
    toast.success('Coming soon!');
    deleteTask(task._id);
  };

  const handleAssigneeClick = (e) => {
    e.stopPropagation();
    setIsAssigneeMenuOpen(!isAssigneeMenuOpen);
  };

  const handleAssigneeChange = (newAssignee) => {
    updateTask({ ...task, assignee: newAssignee });
    setIsAssigneeMenuOpen(false);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getPriorityLabel = (priority) => {
    const priorityLabels = {
      3: 'High',
      2: 'Medium',
      1: 'Low',
      0: 'None',
    };
    return priorityLabels[priority];
  };

  const TimeAgo = ({ date }) => {
    const calculateTimeAgo = () => {
      const seconds = Math.floor((new Date() - new Date(date)) / 1000);
      let interval = seconds / 31536000;
      if (interval > 1) return Math.floor(interval) + ' years ago';
      interval = seconds / 2592000;
      if (interval > 1) return Math.floor(interval) + ' months ago';
      interval = seconds / 86400;
      if (interval > 1) return Math.floor(interval) + ' days ago';
      interval = seconds / 3600;
      if (interval > 1) return Math.floor(interval) + ' hours ago';
      interval = seconds / 60;
      if (interval > 1) return Math.floor(interval) + ' minutes ago';
      return Math.floor(seconds) + ' seconds ago';
    };

    return <span>{calculateTimeAgo()}</span>;
  };

  if (!task) return null;

  const filteredMembers = selectedProject?.members.filter((member) =>
    member.user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      style={{
        userSelect: 'none',
        padding: '12px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '16px',
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => openEditTaskModal(task)}
    >
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {task.taskPriority > 0 && (
          <div
            data-tooltip-id={`priority-${task._id}`}
            data-tooltip-content={getPriorityLabel(task.taskPriority)}
          >
            <FaFire
              color={
                task.taskPriority === 3
                  ? '#ff4d4d'
                  : task.taskPriority === 2
                  ? '#ffa64d'
                  : '#ffff4d'
              }
              size={14}
            />
          </div>
        )}
        {isHovered && (
          <div
            style={{
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <FiTrash color='#c9c9c9' size={14} />
          </div>
        )}
      </div>
      <Tooltip id={`priority-${task._id}`} />
      <div
        style={{
          backgroundColor: colorGradients[0],
          color: '#FFFFFF',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '11px',
          display: 'inline-block',
          marginBottom: '6px',
          fontWeight: 500,
        }}
      >
        {task.category || 'Uncategorized'}
      </div>
      <div style={{ fontSize: '14px', fontWeight: 400, marginBottom: '6px', color: '#16213a' }}>
        {task.name}
      </div>
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
        {task.createdAt ? <TimeAgo date={task.createdAt} /> : 'No description'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', color: '#aeb2c2' }}>
        <div
          style={{
            padding: '4px 8px',
            backgroundColor: '#ffffff',
            borderRadius: '6px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #c5c9d9',
            marginBottom: '6px',
            fontWeight: 500,
          }}
        >
          <span style={{ marginRight: '4px' }}>☰</span>
          {task.status}
        </div>
      </div>
      <div style={{ borderBottom: '1px solid #c5c9d9', margin: '6px -12px' }} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '6px',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', marginRight: '6px', position: 'relative' }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: colorGradients[0],
                border: '2px solid white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '9px',
                fontWeight: 'bold',
                color: 'white',
                cursor: 'pointer',
              }}
              onClick={handleAssigneeClick}
            >
              {task.assignee?.name?.[0].toUpperCase() || 'U'}
            </div>
            {isAssigneeMenuOpen && (
              <div
                ref={assigneeMenuRef}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: 'white',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  borderRadius: '4px',
                  padding: '8px',
                  zIndex: 1000,
                  width: '200px',
                }}
              >
                <div
                  key='unassigned'
                  style={{
                    padding: '6px 8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAssigneeChange(null);
                  }}
                >
                  Unassigned
                </div>
                {filteredMembers.map((member) => (
                  <div
                    key={member.user._id}
                    style={{
                      padding: '6px 8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      borderRadius: '4px',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssigneeChange(member.user);
                    }}
                  >
                    {member.user.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#666' }}>
            <span style={{ marginRight: '6px', display: 'flex', alignItems: 'center' }}>
              <CiClock2 style={{ marginRight: '2px' }} size={12} />
              {formatTime(task.timerState.remainingTime)}
            </span>
            <span style={{ marginRight: '6px' }}>
              {task.timerState.isActive ? <FaPause size={10} /> : <FaPlay size={10} />}
            </span>
            <span>{task.status === 'completed' ? <FaCheck size={10} /> : null}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
