import React from 'react';
import BoardingHeader from '../../BoardHeader/BoardHeader';
import BoardTable from '../../BoardTable/BoardTable';

export default function BoardScreen() {
  const projects = [
    {
      id: 1,
      title: 'Brainstorming',
      description: 'Collaborative session for idea generation',
      status: 'To Do',
      members: 3,
      comments: 5,
    },
    {
      id: 2,
      title: 'Wireframe',
      description: 'UI/UX design for new e-commerce website',
      status: 'In Progress',
      members: 2,
      comments: 3,
    },
    {
      id: 3,
      title: 'High Fidelity',
      description: 'Detailed mockups for mobile app',
      status: 'To Do',
      members: 4,
      comments: 7,
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100vh',
      }}
    >
      <div style={{ padding: '20px', paddingBottom: '0px' }}>
        <BoardingHeader />
      </div>
      <div style={{ backgroundColor: '#f7f7f7', padding: '20px', flex: 1 }}>
        <BoardTable />
      </div>
    </div>
  );
}
