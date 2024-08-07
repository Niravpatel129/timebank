import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { FaDollarSign, FaTrashCan } from 'react-icons/fa6';
import { GoTag } from 'react-icons/go';
import { LuUsers2 } from 'react-icons/lu';
import { Tooltip } from 'react-tooltip';
import { useScreenContext } from '../context/useScreenContext';
import secondsToTime from '../helpers/secondsToTime';

export default function TrackingCardsBeno() {
  const { finishedTasks, deleteTask } = useScreenContext();
  console.log('🚀  finishedTasks:', finishedTasks);

  const cardStyle = {
    margin: '8px',
    borderRadius: '12px',
    color: 'white',
    backgroundColor: '#15093d',
    border: '0.1px solid #483776',
    width: '200px',
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
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
      {finishedTasks.length === 0 ? (
        <div style={{ ...cardStyle, width: 'auto', padding: '16px', textAlign: 'center' }}>
          <p style={{ color: '#8c82c6', margin: 0 }}>
            No completed tasks yet. Start tracking to see your history!
          </p>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            style={{
              display: 'flex',
              overflowX: 'auto',
              overflowY: 'hidden',
              whiteSpace: 'nowrap',
              padding: '8px 0',
            }}
            layout
          >
            {finishedTasks.map((task) => (
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
                  onClick={() => deleteTask(task.id)}
                  data-tooltip-id='delete'
                  data-tooltip-content={'Delete'}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <FaTrashCan style={{ color: 'white', fontSize: '0.8rem' }} />
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
                    data-tooltip-content={`Completed: ${new Date(
                      task.completedAt,
                    ).toLocaleString()}`}
                  >
                    {secondsToTime(task.taskDuration - task.timeRemaining)}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
      <Tooltip id='billable-tooltip' />
      <Tooltip id='client-tooltip' />
      <Tooltip id='project-tooltip' />
      <Tooltip id='date-completed-tooltip' />
      <Tooltip id='delete' />
      <style jsx>{`
        .delete-icon:hover {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
