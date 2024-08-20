import { useCallback, useState } from 'react';

const useSync = () => {
  const [lastSyncTime, setLastSyncTime] = useState(null);

  const sync = useCallback(async () => {
    // fake sync
    const currentTime = new Date().toISOString();
    setLastSyncTime(currentTime);
    localStorage.setItem('lastSyncTime', currentTime);
  }, []);

  return { sync, lastSyncTime };
};

export default useSync;
