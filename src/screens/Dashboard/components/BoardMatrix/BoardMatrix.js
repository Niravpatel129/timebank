import React from 'react';
import { useProjectContext } from '../../../../context/useProjectContext';
import { useTasksContext } from '../../../../context/useTasksContext';

const PriorityMatrixView = () => {
  const { tasks, updateTask } = useTasksContext();
  const { colorGradients } = useProjectContext();

  const matrices = {
    'urgent-important': { title: 'Urgent & Important', color: '#FF4136' },
    'not-urgent-important': { title: 'Important, Not Urgent', color: '#FF851B' },
    'urgent-not-important': { title: 'Urgent, Not Important', color: '#FFDC00' },
    'not-urgent-not-important': { title: 'Neither Urgent Nor Important', color: '#2ECC40' },
  };

  const categorizedTasks = tasks.reduce((acc, task) => {
    const category = `${task.urgent ? 'urgent' : 'not-urgent'}-${
      task.important ? 'important' : 'not-important'
    }`;
    if (!acc[category]) acc[category] = [];
    acc[category].push(task);
    return acc;
  }, {});

  const renderQuadrant = (key) => (
    <div style={styles.quadrant} key={key}>
      <h3 style={{ ...styles.quadrantTitle, backgroundColor: matrices[key].color }}>
        {matrices[key].title}
      </h3>
      <div style={styles.taskList}>
        {(categorizedTasks[key] || []).map((task) => (
          <div key={task._id} style={styles.task}>
            <input
              type='checkbox'
              checked={task.status === 'completed'}
              onChange={() =>
                updateTask({
                  ...task,
                  status: task.status === 'completed' ? 'in-progress' : 'completed',
                })
              }
            />
            <span
              style={{
                marginLeft: '10px',
                textDecoration: task.status === 'completed' ? 'line-through' : 'none',
              }}
            >
              {task.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.row}>
        {renderQuadrant('urgent-important')}
        {renderQuadrant('not-urgent-important')}
      </div>
      <div style={styles.row}>
        {renderQuadrant('urgent-not-important')}
        {renderQuadrant('not-urgent-not-important')}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  row: {
    display: 'flex',
    flex: 1,
  },
  quadrant: {
    flex: 1,
    margin: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  quadrantTitle: {
    padding: '10px',
    margin: 0,
    color: 'white',
    textAlign: 'center',
  },
  taskList: {
    padding: '10px',
  },
  task: {
    marginBottom: '5px',
    display: 'flex',
    alignItems: 'center',
  },
};

export default PriorityMatrixView;
