import React, { useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const initialColumns = {
  created: {
    id: 'created',
    title: 'Created',
    taskIds: ['task-1', 'task-2'],
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
    taskIds: ['task-3'],
  },
  review: {
    id: 'review',
    title: 'Review',
    taskIds: ['task-4'],
  },
  done: {
    id: 'done',
    title: 'Done',
    taskIds: ['task-5'],
  },
};

const initialTasks = {
  'task-1': { id: 'task-1', content: 'Wireframing', stage: 'UX stages', progress: '0/8' },
  'task-2': { id: 'task-2', content: 'Task 2' },
  'task-3': { id: 'task-3', content: 'Task 3' },
  'task-4': { id: 'task-4', content: 'Task 4' },
  'task-5': { id: 'task-5', content: 'Task 5' },
};

export default function BoardTable() {
  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);
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

  const onDragEnd = (result) => {
    // ... (keep the existing onDragEnd logic)
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
          overflow: 'hidden',
        }}
      >
        {Object.values(columns).map((column) => (
          <div
            key={column.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '24%',
              minWidth: '200px',
              height: '100%',
            }}
          >
            <h2 style={{ marginBottom: '16px' }}>{column.title}</h2>
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
                    const task = tasks[taskId];
                    return (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              userSelect: 'none',
                              padding: '16px',
                              margin: '0 0 8px 0',
                              minHeight: '100px',
                              backgroundColor: 'white',
                              borderRadius: '8px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                              width: 'calc(100% - 32px)', // Subtracting padding from width
                              ...provided.draggableProps.style,
                            }}
                          >
                            {task.stage && (
                              <div
                                style={{
                                  backgroundColor: '#FFF3E0',
                                  color: '#FF9800',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  display: 'inline-block',
                                  marginBottom: '8px',
                                }}
                              >
                                {task.stage}
                              </div>
                            )}
                            <div
                              style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}
                            >
                              {task.content}
                            </div>
                            {task.progress && (
                              <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
                                {task.progress}
                              </div>
                            )}
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  marginBottom: '8px',
                                }}
                              >
                                <div
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: '#ddd',
                                    marginRight: '4px',
                                  }}
                                ></div>
                                <div
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: '#ddd',
                                    marginRight: '4px',
                                  }}
                                ></div>
                                <div
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: '#ddd',
                                    marginRight: '4px',
                                  }}
                                ></div>
                                <div
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: '#4285f4',
                                    color: 'white',
                                    fontSize: '12px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  +2
                                </div>
                              </div>
                              <div
                                style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}
                              >
                                <span style={{ marginRight: '8px' }}>👁 2</span>
                                <span style={{ marginRight: '8px' }}>💬 0</span>
                                <span>🔗 0</span>
                              </div>
                            </div>
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
