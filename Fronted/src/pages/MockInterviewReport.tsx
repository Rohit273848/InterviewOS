import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  AlertTriangle,
  BookOpen,
  Code2,
  ChevronDown,
  ArrowLeft,
  Loader2,
  Sparkles,
  Download,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { getSessionReport, SessionReportResponse } from '../services/mockInterview.service';

const MockInterviewReport = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<SessionReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getSessionReport(id);
        setReport(data);
      } catch (error) {
        toast.error('Failed to load interview report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-transparent">
        <Loader2 className="w-10 h-10 text-accent-green animate-spin" />
        <p className="text-slate-600 dark:text-slate-400 font-medium text-lg animate-pulse">
          Fetching evaluation scorecard from server...
        </p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <AlertTriangle className="w-12 h-12 text-accent-pink" />
        <h2 className="text-xl font-bold">Report Not Found</h2>
        <p className="text-slate-500 max-w-sm">
          We could not find the requested mock interview report. It may not be evaluated yet.
        </p>
        <button
          onClick={() => navigate('/mock-interview')}
          className="px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Format category scores for Radar Chart
  const radarData = Object.entries(report.categoryScores).map(([key, val]) => ({
    subject: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    score: val,
    fullMark: 100,
  }));

  // Format category scores for Bar Chart
  const barData = Object.entries(report.categoryScores).map(([key, val]) => ({
    name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    score: val,
  }));

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-accent-green border-accent-green/20 bg-accent-green/10';
    if (score >= 60) return 'text-accent-cyan border-accent-cyan/20 bg-accent-cyan/10';
    if (score >= 40) return 'text-accent-yellow border-accent-yellow/20 bg-accent-yellow/10';
    return 'text-accent-pink border-accent-pink/20 bg-accent-pink/10';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8 text-slate-800 dark:text-slate-100 print:bg-white print:text-black">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <button
          onClick={() => navigate('/mock-interview')}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Interviews
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          Print / Download PDF Report
        </button>
      </div>

      {/* Main Panel Header */}
      <div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-accent-green to-accent-cyan bg-clip-text text-transparent flex items-center gap-2.5">
          Mock Interview Report
          <Sparkles className="w-6 h-6 text-accent-green print:hidden" />
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Detailed scorecard analysis, visual competency tracking, and study action guidelines.
        </p>
      </div>

      {/* Analytics Scorecards Row */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* SVG score gauge */}
        <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-28 h-28 bg-accent-green/5 rounded-full blur-2xl" />
          <div className="flex items-center gap-1.5 self-start text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            <Award className="w-4 h-4 text-accent-green" />
            <span>Aggregate Performance</span>
          </div>

          <div className="relative flex items-center justify-center w-32 h-32 my-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="54" className="stroke-slate-100 dark:stroke-slate-800 fill-none" strokeWidth="8" />
              <circle
                cx="64"
                cy="64"
                r="54"
                className="stroke-accent-green fill-none transition-all duration-1000"
                strokeWidth="8"
                strokeDasharray="339.3"
                strokeDashoffset={339.3 - (339.3 * report.overallScore) / 100}
              />
            </svg>
            <span className="absolute text-3xl font-black">{report.overallScore}%</span>
          </div>

          <div className="mt-4 space-y-1">
            <h3 className="text-base font-bold">
              {report.overallScore >= 80 ? 'Excellent Performance Match' : report.overallScore >= 60 ? 'Satisfactory Match' : 'Requires Preparation'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed px-2">
              Performance metrics for {report.interviewType} ({report.difficulty}) based on job profile alignment.
            </p>
          </div>
        </div>

        {/* Recharts Radar Chart */}
        <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 shadow-sm flex flex-col md:col-span-2 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4 self-start text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-accent-cyan" />
            <span>Competency Radar Graph</span>
          </div>

          <div className="flex-1 w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" opacity={0.3} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 8 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recharts Bar Graph for Score Details */}
      <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Code2 className="w-4 h-4 text-accent-cyan" />
          <span>Dimension Breakdown Scores</span>
        </div>
        <div className="w-full h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12 }} 
                labelStyle={{ color: '#fff', fontWeight: 'bold' }} 
              />
              <Bar dataKey="score" fill="#06b6d4" radius={[6, 6, 0, 0]} maxBarSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Improvements and Actions Plan Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Improvement Areas */}
        <div className="p-6 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-accent-pink flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Key Improvement Areas
          </h3>
          {report.keyImprovementAreas.length > 0 ? (
            <ul className="space-y-3 text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {report.keyImprovementAreas.map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <span className="text-accent-pink font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 italic">No critical improvement themes observed across responses.</p>
          )}
        </div>

        {/* Action Study Plan */}
        <div className="p-6 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-accent-green flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Action Preparation Roadmap
          </h3>
          {report.actionPlan.length > 0 ? (
            <div className="space-y-4">
              {report.actionPlan.map((action, idx) => (
                <div key={idx} className="flex gap-3.5 text-xs">
                  <div className="w-5 h-5 rounded-full bg-accent-green/10 border border-accent-green/20 text-accent-green flex items-center justify-center font-bold flex-shrink-0">
                    {action.step}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{action.topic}</h4>
                    <p className="text-slate-500 dark:text-slate-400 leading-normal">{action.details}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-450 italic">No study plan steps required.</p>
          )}
        </div>
      </div>

      {/* Accordion Questions Logs */}
      <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent-cyan" />
          Question-by-Question Response Logs
        </h3>

        <div className="space-y-4">
          {report.questionsAndAnswers.map((qa, idx) => {
            const isExpanded = expandedQuestion === idx;
            return (
              <div key={idx} className="border border-slate-150 dark:border-slate-850 rounded-2xl bg-white/40 dark:bg-slate-950/20 overflow-hidden">
                <button
                  onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left group"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-xs font-bold text-accent-cyan uppercase">Question {qa.questionNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${getScoreColor(qa.score)}`}>
                        Score: {qa.score}%
                      </span>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full capitalize">
                        {qa.source.replace(/([A-Z])/g, ' $1')}
                      </span>
                    </div>
                    <h4 className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-200 group-hover:text-accent-cyan transition-colors">
                      {qa.questionText}
                    </h4>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-150 dark:border-slate-850 p-4 bg-slate-50/50 dark:bg-slate-950/40 text-xs md:text-sm space-y-4"
                    >
                      {/* Answer submitted */}
                      <div>
                        <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">Your Answer:</div>
                        <p className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl leading-relaxed italic">
                          {qa.isSkipped ? '[No Answer Submitted / Skipped]' : `"${qa.answerText}"`}
                        </p>
                      </div>

                      {/* Strengths & Weaknesses */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <div className="font-bold text-accent-green uppercase tracking-wider text-[10px]">Strengths:</div>
                          {qa.strengths.length > 0 ? (
                            <ul className="list-disc pl-4 space-y-1 text-slate-550 dark:text-slate-400 leading-normal">
                              {qa.strengths.map((s, sIdx) => <li key={sIdx}>{s}</li>)}
                            </ul>
                          ) : <p className="text-slate-400 italic">No specific strengths observed.</p>}
                        </div>
                        <div className="space-y-1.5">
                          <div className="font-bold text-accent-pink uppercase tracking-wider text-[10px]">Weaknesses:</div>
                          {qa.weaknesses.length > 0 ? (
                            <ul className="list-disc pl-4 space-y-1 text-slate-550 dark:text-slate-400 leading-normal">
                              {qa.weaknesses.map((w, wIdx) => <li key={wIdx}>{w}</li>)}
                            </ul>
                          ) : <p className="text-slate-400 italic">No weaknesses observed.</p>}
                        </div>
                      </div>

                      {/* AI Better response */}
                      {qa.betterAnswer && (
                        <div className="space-y-1.5 pt-2 border-t border-slate-150 dark:border-slate-850">
                          <div className="font-bold text-accent-cyan uppercase tracking-wider text-[10px] flex items-center gap-1">
                            <Code2 className="w-3.5 h-3.5" />
                            Interviewer Recommended Answer Structure:
                          </div>
                          <p className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl leading-relaxed text-slate-600 dark:text-slate-350">
                            {qa.betterAnswer}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
};

export default MockInterviewReport;
