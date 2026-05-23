import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  generateInterviewStrategy,
  getInterviewById,
  getResumePdfUrl,
} from '../services/interview.service';

export const useInterview = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const generateStrategy = async (jobDescription: string, selfDescription: string, file: File) => {
    try {
      setLoading(true);
      const data = await generateInterviewStrategy(jobDescription, selfDescription, file);
      setReport(data);
      toast.success('Interview strategy generated successfully!');
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to generate interview strategy';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchReportById = async (id: string) => {
    try {
      setLoading(true);
      const data = await getInterviewById(id);
      setReport(data);
    } catch (error: any) {
      toast.error('Failed to fetch interview report');
    } finally {
      setLoading(false);
    }
  };

  const getResumePdf = async (id: string) => {
    try {
      const url = await getResumePdfUrl(id);
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error: any) {
      toast.error('Failed to load resume PDF');
    }
  };

  return {
    loading,
    report,
    generateStrategy,
    fetchReportById,
    getResumePdf,
  };
};
