// BottomBar.js
import React, { useState } from 'react';
import FloatingBar from './FloatingBar';
import MindMapEditItemModal from './MindMapEditItemModal';
import FloatingPanel from './MindMapFloatingPanel';

const MindMapBottomBar = ({ onDragStart }) => {
  const [openPanel, setOpenPanel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [epics, setEpics] = useState([{ id: 'e1', label: 'Sample Epic' }]);
  const [tasks, setTasks] = useState([{ id: 't1', label: 'Sample Task' }]);
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
