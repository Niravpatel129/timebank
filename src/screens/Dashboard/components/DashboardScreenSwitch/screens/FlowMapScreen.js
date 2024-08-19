import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Handle,
  Position,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useProjectContext } from '../../../../../context/useProjectContext';
import { useTasksContext } from '../../../../../context/useTasksContext';

// Custom node components
const ProjectNode = ({ data }) => (
  <div
    style={{
      padding: '15px',
      border: '3px solid #4169E1',
      borderRadius: '8px',
      background:
        data.projectColor && data.projectColor.gradient1 && data.projectColor.gradient2
          ? `linear-gradient(135deg, ${data.projectColor.gradient1}, ${data.projectColor.gradient2})`
          : '#4169E1',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      transition: 'all 0.3s ease',
    }}
  >
    <h2 style={{ margin: '0', color: '#fff' }}>{data.label}</h2>
    {data.handles &&
      data.handles.map((handle, index) => {
        const totalHandles = data.handles.length;
        const spacing = 100 / (totalHandles + 1);
        return (
          <Handle
            key={index}
            type='source'
            position={Position.Bottom}
            id={`handle-${index}`}
            style={{
              width: '7px',
              height: '7px',
              backgroundColor: 'white',
              left: `calc(${spacing * (index + 1)}% - 5px)`,
              transition: 'all 0.3s ease',
              bottom: '-5px',
            }}
            isConnectable={true}
          />
        );
      })}
  </div>
);

const TaskNode = ({ data }) => (
  <div
    style={{
      padding: '12px',
      border: '2px solid #ddd',
      borderRadius: '8px',
      background: 'white',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
    }}
  >
    <Handle
      type='target'
      position={Position.Top}
      style={{
        width: '0',
        height: '0',
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: '10px solid black',
        backgroundColor: 'transparent',
        top: '-10px',
        transition: 'all 0.3s ease',
      }}
      isConnectable={true}
    />
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <input
        type='checkbox'
        checked={data.status === 'completed'}
        onChange={data.onToggle}
        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
      />
      <span
        style={{
          textDecoration: data.status === 'completed' ? 'line-through' : 'none',
          color: data.status === 'completed' ? '#888' : '#333',
          transition: 'all 0.3s ease',
        }}
      >
        {data.name}
      </span>
    </div>
    <Handle
      type='source'
      position={Position.Bottom}
      style={{
        width: '10px',
        height: '10px',
        backgroundColor: 'black',
        transition: 'all 0.3s ease',
      }}
      isConnectable={true}
    />
  </div>
);

const nodeTypes = {
  project: ProjectNode,
  task: TaskNode,
};

const ProjectTodoFlow = () => {
  const { selectedProject } = useProjectContext();
  const { tasks } = useTasksContext();
  console.log('🚀  tasks:', tasks);
  console.log('🚀  selectedProject:', selectedProject);

  const [isHorizontal, setIsHorizontal] = useState(true);

  const createNodesAndEdges = useCallback(() => {
    const projectNode = {
      id: 'project',
      type: 'project',
      data: {
        label: selectedProject?.name || 'Untitled Project',
        handles: Array(tasks.length).fill({ position: Position.Bottom }),
        projectColor: selectedProject?.projectColor || {
          gradient1: '#4169E1',
          gradient2: '#4169E1',
        },
      },
      position: { x: 250, y: 50 },
    };

    const taskNodes = tasks.map((task, index) => ({
      id: task._id,
      type: 'task',
      data: {
        ...task,
        onToggle: () => toggleTaskCompletion(task._id),
      },
      position: isHorizontal
        ? { x: 50 + 300 * (index % 3), y: 200 + 150 * Math.floor(index / 3) }
        : { x: 250, y: 200 + 120 * index },
    }));

    const nodes = [projectNode, ...taskNodes];

    const edges = tasks.map((task, index) => ({
      id: `edge-${index}`,
      source: 'project',
      target: task._id,
      sourceHandle: `handle-${index}`,
      animated: true,
    }));

    return { nodes, edges };
  }, [tasks, isHorizontal, selectedProject]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

  const [newTask, setNewTask] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;

    const newTaskItem = {
      _id: `task-${tasks.length + 1}`,
      name: newTask.trim(),
      status: 'paused',
      // Add other necessary fields here
    };

    // You might want to update this to use your task creation API
    // For now, we'll just add it to the local state
    tasks.push(newTaskItem);
    setNewTask('');
  };

  const toggleTaskCompletion = useCallback(
    (taskId) => {
      // Update this to use your task update API
      // For now, we'll just update the local state
      const updatedTasks = tasks.map((task) =>
        task._id === taskId
          ? { ...task, status: task.status === 'completed' ? 'paused' : 'completed' }
          : task,
      );
      // You might want to update this to use your task update API
      // For now, we'll just update the local state
      tasks.splice(0, tasks.length, ...updatedTasks);
    },
    [tasks],
  );

  const toggleLayout = useCallback(() => {
    setIsHorizontal((prev) => !prev);
  }, []);

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = createNodesAndEdges();
    setNodes(newNodes);
    setEdges(newEdges);
  }, [tasks, setNodes, setEdges, createNodesAndEdges, isHorizontal]);

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ margin: '20px', display: 'flex', gap: '10px' }}>
        <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', flex: 1 }}>
          <input
            type='text'
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder='Add new task'
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              transition: 'all 0.3s ease',
            }}
          />
          <button
            type='submit'
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Add Task
          </button>
        </form>
        <button
          onClick={toggleLayout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          {isHorizontal ? 'Vertical Layout' : 'Horizontal Layout'}
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        style={{ flex: 1 }}
        connectionMode='loose'
      >
        <Controls />
        <Background variant='dots' gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default ProjectTodoFlow;
