import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import Checklist from '../CheckList';

const TaskList = ({ tasks, listType, moveTask, onEditTask }) => {
  return (
    <motion.div style={{ minHeight: '50px', padding: '10px 0' }}>
      <AnimatePresence>
        {tasks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tasks.map((task) => {
              if (!task) return null;
              return (
                <Checklist
                  onEditTask={onEditTask}
                  key={task?._id}
                  id={task?._id}
                  assignee={task?.assignee}
                  user={task?.user}
                  title={task?.name}
                  tag={task.category}
                  status={task.status}
                  time={`${Math.floor(task.taskDuration / 3600)}:${String(
                    Math.floor((task.taskDuration % 3600) / 60),
                  ).padStart(2, '0')}`}
                  taskDuration={task.taskDuration}
                  profileImage={null}
                  listType={listType}
                  moveTask={moveTask}
                  disabled={listType === 'currentWeek' && task.status === 'completed'}
                  timerState={task.timerState}
                />
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ color: '#888', textAlign: '' }}
          >
            No tasks in this list
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskList;
