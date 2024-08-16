import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BiPlus } from 'react-icons/bi';
import { Tooltip } from 'react-tooltip';
import newRequest from '../../../api/newReqest';
import AddTaskButton from '../../../components/AddTaskButton';
import { useProjectContext } from '../../../context/useProjectContext';
import { useTasksContext } from '../../../context/useTasksContext';
import { useUserContext } from '../../../context/useUserContext';
import secondsToTimeObj from '../../../helpers/secondsToTimeObj';
import { commonStyles } from './sharedStyles/commonStyles';
import TaskList from './TaskList/TaskList';

export default function DashboardComponent({
  handleTriggerAddTaskButton,
  onEditTask,
  handleInviteClick,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUserContext();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { selectedProject, updateProject, colorGradients } = useProjectContext();
  const [filterType, setFilterType] = useState('all');
  const { tasks, updateTask, totalTimeSpent, dailyTimeSpent, setTasks, isLoading, moveTask } =
    useTasksContext();
  const [title, setTitle] = useState(selectedProject?.name);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [totalHoursLastTwoMonths, setTotalHoursLastTwoMonths] = useState(0);
  const [lastTwoMonthsTimeSpent, setLastTwoMonthsTimeSpent] = useState({});
  const [hideCompleted, setHideCompleted] = useState(false);
  const [showInviteButton, setShowInviteButton] = useState(false);

  useEffect(() => {
    const fetchTwoMonthsAgo = async () => {
      try {
        if (!selectedProject) return;
        const twoMonthsAgo = await newRequest.get(
          `/timeTrack/last-two-months/${selectedProject?._id}`,
        );
        setLastTwoMonthsTimeSpent(twoMonthsAgo.data || {});
      } catch (error) {
        console.error('Error fetching last two months data:', error);
      }
    };

    fetchTwoMonthsAgo();
  }, [tasks, selectedProject]);

  const members = useMemo(() => {
    return selectedProject?.members?.map((member) => member?.user?.name) || [];
  }, [selectedProject]);

  useEffect(() => {
    setTitle(selectedProject?.name);
  }, [selectedProject]);

  const handleSearch = () => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
      setSearchQuery('');
    } else {
      setIsSearchOpen(true);
    }
  };

  const getTaskOrder = (listType) => {
    const storedOrder = localStorage.getItem(`taskOrder_${listType}`);
    return storedOrder ? JSON.parse(storedOrder) : [];
  };

  const setTaskOrder = (listType, order) => {
    localStorage.setItem(`taskOrder_${listType}`, JSON.stringify(order));
  };

  const sortTasks = (tasksToSort, listType) => {
    const order = getTaskOrder(listType);
    return tasksToSort.sort((a, b) => {
      const indexA = order.indexOf(a._id);
      const indexB = order.indexOf(b._id);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  };

  const currentWeekTasks = useMemo(() => {
    let filteredTasks = tasks?.filter((task) => task?.listType === 'currentWeek') || [];
    if (hideCompleted) {
      filteredTasks = filteredTasks.filter((task) => task.status !== 'completed');
    }
    filteredTasks =
      filterType === 'all'
        ? filteredTasks
        : filteredTasks.filter((task) => {
            return task.assignee?.name === user?.name;
          });
    return sortTasks(filteredTasks, 'currentWeek');
  }, [tasks, filterType, user?.name, hideCompleted]);

  const thingsToDoTasks = useMemo(() => {
    let filteredTasks = tasks?.filter((task) => task?.listType === 'thingsToDo') || [];
    if (hideCompleted) {
      filteredTasks = filteredTasks.filter((task) => task.status !== 'completed');
    }
    filteredTasks =
      filterType === 'all'
        ? filteredTasks
        : filteredTasks.filter((task) => {
            return task.assignee?.name === user?.name;
          });
    return sortTasks(filteredTasks, 'thingsToDo');
  }, [tasks, filterType, user?.name, hideCompleted]);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  useEffect(() => {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const totalSeconds = tasks.reduce((total, task) => {
      if (!task?.date) return total;
      const taskDate = new Date(task?.date);
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

  const loadingVariants = {
    start: {
      opacity: 0.5,
      y: -20,
    },
    end: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        yoyo: Infinity,
      },
    },
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <motion.div
        initial='start'
        animate={isLoading ? 'start' : 'end'}
        variants={loadingVariants}
        style={{
          backgroundColor: '#ffffff',
          fontFamily: 'sans-serif',
          padding: '20px',
          paddingBottom: '300px',
          height: '100vh',
          overflowY: tasks.length === 0 ? 'visible' : 'scroll',
          position: 'relative',
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
              <span style={{ marginRight: '10px' }}>Date Created:</span>
              <div
                style={{
                  backgroundColor: '#eae8f2',
                  display: 'inline-block',
                  padding: '5px 10px',
                  borderRadius: '15px',
                  fontSize: '14px',
                  marginBottom: '10px',
                  fontWeight: 300,
                  color: selectedProject?.projectColor?.gradient1,
                }}
              >
                {selectedProject?.createdAt
                  ? new Date(selectedProject.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
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
                  onBlur={() => {
                    updateProject(selectedProject._id, { ...selectedProject, name: title });
                    setIsEditingTitle(false);
                  }}
                  style={{
                    color: colorGradients[0],
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
                    color: colorGradients[0],
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
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '30px' }}>
              {selectedProject?.members?.map((user, index) => {
                if (!user) return null;
                const userName = user?.user.name || user?.email;

                return (
                  <div
                    key={userName}
                    data-tooltip-id={`day-${index}`}
                    data-tooltip-content={`${
                      userName[0].toUpperCase() + userName.slice(1)
                    } - Last active: 2 hours ago`}
                    style={{ cursor: 'pointer' }}
                  >
                    {user?.profileImage ? (
                      <motion.img
                        whileHover={{ scale: 1.05, backgroundColor: colorGradients[0] }}
                        whileTap={{ scale: 0.95 }}
                        src={user?.profileImage}
                        alt={`${user} profile`}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          marginRight: '-5px',
                          border: '2px solid white',
                          zIndex: members.length - index,
                        }}
                      />
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.05, backgroundColor: colorGradients[0] }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          marginRight: '-10px',
                          border: '2px solid white',
                          zIndex: members.length - index,
                          backgroundColor: '#ccc',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#fff',
                        }}
                      >
                        {userName[0].toUpperCase()}
                      </motion.div>
                    )}
                  </div>
                );
              })}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <motion.div
                  whileHover={{ scale: 1.05, backgroundColor: colorGradients[0], color: 'white' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: '2px solid white',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    zIndex: members.length + 1,
                    position: 'relative',
                    marginLeft: '-5px', // Add negative margin to align with other avatars
                  }}
                  onMouseEnter={() => setShowInviteButton(true)}
                  onMouseLeave={() => setShowInviteButton(false)}
                  onClick={handleInviteClick}
                >
                  {showInviteButton ? (
                    <BiPlus />
                  ) : (
                    <span style={{ fontSize: '16px', lineHeight: '30px' }}>...</span>
                  )}
                </motion.div>
              </div>
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
            {/* <FaSearch
              style={{
                marginRight: '15px',
                fontSize: '20px',
                color: commonStyles.secondaryColor,
                cursor: 'pointer',
              }}
              onClick={handleSearch}
            /> */}
            <AddTaskButton
              handleTriggerAddTaskButton={handleTriggerAddTaskButton}
              colorGradients={colorGradients}
              showNudge={tasks.length === 0}
            />
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
                const timeSpent = lastTwoMonthsTimeSpent[i]?.timeSpent || 0;
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
                    color: colorGradients[0],
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
              color: colorGradients[0],
              marginBottom: '20px',
              ...commonStyles.flexContainer,
              gap: '4px',
            }}
          >
            <span>Currently Working On</span>
          </h2>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* button here to toggle hide completed tasks */}

            <div
              style={{
                ...commonStyles.flexContainer,
                gap: '20px',
                textWrap: 'nowrap',
                textTransform: 'capitalize',
              }}
            >
              {['All Tasks', `${user?.name}'s Tasks`].map((text, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    color:
                      filterType === (index === 0 ? 'all' : 'my')
                        ? colorGradients[0]
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
          colorGradients={colorGradients}
        />

        <h2 style={{ color: colorGradients[0], marginTop: '30px', marginBottom: '20px' }}>
          Not Working On
        </h2>

        <div style={{ marginBottom: '300px', marginTop: '30px' }}>
          {/* items */}
          <TaskList
            tasks={thingsToDoTasks}
            listType='thingsToDo'
            moveTask={moveTask}
            onEditTask={onEditTask}
          />
        </div>
      </motion.div>

      {Array(60)
        .fill()
        .map((_, i) => {
          return <Tooltip key={i} id={`day-${i}`} />;
        })}
    </DndProvider>
  );
}
