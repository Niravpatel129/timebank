import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useTasksContext } from '../../../context/useTasksContext';
import Checklist from './CheckList';
import { commonStyles } from './sharedStyles/commonStyles';

const TaskList = ({ tasks, listType, moveTask }) => {
  return (
    <motion.div style={{ minHeight: '50px', padding: '10px 0' }}>
      <AnimatePresence>
        {tasks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tasks.map((task) => (
              <Checklist
                key={task.id}
                id={task.id}
                title={task.name}
                tag={task.category}
                status={task.status}
                time={`${Math.floor(task.taskDuration / 3600)}:${String(
                  Math.floor((task.taskDuration % 3600) / 60),
                ).padStart(2, '0')}`}
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
            style={{ color: '#888', textAlign: 'center' }}
          >
            No tasks in this list
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function DashboardComponent({ handleTriggerAddTaskButton }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { tasks, updateTask } = useTasksContext();

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

  const currentWeekTasks = tasks.filter((task) => isCurrentWeek(task.date));
  const thingsToDoTasks = tasks.filter((task) => !isCurrentWeek(task.date));

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

            <h1 style={{ color: commonStyles.primaryColor, fontSize: '28px', margin: '0' }}>
              Storybook for Vue.js
            </h1>
          </div>
          <div style={commonStyles.flexContainer}>
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
              .map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor:
                      i % 5 === 0 ? commonStyles.primaryColor : i % 3 === 0 ? '#5a47d1' : '#d1c9f5',
                    borderRadius: '4px',
                  }}
                />
              ))}
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 'normal', width: '100%' }}>
              <div style={{ ...commonStyles.flexContainer, gap: '4px' }}>
                <span
                  style={{
                    color: commonStyles.primaryColor,
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  67:30{' '}
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    color: commonStyles.secondaryColor,
                    textWrap: 'nowrap',
                  }}
                >
                  hours in the last 2 month
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
          <div>
            <div style={{ ...commonStyles.flexContainer, gap: '20px' }}>
              {['All Tasks', 'My Tasks'].map((text, index) => (
                <div
                  key={index}
                  style={{
                    color: index === 0 ? commonStyles.primaryColor : commonStyles.secondaryColor,
                    fontSize: '15px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  {text}
                </div>
              ))}
              <div
                style={{
                  cursor: 'pointer',
                  ...commonStyles.flexContainer,
                }}
              >
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M3 17V19H9V17H3ZM3 5V7H13V5H3ZM13 21V19H21V17H13V15H11V21H13ZM7 9V11H3V13H7V15H9V9H7ZM21 13V11H11V13H21ZM15 9H17V7H21V5H17V3H15V9Z'
                    fill={commonStyles.secondaryColor}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <TaskList tasks={currentWeekTasks} listType='currentWeek' moveTask={moveTask} />

        <h2 style={{ color: commonStyles.primaryColor, marginTop: '30px', marginBottom: '20px' }}>
          Things to do
        </h2>

        {/* items */}
        <TaskList tasks={thingsToDoTasks} listType='thingsToDo' moveTask={moveTask} />
      </div>
    </DndProvider>
  );
}
