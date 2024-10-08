import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import MindMapBottomBar from './MindMapBottomBar';

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

const ProjectBoard = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    JSON.parse(localStorage.getItem('mindmap-nodes')) || initialNodes,
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    JSON.parse(localStorage.getItem('mindmap-edges')) || initialEdges,
  );

  useEffect(() => {
    localStorage.setItem('mindmap-nodes', JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem('mindmap-edges', JSON.stringify(edges));
  }, [edges]);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'floating',
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          },
          eds,
        ),
      ),
    [setEdges],
  );

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
            fitViewOptions={{
              padding: 2,
              includeHiddenNodes: false,
              minZoom: 0.5,
              maxZoom: 2,
              duration: 800,
            }}
          >
            <Controls />
            <Background variant='dots' gap={12} size={1} />
          </ReactFlow>
        </div>
        <MindMapBottomBar onDragStart={onDragStart} />
      </ReactFlowProvider>
    </div>
  );
};

export default ProjectBoard;
