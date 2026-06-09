import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  generateInterviewStrategy,
  getInterviewById,
  getResumePdfUrl,
  getLatestInterviewReport,
} from '../services/interview.service';

export const useInterview = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [latestReport, setLatestReport] = useState<any>(null);
  const [fetchingLatest, setFetchingLatest] = useState(false);

  const generateStrategy = async (jobDescription: string, selfDescription: string, candidateWeaknesses: string, file: File) => {
    try {
      setLoading(true);
      const data = await generateInterviewStrategy(jobDescription, selfDescription, candidateWeaknesses, file);
      setReport(data);
      setLatestReport(data); // update latest report in hook state as well
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

  const fetchLatestReport = async () => {
    try {
      setFetchingLatest(true);
      const data = await getLatestInterviewReport();
      setLatestReport(data);
      return data;
    } catch (error: any) {
      // Don't toast error here since returning null on first load is normal behaviour
      console.error('Failed to fetch latest report:', error);
    } finally {
      setFetchingLatest(false);
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
    latestReport,
    fetchingLatest,
    generateStrategy,
    fetchReportById,
    fetchLatestReport,
    getResumePdf,
  };
};
