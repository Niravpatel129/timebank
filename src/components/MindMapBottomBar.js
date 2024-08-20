import React, { useState } from 'react';
import { useTasksContext } from '../context/useTasksContext';
import FloatingBar from './FloatingBar';
import MindMapEditItemModal from './MindMapEditItemModal';
import FloatingPanel from './MindMapFloatingPanel';

const MindMapBottomBar = ({ onDragStart }) => {
  const { tasks: defaultTasks } = useTasksContext();
  const [openPanel, setOpenPanel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [epics, setEpics] = useState([{ id: 'e1', label: 'Sample Epic' }]);
  const [tasks, setTasks] = useState(
    defaultTasks.map((task) => ({
      id: task._id,
      label: task.name,
      timerState: task.timerState,
      category: task.category,
      listOrder: task.listOrder,
      tagColor: task.tagColor,
      timerType: task.timerType,
      listType: task.listType,
      taskDuration: task.taskDuration,
      status: task.status,
      timeSpent: task.timeSpent,
      date: task.date,
      dateDue: task.dateDue,
      assignee: task.assignee,
      user: task.user,
      project: task.project,
      taskBoardOrder: task.taskBoardOrder,
      taskPriority: task.taskPriority,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    })),
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const addItem = (type) => {
    const setItemSet = type === 'epic' ? setEpics : setTasks;
    const itemSet = type === 'epic' ? epics : tasks;
    const newItem = {
      id: `${type[0]}${itemSet.length + 1}`,
      label: `New ${type} ${itemSet.length + 1}`,
    };
    setItemSet([...itemSet, newItem]);
  };

  const editItem = (type, id) => {
    const itemSet = type === 'epic' ? epics : tasks;
    const item = itemSet.find((item) => item.id === id);
    setEditingItem({ ...item, type });
    setEditModalOpen(true);
  };

  const handleEditSave = (editedItem) => {
    const setItemSet = editedItem.type === 'epic' ? setEpics : setTasks;
    setItemSet((prevItems) =>
      prevItems.map((item) =>
        item.id === editedItem.id ? { ...item, label: editedItem.label } : item,
      ),
    );
    setEditModalOpen(false);
    setEditingItem(null);
  };

  const deleteItem = (type, id) => {
    const setItemSet = type === 'epic' ? setEpics : setTasks;
    setItemSet((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <>
      <FloatingBar onOpenPanel={setOpenPanel} currentPanel={openPanel} />
      {openPanel && (
        <FloatingPanel
          items={openPanel === 'epic' ? epics : tasks}
          onDragStart={onDragStart}
          type={openPanel}
          onAdd={() => addItem(openPanel)}
          onEdit={(id) => editItem(openPanel, id)}
          onDelete={(id) => deleteItem(openPanel, id)}
          onClose={() => setOpenPanel(null)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}
      {editModalOpen && (
        <MindMapEditItemModal
          item={editingItem}
          onSave={handleEditSave}
          onClose={() => {
            setEditModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}
    </>
  );
};

export default MindMapBottomBar;
