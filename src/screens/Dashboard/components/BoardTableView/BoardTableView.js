import React, { useState } from 'react';
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

const TableView = () => {
  const { tasks, updateTask } = useTasksContext();
  console.log('🚀  tasks:', tasks);
  const { colorGradients } = useProjectContext();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const renderHeader = () => {
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

  const renderTableContentRow = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          borderBottom: '1px solid #e0e0e0',
          color: '#484560',
          fontWeight: 500,
          fontSize: '14px',
        }}
      >
        <div style={{ width: '20px', padding: '10px', borderRight: '1px solid #e0e0e0' }}>
          <input type='checkbox' />
        </div>
        <div style={{ flex: 2, padding: '10px', borderRight: '1px solid #e0e0e0' }}>
          Do something
        </div>
        <div style={{ flex: 1, padding: '10px', borderRight: '1px solid #e0e0e0' }}>
          some estimation
        </div>
        <div style={{ flex: 1, padding: '10px', borderRight: '1px solid #e0e0e0' }}>
          {getStatusColor('not-started')}
        </div>
        <div style={{ flex: 1, padding: '10px', borderRight: '1px solid #e0e0e0' }}>
          {renderUserCircle('J')}
        </div>
        <div style={{ flex: 1, padding: '10px', borderRight: '1px solid #e0e0e0' }}>
          {renderPriorityBadge('high')}
        </div>
        <div style={{ width: '40px', padding: '10px' }}>...</div>
      </div>
    );
  };

  const renderTable = () => {
    return (
      <div>
        {renderTableHeading()}
        {renderTableContents()}
      </div>
    );
  };

  const renderTableHeading = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f9f9f9',
        }}
      >
        <div style={{ width: '20px', padding: '10px' }}>
          <input type='checkbox' />
        </div>
        <div style={{ flex: 2, padding: '10px' }}>
          <FaRegClipboard /> Task Name
        </div>
        <div style={{ flex: 1, padding: '10px' }}>
          <FaRegClock /> Task Estimation
        </div>
        <div style={{ flex: 1, padding: '10px' }}>
          <FaRegChartBar /> Task Status
        </div>
        <div style={{ flex: 1, padding: '10px' }}>
          <FaRegUserCircle /> Task People
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

  const renderTableContents = () => {
    return (
      <div>
        {renderTableContentRow()}
        {renderTableContentRow()}
        {renderTableContentRow()}
      </div>
    );
  };

  const renderPriorityBadge = (priority) => {
    const priorityColors = {
      low: '#00C853',
      medium: '#FFA000',
      high: '#D50000',
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
        {priority}
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
    <div style={{ overflowX: 'auto', width: '100%', color: '#484560' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          {renderHeader()}
          {renderTable()}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          {renderHeader()}
          {renderTable()}
        </div>
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
