import { motion } from 'framer-motion';
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useNotificationContext } from '../context/useNotificationContext';

export default function NotificationModal({ isOpen, onClose }) {
  const { notifications } = useNotificationContext();

  return (
    <>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '140%' }}
        transition={{ type: 'spring', duration: 1 }}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          width: 'calc(400px - 40px)',
          height: 'calc(100vh - 40px)',
          backgroundColor: 'white',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '15px',
          fontSize: '14px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            padding: '15px',
            borderBottom: '1px solid #f3f3f3',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '18px' }}>Notifications</h2>
          <FaTimes onClick={onClose} style={{ cursor: 'pointer', fontSize: '16px' }} />
        </div>
        <div style={{ padding: '15px', overflowY: 'auto', flex: 1 }}>
          {notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: '15px',
                  padding: '8px',
                  paddingTop: '16px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #f3f3f3',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#ddd',
                      marginRight: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      border: '1px solid #f3f3f3',
                    }}
                  >
                    {notification.avatar[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 3px 0', fontSize: '13px' }}>
                      <strong>{notification.avatar}</strong> {notification.action}{' '}
                      <strong>{notification.target}</strong>
                    </p>
                    <div style={{ display: 'flex', marginTop: '10px' }}>
                      <button
                        style={{
                          flex: 1,
                          marginRight: '6px',
                          padding: '5px 10px',
                          backgroundColor: 'white',
                          color: 'black',
                          border: '1px solid #ccc',
                          borderRadius: '7px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#f0f0f0';
                          e.target.style.borderColor = '#999';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.borderColor = '#ccc';
                        }}
                      >
                        Decline
                      </button>
                      <button
                        style={{
                          flex: 1,
                          padding: '5px 10px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '7px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#0056b3';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#007bff';
                        }}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                  <div style={{ color: '#888', fontSize: '0.8em' }}>{notification.timeAgo}</div>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                color: '#888',
              }}
            >
              <span style={{ fontSize: '48px', marginBottom: '20px' }}>🌟</span>
              <p>You're all caught up! No new notifications.</p>
            </div>
          )}
        </div>
      </motion.div>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            zIndex: 1000,
          }}
          onClick={onClose}
        />
      )}
    </>
  );
}
