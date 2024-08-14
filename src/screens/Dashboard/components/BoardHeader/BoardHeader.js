import React from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';

const Header = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0px',
      borderBottom: '1px solid #e0e0e0',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '200px',
        height: '40px',
        backgroundColor: '#f0f0f0',
        borderRadius: '20px',
        padding: '0 15px',
      }}
    >
      <svg viewBox='0 0 24 24' width='20' height='20' style={{ marginRight: '10px' }}>
        <path
          d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'
          fill='#666'
        />
      </svg>
      <span style={{ color: '#666' }}>Search</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <IoNotificationsOutline
        style={{
          marginRight: '15px',
          fontSize: '20px',
          color: '#bebfca',
          cursor: 'pointer',
        }}
      />
      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          overflow: 'hidden',
          marginRight: '10px',
        }}
      >
        <img
          src='https://thumbs.dreamstime.com/b/random-cat-love-cats-pet-catsslave-110819582.jpg'
          alt='Profile'
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  </div>
);

const ProjectHeader = () => (
  <div
    style={{
      paddingTop: '20px',
      //   borderBottom: '1px solid #e0e0e0',
    }}
  >
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#eaf2fd',
              borderRadius: '8px',
              marginRight: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '24px',
            }}
          >
            🗂️
          </div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 400, color: '#141b35' }}>
            Piper Enterprise
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '60%',
              backgroundColor: '#f1f1f1',
              height: '8px',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div style={{ width: '13%', backgroundColor: '#4285f4', height: '100%' }}></div>
          </div>
          <span style={{ color: '#8d97a3', fontSize: '11px', fontWeight: 500 }}>13% complete</span>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MemberAvatars />
          <AddMemberButton />
        </div>
      </div>
    </div>
    <Navigation />
  </div>
);

const MemberAvatars = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    {[1, 2, 3, 4].map((_, index) => (
      <div
        key={index}
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: ['#ff9800', '#4caf50', '#2196f3', '#9c27b0'][index],
          marginRight: '-8px',
          border: '2px solid white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
        }}
      >
        {index < 3 ? 'N' : '+3'}
      </div>
    ))}
  </div>
);

const Navigation = () => (
  <div
    style={{
      display: 'flex',
      gap: '30px',
      fontSize: '14px',
      fontWeight: 500,
      marginTop: '20px',
      borderBottom: '1px solid #e0e0e0',
    }}
  >
    {['Overview', 'Tasks', 'Notes', 'Questions'].map((item, index) => (
      <div
        key={index}
        style={{
          padding: '10px 0px',
          color: '#0d2232',
          borderBottom: index === 0 ? '2px solid #4285f4' : 'none',
          cursor: 'pointer',
        }}
      >
        {item}
      </div>
    ))}
  </div>
);

const ViewOptions = () => (
  <div style={{ display: 'flex', padding: '10px 20px' }}>
    {[
      { icon: '􀏜', label: 'Board' },
      { icon: '􀎫', label: 'Table' },
      { icon: '􀋱', label: 'List' },
    ].map((item, index) => (
      <div
        key={index}
        style={{
          display: 'flex',
          alignItems: 'center',
          marginRight: '15px',
          color: index === 0 ? '#4285f4' : '#666',
          cursor: 'pointer',
        }}
      >
        <span style={{ marginRight: '5px' }}>{item.icon}</span>
        <span>{item.label}</span>
      </div>
    ))}
  </div>
);

const AddMemberButton = () => (
  <button
    style={{
      backgroundColor: '#4285f4',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '8px 16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      marginLeft: '20px',
    }}
  >
    <span style={{ marginRight: '5px' }}>+</span>
    Add Member
  </button>
);

const BoardingHeader = () => (
  <div
    style={{
      margin: '0 auto',
      width: '100%',
      backgroundColor: '#fff',
    }}
  >
    <Header />
    <ProjectHeader />
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0px',
      }}
    >
      Main Content
    </div>
    <ViewOptions />
  </div>
);

export default BoardingHeader;
