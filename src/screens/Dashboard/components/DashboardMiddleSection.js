import React from 'react';
import { FaCheck, FaPause, FaPlay, FaPlus, FaSearch } from 'react-icons/fa';

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
  },
  primaryColor: '#341dc0',
  secondaryColor: '#888',
};

// Reusable components
const Tag = ({ backgroundColor, color = 'white', children }) => (
  <span
    style={{
      backgroundColor,
      color,
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '12px',
      marginRight: '10px',
    }}
  >
    {children}
  </span>
);

const IconButton = ({ Icon, color, marginLeft = '10px' }) => <Icon style={{ marginLeft, color }} />;

export default function DashboardComponent() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
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

      <div style={commonStyles.taskItem}>
        <input type='checkbox' style={{ marginRight: '10px' }} />
        <span style={{ flexGrow: 1 }}>Using Environment Variables</span>
        <Tag backgroundColor='#FFD700'>auth</Tag>
        <span style={{ color: commonStyles.secondaryColor, marginRight: '10px' }}>in progress</span>
        <span>02:36</span>
        <IconButton Icon={FaPlay} color={commonStyles.secondaryColor} />
      </div>

      <div style={commonStyles.taskItem}>
        <FaCheck style={{ color: commonStyles.primaryColor, marginRight: '10px' }} />
        <span style={{ flexGrow: 1 }}>Setup server at Heroku</span>
        <Tag backgroundColor={commonStyles.primaryColor}>Due to 28 Dec 2018</Tag>
        <span style={{ color: commonStyles.secondaryColor, marginRight: '10px' }}>Done</span>
        <span>03:28</span>
        <IconButton Icon={FaPlay} color={commonStyles.secondaryColor} />
      </div>

      <div style={commonStyles.taskItem}>
        <input type='checkbox' style={{ marginRight: '10px' }} />
        <span style={{ flexGrow: 1 }}>Configure Vue Boilerplate</span>
        <span style={{ color: commonStyles.secondaryColor, marginRight: '10px' }}>Running</span>
        <span>00:36</span>
        <IconButton Icon={FaPause} color={commonStyles.primaryColor} />
      </div>

      <div style={commonStyles.taskItem}>
        <FaCheck style={{ color: commonStyles.primaryColor, marginRight: '10px' }} />
        <span style={{ flexGrow: 1 }}>Automated Visual Testing</span>
        <span style={{ color: commonStyles.secondaryColor, marginRight: '10px' }}>Done</span>
      </div>

      <h2 style={{ color: commonStyles.primaryColor, marginTop: '30px', marginBottom: '20px' }}>
        Things to do
      </h2>

      <div style={commonStyles.flexContainer}>
        <input type='checkbox' style={{ marginRight: '10px' }} />
        <span style={{ flexGrow: 1 }}>Exporting Storybook as a Static App</span>
        <span style={{ color: commonStyles.secondaryColor }}>in progress</span>
      </div>
    </div>
  );
}
