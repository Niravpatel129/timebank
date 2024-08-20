import React from 'react';

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
      bottom: '80px',
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

export default FloatingPanel;
