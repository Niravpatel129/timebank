// BottomBar.js
import React, { useState } from 'react';

const customNodeStyles = {
  epic: {
    background: '#ff7e67',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    minWidth: '150px',
  },
  task: {
    background: '#ffa500',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    minWidth: '120px',
  },
};

const FloatingPanel = ({
  items,
  onDragStart,
  type,
  onAdd,
  onEdit,
  onDelete,
  onClose,
  searchTerm,
  setSearchTerm,
}) => (
  <div
    style={{
      position: 'absolute',
      bottom: '60px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '300px',
      maxHeight: '400px',
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <input
      type='text'
      placeholder={`Search ${type}s...`}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{
        marginBottom: '10px',
        padding: '5px',
        borderRadius: '5px',
        border: '1px solid #ccc',
      }}
    />
    <div style={{ overflowY: 'auto', flex: 1 }}>
      {items
        .filter((item) => item.label.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(event) => onDragStart(event, type, item.label)}
            style={{
              ...customNodeStyles[type],
              margin: '5px 0',
              cursor: 'move',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {item.label}
            <div>
              <button onClick={() => onEdit(item.id)} style={{ marginRight: '5px' }}>
                Edit
              </button>
              <button onClick={() => onDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
    </div>
    <button onClick={onAdd} style={{ marginTop: '10px' }}>
      Add {type}
    </button>
    <button onClick={onClose} style={{ marginTop: '10px' }}>
      Close
    </button>
  </div>
);

const FloatingBar = ({ onOpenPanel }) => (
  <div
    style={{
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '10px',
      background: 'white',
      padding: '10px',
      borderRadius: '25px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    }}
  >
    <button
      onClick={() => onOpenPanel('task')}
      style={{ padding: '5px 15px', borderRadius: '20px' }}
    >
      Tasks
    </button>
    <button
      onClick={() => onOpenPanel('epic')}
      style={{ padding: '5px 15px', borderRadius: '20px' }}
    >
      Epics
    </button>
  </div>
);

const MindMapBottomBar = ({ onDragStart }) => {
  const [openPanel, setOpenPanel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [epics, setEpics] = useState([{ id: 'e1', label: 'Sample Epic' }]);
  const [tasks, setTasks] = useState([{ id: 't1', label: 'Sample Task' }]);

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
    const setItemSet = type === 'epic' ? setEpics : setTasks;
    const item = itemSet.find((item) => item.id === id);
    const newLabel = prompt('Enter new label:', item.label);
    if (newLabel) {
      setItemSet(itemSet.map((item) => (item.id === id ? { ...item, label: newLabel } : item)));
    }
  };

  const deleteItem = (type, id) => {
    const setItemSet = type === 'epic' ? setEpics : setTasks;
    setItemSet((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <>
      <FloatingBar onOpenPanel={setOpenPanel} />
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
    </>
  );
};

export default MindMapBottomBar;
