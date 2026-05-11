/**
 * useApi Hook
 * Generic data-fetching hook wrapping the centralized Axios instance.
 * Handles loading, error, and data states.
 */
import { useState, useEffect, useCallback } from 'react';
import api from '../../core/api/axios.instance';

const useApi = (url, options = {}) => {
  const { immediate = true, method = 'get', body = null } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (overrideBody = null) => {
    setLoading(true);
    setError(null);
    try {
      const config = method === 'get'
        ? { method, url }
        : { method, url, data: overrideBody || body };
      
      const response = await api(config);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, body]);

  useEffect(() => {
    if (immediate && url) {
      execute();
    }
  }, [url, immediate]);

  return { data, loading, error, execute, setData };
};

export default useApi;
