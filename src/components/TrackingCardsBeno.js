import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { FaDollarSign } from 'react-icons/fa6';
import { GoTag } from 'react-icons/go';
import { LuUsers2 } from 'react-icons/lu';
import { Tooltip } from 'react-tooltip';

export default function TrackingCardsBeno() {
  const [finishedTasks, setFinishedTasks] = useState([]);

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem('finishedTasks') || '[]');
    setFinishedTasks(tasks);
  }, []);

  const cardStyle = {
    margin: '8px',
    borderRadius: '12px',
    color: 'white',
    backgroundColor: '#15093d',
    border: '0.1px solid #483776',
    width: 'calc(50% - 16px)',
    position: 'relative',
    overflow: 'hidden',
  };

  const deleteTask = (taskId) => {
    const updatedTasks = finishedTasks.filter((task) => task.id !== taskId);
    setFinishedTasks(updatedTasks);
    localStorage.setItem('finishedTasks', JSON.stringify(updatedTasks));
  };

  return (
    <div style={{ marginBottom: '14px', marginTop: '14px' }}>
      <h2
        style={{
          fontSize: '1.1rem',
          fontWeight: '100',
          color: '#d7ceed',
          margin: '16px',
          marginBottom: '8px',
          marginTop: '0px',
        }}
      >
        History
      </h2>
      <AnimatePresence>
        <motion.div style={{ display: 'flex', flexWrap: 'nowrap' }} layout>
          {finishedTasks.slice(0, 2).map((task) => (
            <motion.div
              key={task.id}
              style={cardStyle}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  zIndex: 1,
                }}
                className='delete-icon'
              >
                <FaTrash
                  style={{ color: '#ff6b6b', cursor: 'pointer' }}
                  onClick={() => deleteTask(task.id)}
                />
              </div>
              <div style={{ padding: '16px' }}>
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
                  {task.category}
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
                  {task.name}
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
                  <FaDollarSign
                    style={{ marginRight: '8px', color: '#8c82c6', fontSize: '0.9rem' }}
                    data-tooltip-id='billable-tooltip'
                    data-tooltip-content={task.billable ? 'Billable' : 'Non-billable'}
                  />
                  <LuUsers2
                    style={{ marginRight: '8px', color: '#8c82c6', fontSize: '0.9rem' }}
                    data-tooltip-id='client-tooltip'
                    data-tooltip-content={task.client || 'No client'}
                  />
                  <GoTag
                    style={{ color: '#8c82c6', fontSize: '0.9rem' }}
                    data-tooltip-id='project-tooltip'
                    data-tooltip-content={task.project || 'No project'}
                  />
                </div>
                <div
                  style={{ fontSize: '1rem', color: '#8c82c6', fontWeight: '300' }}
                  data-tooltip-id='date-completed-tooltip'
                  data-tooltip-content={`Completed: ${new Date(task.completedAt).toLocaleString()}`}
                >
                  {`${task.hours}:${task.minutes}:${task.seconds}`}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      <Tooltip id='billable-tooltip' />
      <Tooltip id='client-tooltip' />
      <Tooltip id='project-tooltip' />
      <Tooltip id='date-completed-tooltip' />
      <style jsx>{`
        .delete-icon:hover {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
