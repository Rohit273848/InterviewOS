import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, TrendingUp, Download, Loader2 } from 'lucide-react';
import { useInterview } from '../hooks/useInterview';

const InterviewResult = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { report, fetchReportById, loading, getResumePdf } = useInterview();

  useEffect(() => {
    if (id) {
      fetchReportById(id);
    }
  }, [id]);

  if (loading || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-yellow-500 dark:text-accent-yellow" />
          <p className="text-gray-500 font-medium">Loading your interview strategy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen text-gray-800 dark:text-gray-200 transition-colors">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Interview Dashboard</h1>
        {report.resumeUrl && (
          <button
            onClick={() => getResumePdf(id!)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-black dark:hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Resume
          </button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="p-8 bg-white dark:bg-bg-secondary rounded-3xl border border-gray-200 dark:border-border-subtle shadow-sm text-center h-full flex flex-col justify-center transition-colors">
              <div className="text-7xl font-black text-gray-900 dark:text-white mb-2">
                {report.matchScore}
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider text-sm">Match Score</p>
            </div>
          </div>

          <div className="col-span-2 space-y-6">
            {/* Technical Questions */}
            <div className="p-6 bg-white dark:bg-bg-secondary rounded-3xl border border-gray-200 dark:border-border-subtle shadow-sm transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-accent-cyan/10 flex items-center justify-center transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-accent-cyan" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Technical Questions</h3>
              </div>
              <ul className="space-y-4">
                {report.technicalQuestions?.map((q: any, index: number) => (
                  <li key={index} className="flex items-start gap-3 flex-col">
                    <p className="font-semibold text-gray-900 dark:text-gray-100"><span className="text-blue-500">Q:</span> {q.question}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">Intention: {q.intention}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">Expected Answer:</span> {q.answer}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Behavioral Questions */}
            <div className="p-6 bg-white dark:bg-bg-secondary rounded-3xl border border-gray-200 dark:border-border-subtle shadow-sm transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-accent-green/10 flex items-center justify-center transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-accent-green" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Behavioral Questions</h3>
              </div>
              <ul className="space-y-4">
                {report.behavioralQuestions?.map((q: any, index: number) => (
                  <li key={index} className="flex items-start gap-3 flex-col">
                    <p className="font-semibold text-gray-900 dark:text-gray-100"><span className="text-green-500">Q:</span> {q.question}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">Intention: {q.intention}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">Expected Answer:</span> {q.answer}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preparation Plan / Roadmap */}
            <div className="p-6 bg-white dark:bg-bg-secondary rounded-3xl border border-gray-200 dark:border-border-subtle shadow-sm transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center transition-colors">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Preparation Roadmap</h3>
              </div>
              <ul className="space-y-4">
                {report.preparationPlan?.map((plan: any, index: number) => (
                  <li key={index} className="flex items-start gap-3 flex-col border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0">
                    <p className="font-bold text-gray-900 dark:text-gray-100">Day {plan.day}: {plan.focus}</p>
                    <ul className="list-disc list-inside space-y-1">
                      {plan.tasks?.map((task: string, tIndex: number) => (
                        <li key={tIndex} className="text-sm text-gray-600 dark:text-gray-300">{task}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skill Gaps */}
            <div className="p-6 bg-white dark:bg-bg-secondary rounded-3xl border border-gray-200 dark:border-border-subtle shadow-sm transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center transition-colors">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Skill Gaps</h3>
              </div>
              <ul className="space-y-3">
                {report.skillGaps?.map((gap: any, index: number) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{gap.skill}</span>
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider
                      ${gap.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400' :
                        gap.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400' :
                        'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400'}`}
                    >
                      {gap.severity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewResult;
