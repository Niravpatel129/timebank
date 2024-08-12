import React from 'react';
import { CiClock1 } from 'react-icons/ci';

export default function LastActivity({ colorGradients }) {
  return (
    <div>
      <div style={{ padding: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h3
            style={{
              color: colorGradients[0],
              fontSize: '18px',
              fontWeight: 'bold',
              margin: 0,
            }}
          >
            Your last activity
          </h3>
          <div style={{ color: '#8f8f9d', fontSize: '14px' }}>Complete today 4 tasks</div>
        </div>
      </div>
      <div style={{ overflowY: 'auto', flex: 1, padding: '0 20px 20px' }}>
        {[
          { task: 'Setup GitHub repository', category: 'Current Week', time: '02:36' },
          { task: 'Configure Vue Boilerplate', category: 'Things to do', time: '00:18' },
          { task: 'Create atomic components', category: 'Current Week', time: '00:12' },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              marginBottom: '15px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  color: '#2d2c31',
                  fontSize: '16px',
                  fontWeight: '400',
                  marginBottom: '5px',
                }}
              >
                {item.task}
              </div>
              <div style={{ color: '#8f8f9d', fontSize: '14px' }}>in {item.category}</div>
            </div>
            <div
              style={{
                color: colorGradients[0],
                fontSize: '16px',
                fontWeight: 400,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  marginRight: '5px',
                  fontSize: '16px',
                  paddingTop: '2px',
                  color: '#cbccd5',
                }}
              >
                <CiClock1 />
              </span>
              <span>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
