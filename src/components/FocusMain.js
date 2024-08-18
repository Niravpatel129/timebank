import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { GrClose } from 'react-icons/gr';
import { IoPauseOutline, IoPlayOutline } from 'react-icons/io5';
import { MdCheck, MdMoreTime } from 'react-icons/md';

export default function FocusMain({
  title,
  time,
  onClickTimeAction,
  closeFocus,
  isActive,
  fillAmount,
  currentFillAmount,
  handleMarkComplete,
  handleAddMoreTime,
}) {
  console.log(
    '🚀  fillAmount currentFillAmount:',
    fillAmount,
    currentFillAmount,
    fillAmount / currentFillAmount,
  );
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

  const renderClock = ({ time, isActive, onClickTimeAction }) => {
    const initialRemainingTime = currentFillAmount;

    return (
      <div style={{ position: 'relative' }}>
        <CountdownCircleTimer
          isPlaying={isActive}
          duration={fillAmount}
          initialRemainingTime={initialRemainingTime}
          colors={['#fff']}
          trailColor='rgba(255, 255, 255, 0.5)'
          colorsTime={[fillAmount]}
          size={400}
          strokeWidth={12}
        >
          {({ remainingTime }) => (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                // width: `${clockSize * 0.75}%`,
                // height: `${clockSize * 0.75}%`,
                borderRadius: '50%',
                backgroundColor: '#6366F1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={onClickTimeAction}
            >
              {isActive ? (
                <IoPauseOutline style={{ fontSize: '100px', color: 'white' }} />
              ) : (
                <IoPlayOutline style={{ fontSize: '100px', color: 'white' }} />
              )}
            </div>
          )}
        </CountdownCircleTimer>
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
        <div style={{ cursor: 'pointer', color: 'white', fontSize: '20px' }} onClick={closeFocus}>
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
          justifyContent: 'space-between',
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
        {renderClock({ time, isActive, onClickTimeAction })}
      </div>

      {/* bottom section */}
      <div style={{ padding: '16px', display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <div onClick={handleMarkComplete}>{renderIcon({ Icon: MdCheck })}</div>
        <div onClick={handleAddMoreTime}>{renderIcon({ Icon: MdMoreTime })}</div>
      </div>
    </div>
  );
}
