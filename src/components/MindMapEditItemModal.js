import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function MindMapEditItemModal({ item, onSave, onClose }) {
  const [editedLabel, setEditedLabel] = useState(item.label);

  const handleSave = () => {
    onSave({ ...item, label: editedLabel });
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
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
        initial='hidden'
        animate='visible'
        variants={contentVariants}
        transition={{ delay: 0.2, duration: 0.3 }}
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
          }}
        >
          <FaTimes />
        </button>
        <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600' }}>
          Edit {item.type}
        </h2>
        <input
          type='text'
          value={editedLabel}
          onChange={(e) => setEditedLabel(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '16px',
            border: '1px solid #E5E7EB',
            borderRadius: '4px',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              marginRight: '8px',
              background: '#F3F4F6',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 16px',
              background: '#2563EB',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
