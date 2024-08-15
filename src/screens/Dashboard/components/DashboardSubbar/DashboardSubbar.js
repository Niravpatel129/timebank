import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaClipboardList, FaListAlt } from 'react-icons/fa';
import { FaPeopleGroup } from 'react-icons/fa6';

const iconStyle = {
  fontSize: '24px',
  width: '24px', // Fixed width for icons
  display: 'flex',
  justifyContent: 'center',
};

const labelStyle = {
  color: '#ffffff',
  fontSize: '14px',
  marginLeft: '10px',
};

export default function DashboardSubbar({
  colorGradients,
  setSelectedDashboardScreen,
  selectedDashboardScreen,
}) {
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
    { icon: FaListAlt, label: 'List', screen: 'list' },
    { icon: FaClipboardList, label: 'Board', screen: 'board' },
    // { icon: FaCalendarAlt, label: 'Calendar', screen: 'calendar' },
    { icon: FaPeopleGroup, label: 'Team', screen: 'team' },
    // { icon: FaTrash, label: 'Trash', screen: 'trash' },
  ];

  return (
    <motion.div
      animate={{ width: isExpanded ? '200px' : 'auto' }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
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
          onClick={() => {
            if (item.onClick) {
              item.onClick();
            } else if (item.screen) {
              setSelectedDashboardScreen(item.screen);
            }
          }}
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: '10px',
            paddingLeft: '20px',
            paddingRight: '10px',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          {item.expandedIcon && isExpanded ? (
            <item.expandedIcon
              style={{
                ...iconStyle,
                color:
                  selectedDashboardScreen === item.screen ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              }}
            />
          ) : (
            <item.icon
              style={{
                ...iconStyle,
                color:
                  selectedDashboardScreen === item.screen ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              }}
            />
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
