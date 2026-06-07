import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Loader2,
  ChevronDown,
  Brain,
  Calendar,
  Target,
  Award,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  MinusCircle,
  BookOpen,
  Code2,
  Check,
  TrendingUp,
  Briefcase,
} from 'lucide-react';
import { useInterview } from '../hooks/useInterview';

// ============ SCORE COLOR & TEXT HELPER ============
const getScoreDetails = (score: number) => {
  if (score >= 80) {
    return {
      label: 'Excellent Profile Match',
      color: 'text-emerald-500 dark:text-emerald-400',
      progress: 'stroke-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      desc: "Outstanding profile alignment! Minor tweaks will put you in the top tier.",
    };
  }
  if (score >= 60) {
    return {
      label: 'Good Profile Match',
      color: 'text-teal-500 dark:text-teal-400',
      progress: 'stroke-teal-500',
      bg: 'bg-teal-500/10 border-teal-500/20',
      desc: 'Solid alignment. Address the missing skills and keywords to boost visibility.',
    };
  }
  if (score >= 40) {
    return {
      label: 'Fair Profile Match',
      color: 'text-amber-500 dark:text-amber-400',
      progress: 'stroke-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/20',
      desc: 'Moderate alignment. Resume requires optimization and projects target to this role.',
    };
  }
  return {
    label: 'Needs Significant Optimization',
    color: 'text-rose-500 dark:text-rose-400',
    progress: 'stroke-rose-500',
    bg: 'bg-rose-500/10 border-rose-500/20',
    desc: 'Low alignment. Follow the step-by-step ATS improvement plan immediately.',
  };
};

const getImportanceBadge = (importance: string) => {
  switch (importance.toLowerCase()) {
    case 'high':
      return 'bg-rose-500/10 border-rose-500/20 text-rose-500';
    case 'medium':
      return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
    default:
      return 'bg-blue-500/10 border-blue-500/20 text-blue-500';
  }
};

const InterviewResult = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { report, fetchReportById, loading, getResumePdf } = useInterview();
  
  const [expandedAddition, setExpandedAddition] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'suggestions' | 'roadmap'>('overview');

  useEffect(() => {
    if (id) {
      fetchReportById(id);
    }
  }, [id]);

  if (loading || !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
        <p className="text-slate-650 dark:text-slate-400 font-medium text-lg animate-pulse">
          Analyzing resume against target Job Description...
        </p>
      </div>
    );
  }

  // Handle fallback for older reports
  const atsScore = report.atsScore !== undefined ? report.atsScore : (report.matchScore || 0);
  const candidateFitScore = report.candidateFitScore !== undefined ? report.candidateFitScore : (report.matchScore || 0);
  
  const scoreDetails = getScoreDetails(atsScore);
  const fitDetails = getScoreDetails(candidateFitScore);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8 text-slate-800 dark:text-slate-200">
      
      {/* Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
            ATS Profile Evaluation
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Brutally honest resume analysis, keyword mapping, and career coaching roadmap
          </p>
        </div>

        <div className="flex items-center gap-3">
          {report.resumeUrl && (
            <button
              onClick={() => getResumePdf(id!)}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-855 border border-slate-200 dark:border-slate-700 text-slate-705 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-250 dark:hover:bg-slate-700 transition-all w-fit shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download Resume PDF
            </button>
          )}
        </div>
      </div>

      {/* Main Double Dashboard Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Score Card 1: ATS MATCH SCORE */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-slate-700/50 shadow-sm rounded-3xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl" />
          <div className="flex items-center gap-2 self-start mb-4">
            <Award className="w-5 h-5 text-teal-500" />
            <span className="text-sm font-bold tracking-wide text-slate-500 dark:text-slate-400 uppercase">ATS Match Score</span>
          </div>

          <div className="relative flex items-center justify-center w-32 h-32 my-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="54" className="stroke-slate-100 dark:stroke-slate-750 fill-none" strokeWidth="8" />
              <circle
                cx="64"
                cy="64"
                r="54"
                className={`stroke-current fill-none transition-all duration-1000 ease-out ${scoreDetails.progress}`}
                strokeWidth="8"
                strokeDasharray="339.3"
                strokeDashoffset={339.3 - (339.3 * atsScore) / 100}
              />
            </svg>
            <span className="absolute text-3xl font-black text-slate-800 dark:text-white">
              {atsScore}%
            </span>
          </div>

          <div className="mt-4 space-y-1">
            <h3 className={`text-base font-bold ${scoreDetails.color}`}>{scoreDetails.label}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 px-4 leading-relaxed">{scoreDetails.desc}</p>
          </div>
        </div>

        {/* Score Card 2: CANDIDATE FIT SCORE */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-slate-700/50 shadow-sm rounded-3xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl" />
          <div className="flex items-center gap-2 self-start mb-4">
            <Briefcase className="w-5 h-5 text-cyan-500" />
            <span className="text-sm font-bold tracking-wide text-slate-500 dark:text-slate-400 uppercase">Candidate Fit Score</span>
          </div>

          <div className="relative flex items-center justify-center w-32 h-32 my-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="54" className="stroke-slate-100 dark:stroke-slate-750 fill-none" strokeWidth="8" />
              <circle
                cx="64"
                cy="64"
                r="54"
                className={`stroke-current fill-none transition-all duration-1000 ease-out ${fitDetails.progress}`}
                strokeWidth="8"
                strokeDasharray="339.3"
                strokeDashoffset={339.3 - (339.3 * candidateFitScore) / 100}
              />
            </svg>
            <span className="absolute text-3xl font-black text-slate-800 dark:text-white">
              {candidateFitScore}%
            </span>
          </div>

          <div className="mt-4 space-y-1">
            <h3 className={`text-base font-bold ${fitDetails.color}`}>{fitDetails.label}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 px-4 leading-relaxed">Suitability scorecard based on core technical expertise and professional capabilities.</p>
          </div>
        </div>

        {/* Score Card 3: KEYWORD COVERAGE */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-slate-700/50 shadow-sm rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl" />
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-violet-500" />
            <span className="text-sm font-bold tracking-wide text-slate-500 dark:text-slate-400 uppercase">ATS Keyword Match</span>
          </div>

          {report.atsKeywordAnalysis ? (
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Keyword Coverage</span>
                <span className="text-2xl font-black text-slate-800 dark:text-white">
                  {report.atsKeywordAnalysis.keywordCoveragePercentage || 0}%
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${report.atsKeywordAnalysis.keywordCoveragePercentage || 0}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-500/10 px-3 py-2 rounded-xl text-center">
                  <div className="text-lg font-black text-emerald-500">{report.atsKeywordAnalysis.matchedKeywords?.length || 0}</div>
                  <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">Matched</div>
                </div>
                <div className="bg-rose-50 dark:bg-rose-500/5 border border-rose-500/10 px-3 py-2 rounded-xl text-center">
                  <div className="text-lg font-black text-rose-500">{report.atsKeywordAnalysis.missingKeywords?.length || 0}</div>
                  <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">Missing</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400 text-center leading-relaxed">
              No keyword matches generated. Upload a resume against a job description.
            </div>
          )}
        </div>

      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-slate-200 dark:border-slate-700/60 gap-1 overflow-x-auto pb-px">
        {[
          { id: 'overview', name: 'Profile Overview', icon: Brain },
          { id: 'keywords', name: 'Keyword & Skills Match', icon: Target },
          { id: 'suggestions', name: 'Optimize & Suggestions', icon: Lightbulb },
          { id: 'roadmap', name: 'Personal Action Roadmap', icon: Calendar }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${
                isActive
                  ? 'border-teal-550 text-teal-600 dark:text-teal-400 bg-teal-500/5 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        
        {/* PANEL 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Strengths Card */}
            <div className="bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700/50 shadow-sm rounded-3xl p-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2.5">
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 rounded-lg">
                  <Check className="w-4 h-4" />
                </div>
                Key Strengths & Assets
              </h3>
              {report.strengths && report.strengths.length > 0 ? (
                <ul className="space-y-3.5">
                  {report.strengths.map((str: string, idx: number) => (
                    <li key={idx} className="flex gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">No profile strengths identified.</p>
              )}
            </div>

            {/* Weaknesses Card */}
            <div className="bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700/50 shadow-sm rounded-3xl p-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2.5">
                <div className="p-1.5 bg-rose-100 dark:bg-rose-500/20 text-rose-500 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                Key Weaknesses & Gaps
              </h3>
              {report.weaknesses && report.weaknesses.length > 0 ? (
                <ul className="space-y-3.5">
                  {report.weaknesses.map((weak: string, idx: number) => (
                    <li key={idx} className="flex gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">No profile weaknesses identified.</p>
              )}
            </div>

            {/* ATS Improvement Plan Checklist */}
            {report.atsImprovementPlan && report.atsImprovementPlan.length > 0 && (
              <div className="bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700/50 shadow-sm rounded-3xl p-6 md:col-span-2">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2.5">
                  <div className="p-1.5 bg-teal-100 dark:bg-teal-500/20 text-teal-500 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  ATS Optimization Plan
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {report.atsImprovementPlan.map((plan: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex gap-3 p-3.5 border border-slate-100 dark:border-slate-700/60 rounded-xl bg-white/40 dark:bg-slate-850/40 text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
                    >
                      <div className="w-5 h-5 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-[10px]">
                        {idx + 1}
                      </div>
                      <span>{plan}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* PANEL 2: KEYWORDS & SKILLS MATCH */}
        {activeTab === 'keywords' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Keywords Analysis */}
            {report.atsKeywordAnalysis && (
              <div className="bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700/50 shadow-sm rounded-3xl p-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-violet-500" />
                  ATS Keyword Breakdown
                </h3>
                <div className="space-y-5">
                  {/* Matched Keywords */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Matched Keywords ({report.atsKeywordAnalysis.matchedKeywords?.length || 0})
                    </h4>
                    {report.atsKeywordAnalysis.matchedKeywords && report.atsKeywordAnalysis.matchedKeywords.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {report.atsKeywordAnalysis.matchedKeywords.map((kw: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs font-bold px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg shadow-sm hover:scale-[1.02] transition-all"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">No matching keywords found.</p>
                    )}
                  </div>

                  {/* Missing Keywords */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      Missing Keywords ({report.atsKeywordAnalysis.missingKeywords?.length || 0})
                    </h4>
                    {report.atsKeywordAnalysis.missingKeywords && report.atsKeywordAnalysis.missingKeywords.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {report.atsKeywordAnalysis.missingKeywords.map((kw: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs font-bold px-3 py-1 bg-rose-50 dark:bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 rounded-lg shadow-sm hover:scale-[1.02] transition-all"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-450 dark:text-slate-500">Perfect keyword coverage! No missing keywords.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Missing Skills list */}
            <div className="bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700/50 shadow-sm rounded-3xl p-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Missing Core Skills from Job Description
              </h3>
              {report.missingSkills && report.missingSkills.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {report.missingSkills.map((skObj: any, idx: number) => (
                    <div
                      key={idx}
                      className="border border-slate-100 dark:border-slate-700/60 rounded-2xl p-4 bg-white/40 dark:bg-slate-850/40 relative flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {skObj.skill}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 border rounded-full uppercase tracking-wider ${getImportanceBadge(skObj.importance)}`}>
                            {skObj.importance} Importance
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {skObj.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Compatibility for old skillGaps
                report.skillGaps && report.skillGaps.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {report.skillGaps.map((skObj: any, idx: number) => (
                      <div
                        key={idx}
                        className="border border-slate-100 dark:border-slate-700/60 rounded-2xl p-4 bg-white/40 dark:bg-slate-850/40 flex justify-between items-center"
                      >
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{skObj.skill}</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 border rounded-full uppercase tracking-wider ${getImportanceBadge(skObj.severity)}`}>
                          {skObj.severity} severity
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-450 dark:text-slate-500 leading-relaxed p-4 text-center">
                    No critical missing skills detected!
                  </p>
                )
              )}
            </div>
          </motion.div>
        )}

        {/* PANEL 3: OPTIMIZE & SUGGESTIONS */}
        {activeTab === 'suggestions' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Additions grid */}
            <div className="bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700/50 shadow-sm rounded-3xl p-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-500" />
                Resume Optimization: Content to Add
              </h3>
              {report.additions && report.additions.length > 0 ? (
                <div className="space-y-4">
                  {report.additions.map((addObj: any, idx: number) => {
                    const isExpanded = expandedAddition === idx;
                    return (
                      <div
                        key={idx}
                        className="border border-slate-100 dark:border-slate-700/60 rounded-2xl bg-white/40 dark:bg-slate-855/40 overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedAddition(isExpanded ? null : idx)}
                          className="w-full flex items-center justify-between p-4 text-left group"
                        >
                          <div className="pr-4 flex-1">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-500 block mb-1">
                              Addition Suggestion {idx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-500 transition-colors duration-305">
                              {addObj.item}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {addObj.reason}
                            </p>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t border-slate-100 dark:border-slate-750 bg-slate-50 dark:bg-slate-900/10 p-4"
                            >
                              <div className="flex gap-2.5 items-start">
                                <Lightbulb className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-500 block mb-1">
                                    Example Bullet Point / Content:
                                  </span>
                                  <p className="text-xs font-medium text-slate-705 dark:text-slate-300 bg-white dark:bg-slate-800/80 border border-slate-150 dark:border-slate-700/50 p-3 rounded-xl leading-relaxed italic">
                                    "{addObj.example}"
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-450">No major additions recommended.</p>
              )}
            </div>

            {/* Removals list */}
            <div className="bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700/50 shadow-sm rounded-3xl p-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <MinusCircle className="w-4 h-4 text-rose-500" />
                Resume Optimization: Content to Remove
              </h3>
              {report.removals && report.removals.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {report.removals.map((remObj: any, idx: number) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-3 sm:items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {remObj.item}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {remObj.reason}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20 w-fit self-start">
                        Remove
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No removal suggestions. Good resume format and length!</p>
              )}
            </div>

            {/* Recommended Projects */}
            <div className="bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700/50 shadow-sm rounded-3xl p-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-violet-500" />
                Recommended Projects to Boost Resume Relevance
              </h3>
              {report.recommendedProjects && report.recommendedProjects.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {report.recommendedProjects.map((projObj: any, idx: number) => (
                    <div
                      key={idx}
                      className="border border-slate-100 dark:border-slate-700/60 rounded-2xl p-4 bg-white/40 dark:bg-slate-850/40 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Code2 className="w-4 h-4 text-violet-500" />
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {projObj.projectName}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                          {projObj.reason}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wide block mb-1.5">
                          Skills Covered:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {projObj.skillsCovered.map((sk: string, skIdx: number) => (
                            <span
                              key={skIdx}
                              className="text-[10px] font-bold px-2 py-0.5 bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 rounded-md border border-violet-500/10"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-450 dark:text-slate-500 font-medium">No additional project recommendations provided.</p>
              )}
            </div>
          </motion.div>
        )}

        {/* PANEL 4: ROADMAP */}
        {activeTab === 'roadmap' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {report.roadmap ? (
              <div className="bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700/50 shadow-sm rounded-3xl p-6 md:p-8">
                <div className="flex items-center gap-2.5 mb-8">
                  <Calendar className="w-5 h-5 text-teal-500" />
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Career Improvement Timeline</h3>
                </div>

                <div className="relative pl-6 md:pl-8 border-l border-slate-200 dark:border-slate-700 space-y-8">
                  
                  {/* Timeline Item 1: Immediate */}
                  <div className="relative">
                    {/* Circle Node */}
                    <div className="absolute -left-[35px] md:-left-[43px] top-1 w-6 h-6 rounded-full border-4 border-slate-50 dark:border-slate-800 bg-rose-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm" />
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500 block mb-1">
                        Phase 1: Immediate Fixes (1 Day)
                      </span>
                      {report.roadmap.immediate && report.roadmap.immediate.length > 0 ? (
                        <div className="bg-white/40 dark:bg-slate-850/40 border border-slate-100 dark:border-slate-700/60 p-4 rounded-2xl space-y-2">
                          {report.roadmap.immediate.map((item: string, idx: number) => (
                            <div key={idx} className="flex gap-2.5 items-start">
                              <CheckCircle2 className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">{item}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No immediate changes needed.</p>
                      )}
                    </div>
                  </div>

                  {/* Timeline Item 2: Short Term */}
                  <div className="relative">
                    <div className="absolute -left-[35px] md:-left-[43px] top-1 w-6 h-6 rounded-full border-4 border-slate-50 dark:border-slate-800 bg-amber-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm" />
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500 block mb-1">
                        Phase 2: Short Term (1 Week)
                      </span>
                      {report.roadmap.shortTerm && report.roadmap.shortTerm.length > 0 ? (
                        <div className="bg-white/40 dark:bg-slate-850/40 border border-slate-100 dark:border-slate-700/60 p-4 rounded-2xl space-y-2">
                          {report.roadmap.shortTerm.map((item: string, idx: number) => (
                            <div key={idx} className="flex gap-2.5 items-start">
                              <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">{item}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No short term fixes needed.</p>
                      )}
                    </div>
                  </div>

                  {/* Timeline Item 3: Medium Term */}
                  <div className="relative">
                    <div className="absolute -left-[35px] md:-left-[43px] top-1 w-6 h-6 rounded-full border-4 border-slate-50 dark:border-slate-800 bg-teal-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm" />
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-500 block mb-1">
                        Phase 3: Medium Term (1 Month)
                      </span>
                      {report.roadmap.mediumTerm && report.roadmap.mediumTerm.length > 0 ? (
                        <div className="bg-white/40 dark:bg-slate-850/40 border border-slate-100 dark:border-slate-700/60 p-4 rounded-2xl space-y-2">
                          {report.roadmap.mediumTerm.map((item: string, idx: number) => (
                            <div key={idx} className="flex gap-2.5 items-start">
                              <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-slate-650 dark:text-slate-300 leading-normal">{item}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No medium term actions specified.</p>
                      )}
                    </div>
                  </div>

                  {/* Timeline Item 4: Long Term */}
                  <div className="relative">
                    <div className="absolute -left-[35px] md:-left-[43px] top-1 w-6 h-6 rounded-full border-4 border-slate-50 dark:border-slate-800 bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm" />
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-500 block mb-1">
                        Phase 4: Long Term (3 Months)
                      </span>
                      {report.roadmap.longTerm && report.roadmap.longTerm.length > 0 ? (
                        <div className="bg-white/40 dark:bg-slate-850/40 border border-slate-100 dark:border-slate-700/60 p-4 rounded-2xl space-y-2">
                          {report.roadmap.longTerm.map((item: string, idx: number) => (
                            <div key={idx} className="flex gap-2.5 items-start">
                              <CheckCircle2 className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-slate-650 dark:text-slate-300 leading-normal">{item}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No long term actions specified.</p>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              // Fallback for older preparation plans
              report.preparationPlan && report.preparationPlan.length > 0 && (
                <div className="bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700/50 shadow-sm rounded-3xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Calendar className="w-5 h-5 text-teal-500" />
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Preparation Roadmap</h3>
                  </div>
                  <div className="space-y-4">
                    {report.preparationPlan.map((dayObj: any, idx: number) => (
                      <div key={idx} className="border border-slate-100 dark:border-slate-700/60 rounded-2xl p-4 bg-white/40 dark:bg-slate-850/40">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="px-2.5 py-1 rounded-md bg-teal-500 text-white font-bold text-[10px]">
                            DAY {dayObj.day}
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{dayObj.focus}</h4>
                        </div>
                        {dayObj.tasks && dayObj.tasks.length > 0 && (
                          <div className="pl-6 space-y-1">
                            {dayObj.tasks.map((tsk: string, tIdx: number) => (
                              <p key={tIdx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">• {tsk}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </motion.div>
        )}

      </div>

      {/* Action CTA Box */}
      <div className="bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10 dark:from-teal-900/10 dark:via-cyan-900/10 dark:to-blue-900/10 border border-teal-500/10 dark:border-teal-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center justify-center md:justify-start gap-2">
            <TrendingUp className="w-5 h-5 text-teal-500 animate-pulse" />
            Apply Recommendations Now
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
            Update your resume with the suggested additions, keyword updates, and roadmap actions. Once optimized, re-upload to see your ATS Match score skyrocket!
          </p>
        </div>
        <button
          onClick={() => navigate('/resume-xray')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-2xl text-sm font-bold transition-all shadow-md shadow-teal-500/10"
        >
          Re-Analyze Resume
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

export default InterviewResult;