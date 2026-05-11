/**
 * useDiseaseScan Hook
 * Handles image submission and diagnosis scanning logic.
 */
import { useState } from 'react';
import { toast } from 'react-toastify';
import * as diseaseApi from '../api/disease.api';

const useDiseaseScan = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const submitScan = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('cropImage', file);
      toast.info('Analyzing crop image with AI. Please wait...', { autoClose: 5000 });
      
      const data = await diseaseApi.diagnose(formData);
      if (data.success) {
        toast.success('Diagnosis complete!');
        setResult(data.data);
        return data.data;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error analyzing image. Please try again.');
    } finally {
      setLoading(false);
    }
    return null;
  };

  const clearResult = () => setResult(null);

  return { loading, result, setResult, submitScan, clearResult };
};

export default useDiseaseScan;
