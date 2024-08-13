import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import newRequest from '../api/newReqest';
import { useProjectContext } from './useProjectContext';

const HistoryContext = createContext();

export const useHistoryContext = () => useContext(HistoryContext);

export const HistoryProvider = ({ children }) => {
  const [historyEntries, setHistoryEntries] = useState([]);
  const [selectedProjectHistory, setSelectedProjectHistory] = useState([]);
  const { selectedProject } = useProjectContext();

  useEffect(() => {
    const fetchSelectedProjectHistory = async () => {
      if (!selectedProject) return;
      try {
        const response = await newRequest.get(`/history/project/${selectedProject._id}`);
        setSelectedProjectHistory(response.history);
      } catch (error) {
        console.error('Error fetching selected project history:', error);
      }
    };

    fetchSelectedProjectHistory();
  }, [selectedProject]);

  const addHistoryEntry = useCallback(
    async (entry) => {
      try {
        const response = await newRequest.post('/history/add', entry);
        setHistoryEntries((prevEntries) => [response.entry, ...prevEntries]);
        if (entry.projectId === selectedProject?._id) {
          setSelectedProjectHistory((prevHistory) => [response.entry, ...prevHistory]);
        }
      } catch (error) {
        console.error('Error adding history entry:', error);
      }
    },
    [selectedProject],
  );

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
    selectedProjectHistory,
  };

  return <HistoryContext.Provider value={contextValue}>{children}</HistoryContext.Provider>;
};

export default HistoryProvider;
