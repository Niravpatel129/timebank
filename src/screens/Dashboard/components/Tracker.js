import React from 'react';
import secondsToTimeObj from '../../../helpers/secondsToTimeObj';
import { commonStyles } from './sharedStyles/commonStyles';

export default function Tracker({ lastTwoMonthsTimeSpent, totalTimeSpent, colorGradients, tasks }) {
  const getContributionColor = (timeSpent) => {
    if (timeSpent === 0) return '#f0f0f0';
    let color;
    if (timeSpent <= 1800) color = '#d1c9f5'; // 30 minutes
    else if (timeSpent <= 3600) color = '#a799e8'; // 1 hour
    else if (timeSpent <= 7200) color = '#7d69db'; // 2 hours
    else if (timeSpent <= 14400) color = '#5339ce'; // 4 hours
    else color = commonStyles.primaryColor;

    return color;
  };

  const darkenColor = (color, amount) => {
    return (
      '#' +
      color
        .replace(/^#/, '')
        .replace(/../g, (color) =>
          ('0' + Math.min(255, Math.max(0, parseInt(color, 16) - amount)).toString(16)).substr(-2),
        )
    );
  };

  return (
    <div>
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
            .map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (59 - i));
              const dateString = date.toISOString().split('T')[0];
              const timeSpent = lastTwoMonthsTimeSpent[i]?.timeSpent || 0;
              const isCompleted = lastTwoMonthsTimeSpent[i]?.isCompleted || false;
              return (
                <div
                  data-tooltip-id={`day-${59 - i}`}
                  data-tooltip-content={`${dateString} - ${secondsToTimeObj(timeSpent).hours}:${
                    secondsToTimeObj(timeSpent).minutes
                  }:${secondsToTimeObj(timeSpent).seconds} hours`}
                  key={59 - i}
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: getContributionColor(timeSpent),
                    borderRadius: '4px',
                  }}
                />
              );
            })}
        </div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 'normal', width: '100%' }}>
            <div style={{ ...commonStyles.flexContainer, gap: '4px' }}>
              <span
                style={{
                  color: colorGradients[0],
                  fontSize: '18px',
                  fontWeight: 'bold',
                  textWrap: 'nowrap',
                }}
              >
                {secondsToTimeObj(totalTimeSpent || 0).hours}:
                {secondsToTimeObj(totalTimeSpent || 0).minutes}:
                {secondsToTimeObj(totalTimeSpent || 0).seconds}
              </span>
              <span
                style={{
                  fontSize: '14px',
                  color: commonStyles.secondaryColor,
                  textWrap: 'nowrap',
                }}
              >
                hours in the last 2 months
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
    </div>
  );
}
