import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Select from 'react-select';
import { useProjectContext } from '../../../../context/useProjectContext';
import { useUserContext } from '../../../../context/useUserContext';

const DashboardCreateProjectModal = () => {
  const { user } = useUserContext();
  const [projectName, setProjectName] = useState('');
  const [members, setMembers] = useState([
    {
      user: user._id,
      name: user.name,
      email: user.email,
      role: { value: 'owner', label: 'owner' },
      status: 'You',
    },
  ]);
  const [projectColor, setProjectColor] = useState({
    gradient1: '#6941C6',
    gradient2: '#419ec6',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { addProject, closeModal } = useProjectContext();

  const colors = [
    { gradient1: '#000000', gradient2: '#333333', label: 'Black' },
    { gradient1: '#7F56D9', gradient2: '#9E77ED', label: 'Purple' },
    { gradient1: '#6941C6', gradient2: '#8B5CF6', label: 'Indigo' },
    { gradient1: '#3538CD', gradient2: '#4F46E5', label: 'Blue' },
    { gradient1: '#2563EB', gradient2: '#3B82F6', label: 'Light Blue' },
    { gradient1: '#0086C9', gradient2: '#00A3E0', label: 'Cyan' },
    { gradient1: '#0E9384', gradient2: '#14B8A6', label: 'Teal' },
    { gradient1: '#099250', gradient2: '#10B981', label: 'Green' },
    { gradient1: '#F5F5F5', gradient2: '#FFFFFF', label: 'Light Gray' },
  ];

  const roleOptions = [
    { value: 'Owner', label: 'Owner' },
    { value: 'Editor', label: 'Editor' },
  ];

  useEffect(() => {
    // Simulating a search function
    const searchMembers = () => {
      const results = members.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setSearchResults(results);
    };

    if (searchTerm) {
      searchMembers();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, members]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      await addProject({ name: projectName.trim(), projectColor, members });
      closeModal();
    }
  };

  const handleAddMember = (selectedOption) => {
    if (selectedOption) {
      const newMember = {
        name: selectedOption.label,
        email: selectedOption.value,
        role: { value: 'Editor', label: 'Editor' },
        status: 'Invite pending',
      };
      setMembers([...members, newMember]);
      setSearchTerm('');
    }
  };

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const emailOptions = isValidEmail(searchTerm) ? [{ value: searchTerm, label: searchTerm }] : [];

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
              background: `linear-gradient(45deg, ${projectColor.gradient1}, ${projectColor.gradient2})`,
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
              Project Color
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {colors.map((color) => (
                <div
                  key={color.gradient1}
                  onClick={() =>
                    setProjectColor({ gradient1: color.gradient1, gradient2: color.gradient2 })
                  }
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: `linear-gradient(45deg, ${color.gradient1}, ${color.gradient2})`,
                    cursor: 'pointer',
                    border: projectColor.gradient1 === color.gradient1 ? '2px solid #000' : 'none',
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
              <Select
                value={null}
                onChange={handleAddMember}
                options={emailOptions}
                onInputChange={(inputValue) => setSearchTerm(inputValue)}
                inputValue={searchTerm}
                isValidNewOption={(inputValue) => isValidEmail(inputValue)}
                placeholder="Enter member's email"
                noOptionsMessage={() => 'Enter a valid email to add a member'}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    marginBottom: '8px',
                  }),
                }}
              />
              <div style={{ marginTop: '10px' }}>
                {members.map((member, index) => {
                  return (
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
                          background: `linear-gradient(45deg, ${projectColor.gradient1}, ${projectColor.gradient2})`,
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
                  );
                })}
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
                  background: `linear-gradient(45deg, ${projectColor.gradient1}, ${projectColor.gradient2})`,
                  color: 'white',
                  border: 'none',
                }}
              >
                Create project
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default DashboardCreateProjectModal;
