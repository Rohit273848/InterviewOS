import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  generateProjectQuestions, 
  getSession, 
  getHistory, 
  deleteSession,
  GenerateParams
} from '../services/projectPrep.service';
import toast from 'react-hot-toast';

/**
 * Custom React hook exposing queries and mutations for the Project Prep module.
 * 
 * @param sessionId - Optional active session ID to query detailed session info.
 */
export const useProjectPrep = (sessionId?: string) => {
  const queryClient = useQueryClient();

  // 1. History Query (Fetches completed sessions list)
  const historyQuery = useQuery({
    queryKey: ['projectPrepHistory'],
    queryFn: getHistory,
  });

  // 2. Session Detail Query (Fetches active session details if ID is present)
  const sessionQuery = useQuery({
    queryKey: ['projectPrepSession', sessionId],
    queryFn: () => getSession(sessionId!),
    enabled: !!sessionId,
  });

  // 3. Generate Questions Mutation
  const generateMutation = useMutation({
    mutationFn: (params: GenerateParams) => generateProjectQuestions(params),
    onSuccess: (data) => {
      toast.success(`Questions generated successfully for ${data.repoName}!`);
      // Invalidate history to keep it synced
      queryClient.invalidateQueries({ queryKey: ['projectPrepHistory'] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to generate project questions';
      toast.error(msg);
    },
  });

  // 4. Delete Session Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSession(id),
    onSuccess: () => {
      toast.success('Project prep session deleted.');
      queryClient.invalidateQueries({ queryKey: ['projectPrepHistory'] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to delete project prep session';
      toast.error(msg);
    },
  });

  return {
    // History state
    history: historyQuery.data || [],
    isLoadingHistory: historyQuery.isLoading,
    historyError: historyQuery.error,
    refetchHistory: historyQuery.refetch,

    // Active session state
    activeSession: sessionQuery.data || null,
    isLoadingSession: sessionQuery.isLoading,
    sessionError: sessionQuery.error,
    refetchSession: sessionQuery.refetch,

    // Generation routines
    generateQuestions: generateMutation.mutateAsync,
    isGenerating: generateMutation.isPending,
    generationError: generateMutation.error,

    // Deletion routines
    deleteSessionRecord: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
