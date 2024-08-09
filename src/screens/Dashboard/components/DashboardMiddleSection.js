import React from 'react';
import { FaPlay, FaPlus, FaSearch } from 'react-icons/fa';

// Reusable styles
const commonStyles = {
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  taskItem: {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryColor: '#341dc0',
  secondaryColor: '#888',
};

// Reusable components
const Tag = ({ backgroundColor, color = 'white', children, style }) => (
  <span
    style={{
      backgroundColor,
      color,
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '12px',
      marginRight: '10px',
      ...style,
    }}
  >
    {children}
  </span>
);

const IconButton = ({ Icon, color, style, marginLeft = '10px' }) => (
  <div style={{ marginLeft, ...style }}>
    <Icon style={{ color }} />
  </div>
);

const ChecklistItem = ({ title, tag, status, time, profileImage }) => (
  <div
    style={{
      ...commonStyles.taskItem,
      padding: '4px 0',
      borderBottom: '1px solid #eee',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <input
        type='checkbox'
        style={{
          marginRight: '10px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: '2px solid #ddd',
          appearance: 'none',
          cursor: 'pointer',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span
          style={{
            flexGrow: 1,
            fontSize: '16px',
            fontWeight: '500',
            color: '#333',
          }}
        >
          {title}
        </span>
        <Tag
          backgroundColor='#FFD700'
          color='#B8860B'
          style={{
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: '8px',
            padding: '4px 8px',
          }}
        >
          {tag}
        </Tag>
      </div>
    </div>

    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span
        style={{
          color: commonStyles.secondaryColor,
          fontSize: '14px',
          marginRight: '10px',
        }}
      >
        {status}
      </span>
      <span
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#ced2d8',
        }}
      >
        {time}
      </span>
      <IconButton
        Icon={FaPlay}
        color='#888'
        style={{
          backgroundColor: '#eee',
          padding: '10px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '10px',
          height: '10px',
          cursor: 'pointer',
          marginRight: '10px',
        }}
      />
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          overflow: 'hidden',
          marginLeft: '10px',
        }}
      >
        <img
          src={profileImage}
          alt='profile'
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  </div>
);

export default function DashboardComponent() {
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        paddingBottom: '100px',
        height: '100vh',
        overflow: 'auto',
      }}
    >
      {/* Top Section */}
      <div
        style={{
          ...commonStyles.flexContainer,
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ fontSize: '14px', color: '#8888a4' }}>
            <span style={{ marginRight: '10px' }}>Project:</span>
            <div
              style={{
                backgroundColor: '#eae8f2',
                display: 'inline-block',
                padding: '5px 10px',
                borderRadius: '15px',
                fontSize: '14px',
                marginBottom: '10px',
              }}
            >
              design system
            </div>
          </div>

          <h1 style={{ color: commonStyles.primaryColor, fontSize: '28px', margin: '0' }}>
            Storybook for Vue.js
          </h1>
        </div>
        <div style={commonStyles.flexContainer}>
          <FaSearch
            style={{ marginRight: '15px', fontSize: '20px', color: commonStyles.secondaryColor }}
          />
          <div
            style={{
              backgroundColor: commonStyles.primaryColor,
              color: 'white',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FaPlus />
          </div>
        </div>
      </div>

      <div
        style={{
          ...commonStyles.flexContainer,
          justifyContent: 'space-between',
          gap: '50px',
        }}
      >
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {Array(60)
            .fill()
            .map((_, i) => (
              <div
                key={i}
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor:
                    i % 5 === 0 ? commonStyles.primaryColor : i % 3 === 0 ? '#5a47d1' : '#d1c9f5',
                  borderRadius: '4px',
                }}
              />
            ))}
        </div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 'normal', width: '100%' }}>
            <div style={{ ...commonStyles.flexContainer, gap: '4px' }}>
              <span
                style={{
                  color: commonStyles.primaryColor,
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                67:30{' '}
              </span>
              <span
                style={{ fontSize: '14px', color: commonStyles.secondaryColor, textWrap: 'nowrap' }}
              >
                hours in the last 2 month
              </span>
            </div>
          </div>
          <div
            style={{
              fontSize: '12px',
              color: commonStyles.secondaryColor,
              ...commonStyles.flexContainer,
              gap: '4px',
            }}
          >
            Less
            <div style={{ display: 'flex', gap: '1px' }}>
              {Array(5)
                .fill()
                .map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '20%',
                      backgroundColor:
                        i === 0
                          ? '#d1c9f5'
                          : i === 1
                          ? '#a799e8'
                          : i === 2
                          ? '#7d69db'
                          : i === 3
                          ? '#5339ce'
                          : commonStyles.primaryColor,
                      marginLeft: '2px',
                    }}
                  />
                ))}
            </div>
            More
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div
        style={{
          ...commonStyles.flexContainer,
          justifyContent: 'space-between',
          marginTop: '30px',
        }}
      >
        <h2
          style={{
            color: commonStyles.primaryColor,
            marginBottom: '20px',
            ...commonStyles.flexContainer,
            gap: '4px',
          }}
        >
          <span>Current week</span>
        </h2>
        <div>
          <div style={{ ...commonStyles.flexContainer, gap: '20px' }}>
            {['All Tasks', 'My Tasks'].map((text, index) => (
              <div
                key={index}
                style={{
                  color: index === 0 ? commonStyles.primaryColor : commonStyles.secondaryColor,
                  fontSize: '15px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                {text}
              </div>
            ))}
            <div
              style={{
                cursor: 'pointer',
                ...commonStyles.flexContainer,
              }}
            >
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M3 17V19H9V17H3ZM3 5V7H13V5H3ZM13 21V19H21V17H13V15H11V21H13ZM7 9V11H3V13H7V15H9V9H7ZM21 13V11H11V13H21ZM15 9H17V7H21V5H17V3H15V9Z'
                  fill={commonStyles.secondaryColor}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <ChecklistItem
          title='Implement User Authentication'
          tag='auth'
          status='in progress'
          time='01:45'
          profileImage='https://steamuserimages-a.akamaihd.net/ugc/952958837545085710/66EE7FE7365BF1365AFA9E8EB3C7447FF4DF81CD/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
        />
        <ChecklistItem
          title='Design Landing Page'
          tag='ui'
          status='not started'
          time='00:00'
          profileImage='https://steamuserimages-a.akamaihd.net/ugc/952958837545085710/66EE7FE7365BF1365AFA9E8EB3C7447FF4DF81CD/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
        />
        <ChecklistItem
          title='Optimize Database Queries'
          tag='backend'
          status='completed'
          time='03:20'
          profileImage='https://steamuserimages-a.akamaihd.net/ugc/952958837545085710/66EE7FE7365BF1365AFA9E8EB3C7447FF4DF81CD/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
        />
        <ChecklistItem
          title='Write Unit Tests'
          tag='testing'
          status='in progress'
          time='02:10'
          profileImage='https://steamuserimages-a.akamaihd.net/ugc/952958837545085710/66EE7FE7365BF1365AFA9E8EB3C7447FF4DF81CD/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
        />
        <ChecklistItem
          title='Integrate Payment Gateway'
          tag='feature'
          status='not started'
          time='00:00'
          profileImage='https://steamuserimages-a.akamaihd.net/ugc/952958837545085710/66EE7FE7365BF1365AFA9E8EB3C7447FF4DF81CD/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
        />
      </div>

      <h2 style={{ color: commonStyles.primaryColor, marginTop: '30px', marginBottom: '20px' }}>
        Things to do
      </h2>

      {/* items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '50px' }}>
        <ChecklistItem
          title='Implement User Authentication'
          tag='security'
          status='not started'
          time='00:00'
          profileImage='https://steamuserimages-a.akamaihd.net/ugc/952958837545085710/66EE7FE7365BF1365AFA9E8EB3C7447FF4DF81CD/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
        />
        <ChecklistItem
          title='Optimize API Endpoints'
          tag='backend'
          status='in progress'
          time='01:45'
          profileImage='https://steamuserimages-a.akamaihd.net/ugc/952958837545085710/66EE7FE7365BF1365AFA9E8EB3C7447FF4DF81CD/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
        />
        <ChecklistItem
          title='Create Mobile-Responsive Layout'
          tag='ui'
          status='completed'
          time='03:20'
          profileImage='https://steamuserimages-a.akamaihd.net/ugc/952958837545085710/66EE7FE7365BF1365AFA9E8EB3C7447FF4DF81CD/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
        />
        <ChecklistItem
          title='Set Up CI/CD Pipeline'
          tag='devops'
          status='in progress'
          time='02:10'
          profileImage='https://steamuserimages-a.akamaihd.net/ugc/952958837545085710/66EE7FE7365BF1365AFA9E8EB3C7447FF4DF81CD/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
        />
        <ChecklistItem
          title='Implement Data Analytics Dashboard'
          tag='feature'
          status='not started'
          time='00:00'
          profileImage='https://steamuserimages-a.akamaihd.net/ugc/952958837545085710/66EE7FE7365BF1365AFA9E8EB3C7447FF4DF81CD/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
        />
      </div>
    </div>
  );
}
