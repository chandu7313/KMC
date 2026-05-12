/**
 * useScanHistory Hook
 * Fetches and manages the user's scan history.
 */
import { useState, useEffect, useCallback } from 'react';
import * as diseaseApi from '../api/disease.api';

const useScanHistory = (userData) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!userData) return;
    setLoading(true);
    try {
      const data = await diseaseApi.getHistory();
      if (data.success) {
        setHistory(data.data);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      fetchHistory();
    }
  }, [userData, fetchHistory]);

  return { history, loading, refetch: fetchHistory };
};

export default useScanHistory;
