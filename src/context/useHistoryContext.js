import React, { createContext, useCallback, useContext, useState } from 'react';
import newRequest from '../api/newReqest';

const HistoryContext = createContext();

export const useHistoryContext = () => useContext(HistoryContext);

export const HistoryProvider = ({ children }) => {
  const [historyEntries, setHistoryEntries] = useState([]);

  const addHistoryEntry = useCallback(async (entry) => {
    try {
      const response = await newRequest.post('/history/add', entry);
      setHistoryEntries((prevEntries) => [response.entry, ...prevEntries]);
    } catch (error) {
      console.error('Error adding history entry:', error);
    }
  }, []);

  const fetchHistoryEntries = useCallback(async () => {
    try {
      const response = await newRequest.get('/history');
      setHistoryEntries(response.entries);
    } catch (error) {
      console.error('Error fetching history entries:', error);
    }
  }, []);

  const getRecentEntries = useCallback(
    (count = 5) => {
      return historyEntries.slice(0, count);
    },
    [historyEntries],
  );

  const contextValue = {
    historyEntries,
    addHistoryEntry,
    fetchHistoryEntries,
    getRecentEntries,
  };

  return <HistoryContext.Provider value={contextValue}>{children}</HistoryContext.Provider>;
};

export default HistoryProvider;
