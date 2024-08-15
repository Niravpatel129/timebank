import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BiDotsVerticalRounded, BiPlus } from 'react-icons/bi';
import {
  FaRegChartBar,
  FaRegClipboard,
  FaRegClock,
  FaRegFlag,
  FaRegUserCircle,
  FaTrash,
} from 'react-icons/fa';
import { useProjectContext } from '../../../../context/useProjectContext';
import { useTasksContext } from '../../../../context/useTasksContext';

const getboardOrderName = (boardOrder) => {
  switch (boardOrder) {
    case '0':
      return 'not started';
    case '1':
      return 'in progress';
    case '2':
      return 'review';
    case '3':
      return 'completed';
    default:
      return 'Tasks';
  }
};

const TableView = () => {
  const { tasks, updateTask, deleteTask } = useTasksContext();
  const { colorGradients } = useProjectContext();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [expandedSections, setExpandedSections] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const groupedTasks = useMemo(() => {
    const grouped = tasks.reduce((acc, task) => {
      const boardOrder = task.taskBoardOrder || 0;
      if (!acc[boardOrder]) {
        acc[boardOrder] = [];
      }
      acc[boardOrder].push(task);
      return acc;
    }, {});
    return Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b));
  }, [tasks]);

  useEffect(() => {
    // Set all sections to expanded by default
    const initialExpandedState = groupedTasks.reduce((acc, [boardOrder]) => {
      acc[boardOrder] = true;
      return acc;
    }, {});
    setExpandedSections(initialExpandedState);
  }, [groupedTasks]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSection = (boardOrder) => {
    setExpandedSections((prev) => ({
      ...prev,
      [boardOrder]: !prev[boardOrder],
    }));
  };

  const toggleDropdown = (taskId) => {
    setOpenDropdown(openDropdown === taskId ? null : taskId);
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
    setOpenDropdown(null);
  };

  const renderHeader = (boardOrder, tasksCount) => {
    const isExpanded = expandedSections[boardOrder];
    return (
      <motion.div
        initial={false}
        animate={{ backgroundColor: isExpanded ? '#f5f7fb' : '#ffffff' }}
        transition={{ duration: 0.3 }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          padding: '10px',
          overflow: 'hidden',
          borderRadius: '7px',
          color: '#191731',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '20px',
          cursor: 'pointer',
        }}
        onClick={() => toggleSection(boardOrder)}
      >
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <span
            style={{
              width: '5px',
              backgroundImage: 'linear-gradient(to right, white, #acacac)',
              borderRadius: '20%',
              marginRight: '7px',
              height: '100%',
            }}
          />
          <span style={{ fontWeight: 500, fontSize: '15px', textTransform: 'capitalize' }}>
            {getboardOrderName(boardOrder)}
          </span>
          <span
            style={{
              fontSize: '12px',
              color: '#6a62e9',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '10px',
              gap: '5px',
              backgroundColor: '#e7e8fb',
              justifyContent: 'center',
              width: '20px',
              height: '20px',
              borderRadius: '5px',
              fontWeight: 500,
            }}
          >
            {tasksCount}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            marginTop: '2px',
            marginRight: '25px',
          }}
        >
          ▼
        </motion.div>
      </motion.div>
    );
  };

  const renderTableContentRow = (task) => {
    return (
      <motion.div
        key={task._id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          borderBottom: '1px solid #f4f3f6',
          color: '#484560',
          fontWeight: 500,
          fontSize: '14px',
          alignItems: 'stretch',
        }}
      >
        <div
          style={{
            flex: 2,
            padding: '10px',
            borderRight: '1px solid #f4f3f6',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {task.name}
        </div>
        <div
          style={{
            flex: 1,
            padding: '10px',
            borderRight: '1px solid #f4f3f6',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {task.taskDuration / 60} minutes
        </div>
        <div
          style={{
            flex: 1,
            padding: '10px',
            borderRight: '1px solid #f4f3f6',
            textTransform: 'capitalize',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {task.status.split('-').join(' ')}
        </div>
        <div
          style={{
            flex: 1,
            padding: '10px',
            borderRight: '1px solid #f4f3f6',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {renderUserCircle(task.user.name[0])}
        </div>
        <div
          style={{
            flex: 1,
            padding: '10px',
            borderRight: '1px solid #f4f3f6',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {renderPriorityBadge(task.taskPriority)}
        </div>
        <div
          style={{
            width: '40px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <BiDotsVerticalRounded
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown(task._id);
            }}
          />
          {openDropdown === task._id && (
            <div
              ref={dropdownRef}
              style={{
                position: 'absolute',
                bottom: '100%',
                right: '-8px', // Adjusted to prevent cut-off
                backgroundColor: 'white',
                boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                zIndex: 1,
                borderRadius: '4px',
                padding: '8px',
                minWidth: '100px', // Added to ensure menu width
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                }}
                onClick={() => handleDeleteTask(task._id)}
              >
                <FaTrash style={{ marginRight: '8px' }} /> Delete
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderTable = (tasks, boardOrder) => {
    const isExpanded = expandedSections[boardOrder];
    return (
      <div key={boardOrder}>
        {renderHeader(boardOrder, tasks.length)}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTableHeading()}
              <div>{tasks.map((task) => renderTableContentRow(task))}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderTableHeading = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          borderBottom: '1px solid #f4f3f6',
          marginTop: '10px',
          fontWeight: 500,
          fontSize: '14px',
          color: '#848590',
        }}
      >
        <div style={{ flex: 2, padding: '10px' }}>
          <FaRegClipboard /> Task Name
        </div>
        <div style={{ flex: 1, padding: '10px' }}>
          <FaRegClock /> Duration
        </div>
        <div style={{ flex: 1, padding: '10px' }}>
          <FaRegChartBar /> Status
        </div>
        <div style={{ flex: 1, padding: '10px' }}>
          <FaRegUserCircle /> Assigned To
        </div>
        <div style={{ flex: 1, padding: '10px' }}>
          <FaRegFlag /> Priority
        </div>
        <div style={{ width: '40px', padding: '10px' }}>
          <BiPlus />
        </div>
      </div>
    );
  };

  const renderPriorityBadge = (priority) => {
    const priorityGradients = {
      1: 'linear-gradient(135deg, #00C853, #4CAF50)',
      2: 'linear-gradient(135deg, #FFA000, #FF6F00)',
      3: 'linear-gradient(135deg, #D50000, #B71C1C)',
    };

    const priorityLabels = {
      1: 'Low',
      2: 'Medium',
      3: 'High',
    };

    return (
      <span
        style={{
          background: priorityGradients[priority] || 'linear-gradient(135deg, #757575, #424242)',
          color: 'white',
          padding: '2px 8px 2px 20px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
          textTransform: 'capitalize',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
        }}
      >
        <span
          style={{
            content: '""',
            position: 'absolute',
            left: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: 'white',
          }}
        />
        {priorityLabels[priority] || 'Not Set'}
      </span>
    );
  };

  const renderUserCircle = (letter) => {
    return (
      <div
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          backgroundColor: '#6a62e9',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '14px',
        }}
      >
        {letter}
      </div>
    );
  };

  return (
    <div style={{ overflowX: 'auto', width: '100%', color: '#484560', marginBottom: '100px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {groupedTasks.map(([boardOrder, tasks]) => renderTable(tasks, boardOrder))}
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'not-started':
      return '#00ff80';
    case 'in-progress':
      return '#FF9800';
    case 'review':
      return '#ff001e';
    case 'completed':
      return '#8c00ff';
    default:
      return '#gray';
  }
};

export default TableView;
