import React from 'react';
import DashboardMiddleSection from '../../../components/DashboardMiddleSection';
import TimerTrack from '../../../components/TimerTrack';

const ListScreen = ({
  setAddTaskModalOpen,
  setIsInviteModalOpen,
  setIsNotificationModalOpen,
  handleEditTask,
}) => {
  return (
    <>
      <div style={{ flex: 1, height: '100%' }}>
        {/* Content for main area */}
        <DashboardMiddleSection
          handleTriggerAddTaskButton={() => setAddTaskModalOpen(true)}
          onEditTask={handleEditTask}
          handleInviteClick={() => setIsInviteModalOpen(true)}
        />
      </div>

      {/* Right part of main content - 300px wide, full height */}
      <div style={{ width: '400px', height: '100%', backgroundColor: '#c0c0c0' }}>
        {/* Content for right column */}
        <TimerTrack openNotificationModal={() => setIsNotificationModalOpen(true)} />
      </div>
    </>
  );
};

export default ListScreen;
