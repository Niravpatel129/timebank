import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { useTasksContext } from '../../../../../context/useTasksContext';

const BlocksScreen = () => {
  const { tasks } = useTasksContext();
  console.log('🚀  tasks:', tasks);
  const [calendarBlocks, setCalendarBlocks] = useState([]);
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Generate calendar blocks with fake data
    const blocks = [
      {
        id: 1,
        title: 'Design meeting',
        date: '2023-05-15',
        startTime: 9,
        duration: 2,
        isDone: false,
        gradient: ['#E6D7C3', '#F0E6D8'],
        day: 'Monday',
        category: 'Meeting',
      },
      {
        id: 2,
        title: 'Code review',
        date: '2023-05-15',
        startTime: 11,
        duration: 1,
        isDone: true,
        gradient: ['#C3D7E6', '#D8E6F0'],
        day: 'Monday',
        category: 'Development',
      },
      {
        id: 3,
        title: 'Project planning',
        date: '2023-05-16',
        startTime: 13,
        duration: 3,
        isDone: false,
        gradient: ['#E6D7C3', '#F0E6D8'],
        day: 'Tuesday',
        category: 'Planning',
      },
      {
        id: 4,
        title: 'Client call',
        date: '2023-05-17',
        startTime: 10,
        duration: 2,
        isDone: false,
        gradient: ['#D7E6C3', '#E6F0D8'],
        day: 'Wednesday',
        category: 'Client',
      },
      {
        id: 5,
        title: 'Team lunch',
        date: '2023-05-17',
        startTime: 12,
        duration: 1,
        isDone: true,
        gradient: ['#E6C3D7', '#F0D8E6'],
        day: 'Wednesday',
        category: 'Team Building',
      },
      {
        id: 6,
        title: 'Bug fixing',
        date: '2023-05-18',
        startTime: 14,
        duration: 2,
        isDone: false,
        gradient: ['#C3D7E6', '#D8E6F0'],
        day: 'Thursday',
        category: 'Development',
      },
      {
        id: 7,
        title: 'Feature implementation',
        date: '2023-05-18',
        startTime: 16,
        duration: 3,
        isDone: false,
        gradient: ['#E6D7C3', '#F0E6D8'],
        day: 'Thursday',
        category: 'Development',
      },
      {
        id: 8,
        title: 'Weekly report',
        date: '2023-05-19',
        startTime: 9,
        duration: 1,
        isDone: false,
        gradient: ['#D7E6C3', '#E6F0D8'],
        day: 'Friday',
        category: 'Reporting',
      },
      {
        id: 9,
        title: 'Team building',
        date: '2023-05-19',
        startTime: 15,
        duration: 2,
        isDone: true,
        gradient: ['#E6C3D7', '#F0D8E6'],
        day: 'Friday',
        category: 'Team Building',
      },
    ];
    setCalendarBlocks(blocks);

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getCurrentTimePosition = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return (hours * 60 + minutes) * (60 / 60) + 40; // 60px per hour, 40px offset for header
  };

  return (
    <div
      style={{
        padding: '20px',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <h1 style={{ fontSize: '2.5em', marginTop: '0', marginBottom: '20px', color: '#141b35' }}>
        Weekly Schedule
      </h1>
      <div
        style={{
          width: '100%',
          height: 'calc(100% - 80px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div style={{ display: 'flex', minWidth: 'fit-content', position: 'relative' }}>
          <div
            style={{
              width: '50px',
              marginRight: '10px',
              flexShrink: 0,
              position: 'sticky',
              left: 0,
              zIndex: 1,
            }}
          >
            <div style={{ height: '40px' }} />{' '}
            {/* Empty space for alignment with weekday headers */}
            {hours.map((hour) => (
              <div
                key={hour}
                style={{
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#141b35',
                }}
              >
                {hour}:00
              </div>
            ))}
          </div>
          {weekdays.map((day) => (
            <div
              key={day}
              style={{
                flex: 1,
                minWidth: '150px',
                display: 'flex',
                flexDirection: 'column',
                height: '1480px', // 24 hours * 60px + 40px for the header
                position: 'relative',
                borderLeft: '1px solid #e0e0e0',
              }}
            >
              <div
                style={{
                  fontWeight: 'bold',
                  padding: '10px',
                  borderBottom: '1px solid #e0e0e0',
                  color: '#141b35',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  height: '40px',
                }}
              >
                {day}
              </div>
              {hours.map((hour) => (
                <div key={hour} style={{ height: '60px', borderBottom: '1px solid #e0e0e0' }} />
              ))}
              {calendarBlocks
                .filter((block) => block.day === day)
                .map((block) => (
                  <motion.div
                    key={block.id}
                    style={{
                      position: 'absolute',
                      top: `${block.startTime * 60 + 40}px`, // Add 40px to account for the header
                      left: '5px',
                      right: '5px',
                      height: `${block.duration * 60}px`,
                      background: `linear-gradient(135deg, ${block.gradient?.[0] || '#E6E6E6'}, ${
                        block.gradient?.[1] || '#F0F0F0'
                      })`,
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '10px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                        }}
                      >
                        <span
                          style={{
                            color: '#141b35',
                            textAlign: 'left',
                            wordBreak: 'break-word',
                            fontWeight: 'bold',
                            fontSize: '1.1em',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '100%',
                          }}
                          title={block.title}
                        >
                          {block.title.length > 20
                            ? block.title.substring(0, 20) + '...'
                            : block.title}
                        </span>
                        <span style={{ color: '#141b35', fontSize: '0.8em', marginTop: '4px' }}>
                          {block.category}
                        </span>
                      </div>
                      {block.isDone ? (
                        <FaCheckCircle color='#141b35' />
                      ) : (
                        <FaRegCircle color='#141b35' />
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        marginTop: '10px',
                      }}
                    >
                      <span style={{ color: '#141b35', fontSize: '0.9em' }}>{block.date}</span>
                      <span style={{ color: '#141b35', fontSize: '0.9em' }}>
                        {`${block.startTime}:00 - ${block.startTime + block.duration}:00`}
                      </span>
                    </div>
                  </motion.div>
                ))}
            </div>
          ))}
          <div
            style={{
              position: 'absolute',
              top: `${getCurrentTimePosition()}px`,
              left: 0,
              right: 0,
              height: '2px',
              backgroundColor: '#0202022c',
              zIndex: 2,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlocksScreen;
