import React from 'react';
import { GrClose } from 'react-icons/gr';
import { MdCheck, MdMoreTime } from 'react-icons/md';

export default function FocusMain({ title, time, onClickTimeAction }) {
  const renderIcon = ({ Icon }) => {
    return (
      <div
        style={{
          cursor: 'pointer',
          border: '1px solid #808ed7',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '50px',
          height: '50px',
        }}
      >
        <Icon style={{ fontSize: '30px', color: 'white' }} />
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#6366F1',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className='heading'
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '40px',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingBottom: '16px',
        }}
      >
        <div style={{ color: 'white', fontSize: '18px', fontWeight: '500' }}>Focus Mode</div>
        <div style={{ cursor: 'pointer', color: 'white', fontSize: '20px' }}>
          <GrClose />
        </div>
      </div>

      {/* main Section */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      >
        <div>
          <div
            style={{
              color: 'white',
              fontSize: '20px',
              marginBottom: '0px',
              fontWeight: 500,
              paddingLeft: '6px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: 'white',
              fontSize: '200px',
              fontWeight: 400,
              fontFamily: "'Roboto Condensed', sans-serif",
              lineHeight: '1',
            }}
          >
            {time}
          </div>
        </div>
      </div>

      {/* bottom section */}
      <div style={{ padding: '16px', display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <div>{renderIcon({ Icon: MdMoreTime })}</div>
        <div>{renderIcon({ Icon: MdCheck })}</div>
      </div>
    </div>
  );
}
