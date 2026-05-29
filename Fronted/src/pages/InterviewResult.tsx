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
} from 'lucide-react';
import { useInterview } from '../hooks/useInterview';

// ============ INTERFACES ============
interface Question {
  question: string;
  intention: string;
  answer: string;
}

interface RoadmapDay {
  day: number;
  focus: string;
  tasks?: string[];
}

interface SkillGap {
  skill: string;
  severity: 'high' | 'medium' | 'low';
}

// ============ SCORE COLOR & TEXT HELPER ============
const getScoreDetails = (score: number) => {
  if (score >= 80) {
    return {
      label: 'Excellent Fit',
      color: 'text-emerald-600 dark:text-emerald-400',
      progress: 'stroke-emerald-500',
      desc: "Outstanding preparation! You're ready for the interview.",
    };
  }
  if (score >= 60) {
    return {
      label: 'Good Fit',
      color: 'text-teal-600 dark:text-teal-400',
      progress: 'stroke-teal-500',
      desc: 'Good foundation. Focus on the areas below to improve further.',
    };
  }
  if (score >= 40) {
    return {
      label: 'Fair Fit',
      color: 'text-amber-600 dark:text-amber-400',
      progress: 'stroke-amber-500',
      desc: 'Solid start. Use the preparation plan to strengthen weak areas.',
    };
  }
  return {
    label: 'Needs Work',
    color: 'text-rose-600 dark:text-rose-400',
    progress: 'stroke-rose-500',
    desc: 'More preparation needed. Follow the personalized roadmap below.',
  };
};

// ============ QUESTION ITEM COMPONENT ============
const QuestionItem = ({
  question,
  type,
  isExpanded,
  onToggle,
}: {
  question: Question;
  type: string;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const isTechnical = type === 'technical';
  const iconBg = isTechnical ? 'text-teal-500 bg-teal-50 dark:bg-teal-950/20' : 'text-purple-500 bg-purple-50 dark:bg-purple-950/20';

  return (
    <div className="border-b border-slate-100 dark:border-slate-700/60 last:border-0 py-4">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between text-left gap-4 group"
      >
        <div className="flex gap-3 flex-1">
          <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform duration-350 group-hover:scale-105`}>
            <Brain className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              {question.question}
            </h4>
            {isExpanded && question.intention && (
              <p className="text-xs text-slate-400 mt-1">
                Intention: {question.intention}
              </p>
            )}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 mt-1 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-slate-650' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 tracking-wider block mb-1">
                Expected Answer
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {question.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============ QUESTIONS SECTION COMPONENT ============
const QuestionsSection = ({
  title,
  questions,
  type,
  expandedQuestion,
  onToggle,
}: {
  title: string;
  questions?: Question[];
  type: 'technical' | 'behavioral';
  expandedQuestion: string | null;
  onToggle: (key: string) => void;
}) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-slate-700/50 shadow-sm rounded-3xl p-6 transition-colors duration-300">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${type === 'technical' ? 'bg-teal-500' : 'bg-purple-500'}`} />
        {title}
      </h3>
      <div className="divide-y divide-slate-100 dark:divide-slate-750">
        {questions.map((q, idx) => {
          const key = `${type}-${idx}`;
          return (
            <QuestionItem
              key={idx}
              question={q}
              type={type}
              isExpanded={expandedQuestion === key}
              onToggle={() => onToggle(key)}
            />
          );
        })}
      </div>
    </div>
  );
};

// ============ ROADMAP SECTION COMPONENT ============
const RoadmapSection = ({
  plan,
  expandedDay,
  onToggleDay,
}: {
  plan?: RoadmapDay[];
  expandedDay: number | null;
  onToggleDay: (dayNum: number) => void;
}) => {
  if (!plan || plan.length === 0) return null;

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-slate-700/50 shadow-sm rounded-3xl p-6 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-teal-500" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Preparation Roadmap</h3>
      </div>

      <div className="space-y-4">
        {plan.map((day, idx) => {
          const isExpanded = expandedDay === day.day;
          return (
            <div key={idx} className="border border-slate-100 dark:border-slate-700/60 rounded-2xl overflow-hidden bg-white/40 dark:bg-slate-850/40">
              <button
                onClick={() => onToggleDay(day.day)}
                className="w-full flex items-center justify-between p-4 text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    D{day.day}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {day.focus}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {day.tasks?.length || 0} study tasks
                    </p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-slate-650' : ''}`} />
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-slate-100 dark:border-slate-750"
                  >
                    <div className="p-4 bg-slate-50/50 dark:bg-slate-900/10 space-y-2.5">
                      {day.tasks?.map((task, taskIdx) => (
                        <div key={taskIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                            {task}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-teal-500/5 border border-teal-500/10 rounded-2xl flex gap-3">
        <Lightbulb className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-teal-700 dark:text-teal-400 block mb-0.5">
            💡 Practice Tip
          </span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Aim for 1-2 hours of quality preparation daily. Regular consistency works wonders for interview confidence.
          </p>
        </div>
      </div>
    </div>
  );
};

// ============ SKILL GAPS COMPONENT ============
const SkillGapsSection = ({ gaps }: { gaps?: SkillGap[] }) => {
  if (!gaps || gaps.length === 0) return null;

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
          label: 'Critical',
        };
      case 'medium':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
          label: 'Medium',
        };
      default:
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
          label: 'Minor',
        };
    }
  };

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-slate-700/50 shadow-sm rounded-3xl p-6 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-rose-500" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Skill Gaps Analysis</h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {gaps.map((gap, idx) => {
          const badge = getSeverityBadge(gap.severity);
          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 border border-slate-100 dark:border-slate-700/60 rounded-xl bg-white/40 dark:bg-slate-850/40"
            >
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {gap.skill}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============ MAIN INTERVIEW RESULT COMPONENT ============
const InterviewResult = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { report, fetchReportById, loading, getResumePdf } = useInterview();
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchReportById(id);
    }
  }, [id]);

  if (loading || !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
        <p className="text-slate-600 dark:text-slate-400 font-medium text-lg animate-pulse">
          Analyzing your interview response...
        </p>
      </div>
    );
  }

  const score = report.matchScore || 0;
  const scoreDetails = getScoreDetails(score);

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">
            Interview Report
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Comprehensive analysis & personalized preparation roadmap
          </p>
        </div>

        {report.resumeUrl && (
          <button
            onClick={() => getResumePdf(id!)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:shadow-md transition-all w-fit"
          >
            <Download className="w-4 h-4" />
            Download Resume
          </button>
        )}
      </div>

      {/* Match Score Card */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-slate-700/50 shadow-sm rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0 relative flex items-center justify-center w-28 h-28">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="48"
              className="stroke-slate-200 dark:stroke-slate-700/60 fill-none"
              strokeWidth="8"
            />
            <circle
              cx="56"
              cy="56"
              r="48"
              className={`stroke-current fill-none transition-all duration-1000 ease-out ${scoreDetails.progress}`}
              strokeWidth="8"
              strokeDasharray="301.6"
              strokeDashoffset={301.6 - (301.6 * score) / 100}
            />
          </svg>
          <span className="absolute text-3xl font-black text-slate-800 dark:text-white">
            {score}%
          </span>
        </div>
        <div className="flex-1 text-center md:text-left space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Award className="w-5 h-5 text-teal-500" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Match Score</h2>
          </div>
          <p className={`text-lg font-bold ${scoreDetails.color}`}>
            {scoreDetails.label}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xl">
            {scoreDetails.desc}
          </p>
        </div>
      </div>

      {/* Questions Section Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <QuestionsSection
          title="Technical Questions"
          questions={report.technicalQuestions}
          type="technical"
          expandedQuestion={expandedQuestion}
          onToggle={(key) => setExpandedQuestion(expandedQuestion === key ? null : key)}
        />
        <QuestionsSection
          title="Behavioral Questions"
          questions={report.behavioralQuestions}
          type="behavioral"
          expandedQuestion={expandedQuestion}
          onToggle={(key) => setExpandedQuestion(expandedQuestion === key ? null : key)}
        />
      </div>

      {/* Preparation Roadmap */}
      <RoadmapSection
        plan={report.preparationPlan}
        expandedDay={expandedDay}
        onToggleDay={(day) => setExpandedDay(expandedDay === day ? null : day)}
      />

      {/* Skill Gaps */}
      <SkillGapsSection gaps={report.skillGaps} />

      {/* Start Mock CTA */}
      <div className="bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10 dark:from-teal-900/10 dark:via-cyan-900/10 dark:to-blue-900/10 border border-teal-550/10 dark:border-teal-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Ready to Practice?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
            Put your strategy to the test with our AI-driven Mock Interviews, custom-tailored to cover your weak areas and target roles.
          </p>
        </div>
        <button
          onClick={() => navigate('/mock-interview')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-2xl text-sm font-semibold transition-all shadow-md shadow-teal-500/10"
        >
          Start Mock Interview
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default InterviewResult;