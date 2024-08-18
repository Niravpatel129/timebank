import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaCog, FaEye, FaEyeSlash, FaRegCircle } from 'react-icons/fa';
import { useTasksContext } from '../../../../../context/useTasksContext';

const BlocksScreen = () => {
  const { tasks } = useTasksContext();
  const [weeklyTasks, setWeeklyTasks] = useState({});
  const [settings, setSettings] = useState({
    hiddenDays: [],
    hideEmpty: false,
    showSettings: false,
  });

  const muteColors = [
    '#E6E6FA', // Lavender
    '#F0FFF0', // Honeydew
    '#FFF0F5', // Lavender Blush
    '#F0FFFF', // Azure
    '#F5F5DC', // Beige
    '#FFF5EE', // Seashell
    '#F0F8FF', // Alice Blue
    '#F8F8FF', // Ghost White
    '#FFF5E6', // Linen
    '#FFFAF0', // Floral White
  ];

  useEffect(() => {
    const groupedTasks = tasks.reduce((acc, task, index) => {
      const startDate = new Date(task.date || task.updatedAt);
      const dayOfWeek = startDate.toLocaleString('en-US', { weekday: 'long' });

      if (!acc[dayOfWeek]) {
        acc[dayOfWeek] = [];
      }

      acc[dayOfWeek].push({
        id: task._id,
        title: task.name,
        isDone: task.status === 'completed',
        gradient: [
          muteColors[index % muteColors.length],
          lightenColor(muteColors[index % muteColors.length], 10),
        ],
        category: task.category || 'Uncategorized',
      });

      return acc;
    }, {});

    setWeeklyTasks(groupedTasks);
  }, [tasks]);

  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = ((num >> 8) & 0x00ff) + amt,
      B = (num & 0x0000ff) + amt;
    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  const TaskItem = ({ task }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{
        background: `linear-gradient(135deg, ${task.gradient[0]}, ${task.gradient[1]})`,
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        color: '#4A4A4A',
        padding: '12px',
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: '600', fontSize: '1em' }}>{task.title}</span>
        {task.isDone ? (
          <FaCheckCircle style={{ color: '#7CB342', fontSize: '1.2em' }} />
        ) : (
          <FaRegCircle style={{ color: '#9E9E9E', fontSize: '1.2em' }} />
        )}
      </div>
      <span style={{ fontSize: '0.9em', marginTop: '4px', display: 'block', color: '#757575' }}>
        {task.category}
      </span>
    </motion.div>
  );

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleSettings = () => {
    setSettings((prev) => ({ ...prev, showSettings: !prev.showSettings }));
  };

  const toggleHideDay = (day) => {
    setSettings((prev) => ({
      ...prev,
      hiddenDays: prev.hiddenDays.includes(day)
        ? prev.hiddenDays.filter((d) => d !== day)
        : [...prev.hiddenDays, day],
    }));
  };

  const toggleHideEmpty = () => {
    setSettings((prev) => ({ ...prev, hideEmpty: !prev.hideEmpty }));
  };

  const visibleDays = weekDays.filter(
    (day) =>
      !settings.hiddenDays.includes(day) &&
      (!settings.hideEmpty || (weeklyTasks[day] && weeklyTasks[day].length > 0)),
  );

  return (
    <LayoutGroup>
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          padding: '30px',
          width: '100%',
          height: '100%',
          overflow: 'auto',
          backgroundColor: '#FAFAFA',
          position: 'relative',
        }}
      >
        <motion.h1
          layout
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 120 }}
          style={{
            fontSize: '2.8em',
            marginTop: '0',
            marginBottom: '30px',
            color: '#3E4C59',
            textAlign: 'center',
            fontWeight: '600',
          }}
        >
          Weekly Schedule
        </motion.h1>
        <motion.div
          layout
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: 'absolute',
            top: '30px',
            right: '30px',
            cursor: 'pointer',
          }}
          onClick={toggleSettings}
        >
          <FaCog size={24} color='#3E4C59' />
        </motion.div>
        <AnimatePresence>
          {settings.showSettings && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                top: '60px',
                right: '30px',
                backgroundColor: '#FFFFFF',
                padding: '20px',
                borderRadius: '15px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
              }}
            >
              <h3 style={{ color: '#3E4C59', marginBottom: '15px' }}>Settings</h3>
              <div style={{ marginBottom: '15px' }}>
                <label
                  style={{
                    color: '#4A4A4A',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type='checkbox'
                    checked={settings.hideEmpty}
                    onChange={toggleHideEmpty}
                    style={{ marginRight: '10px' }}
                  />
                  Hide Empty Days
                  {settings.hideEmpty ? (
                    <FaEyeSlash style={{ marginLeft: '10px' }} />
                  ) : (
                    <FaEye style={{ marginLeft: '10px' }} />
                  )}
                </label>
              </div>
              <h4 style={{ color: '#3E4C59', marginBottom: '10px' }}>Hide Days:</h4>
              {weekDays.map((day) => (
                <div key={day} style={{ marginBottom: '5px' }}>
                  <label
                    style={{
                      color: '#4A4A4A',
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={settings.hiddenDays.includes(day)}
                      onChange={() => toggleHideDay(day)}
                      style={{ marginRight: '10px' }}
                    />
                    {day}
                    {settings.hiddenDays.includes(day) ? (
                      <FaEyeSlash style={{ marginLeft: '10px' }} />
                    ) : (
                      <FaEye style={{ marginLeft: '10px' }} />
                    )}
                  </label>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          layout
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: 'flex', justifyContent: 'flex-start', gap: '20px', flexWrap: 'nowrap' }}
        >
          <AnimatePresence>
            {visibleDays.map((day) => (
              <motion.div
                layout
                key={day}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{
                  width: `calc(${100 / visibleDays.length}% - ${
                    ((visibleDays.length - 1) * 20) / visibleDays.length
                  }px)`,
                  minWidth: '200px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '15px',
                  padding: '15px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)',
                  marginBottom: '20px',
                }}
              >
                <motion.h2
                  layout
                  style={{
                    fontSize: '1.3em',
                    textAlign: 'center',
                    marginBottom: '15px',
                    color: '#3E4C59',
                  }}
                >
                  {day}
                </motion.h2>
                <AnimatePresence>
                  {weeklyTasks[day] &&
                    weeklyTasks[day].map((task) => (
                      <motion.div key={task.id} layout>
                        <TaskItem task={task} />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
};

export default BlocksScreen;
