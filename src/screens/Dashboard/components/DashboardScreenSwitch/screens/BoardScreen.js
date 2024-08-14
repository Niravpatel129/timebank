import React from 'react';
import BoardingHeader from '../../BoardHeader/BoardHeader';

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
        padding: '20px',
        width: '100%',
        backgroundColor: '#fff',
      }}
    >
      <BoardingHeader />
      <h1
        style={{
          fontSize: '24px',
          marginBottom: '20px',
        }}
      >
        All Projects
      </h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
        }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              padding: '16px',
            }}
          >
            <h2
              style={{
                fontSize: '18px',
                marginBottom: '10px',
              }}
            >
              {project.title}
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: '#666',
              }}
            >
              {project.description}
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '10px',
                fontSize: '12px',
                color: '#999',
              }}
            >
              <span>{project.status}</span>
              <span>
                {project.members} members • {project.comments} comments
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
