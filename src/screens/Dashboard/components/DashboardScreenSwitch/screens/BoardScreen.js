import React, { useState } from 'react';
import BoardingHeader from '../../BoardHeader/BoardHeader';
import BoardKanban from '../../BoardKanban/BoardKanban';
import BoardMatrix from '../../BoardMatrix/BoardMatrix';
import BoardTableView from '../../BoardTableView/BoardTableView';
export default function BoardScreen() {
  const [selectedView, setSelectedView] = useState('board');
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100vh',
      }}
    >
      <div style={{ padding: '20px', paddingBottom: '0px' }}>
        <BoardingHeader setSelectedView={setSelectedView} selectedView={selectedView} />
      </div>
      <div style={{ backgroundColor: '#f7f7f7', padding: '20px', flex: 1 }}>
        {selectedView === 'board' && <BoardKanban />}
        {selectedView === 'table' && <BoardTableView />}
        {selectedView === 'matrix' && <BoardMatrix />}
      </div>
    </div>
  );
}
