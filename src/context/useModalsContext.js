import React, { createContext, useContext, useState } from 'react';

const ModalsContext = createContext();

export const ModalsProvider = ({ children }) => {
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const openCreateTaskModal = () => setIsCreateTaskModalOpen(true);
  const closeCreateTaskModal = () => setIsCreateTaskModalOpen(false);

  const openEditTaskModal = (task) => {
    setSelectedTask(task);
    setIsEditTaskModalOpen(true);
  };
  const closeEditTaskModal = () => {
    setSelectedTask(null);
    setIsEditTaskModalOpen(false);
  };

  return (
    <ModalsContext.Provider
      value={{
        isCreateTaskModalOpen,
        openCreateTaskModal,
        closeCreateTaskModal,
        isEditTaskModalOpen,
        openEditTaskModal,
        closeEditTaskModal,
        selectedTask,
        isInviteModalOpen,
        setIsInviteModalOpen,
        isNotificationModalOpen,
        setIsNotificationModalOpen,
      }}
    >
      {children}
    </ModalsContext.Provider>
  );
};

export const useModalsContext = () => {
  const context = useContext(ModalsContext);
  if (!context) {
    throw new Error('useModalsContext must be used within a ModalsProvider');
  }
  return context;
};
