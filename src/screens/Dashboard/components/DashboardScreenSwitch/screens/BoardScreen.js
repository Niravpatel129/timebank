import React from 'react';
import BoardingHeader from '../../BoardHeader/BoardHeader';
import BoardTable from '../../BoardTable/BoardTable';

export default function BoardScreen() {
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
        <BoardingHeader />
      </div>
      <div style={{ backgroundColor: '#f7f7f7', padding: '20px', flex: 1 }}>
        <BoardTable />
      </div>
    </div>
  );
}
