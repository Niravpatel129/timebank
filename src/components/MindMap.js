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

const Sidebar = ({ isOpen, epics, tasks, addEpic, addTask, onDragStart }) => {
  return (
    <div
      style={{
        position: 'absolute',
        right: isOpen ? 0 : '-300px',
        top: 0,
        width: '300px',
        height: '100%',
        background: 'white',
        boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
        transition: 'right 0.3s',
        zIndex: 5,
        padding: '20px',
        overflowY: 'auto',
      }}
    >
      <h3>Epics</h3>
      <button onClick={addEpic}>+ Add Epic</button>
      {epics.map((epic) => (
        <div
          key={epic.id}
          draggable
          onDragStart={(event) => onDragStart(event, 'epic', epic.label)}
          style={customNodeStyles.epic}
        >
          {epic.label}
        </div>
      ))}
      <h3>Tasks</h3>
      <button onClick={addTask}>+ Add Task</button>
      {tasks.map((task) => (
        <div
          key={task.id}
          draggable
          onDragStart={(event) => onDragStart(event, 'task', task.label)}
          style={customNodeStyles.task}
        >
          {task.label}
        </div>
      ))}
    </div>
  );
};

const ProjectBoard = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [epics, setEpics] = useState([{ id: 'e1', label: 'Sample Epic' }]);
  const [tasks, setTasks] = useState([{ id: 't1', label: 'Sample Task' }]);

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

      // Check if the drop occurred inside the ReactFlow component
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

  const addEpic = () => {
    const newEpic = { id: `e${epics.length + 1}`, label: `New Epic ${epics.length + 1}` };
    setEpics([...epics, newEpic]);
  };

  const addTask = () => {
    const newTask = { id: `t${tasks.length + 1}`, label: `New Task ${tasks.length + 1}` };
    setTasks([...tasks, newTask]);
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
        <button
          style={{
            position: 'absolute',
            right: isSidebarOpen ? '310px' : '10px',
            top: '10px',
            zIndex: 6,
          }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? '>' : '<'}
        </button>
        <Sidebar
          isOpen={isSidebarOpen}
          epics={epics}
          tasks={tasks}
          addEpic={addEpic}
          addTask={addTask}
          onDragStart={onDragStart}
        />
      </ReactFlowProvider>
    </div>
  );
};

export default ProjectBoard;
