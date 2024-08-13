import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useProjectContext } from '../context/useProjectContext';

const TeamInviteModal = ({ isOpen, onClose }) => {
  const { selectedProject } = useProjectContext();
  const [inviteEmail, setInviteEmail] = useState('');
  const [pendingInvites, setPendingInvites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const memberColorsRef = useRef({});

  const modalVariants = useMemo(
    () => ({
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    }),
    [],
  );

  const overlayVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    }),
    [],
  );

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const buttonStyle = useMemo(
    () => ({
      transition: 'opacity 0.3s',
      ':hover': {
        opacity: 0.8,
      },
      ':active': {
        opacity: 0.6,
      },
    }),
    [],
  );

  const handleAddInvite = useCallback(() => {
    if (!inviteEmail) return;
    setPendingInvites((prevInvites) => [...prevInvites, { email: inviteEmail, role: 'Editor' }]);
    setInviteEmail('');
  }, [inviteEmail]);

  const handleSendInvites = useCallback(async () => {
    if (pendingInvites.length === 0) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPendingInvites([]);
      onClose();
    } catch (error) {
      console.error('Failed to send invites:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pendingInvites, onClose]);

  const getRandomColor = useCallback((key) => {
    if (!memberColorsRef.current[key]) {
      memberColorsRef.current[key] = `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')}`;
    }
    return memberColorsRef.current[key];
  }, []);

  const renderMember = useCallback(
    (member, index) => {
      const randomColor = getRandomColor(member.user.email);

      return (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: randomColor,
              marginRight: '12px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '14px',
              color: 'white',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            {member.user.name[0]}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: '500' }}>{member.user.name}</div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>{member.user.email}</div>
          </div>
          <select
            style={{
              padding: '6px 8px',
              border: '1px solid #E5E7EB',
              borderRadius: '4px',
              fontSize: '14px',
              color: '#374151',
            }}
            defaultValue={member.role}
          >
            <option value='Owner'>Owner</option>
            <option value='Admin'>Admin</option>
            <option value='Editor'>Editor</option>
          </select>
        </div>
      );
    },
    [getRandomColor],
  );

  const renderPendingInvite = useCallback(
    (invite, index) => (
      <div key={`pending-${index}`} style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: getRandomColor(invite.email),
            marginRight: '12px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '14px',
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        >
          {invite.email[0]}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: '500' }}>{invite.email}</div>
          <div style={{ fontSize: '14px', color: '#6B7280' }}>Pending</div>
        </div>
        <select
          style={{
            padding: '6px 8px',
            border: '1px solid #E5E7EB',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#374151',
          }}
          value={invite.role}
          onChange={(e) => {
            setPendingInvites((prevInvites) => {
              const updatedInvites = [...prevInvites];
              updatedInvites[index].role = e.target.value;
              return updatedInvites;
            });
          }}
        >
          <option value='Admin'>Admin</option>
          <option value='Editor'>Editor</option>
        </select>
      </div>
    ),
    [],
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial='hidden'
          animate='visible'
          exit='hidden'
          variants={overlayVariants}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }}
          onClick={handleOverlayClick}
        >
          <motion.div
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={modalVariants}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div
              style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                maxWidth: '400px',
                width: '95%',
                position: 'relative',
                textAlign: 'left',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6B7280',
                  ...buttonStyle,
                }}
              >
                <FaTimes />
              </button>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  maxHeight: '200px',
                  overflow: 'hidden',
                }}
              >
                <div style={{ color: '#0f1121' }}>
                  <h2 style={{ marginBottom: '8px', fontSize: '23px', fontWeight: '600' }}>
                    Invite team members
                  </h2>
                  <p style={{ color: '#6B7280', marginBottom: '24px', fontSize: '14px' }}>
                    Invite your team to review & collaborate
                  </p>
                </div>
                <div>
                  <img
                    src='https://cdni.iconscout.com/illustration/premium/thumb/mailbox-4550325-3779133.png?f=webp'
                    alt='Mailbox clipart'
                    style={{ maxHeight: '100%', width: '150px', objectFit: 'contain' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Invite team members
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type='email'
                    placeholder='Enter email address'
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      flex: 1,
                    }}
                  />
                  <button
                    style={{
                      padding: '10px 20px',
                      background: '#2563EB',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      height: '100%',
                      borderRadius: '8px',
                      ...buttonStyle,
                    }}
                    onClick={handleAddInvite}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                  In this project
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedProject?.members?.map(renderMember)}
                  {pendingInvites.map(renderPendingInvite)}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                <button
                  style={{
                    padding: '10px 20px',
                    background: 'none',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#374151',
                    flex: 1,
                    ...buttonStyle,
                  }}
                  onClick={onClose}
                >
                  Discard
                </button>
                <button
                  style={{
                    padding: '10px 20px',
                    background: '#2563EB',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    flex: 1,
                    ...buttonStyle,
                  }}
                  onClick={handleSendInvites}
                  disabled={isLoading || pendingInvites.length === 0}
                >
                  {isLoading ? 'Sending...' : 'Invite team members'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(TeamInviteModal);
