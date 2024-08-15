import React, { useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useProjectContext } from '../../../../context/useProjectContext';
import { useTasksContext } from '../../../../context/useTasksContext';
import BoardCard from '../BoardCard/BoardCard';

const initialColumns = {
  'not-started': {
    id: 'not-started',
    title: 'Not Started',
    taskIds: [],
    color: '#00ff80',
  },
  'in-progress': {
    id: 'in-progress',
    title: 'In Progress',
    taskIds: [],
    color: '#FF9800',
  },
  review: {
    id: 'review',
    title: 'Review',
    taskIds: [],
    color: '#ff001e',
  },
  completed: {
    id: 'completed',
    title: 'Completed',
    taskIds: [],
    color: '#8c00ff',
  },
};

export default function BoardTable() {
  const { tasks, updateTask } = useTasksContext();
  const { colorGradients } = useProjectContext();
  const [columns, setColumns] = useState(initialColumns);
  const [containerHeight, setContainerHeight] = useState('100vh');
  const containerRef = useRef(null);
  const [hoveredColumn, setHoveredColumn] = useState(null);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const windowHeight = window.innerHeight;
        const containerTop = containerRef.current.getBoundingClientRect().top;
        const newHeight = windowHeight - containerTop;
        setContainerHeight(`${newHeight}px`);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    const newColumns = JSON.parse(JSON.stringify(initialColumns));
    tasks.forEach((task) => {
      if (newColumns[task.status]) {
        newColumns[task.status].taskIds.push(task._id);
      }
    });
    Object.keys(newColumns).forEach((columnId) => {
      newColumns[columnId].taskIds.sort((a, b) => {
        const taskA = tasks.find((t) => t._id === a);
        const taskB = tasks.find((t) => t._id === b);
        return (taskA?.taskBoardOrder || 0) - (taskB?.taskBoardOrder || 0);
      });
    });
    setColumns(newColumns);
  }, [tasks]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if (!start || !finish) {
      console.error('Invalid source or destination column');
      return;
    }

    const newColumns = JSON.parse(JSON.stringify(columns));

    if (start === finish) {
      const column = newColumns[source.droppableId];
      column.taskIds.splice(source.index, 1);
      column.taskIds.splice(destination.index, 0, draggableId);
    } else {
      const startColumn = newColumns[source.droppableId];
      const finishColumn = newColumns[destination.droppableId];
      startColumn.taskIds.splice(source.index, 1);
      finishColumn.taskIds.splice(destination.index, 0, draggableId);
    }

    setColumns(newColumns);

    const updatedTasks = newColumns[destination.droppableId].taskIds
      .map((taskId, index) => {
        const task = tasks.find((t) => t._id === taskId);
        return task ? { ...task, taskBoardOrder: index, status: destination.droppableId } : null;
      })
      .filter(Boolean);

    updatedTasks.forEach((task) => {
      updateTask(task);
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          height: containerHeight,
          overflowX: 'auto',
        }}
      >
        {Object.values(columns).map((column) => (
          <div
            key={column.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '100%',
              minWidth: '300px',
              height: '100%',
              marginRight: '16px',
            }}
            onMouseEnter={() => setHoveredColumn(column.id)}
            onMouseLeave={() => setHoveredColumn(null)}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  marginBottom: '16px',
                  gap: '8px',
                  marginLeft: '7px',
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: '15px',
                    fontWeight: '500',
                    color: '#132137',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: column.color,
                      }}
                    ></span>
                    <span>{column.title}</span>
                  </div>
                </h2>
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '2px 8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#132137',
                  }}
                >
                  {column.taskIds.length}
                </div>
              </div>
            </div>
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    background: snapshot.isDraggingOver ? '#f0f0f0' : 'transparent',
                    padding: 4,
                    width: '100%',
                    flexGrow: 1,
                    overflowY: 'auto',
                    position: 'relative',
                  }}
                >
                  {column.taskIds.map((taskId, index) => {
                    const task = tasks.find((t) => t._id === taskId);
                    if (!task) return null;
                    return (
                      <Draggable key={taskId} draggableId={taskId} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              marginBottom: '8px',
                            }}
                          >
                            <BoardCard
                              task={task}
                              colorGradients={colorGradients}
                              onEditTask={() => {
                                console.log('edit task');
                              }}
                            />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                  {hoveredColumn === column.id && (
                    <div
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '8px',
                      }}
                    >
                      Add Card
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
