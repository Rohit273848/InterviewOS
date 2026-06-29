import api from './api';

export const generateInterviewStrategy = async (jobDescription: string, selfDescription: string, candidateWeaknesses: string, resumeFile: File) => {
  const formData = new FormData();
  formData.append('jobDescription', jobDescription);
  formData.append('selfDescription', selfDescription);
  formData.append('candidateWeaknesses', candidateWeaknesses);
  formData.append('resume', resumeFile);

  const response = await api.post('/interview/generate', formData);

  return response.data.data;
};

export const getInterviewById = async (id: string) => {
  const response = await api.get(`/interview/${id}`);
  return response.data.data;
};

export const getResumePdfUrl = async (id: string) => {
  const response = await api.get(`/interview/${id}/resume`);
  return response.data.data.resumeUrl;
};

export const getLatestInterviewReport = async () => {
  const response = await api.get('/interview/latest');
  return response.data.data;
};
