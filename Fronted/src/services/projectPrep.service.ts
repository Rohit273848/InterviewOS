import api from './api';

export interface ProjectQuestion {
  question: string;
  category: string;
  difficulty: string;
  hint: string;
}

export interface ProjectPrepSession {
  _id: string;
  userId: string;
  githubUrl: string;
  repoName: string;
  description: string;
  languages: string[];
  topics: string[];
  readmeContent: string;
  status: 'pending' | 'fetching' | 'completed' | 'failed';
  generatedQuestions: ProjectQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface GenerateParams {
  githubUrl: string;
  token?: string | null;
}

/**
 * Service to generate questions from a GitHub repository.
 */
export const generateProjectQuestions = async (params: GenerateParams): Promise<ProjectPrepSession> => {
  const response = await api.post('/project-prep/generate', params);
  return response.data.data;
};

/**
 * Service to fetch detail of a specific project preparation session.
 */
export const getSession = async (sessionId: string): Promise<ProjectPrepSession> => {
  const response = await api.get(`/project-prep/${sessionId}`);
  return response.data.data;
};

/**
 * Service to fetch user's completed project preparation runs.
 */
export const getHistory = async (): Promise<ProjectPrepSession[]> => {
  const response = await api.get('/project-prep/history');
  return response.data.data;
};

/**
 * Service to delete a project preparation session.
 */
export const deleteSession = async (sessionId: string): Promise<{ success: boolean; message: string; deletedSessionId: string }> => {
  const response = await api.delete(`/project-prep/${sessionId}`);
  return response.data.data;
};
