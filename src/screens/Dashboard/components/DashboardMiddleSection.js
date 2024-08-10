import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import { useTasksContext } from '../../../context/useTasksContext';
import secondsToTimeObj from '../../../helpers/secondsToTimeObj';
import Checklist from './CheckList';
import { commonStyles } from './sharedStyles/commonStyles';

const fakeProfiles = ['User1', 'User2', 'User3'];

const TaskList = ({ tasks, listType, moveTask, onEditTask }) => {
  return (
    <motion.div style={{ minHeight: '50px', padding: '10px 0' }}>
      <AnimatePresence>
        {tasks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tasks.map((task) => (
              <Checklist
                onEditTask={onEditTask}
                key={task.id}
                id={task.id}
                title={task.name}
                tag={task.category}
                status={task.status}
                time={`${Math.floor(task.taskDuration / 3600)}:${String(
                  Math.floor((task.taskDuration % 3600) / 60),
                ).padStart(2, '0')}`}
                taskDuration={task.taskDuration}
                profileImage='https://steamuserimages-a.akamaihd.net/ugc/952958837545085710/66EE7FE7365BF1365AFA9E8EB3C7447FF4DF81CD/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
                listType={listType}
                moveTask={moveTask}
                disabled={listType === 'currentWeek' && task.status === 'done'}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ color: '#888', textAlign: '' }}
          >
            No tasks in this list
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function DashboardComponent({ handleTriggerAddTaskButton, onEditTask }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all' or 'my'
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const { tasks, updateTask, totalTimeSpent, dailyTimeSpent } = useTasksContext();
  const username = 'user1'; // Assuming the current user's username is 'user1'
  const [title, setTitle] = useState('Storybook for Vue.js');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [totalHoursLastTwoMonths, setTotalHoursLastTwoMonths] = useState(0);

  const handleSearch = () => {
    if (isSearchOpen) {
      // Close the search
      setIsSearchOpen(false);
      setSearchQuery('');
    } else {
      setIsSearchOpen(true);
    }
  };

  const isCurrentWeek = (date) => {
    if (!date) return false;
    const now = new Date();
    const taskDate = new Date(date);
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    return taskDate >= weekStart && taskDate <= weekEnd;
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) => filterType === 'all' || (filterType === 'my' && task.assignee === username),
    );
  }, [tasks, filterType, username]);

  const currentWeekTasks = useMemo(
    () => filteredTasks.filter((task) => isCurrentWeek(task.date)),
    [filteredTasks],
  );

  const thingsToDoTasks = useMemo(
    () => filteredTasks.filter((task) => !isCurrentWeek(task.date)),
    [filteredTasks],
  );

  const moveTask = useCallback(
    (id, sourceList, targetList) => {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        const newDate =
          targetList === 'currentWeek'
            ? new Date().toISOString().split('T')[0]
            : new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0];
        updateTask({ ...task, date: newDate });
      }
    },
    [tasks, updateTask],
  );

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };

  useEffect(() => {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const totalSeconds = tasks.reduce((total, task) => {
      const taskDate = new Date(task.date);
      if (taskDate >= twoMonthsAgo && task.status === 'completed') {
        return total + (task.timeSpent || 0);
      }
      return total;
    }, 0);

    const totalHours = totalSeconds / 3600;
    setTotalHoursLastTwoMonths(totalHours.toFixed(2));
  }, [tasks]);

  const getContributionColor = (timeSpent) => {
    if (timeSpent === 0) return '#f0f0f0';
    if (timeSpent <= 1800) return '#d1c9f5'; // 30 minutes
    if (timeSpent <= 3600) return '#a799e8'; // 1 hour
    if (timeSpent <= 7200) return '#7d69db'; // 2 hours
    if (timeSpent <= 14400) return '#5339ce'; // 4 hours
    return commonStyles.primaryColor;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          backgroundColor: '#ffffff',
          fontFamily: 'Arial, sans-serif',
          padding: '20px',
          paddingBottom: '100px',
          height: '100vh',
          overflow: 'auto',
        }}
      >
        {/* Top Section */}
        <div
          style={{
            ...commonStyles.flexContainer,
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <div>
            <div style={{ fontSize: '14px', color: '#8888a4' }}>
              <span style={{ marginRight: '10px' }}>Project:</span>
              <div
                style={{
                  backgroundColor: '#eae8f2',
                  display: 'inline-block',
                  padding: '5px 10px',
                  borderRadius: '15px',
                  fontSize: '14px',
                  marginBottom: '10px',
                  fontWeight: 300,
                  color: '#341dc0',
                }}
              >
                design system
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {isEditingTitle ? (
                <input
                  type='text'
                  value={title}
                  onChange={handleTitleChange}
                  onBlur={handleTitleBlur}
                  style={{
                    color: commonStyles.primaryColor,
                    fontSize: '28px',
                    margin: '0',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                  }}
                  autoFocus
                />
              ) : (
                <h1
                  style={{
                    color: commonStyles.primaryColor,
                    fontSize: '28px',
                    margin: '0',
                    cursor: 'pointer',
                  }}
                  onClick={handleTitleClick}
                >
                  {title}
                </h1>
              )}
            </div>
          </div>
          <div style={commonStyles.flexContainer}>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
              {/* profiles of 3 users, stacking like overlapping chips */}
              {fakeProfiles.map((user, index) => (
                <div
                  key={user}
                  data-tooltip-id={`day-${index}`}
                  data-tooltip-content={`${user} - Last active: 2 hours ago`}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src='https://steamuserimages-a.akamaihd.net/ugc/952958837545085710/66EE7FE7365BF1365AFA9E8EB3C7447FF4DF81CD/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
                    alt={`${user} profile`}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      marginRight: index !== 2 ? '-10px' : '0',
                      border: '2px solid white',
                      zIndex: 3 - index,
                    }}
                  />
                </div>
              ))}
            </div>
            <AnimatePresence>
              {isSearchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '200px', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  type='text'
                  placeholder='Search...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '5px 10px',
                    marginRight: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                  }}
                />
              )}
            </AnimatePresence>
            <FaSearch
              style={{
                marginRight: '15px',
                fontSize: '20px',
                color: commonStyles.secondaryColor,
                cursor: 'pointer',
              }}
              onClick={handleSearch}
            />
            <div
              style={{
                backgroundColor: commonStyles.primaryColor,
                color: 'white',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={handleTriggerAddTaskButton}
            >
              <FaPlus />
            </div>
          </div>
        </div>

        <div
          style={{
            ...commonStyles.flexContainer,
            justifyContent: 'space-between',
            gap: '50px',
          }}
        >
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {Array(60)
              .fill()
              .map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (59 - i));
                const dateString = date.toISOString().split('T')[0];
                const timeSpent =
                  dailyTimeSpent && dailyTimeSpent[dateString] ? dailyTimeSpent[dateString] : 0;
                return (
                  <div
                    data-tooltip-id={`day-${59 - i}`}
                    data-tooltip-content={`${dateString} - ${secondsToTimeObj(timeSpent).hours}:${
                      secondsToTimeObj(timeSpent).minutes
                    }:${secondsToTimeObj(timeSpent).seconds} hours`}
                    key={59 - i}
                    style={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: getContributionColor(timeSpent),
                      borderRadius: '4px',
                    }}
                  />
                );
              })}
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 'normal', width: '100%' }}>
              <div style={{ ...commonStyles.flexContainer, gap: '4px' }}>
                <span
                  style={{
                    color: commonStyles.primaryColor,
                    fontSize: '18px',
                    fontWeight: 'bold',
                    textWrap: 'nowrap',
                  }}
                >
                  {secondsToTimeObj(totalTimeSpent || 0).hours}:
                  {secondsToTimeObj(totalTimeSpent || 0).minutes}:
                  {secondsToTimeObj(totalTimeSpent || 0).seconds}
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    color: commonStyles.secondaryColor,
                    textWrap: 'nowrap',
                  }}
                >
                  hours in the last 2 months
                </span>
              </div>
            </div>
            <div
              style={{
                fontSize: '12px',
                color: commonStyles.secondaryColor,
                ...commonStyles.flexContainer,
                gap: '4px',
              }}
            >
              Less
              <div style={{ display: 'flex', gap: '1px' }}>
                {Array(5)
                  .fill()
                  .map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '20%',
                        backgroundColor:
                          i === 0
                            ? '#d1c9f5'
                            : i === 1
                            ? '#a799e8'
                            : i === 2
                            ? '#7d69db'
                            : i === 3
                            ? '#5339ce'
                            : commonStyles.primaryColor,
                        marginLeft: '2px',
                      }}
                    />
                  ))}
              </div>
              More
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div
          style={{
            ...commonStyles.flexContainer,
            justifyContent: 'space-between',
            marginTop: '30px',
          }}
        >
          <h2
            style={{
              color: commonStyles.primaryColor,
              marginBottom: '20px',
              ...commonStyles.flexContainer,
              gap: '4px',
            }}
          >
            <span>Current week</span>
          </h2>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ ...commonStyles.flexContainer, gap: '20px' }}>
              {['All Tasks', 'My Tasks'].map((text, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    color:
                      filterType === (index === 0 ? 'all' : 'my')
                        ? commonStyles.primaryColor
                        : commonStyles.secondaryColor,
                    fontSize: '15px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    padding: '8px 12px',
                    borderRadius: '20px',
                    backgroundColor:
                      filterType === (index === 0 ? 'all' : 'my')
                        ? 'rgba(52, 29, 192, 0.1)'
                        : 'transparent',
                    transition: 'background-color 0.3s ease',
                  }}
                  onClick={() => setFilterType(index === 0 ? 'all' : 'my')}
                >
                  {text}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        <TaskList
          tasks={currentWeekTasks}
          listType='currentWeek'
          moveTask={moveTask}
          onEditTask={onEditTask}
        />

        <h2 style={{ color: commonStyles.primaryColor, marginTop: '30px', marginBottom: '20px' }}>
          Things to do
        </h2>

        {/* items */}
        <TaskList
          tasks={thingsToDoTasks}
          listType='thingsToDo'
          moveTask={moveTask}
          onEditTask={onEditTask}
        />
      </div>
      {fakeProfiles.map((profile, index) => (
        <Tooltip key={`${profile}-${index}`} id={`day-${index}`} />
      ))}

      {Array(60)
        .fill()
        .map((_, i) => {
          return <Tooltip key={i} id={`day-${i}`} />;
        })}
    </DndProvider>
  );
}
