import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import { useScreenContext } from '../context/useScreenContext';

export default function Results({ setScreen, currentTask }) {
  const { finishedTasks } = useScreenContext();
  console.log('🚀  finishedTasks:', finishedTasks);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [contributionsData, setContributionsData] = useState([]);

  const handleBackClick = () => {
    setScreen('home');
  };

  // Generate data for GitHub Contributions Calendar (yearly)
  const generateContributionsData = (year) => {
    const data = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];

      const count = finishedTasks.filter((entry) => {
        return entry.completedAt.split('T')[0] === dateString;
      }).length;

      console.log('🚀  count:', count);

      data.push({
        date: dateString,
        count: count,
      });
    }
    return data;
  };

  useEffect(() => {
    setContributionsData(generateContributionsData(currentYear));
  }, [currentYear, finishedTasks]);

  const handlePrevYear = () => {
    setCurrentYear((prevYear) => prevYear - 1);
  };

  const handleNextYear = () => {
    const nextYear = currentYear + 1;
    if (nextYear <= new Date().getFullYear()) {
      setCurrentYear(nextYear);
    }
  };

  // Calculate summary data from finishedTasks
  const totalHours = finishedTasks
    .reduce((total, entry) => total + entry.taskDuration / 3600, 0)
    .toFixed(2);
  const totalTasks = finishedTasks.length;
  const streakDays = calculateStreak(finishedTasks);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Function to group contributions by week
  const groupContributionsByWeek = (data) => {
    const weeks = [];
    let currentWeek = [];
    data.forEach((day, index) => {
      currentWeek.push(day);
      if ((index + 1) % 7 === 0 || index === data.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    return weeks;
  };

  const contributionWeeks = groupContributionsByWeek(contributionsData);

  // Function to calculate streak
  function calculateStreak(history) {
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < history.length; i++) {
      const entryDate = new Date(history[i].completedAt);
      entryDate.setHours(0, 0, 0, 0);

      if (entryDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (entryDate < currentDate) {
        break;
      }
    }

    return streak;
  }

  return (
    <div style={{ padding: '20px', color: '#d7ceed' }}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
        onClick={handleBackClick}
      >
        <FaArrowLeft style={{ color: '#8c82c6', fontSize: '24px' }} />
      </motion.div>

      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: 200 }}>
        Your Productivity
      </h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '50px',
          gap: '10px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            background: '#15093d',
            borderRadius: '10px',
            width: '100%',
          }}
        >
          <FaClock style={{ fontSize: '28px', marginBottom: '15px' }} />
          <h4>Total Hours</h4>
          <p>{totalHours}</p>
        </div>

        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            background: '#15093d',
            borderRadius: '10px',
            width: '100%',
          }}
        >
          <FaCalendarAlt style={{ fontSize: '28px', marginBottom: '15px' }} />
          <h4>Current Streak</h4>
          <p>{streakDays} days</p>
        </div>
      </div>

      <h2 style={{ textAlign: 'center', fontWeight: 100, margin: 0 }}>Contribution Calendar</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontWeight: 100 }}>{currentYear}</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <FaArrowLeft
            style={{
              cursor: 'pointer',
              opacity: currentYear > new Date().getFullYear() - 5 ? 1 : 0.5,
            }}
            onClick={handlePrevYear}
          />
          <FaArrowLeft
            style={{
              cursor: 'pointer',
              transform: 'rotate(180deg)',
              opacity: currentYear < new Date().getFullYear() ? 1 : 0.5,
            }}
            onClick={handleNextYear}
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
          overflowX: 'auto',
        }}
      >
        <div style={{ display: 'flex', marginTop: '10px', minWidth: 'max-content' }}>
          <div style={{ display: 'flex', gap: '3px' }}>
            {contributionWeeks.map((week, weekIndex) => (
              <div key={weekIndex} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor:
                        day.count > 0
                          ? `rgba(140, 130, 198, ${Math.min(day.count * 0.2, 1)})`
                          : 'rgba(140, 130, 198, 0.1)',
                      borderRadius: '2px',
                    }}
                    data-tooltip-id={`day-${weekIndex}-${dayIndex}`}
                    data-tooltip-content={`${day.date}: ${day.count} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '10px',
            minWidth: 'max-content',
          }}
        >
          {months.map((month, index) => (
            <span key={index} style={{ fontSize: '12px', color: '#8c82c6' }}>
              {month}
            </span>
          ))}
        </div>
      </div>
      {contributionWeeks.map((week, weekIndex) =>
        week.map((day, dayIndex) => (
          <Tooltip key={`${weekIndex}-${dayIndex}`} id={`day-${weekIndex}-${dayIndex}`} />
        )),
      )}
    </div>
  );
}
