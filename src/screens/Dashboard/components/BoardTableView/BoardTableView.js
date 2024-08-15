import React, { useState } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import { useProjectContext } from '../../../../context/useProjectContext';
import { useTasksContext } from '../../../../context/useTasksContext';

const TableView = () => {
  const { tasks, updateTask } = useTasksContext();
  const { colorGradients } = useProjectContext();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const sortedTasks = React.useMemo(() => {
    let sortableTasks = [...tasks];
    if (sortConfig.key !== null) {
      sortableTasks.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTasks;
  }, [tasks, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  const renderHeader = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: '#fff',
          // width: '100%',
          padding: '10px',
          overflow: 'hidden',
          borderRadius: '5px',
          color: '#191731',
          alignItems: 'center',
          // height: '18px',
          justifyContent: 'space-between',
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
          <span style={{ fontWeight: 500, fontSize: '15px' }}>To-do</span>
          <span
            style={{
              fontSize: '12px',
              color: '#6a62e9',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '10px',
              gap: '5px',
              backgroundColor: '#e7e8fb',
              // padding: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20px',
              height: '20px',
              borderRadius: '5px',
              fontWeight: 500,
            }}
          >
            3
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

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      {renderHeader()}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <th onClick={() => requestSort('name')} style={tableHeaderStyle}>
              Task Name {getSortIcon('name')}
            </th>
            <th onClick={() => requestSort('status')} style={tableHeaderStyle}>
              Status {getSortIcon('status')}
            </th>
            <th onClick={() => requestSort('category')} style={tableHeaderStyle}>
              Category {getSortIcon('category')}
            </th>
            <th onClick={() => requestSort('assignee')} style={tableHeaderStyle}>
              Assignee {getSortIcon('assignee')}
            </th>
            <th onClick={() => requestSort('timerState.remainingTime')} style={tableHeaderStyle}>
              Time Remaining {getSortIcon('timerState.remainingTime')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map((task) => (
            <tr key={task._id} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={tableCellStyle}>{task.name}</td>
              <td style={tableCellStyle}>
                <span style={getStatusStyle(task.status)}>{task.status}</span>
              </td>
              <td style={tableCellStyle}>
                <span style={getCategoryStyle(task.category, colorGradients)}>{task.category}</span>
              </td>
              <td style={tableCellStyle}>{task.assignee?.name || 'Unassigned'}</td>
              <td style={tableCellStyle}>{formatTime(task.timerState.remainingTime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tableHeaderStyle = {
  padding: '12px 15px',
  textAlign: 'left',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const tableCellStyle = {
  padding: '12px 15px',
};

const getStatusStyle = (status) => ({
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 'bold',
  backgroundColor: getStatusColor(status),
  color: '#fff',
});

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

const getCategoryStyle = (category, colorGradients) => ({
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 'bold',
  backgroundColor: colorGradients[0],
  color: '#fff',
});

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default TableView;
