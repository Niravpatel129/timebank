import React, { useEffect, useRef, useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { useProjectContext } from '../../../../../context/useProjectContext';

export default function TeamScreen() {
  const { selectedProject } = useProjectContext();
  const members = selectedProject?.members || [];

  const [showDropdown, setShowDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleActionClick = (memberId) => {
    setShowDropdown(showDropdown === memberId ? null : memberId);
  };

  const handleRoleChange = (memberId, newRole) => {
    // Implement role change logic here
    setShowDropdown(null);
  };

  const handleDelete = (memberId) => {
    // Implement delete logic here
    setShowDropdown(null);
  };

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        width: '100%',
        textTransform: 'capitalize',
      }}
    >
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Team Members</h2>
      <div style={{ overflowX: 'auto', height: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '10px', color: '#666' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '10px', color: '#666' }}>Role</th>
              <th style={{ textAlign: 'left', padding: '10px', color: '#666' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
                key={member._id}
                style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
              >
                <td style={{ padding: '15px', borderRadius: '8px 0 0 8px' }}>
                  {member.user?.name}
                </td>
                <td style={{ padding: '15px' }}>{member.role?.label}</td>
                <td style={{ padding: '15px', borderRadius: '0 8px 8px 0', position: 'relative' }}>
                  <FaEllipsisV
                    style={{ cursor: 'pointer', color: '#666' }}
                    onClick={() => handleActionClick(member._id)}
                  />
                  {showDropdown === member._id && (
                    <div
                      ref={dropdownRef}
                      style={{
                        position: 'absolute',
                        right: '20px',
                        top: '40px',
                        background: 'white',
                        borderRadius: '4px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        zIndex: 1000,
                        minWidth: '150px',
                      }}
                    >
                      <div
                        style={{
                          padding: '10px',
                          borderBottom: '1px solid #eee',
                          fontWeight: 'bold',
                        }}
                      >
                        Change Role
                      </div>
                      {['Owner', 'Admin', 'Member'].map((role) => (
                        <div
                          key={role}
                          style={{
                            padding: '10px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                          }}
                          onClick={() => handleRoleChange(member._id, role.toLowerCase())}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                        >
                          {role}
                        </div>
                      ))}
                      <div
                        style={{
                          padding: '10px',
                          borderTop: '1px solid #eee',
                          cursor: 'pointer',
                          color: '#ff4d4d',
                          transition: 'background-color 0.2s',
                        }}
                        onClick={() => handleDelete(member._id)}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#fff0f0')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                      >
                        Delete
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
