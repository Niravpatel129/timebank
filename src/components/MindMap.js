import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Handle,
  Position,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', type: 'epic', position: { x: 250, y: 100 }, data: { label: 'Main Epic' } },
];

const initialEdges = [];

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

const CustomNode = ({ data, type }) => {
  return (
    <div style={customNodeStyles[type]}>
      <Handle
        type='target'
        position={Position.Top}
        style={{ background: '#555', width: '6px', height: '6px', borderRadius: '50%' }}
      />
      {data.label}
      <Handle
        type='source'
        position={Position.Bottom}
        style={{ background: '#555', width: '6px', height: '6px', borderRadius: '0%' }}
      />
    </div>
  );
};

const nodeTypes = {
  epic: (props) => <CustomNode {...props} type='epic' />,
  task: (props) => <CustomNode {...props} type='task' />,
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

const ProjectBoard = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [epics, setEpics] = useState([{ id: 'e1', label: 'Sample Epic' }]);
  const [tasks, setTasks] = useState([{ id: 't1', label: 'Sample Task' }]);
  const [openPanel, setOpenPanel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow-type');
      const label = event.dataTransfer.getData('application/reactflow-label');

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData('application/reactflow-type', nodeType);
    event.dataTransfer.setData('application/reactflow-label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

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
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <ReactFlowProvider>
        <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <Background variant='dots' gap={12} size={1} />
          </ReactFlow>
        </div>
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
      </ReactFlowProvider>
    </div>
  );
};

export default ProjectBoard;
