import { AnimatePresence, motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';
import { CiClock1 } from 'react-icons/ci';
import { FiFilter } from 'react-icons/fi';
import { useHistoryContext } from '../../../../context/useHistoryContext';

export default function LastActivity({ colorGradients }) {
  const { selectedProjectHistory } = useHistoryContext();
  const [filter, setFilter] = useState('all');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const seconds = Math.floor(diffTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    if (weeks < 4) return `${weeks} weeks ago`;
    if (months < 12) return `${months} months ago`;
    return `${years} years ago`;
  };

  const getActionText = (action) => {
    switch (action) {
      case 'add':
        return 'Created';
      case 'update':
        return 'Updated';
      case 'delete':
        return 'Deleted';
      case 'complete':
        return 'Finished';
      default:
        return action.charAt(0).toUpperCase() + action.slice(1);
    }
  };

  const filteredHistory = useMemo(() => {
    const now = new Date();
    return selectedProjectHistory.filter((item) => {
      const itemDate = new Date(item.timestamp);
      switch (filter) {
        case 'today':
          return itemDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return itemDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          return itemDate >= monthAgo;
        default:
          return true;
      }
    });
  }, [selectedProjectHistory, filter]);

  const toggleFilter = () => {
    setFilter((prevFilter) => {
      switch (prevFilter) {
        case 'all':
          return 'today';
        case 'today':
          return 'week';
        case 'week':
          return 'month';
        case 'month':
          return 'all';
        default:
          return 'all';
      }
    });
  };

  const renderHistoryItem = (item, index) => (
    <motion.div
      key={item._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      style={{
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: '15px',
      }}
    >
      <div>
        <div
          style={{
            color: '#2d2c31',
            fontSize: '15px',
            fontWeight: '400',
            marginBottom: '5px',
            textTransform: 'capitalize',
            marginRight: '10px',
          }}
        >
          {item.entityName}
        </div>
        <div style={{ color: '#8f8f9d', fontSize: '14px' }}>
          {getActionText(item.action)} {item.entityType} {formatDate(item.timestamp)}
        </div>
      </div>
      <div
        style={{
          color: colorGradients[0],
          fontSize: '14px',
          fontWeight: 400,
          display: 'flex',
          alignItems: 'center',
          textWrap: 'nowrap',
        }}
      >
        <span
          style={{
            marginRight: '5px',
            fontSize: '12px',
            paddingTop: '2px',
            color: '#cbccd5',
          }}
        >
          <CiClock1 />
        </span>
        <span>{Math.floor(item.details.taskDuration / 60)} minutes</span>
      </div>
    </motion.div>
  );

  const renderEmptyState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#8f8f9d',
        fontSize: '16px',
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: '48px', marginBottom: '20px' }}>🏝️</span>
      <p>No activity to show. Time to start something new!</p>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
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
              color: colorGradients[0],
              fontSize: '18px',
              fontWeight: 'bold',
              margin: 0,
            }}
          >
            Your last activity
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '80px',
              justifyContent: 'flex-end',
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{ cursor: 'pointer', marginRight: '10px' }}
              onClick={toggleFilter}
            >
              <FiFilter />
            </motion.div>
            <motion.span
              key={filter}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              style={{ fontSize: '1px', color: '#8f8f9d' }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </motion.span>
          </div>
        </div>
      </div>
      <div style={{ overflowY: 'scroll', flex: 1, padding: '0 20px 20px' }}>
        <AnimatePresence>
          {filteredHistory.length > 0 ? filteredHistory.map(renderHistoryItem) : renderEmptyState()}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
