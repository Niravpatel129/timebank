import { jsPlumb } from 'jsplumb';
import React, { useEffect, useRef } from 'react';

export default function FlowMapScreen() {
  const containerRef = useRef(null);

  useEffect(() => {
    const instance = jsPlumb.getInstance({
      Container: containerRef.current,
      Connector: 'Bezier',
      PaintStyle: { stroke: '#7AB02C', strokeWidth: 2 },
      Endpoint: 'Dot',
      EndpointStyle: { fill: '#7AB02C', radius: 5 },
    });

    // Example nodes
    const nodes = [
      { id: 'task1', label: 'Task 1', position: { top: 50, left: 100 } },
      { id: 'task2', label: 'Task 2', position: { top: 200, left: 300 } },
    ];

    // Add nodes to the container
    nodes.forEach((node) => {
      const div = document.createElement('div');
      div.id = node.id;
      div.className = 'task-node';
      div.innerText = node.label;
      div.style.position = 'absolute';
      div.style.top = `${node.position.top}px`;
      div.style.left = `${node.position.left}px`;

      containerRef.current.appendChild(div);

      instance.draggable(div);
      instance.addEndpoint(div, { anchor: 'RightMiddle' }, { isSource: true, isTarget: true });
    });

    // Example connection
    instance.connect({
      source: 'task1',
      target: 'task2',
    });

    // Cleanup
    return () => instance.reset();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '500px', minHeight: '100vh' }}
    >
      {/* Nodes will be dynamically added here */}
    </div>
  );
}

// Add some basic styles
const styles = `
  .task-node {
    padding: 10px;
    background-color: #eee;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    width: 100px;
    text-align: center;
  }
`;

document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
