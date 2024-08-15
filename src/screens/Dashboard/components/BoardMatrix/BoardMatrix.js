import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useTasksContext } from '../../../../context/useTasksContext';

const PriorityMatrixView = () => {
  const { tasks, updateTask } = useTasksContext();

  const matrices = {
    'urgent-important': { title: 'Urgent & Important', priority: 3 },
    'not-urgent-important': { title: 'Important, Not Urgent', priority: 2 },
    'urgent-not-important': { title: 'Urgent, Not Important', priority: 1 },
    'not-urgent-not-important': { title: 'Neither Urgent Nor Important', priority: 0 },
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newPriority = matrices[result.destination.droppableId].priority;
    const taskToUpdate = tasks.find((task) => task._id === taskId);

    if (taskToUpdate) {
      updateTask({
        ...taskToUpdate,
        taskPriority: newPriority,
      });
    }
  };

  const getTasksForQuadrant = (quadrant) => {
    return tasks.filter((task) => task.taskPriority === matrices[quadrant].priority);
  };

  const renderQuadrant = (key) => (
    <div style={styles.quadrant} key={key}>
      <h3 style={styles.quadrantTitle}>{matrices[key].title}</h3>
      <Droppable droppableId={key}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} style={styles.taskList}>
            {getTasksForQuadrant(key).map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...styles.task,
                      ...provided.draggableProps.style,
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={task.status === 'completed'}
                      onChange={() =>
                        updateTask({
                          ...task,
                          status: task.status === 'completed' ? 'in-progress' : 'completed',
                        })
                      }
                      style={styles.checkbox}
                    />
                    <span style={styles.taskText}>{task.name}</span>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
    </DragDropContext>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    gap: '20px',
  },
  row: {
    display: 'flex',
    flex: 1,
    gap: '20px',
  },
  quadrant: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  quadrantTitle: {
    padding: '15px',
    margin: 0,
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #e0e0e0',
    fontSize: '16px',
    fontWeight: '500',
  },
  taskList: {
    padding: '15px',
    flex: 1,
    overflowY: 'auto',
  },
  task: {
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  checkbox: {
    marginRight: '10px',
  },
  taskText: {
    flex: 1,
    fontSize: '14px',
  },
};

export default PriorityMatrixView;
