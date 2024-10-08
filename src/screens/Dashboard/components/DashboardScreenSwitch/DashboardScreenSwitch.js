import React from 'react';
import MindMap from '../../../../components/MindMap.js';
import BlocksScreen from './screens/BlocksScreen.js';
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
    case 'blocks':
      return <BlocksScreen />;
    case 'flow-map':
      return <MindMap />;
    // return <FlowMapScreen />;
    default:
      return <ListScreen />;
  }
};

export default DashboardScreenSwitch;
