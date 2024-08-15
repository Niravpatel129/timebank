import React, { useMemo, useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import {
  FaRegChartBar,
  FaRegClipboard,
  FaRegClock,
  FaRegFlag,
  FaRegUserCircle,
} from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
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
  const { tasks, updateTask } = useTasksContext();
  const { colorGradients } = useProjectContext();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

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

  const renderHeader = (boardOrder, tasksCount) => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: '#f5f7fb',
          padding: '10px',
          overflow: 'hidden',
          borderRadius: '7px',
          color: '#191731',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '20px',
        }}
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            marginTop: '2px',
            cursor: 'pointer',
          }}
        >
          <FaPlus />
        </div>
      </div>
    );
  };

  const renderTableContentRow = (task) => {
    return (
      <div
        key={task._id}
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
            width: '20px',
            padding: '10px',
            borderRight: '1px solid #f4f3f6',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <input type='checkbox' />
        </div>
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
        <div style={{ width: '40px', padding: '10px', display: 'flex', alignItems: 'center' }}>
          ...
        </div>
      </div>
    );
  };

  const renderTable = (tasks, boardOrder) => {
    return (
      <div key={boardOrder}>
        {renderHeader(boardOrder, tasks.length)}
        {renderTableHeading()}
        <div>{tasks.map((task) => renderTableContentRow(task))}</div>
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
        }}
      >
        <div style={{ width: '20px', padding: '10px' }}>
          <input type='checkbox' />
        </div>
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
    const priorityColors = {
      1: '#00C853',
      2: '#FFA000',
      3: '#D50000',
    };

    const priorityLabels = {
      1: 'Low',
      2: 'Medium',
      3: 'High',
    };

    return (
      <span
        style={{
          backgroundColor: priorityColors[priority] || '#757575',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold',
          textTransform: 'capitalize',
        }}
      >
        {priorityLabels[priority] || 'Unknown'}
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
