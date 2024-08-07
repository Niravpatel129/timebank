import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import { useScreenContext } from '../context/useScreenContext';

export default function Results({ setScreen, currentTask }) {
  const { savedHistory } = useScreenContext();
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
      data.push({
        date: d.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 6), // Random count between 0 and 5
      });
    }
    return data;
  };

  useEffect(() => {
    setContributionsData(generateContributionsData(currentYear));
  }, [currentYear]);

  const handlePrevYear = () => {
    setCurrentYear((prevYear) => prevYear - 1);
  };

  const handleNextYear = () => {
    const nextYear = currentYear + 1;
    if (nextYear <= new Date().getFullYear()) {
      setCurrentYear(nextYear);
    }
  };

  // Fake summary data
  const totalHours = 120;
  const totalTasks = 45;
  const streakDays = 7;

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
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3px' }}>
        {contributionsData.map((day, index) => (
          <div
            key={index}
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: `rgba(140, 130, 198, ${day.count * 0.2})`,
              borderRadius: '2px',
            }}
            data-tooltip-id={`day-${index}`}
            data-tooltip-content={`${day.date}: ${day.count} contributions`}
          />
        ))}
      </div>
      {contributionsData.map((day, index) => (
        <Tooltip key={index} id={`day-${index}`} />
      ))}
    </div>
  );
}
