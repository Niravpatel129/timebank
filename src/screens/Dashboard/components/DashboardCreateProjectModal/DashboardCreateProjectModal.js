import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Select from 'react-select';
import { useProjectContext } from '../../../../context/useProjectContext';

const DashboardCreateProjectModal = () => {
  const [projectName, setProjectName] = useState('');
  const [members, setMembers] = useState([
    {
      name: 'Frankie Sullivan',
      email: 'frankie@untitledui.com',
      role: { value: 'Owner', label: 'Owner' },
      status: 'You',
    },
    {
      name: 'Amélie Laurent',
      email: 'amélie@untitledui.com',
      role: { value: 'Editor', label: 'Editor' },
    },
    {
      name: 'Katie Moss',
      email: 'katie@untitledui.com',
      role: { value: 'Editor', label: 'Editor' },
      status: 'Invite pending',
    },
  ]);
  const [selectedColor, setSelectedColor] = useState('#6941C6');
  const [newMember, setNewMember] = useState('');
  const { addProject, closeModal } = useProjectContext();

  const colors = [
    { value: '#000000', label: 'Black' },
    { value: '#7F56D9', label: 'Purple' },
    { value: '#6941C6', label: 'Indigo' },
    { value: '#3538CD', label: 'Blue' },
    { value: '#2563EB', label: 'Light Blue' },
    { value: '#0086C9', label: 'Cyan' },
    { value: '#0E9384', label: 'Teal' },
    { value: '#099250', label: 'Green' },
    { value: '#F5F5F5', label: 'Light Gray' },
  ];

  const roleOptions = [
    { value: 'Owner', label: 'Owner' },
    { value: 'Editor', label: 'Editor' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      await addProject({ name: projectName.trim() });
      closeModal();
    }
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (newMember.trim()) {
      setMembers([
        ...members,
        {
          name: newMember,
          email: newMember,
          role: { value: 'Editor', label: 'Editor' },
          status: 'Invited',
        },
      ]);
      setNewMember('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          width: '600px',
          maxWidth: '90%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          overflowY: 'auto',
          maxHeight: '90vh',
        }}
      >
        <button
          onClick={closeModal}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
          }}
        >
          <FaTimes />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <div
            style={{
              maxWidth: '80px',
              height: '80px',
              borderRadius: '8px',
              background: '#F4EBFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '12px',
              width: '100%',
            }}
          >
            <span style={{ fontSize: '48px' }}>✨</span>
          </div>
          <div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                margin: 0,
                fontFamily: 'Arial',
                color: 'black',
              }}
            >
              Create a new project
            </h2>
            <p style={{ fontSize: '14px', color: '#666', margin: '4px 0 0' }}>
              Change how Untitled UI looks and feels in your browser.
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor='teamName'
            style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}
          >
            Project name
          </label>
          <input
            id='teamName'
            type='text'
            value={projectName}
            placeholder='Launch the next big thing'
            onChange={(e) => setProjectName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '24px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              Icon Color
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {colors.map((color) => (
                <div
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: color.value,
                    cursor: 'pointer',
                    border: selectedColor === color.value ? '2px solid #000' : 'none',
                  }}
                />
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              Members
            </label>
            <div>
              <form onSubmit={handleAddMember}>
                <input
                  type='text'
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  placeholder='Add members by name or email'
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </form>
              <div style={{ marginTop: '10px' }}>
                {members.map((member, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#ccc',
                        marginRight: '8px',
                        flexShrink: 0,
                      }}
                    ></div>
                    <div style={{ flexGrow: 1, minWidth: '0' }}>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {member.name}{' '}
                        {member.status && (
                          <span style={{ fontWeight: 'normal', color: '#666' }}>
                            ({member.status})
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#666',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {member.email}
                      </div>
                    </div>
                    <Select
                      value={member.role}
                      onChange={(selectedOption) => {
                        const updatedMembers = [...members];
                        updatedMembers[index].role = selectedOption;
                        setMembers(updatedMembers);
                      }}
                      options={roleOptions}
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          minWidth: '120px',
                          marginLeft: '8px',
                        }),
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              type='button'
              style={{
                background: 'none',
                border: 'none',
                color: '#6941C6',
                cursor: 'pointer',
                marginBottom: '8px',
              }}
            >
              Reset to default
            </button>
            <div>
              <button
                type='button'
                onClick={closeModal}
                style={{
                  marginRight: '10px',
                  padding: '8px 16px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  background: 'white',
                }}
              >
                Cancel
              </button>
              <button
                type='submit'
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: '#6941C6',
                  color: 'white',
                  border: 'none',
                }}
              >
                Create team
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default DashboardCreateProjectModal;
