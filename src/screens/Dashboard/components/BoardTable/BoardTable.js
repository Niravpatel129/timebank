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
  const { tasks } = useTasksContext();
  console.log('🚀  tasks:', tasks);
  const { colorGradients } = useProjectContext();
  const [columns, setColumns] = useState(initialColumns);
  const [containerHeight, setContainerHeight] = useState('100vh');
  const containerRef = useRef(null);

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
    const newColumns = { ...initialColumns };
    tasks.forEach((task) => {
      if (newColumns[task.status]) {
        newColumns[task.status].taskIds.push(task._id);
      }
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

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newColumns = {
        ...columns,
        [newColumn.id]: newColumn,
      };

      setColumns(newColumns);
    } else {
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...start,
        taskIds: startTaskIds,
      };

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds,
      };

      const newColumns = {
        ...columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      };

      setColumns(newColumns);
    }
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
                  }}
                >
                  {column.taskIds.map((taskId, index) => {
                    const task = tasks.find((t) => t._id === taskId);
                    return (
                      <Draggable key={taskId} draggableId={taskId} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
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
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
