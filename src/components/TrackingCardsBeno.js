import React from 'react';
import { FaDollarSign } from 'react-icons/fa6';
import { GoTag } from 'react-icons/go';
import { LuUsers2 } from 'react-icons/lu';

export default function TrackingCardsBeno() {
  const cardStyle = {
    margin: '8px',
    borderRadius: '12px',
    color: 'white',
    backgroundColor: '#15093d',
    border: '0.1px solid #483776',
    width: 'calc(50% - 16px)',
  };

  const cardContent = (title, description, time) => (
    <div style={cardStyle}>
      <div style={{ padding: '16px' }}>
        <h2
          style={{
            fontSize: '0.9rem',
            fontWeight: '100',
            color: '#e4e1e4',
            margin: 0,
            padding: 0,
            marginBottom: '4px',
          }}
        >
          {title}
        </h2>
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: '300',
            color: '#d7ceed',
            margin: 0,
            padding: 0,
          }}
        >
          {description}
        </h3>
      </div>
      <hr
        style={{
          border: '1px solid #25164d',
          margin: '0',
          padding: '0',
          marginTop: '8px',
          marginBottom: '8px',
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaDollarSign style={{ marginRight: '8px', color: '#8c82c6', fontSize: '0.9rem' }} />
          <LuUsers2 style={{ marginRight: '8px', color: '#8c82c6', fontSize: '0.9rem' }} />
          <GoTag style={{ color: '#8c82c6', fontSize: '0.9rem' }} />
        </div>
        <div style={{ fontSize: '1rem', color: '#8c82c6', fontWeight: '300' }}>{time}</div>
      </div>
    </div>
  );

  return (
    <div style={{ marginBottom: '14px', marginTop: '14px' }}>
      <h2
        style={{
          fontSize: '1.1rem',
          fontWeight: '100',
          color: '#d7ceed',
          margin: '16px',
          marginBottom: '8px',
          marginTop: '0px',
        }}
      >
        History
      </h2>
      <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
        {cardContent('Terracoz Landing Page', 'Create 2 Options for Hero', '01:32:44')}
        {cardContent('Client Meeting', 'Prepare Presentation', '00:45:30')}
      </div>
    </div>
  );
}
