import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaCircle } from 'react-icons/fa';
import { FaDollarSign, FaPlus } from 'react-icons/fa6';
import { GoTag } from 'react-icons/go';
import { LuUsers2 } from 'react-icons/lu';
import { Tooltip } from 'react-tooltip';
import { useScreenContext } from '../context/useScreenContext';
import secondsToTime from '../helpers/secondsToTime';

export default function TrackingCard({ currentTask, toggleAddTimeModal }) {
  const { isRunning, getDisplayTime } = useScreenContext();
  const displayTime = secondsToTime(getDisplayTime());
  const status = currentTask ? (isRunning ? 'running' : 'paused') : 'not-started';
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case 'running':
        return '#4CAF50';
      case 'paused':
        return '#FFC107';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <motion.div
      style={{ marginBottom: '14px', marginTop: '14px', position: 'relative' }}
      className='tracking-card'
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <h2
        style={{
          fontSize: '1.1rem',
          fontWeight: '100',
          color: '#d7ceed',
          margin: '8px',
          marginBottom: '8px',
          marginTop: '0px',
        }}
      >
        Tracking
      </h2>
      <motion.div
        style={{
          margin: '8px',
          marginBottom: '0px',
          borderRadius: '12px',
          color: 'white',
          backgroundColor: '#15093d',
          borderRadius: '12px',
          border: '0.1px solid #483776',
          position: 'relative',
        }}
        className='tracking-card-inner'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          style={{
            position: 'absolute',
            right: '8px',
            top: '8px',
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
          >
            <motion.div
              onClick={(e) => {
                e.stopPropagation();
                console.log('clicked');
                toggleAddTimeModal();
              }}
              style={{
                cursor: 'pointer',
              }}
              className='add-time-icon'
              initial={{ scale: 0 }}
              animate={{ scale: isHovered ? 1 : 0, color: isHovered ? '#ffffff' : '#8c82c6' }}
              transition={{ duration: 0.3 }}
              data-tooltip-id='add-time-tooltip'
              data-tooltip-content='Add time'
            >
              <FaPlus style={{ fontSize: '1rem', marginTop: '4px' }} />
            </motion.div>
            <FaCircle
              style={{ color: getStatusColor(), fontSize: '0.8rem' }}
              data-tooltip-id='status-tooltip'
              data-tooltip-content={status}
            />
          </div>
        </div>
        <div style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '16px' }}>
          <h2
            style={{
              fontSize: '0.9rem',
              fontWeight: '100',
              color: '#e4e1e4',
              margin: 0,
              padding: 0,
              marginBottom: '4px',
            }}
          >
            {currentTask ? currentTask.category : 'No Task'}
          </h2>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: '300',
              color: '#d7ceed',
              margin: 0,
              padding: 0,
            }}
          >
            {currentTask ? currentTask.name : 'No task in progress'}
          </h3>
        </div>
        <hr
          style={{
            border: '1px solid #25164d',
            margin: '0',
            padding: '0',
            marginTop: '8px',
            marginBottom: '8px',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              data-tooltip-id='billable-tooltip'
              data-tooltip-content='Billable'
              style={{ display: 'inline-block', marginRight: '8px' }}
            >
              <FaDollarSign style={{ color: '#8c82c6', fontSize: '0.9rem' }} />
            </div>
            <div
              data-tooltip-id='client-tooltip'
              data-tooltip-content='Client'
              style={{ display: 'inline-block', marginRight: '8px' }}
            >
              <LuUsers2 style={{ color: '#8c82c6', fontSize: '0.9rem' }} />
            </div>
            <div
              data-tooltip-id='project-tooltip'
              data-tooltip-content='Project'
              style={{ display: 'inline-block' }}
            >
              <GoTag style={{ color: '#8c82c6', fontSize: '0.9rem' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                fontSize: '1rem',
                color: '#8c82c6',
                fontWeight: '300',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              data-tooltip-id='time-tooltip'
              data-tooltip-content={
                currentTask
                  ? `Created: ${new Date(currentTask.dateCreated).toLocaleString()}`
                  : 'No task'
              }
            >
              <div>{currentTask ? displayTime : '--:--:--'}</div>
            </div>
          </div>
        </div>
      </motion.div>
      <Tooltip id='billable-tooltip' />
      <Tooltip id='client-tooltip' />
      <Tooltip id='project-tooltip' />
      <Tooltip id='status-tooltip' />
      <Tooltip id='time-tooltip' />
      <Tooltip id='add-time-tooltip' />
    </motion.div>
  );
}
