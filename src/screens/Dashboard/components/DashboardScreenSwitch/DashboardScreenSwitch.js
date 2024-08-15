import React from 'react';
import BoardScreen from './screens/BoardScreen';
import CalendarScreen from './screens/CalendarScreen';
import ListScreen from './screens/ListScreen';
import TeamScreen from './screens/TeamScreen';
import TrashScreen from './screens/TrashScreen';

const DashboardScreenSwitch = (props) => {
  switch (props.selectedDashboardScreen) {
    case 'list':
      return <ListScreen {...props} />;
    case 'board':
      return <BoardScreen />;
    case 'calendar':
      return <CalendarScreen />;
    case 'team':
      return <TeamScreen />;
    case 'trash':
      return <TrashScreen />;
    default:
      return <ListScreen />;
  }
};

export default DashboardScreenSwitch;
