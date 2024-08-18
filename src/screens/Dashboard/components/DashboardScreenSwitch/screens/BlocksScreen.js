import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaCog, FaRegCircle } from 'react-icons/fa';
import { useTasksContext } from '../../../../../context/useTasksContext';

const BlocksScreen = () => {
  const { tasks } = useTasksContext();
  const [weeklyTasks, setWeeklyTasks] = useState({});
  const [settings, setSettings] = useState({
    hiddenDays: [],
    hideEmpty: false,
    showSettings: false,
  });

  useEffect(() => {
    const groupedTasks = tasks.reduce((acc, task) => {
      const startDate = new Date(task.date || task.updatedAt);
      const dayOfWeek = startDate.toLocaleString('en-US', { weekday: 'long' });

      if (!acc[dayOfWeek]) {
        acc[dayOfWeek] = [];
      }

      acc[dayOfWeek].push({
        id: task._id,
        title: task.name,
        isDone: task.status === 'completed',
        gradient: [task.tagColor, lightenColor(task.tagColor, 20)],
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
    <div
      style={{
        background: `linear-gradient(135deg, ${task.gradient[0]}, ${task.gradient[1]})`,
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        color: '#141b35',
        padding: '12px',
        marginBottom: '12px',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1em' }}>{task.title}</span>
        {task.isDone ? (
          <FaCheckCircle style={{ color: '#4CAF50', fontSize: '1.2em' }} />
        ) : (
          <FaRegCircle style={{ color: '#757575', fontSize: '1.2em' }} />
        )}
      </div>
      <span style={{ fontSize: '0.9em', marginTop: '4px', display: 'block' }}>{task.category}</span>
    </div>
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
    <div
      style={{
        padding: '30px',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: '#f5f7fa',
        position: 'relative',
      }}
    >
      <h1
        style={{
          fontSize: '2.8em',
          marginTop: '0',
          marginBottom: '30px',
          color: '#141b35',
          textAlign: 'center',
          fontWeight: '600',
        }}
      >
        Weekly Schedule
      </h1>
      <div
        style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          cursor: 'pointer',
        }}
        onClick={toggleSettings}
      >
        <FaCog size={24} color='#141b35' />
      </div>
      {settings.showSettings && (
        <div
          style={{
            position: 'absolute',
            top: '60px',
            right: '30px',
            backgroundColor: '#ffffff',
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3>Settings</h3>
          <div>
            <label>
              <input type='checkbox' checked={settings.hideEmpty} onChange={toggleHideEmpty} />
              Hide Empty Days
            </label>
          </div>
          <h4>Hide Days:</h4>
          {weekDays.map((day) => (
            <div key={day}>
              <label>
                <input
                  type='checkbox'
                  checked={settings.hiddenDays.includes(day)}
                  onChange={() => toggleHideDay(day)}
                />
                {day}
              </label>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
        {visibleDays.map((day) => (
          <div
            key={day}
            style={{
              width: `calc(${100 / visibleDays.length}% - ${
                ((visibleDays.length - 1) * 20) / visibleDays.length
              }px)`,
              minWidth: '200px',
              backgroundColor: '#ffffff',
              borderRadius: '15px',
              padding: '15px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              marginBottom: '20px',
            }}
          >
            <h2
              style={{
                fontSize: '1.3em',
                textAlign: 'center',
                marginBottom: '15px',
                color: '#2c3e50',
              }}
            >
              {day}
            </h2>
            {weeklyTasks[day] &&
              weeklyTasks[day].map((task) => <TaskItem key={task.id} task={task} />)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlocksScreen;
