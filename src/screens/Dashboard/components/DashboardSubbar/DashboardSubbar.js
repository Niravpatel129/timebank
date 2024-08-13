import { motion } from 'framer-motion';
import React, { useState } from 'react';
import {
  FaCalendarAlt,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaClipboardList,
  FaListAlt,
  FaTags,
  FaTrash,
} from 'react-icons/fa';

const iconStyle = {
  fontSize: '24px',
  color: '#ffffff',
  opacity: 0.7,
  width: '24px', // Fixed width for icons
  display: 'flex',
  justifyContent: 'center',
};

const labelStyle = {
  color: '#ffffff',
  fontSize: '14px',
  marginLeft: '10px',
};

export default function DashboardSubbar({ colorGradients }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const items = [
    {
      icon: FaChevronRight,
      label: 'Expand',
      expandedIcon: FaChevronLeft,
      expandedLabel: 'Collapse',
      onClick: toggleExpand,
    },
    { icon: FaListAlt, label: 'List' },
    { icon: FaCalendarAlt, label: 'Calendar' },
    { icon: FaClipboardList, label: 'Board' },
    { icon: FaTags, label: 'Tags' },
    { icon: FaCheck, label: 'Completed' },
    { icon: FaTrash, label: 'Trash' },
  ];

  return (
    <motion.div
      animate={{ width: isExpanded ? '200px' : 'auto' }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'center',
        paddingTop: '20px',
        gap: '10px',
        height: '100%',
        background: `linear-gradient(to top, ${colorGradients[1] || '#212d8b'}, ${
          colorGradients[0] || '#1f2f8c'
        })`,
      }}
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          onClick={item.onClick}
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            // width: '100%',
            padding: '10px',
            paddingLeft: '20px',
            paddingRight: '10px',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          {item.expandedIcon && isExpanded ? (
            <item.expandedIcon style={iconStyle} />
          ) : (
            <item.icon style={iconStyle} />
          )}
          <motion.span
            initial={false}
            animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? 'auto' : 0 }}
            style={{ ...labelStyle, overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: 'bold' }}
          >
            {isExpanded && item.expandedLabel ? item.expandedLabel : item.label}
          </motion.span>
        </motion.div>
      ))}
    </motion.div>
  );
}
