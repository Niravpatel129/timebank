import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModalsContext } from '../context/useModalsContext';
import { useProjectContext } from '../context/useProjectContext';
import { useTasksContext } from '../context/useTasksContext';

const useKeyboardShortcuts = () => {
  const { openCreateTaskModal, openEditTaskModal } = useModalsContext();
  const { openModal: openCreateProjectModal } = useProjectContext();
  const { tasks, activeTaskId, startTask, pauseTask } = useTasksContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Cmd/Ctrl + N: Create new task
      if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
        event.preventDefault();
        openCreateTaskModal();
      }

      // Cmd/Ctrl + P: Create new project
      if ((event.metaKey || event.ctrlKey) && event.key === 'p') {
        event.preventDefault();
        openCreateProjectModal();
      }

      // Cmd/Ctrl + E: Edit active task
      if ((event.metaKey || event.ctrlKey) && event.key === 'e') {
        event.preventDefault();
        const activeTask = tasks.find((task) => task._id === activeTaskId);
        if (activeTask) {
          openEditTaskModal(activeTask);
        }
      }

      // Cmd/Ctrl + Space: Start/Pause active task
      if ((event.metaKey || event.ctrlKey) && event.code === 'Space') {
        event.preventDefault();
        if (activeTaskId) {
          const activeTask = tasks.find((task) => task._id === activeTaskId);
          if (activeTask?.timerState?.isActive) {
            pauseTask(activeTaskId);
          } else {
            startTask(activeTaskId);
          }
        }
      }

      // Cmd/Ctrl + F: Navigate to Focus mode
      if ((event.metaKey || event.ctrlKey) && event.key === 'f') {
        event.preventDefault();
        navigate('/focus');
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [
    openCreateTaskModal,
    openCreateProjectModal,
    openEditTaskModal,
    tasks,
    activeTaskId,
    startTask,
    pauseTask,
    navigate,
  ]);
};

export default useKeyboardShortcuts;
