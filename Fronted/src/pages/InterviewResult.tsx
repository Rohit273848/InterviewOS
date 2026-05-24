import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Loader2,
  ChevronDown,
  Brain,
  BookOpen,
  Calendar,
  Target,
  Award,
  ArrowRight,
  Lightbulb,
  Zap,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { useInterview } from '../hooks/useInterview';

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

  // Score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-cyan-400 to-blue-500';
    if (score >= 40) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  // ============ LOADING STATE ============
  if (loading || !report) {
    return (
      <div className="min-h-screen bg-[#f8f6f1] dark:bg-bg-primary flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          >
            <Loader2 className="w-12 h-12 text-cyan-400" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-gray-600 dark:text-gray-300 font-medium text-lg"
          >
            Analyzing your interview response...
          </motion.p>
        </div>
      </div>
    );
  }

  // ============ HEADER ============
  const Header = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2">
            Interview Report
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Comprehensive analysis & personalized preparation plan
          </p>
        </div>

        {report.resumeUrl && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => getResumePdf(id!)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-900 dark:text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-400/50 transition-all w-fit"
          >
            <Download className="w-5 h-5" />
            Download Resume
          </motion.button>
        )}
      </div>
    </motion.div>
  );

  // ============ MATCH SCORE CARD ============
  const MatchScoreCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="group relative bg-white dark:bg-bg-secondary border border-[#e8e6e1] dark:border-border-subtle hover:border-gray-300 dark:hover:border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none rounded-3xl p-8 md:p-12 transition-all duration-300 overflow-hidden"
    >
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${getScoreColor(
          report.matchScore || 0
        )} transition-opacity duration-300`}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.8 }}
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getScoreColor(
            report.matchScore || 0
          )} flex items-center justify-center mb-8 shadow-lg`}
        >
          <Award className="w-8 h-8 text-gray-900 dark:text-white" />
        </motion.div>

        {/* Score Display */}
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
            className={`text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r ${getScoreColor(
              report.matchScore || 0
            )} mb-3`}
          >
            {report.matchScore}%
          </motion.div>
          <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">Match Score</p>
          <p
            className={`text-lg font-semibold ${report.matchScore >= 80
                ? 'text-green-400'
                : report.matchScore >= 60
                  ? 'text-cyan-400'
                  : report.matchScore >= 40
                    ? 'text-yellow-400'
                    : 'text-red-400'
              }`}
          >
            {getScoreLabel(report.matchScore || 0)} Fit
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${report.matchScore || 0}%` }}
              transition={{ delay: 0.5, duration: 1 }}
              className={`h-full bg-gradient-to-r ${getScoreColor(
                report.matchScore || 0
              )} rounded-full`}
            ></motion.div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
          {report.matchScore >= 80
            ? "Outstanding preparation! You're ready for the interview."
            : report.matchScore >= 60
              ? 'Good foundation. Focus on the areas below to improve further.'
              : report.matchScore >= 40
                ? 'Solid start. Use the preparation plan to strengthen weak areas.'
                : 'More preparation needed. Follow the personalized roadmap below.'}
        </p>
      </div>
    </motion.div>
  );

  // ============ QUESTION CARD ============
  const QuestionCard = ({
    question,
    index,
    type,
    isExpanded,
    onToggle,
  }: {
    question: any;
    index: number;
    type: 'technical' | 'behavioral';
    isExpanded: boolean;
    onToggle: () => void;
  }) => {
    const isTechnical = type === 'technical';
    const bgGradient = isTechnical ? 'from-blue-500/10 to-cyan-500/10' : 'from-purple-500/10 to-pink-500/10';
    const borderColor = isTechnical ? 'border-blue-500/30' : 'border-purple-500/30';
    const iconBg = isTechnical ? 'bg-blue-500/20' : 'bg-purple-500/20';
    const iconColor = isTechnical ? 'text-blue-400' : 'text-purple-400';

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className="mb-4"
      >
        <motion.button
          onClick={onToggle}
          className={`w-full text-left p-6 rounded-2xl border border-[#e8e6e1] dark:border-border-subtle hover:border-gray-300 dark:hover:border-gray-200 dark:border-gray-700 transition-all duration-300 group ${isExpanded ? `bg-gradient-to-r ${bgGradient} border-blue-500/50` : 'bg-white dark:bg-bg-tertiary hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm dark:shadow-none'
            }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform`}
              >
                <Brain className={`w-5 h-5 ${iconColor}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 dark:text-white font-bold text-lg leading-tight mb-2 group-hover:text-cyan-400 transition-colors">
                  {question.question}
                </p>
                {isExpanded && (
                  <p className={`text-sm ${isTechnical ? 'text-blue-300' : 'text-purple-300'}`}>
                    Intention: {question.intention}
                  </p>
                )}
              </div>
            </div>

            {/* Chevron */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0"
            >
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:text-white transition-colors" />
            </motion.div>
          </div>
        </motion.button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className={`p-6 bg-gradient-to-r ${bgGradient} border-x border-b border-gray-200 dark:border-gray-700 rounded-b-xl`}>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-900 dark:text-white font-bold text-sm uppercase tracking-wider mb-2">
                      💡 Expected Answer
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{question.answer}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700/50">
                    <p
                      className={`text-xs font-semibold uppercase tracking-wider ${isTechnical ? 'text-blue-300' : 'text-purple-300'
                        }`}
                    >
                      📌 {question.intention}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // ============ QUESTIONS SECTION ============
  const QuestionsSection = ({
    title,
    questions,
    type,
    icon: Icon,
  }: {
    title: string;
    questions?: any[];
    type: 'technical' | 'behavioral';
    icon: React.ComponentType<{ className: string }>;
  }) => {
    if (!questions || questions.length === 0) return null;

    const isTechnical = type === 'technical';
    const bgGradient = isTechnical ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {/* Section Header */}
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bgGradient} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-6 h-6 text-gray-900 dark:text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">{title}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {questions.length} question{questions.length !== 1 ? 's' : ''} to prepare for
            </p>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-3">
          {questions.map((question, index) => (
            <QuestionCard
              key={index}
              question={question}
              index={index}
              type={type}
              isExpanded={expandedQuestion === `${type}-${index}`}
              onToggle={() =>
                setExpandedQuestion(
                  expandedQuestion === `${type}-${index}` ? null : `${type}-${index}`
                )
              }
            />
          ))}
        </div>
      </motion.div>
    );
  };

  // ============ PREPARATION ROADMAP ============
  const PreparationRoadmap = () => {
    if (!report.preparationPlan || report.preparationPlan.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        {/* Section Header */}
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg"
          >
            <Calendar className="w-6 h-6 text-gray-900 dark:text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Preparation Roadmap</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{report.preparationPlan.length}-day personalized study plan</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {report.preparationPlan.map((day: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.button
                onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                className="w-full text-left p-6 rounded-2xl bg-emerald-50 dark:bg-gradient-to-r dark:from-emerald-500/10 dark:to-teal-500/10 border border-gray-800 hover:border-emerald-500/50 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Day Number */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 font-bold text-gray-900 dark:text-white text-lg">
                      {day.day}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 mt-1">
                      <p className="text-gray-900 dark:text-white font-bold text-lg mb-1">{day.focus}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {day.tasks?.length || 0} task{day.tasks?.length !== 1 ? 's' : ''} to complete
                      </p>
                    </div>
                  </div>

                  {/* Chevron */}
                  <motion.div
                    animate={{ rotate: expandedDay === day.day ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:text-white transition-colors" />
                  </motion.div>
                </div>
              </motion.button>

              {/* Expanded Tasks */}
              <AnimatePresence>
                {expandedDay === day.day && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-emerald-50 dark:bg-emerald-500/5 border-x border-b border-gray-800 rounded-b-xl space-y-3">
                      {day.tasks?.map((task: string, taskIndex: number) => (
                        <motion.div
                          key={taskIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: taskIndex * 0.05 }}
                          className="flex items-start gap-3 group/task"
                        >
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-gray-900 dark:text-white" />
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 group-hover/task:text-gray-900 dark:text-white transition-colors">{task}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="p-6 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-start gap-4">
          <Lightbulb className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
          <div>
            <p className="text-gray-900 dark:text-white font-bold mb-1">💡 Pro Tip</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Dedicate 2-3 hours daily to this roadmap. Consistency is key to interview success. Focus on quality practice
              over quantity.
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  // ============ SKILL GAPS ============
  const SkillGapsSection = () => {
    if (!report.skillGaps || report.skillGaps.length === 0) return null;

    const highGaps = report.skillGaps.filter((g: any) => g.severity === 'high');
    const mediumGaps = report.skillGaps.filter((g: any) => g.severity === 'medium');
    const lowGaps = report.skillGaps.filter((g: any) => g.severity === 'low');

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        {/* Section Header */}
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg"
          >
            <Target className="w-6 h-6 text-gray-900 dark:text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Skill Gaps Analysis</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Areas to focus on for improvement</p>
          </div>
        </div>

        {/* Skill Gaps by Severity */}
        <div className="space-y-6">
          {/* High Priority */}
          {highGaps.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-red-400" />
                <h3 className="text-gray-900 dark:text-white font-bold text-sm uppercase tracking-wider">Critical Priority</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {highGaps.map((gap: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-red-50 dark:bg-gradient-to-r dark:from-red-500/10 dark:to-orange-500/10 border border-red-200 dark:border-red-500/30 hover:border-red-300 dark:hover:border-red-500/50 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-gray-900 dark:text-white font-bold group-hover:text-red-400 transition-colors">{gap.skill}</p>
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-red-500/30 text-red-300 uppercase tracking-wider">
                        HIGH
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Focus here first</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Medium Priority */}
          {mediumGaps.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                <h3 className="text-gray-900 dark:text-white font-bold text-sm uppercase tracking-wider">Medium Priority</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {mediumGaps.map((gap: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-yellow-50 dark:bg-gradient-to-r dark:from-yellow-500/10 dark:to-orange-500/10 border border-yellow-200 dark:border-yellow-500/30 hover:border-yellow-300 dark:hover:border-yellow-500/50 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-gray-900 dark:text-white font-bold group-hover:text-yellow-400 transition-colors">{gap.skill}</p>
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-yellow-500/30 text-yellow-300 uppercase tracking-wider">
                        MEDIUM
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Secondary focus</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Low Priority */}
          {lowGaps.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <h3 className="text-gray-900 dark:text-white font-bold text-sm uppercase tracking-wider">Good Progress</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {lowGaps.map((gap: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-green-50 dark:bg-gradient-to-r dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-500/30 hover:border-green-300 dark:hover:border-green-500/50 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-gray-900 dark:text-white font-bold group-hover:text-green-400 transition-colors">{gap.skill}</p>
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-green-500/30 text-green-300 uppercase tracking-wider">
                        LOW
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Maintain this level</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  // ============ NEXT STEPS ============
  const NextSteps = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5 }}
      className="mt-12 p-8 rounded-3xl bg-cyan-50 dark:bg-gradient-to-r dark:from-cyan-500/10 dark:via-blue-500/10 dark:to-purple-500/10 border border-cyan-200 dark:border-cyan-500/30"
    >
      <div className="flex items-start gap-4">
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <Lightbulb className="w-8 h-8 text-cyan-400 flex-shrink-0" />
        </motion.div>
        <div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Ready to Ace Your Interview?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            Follow your personalized roadmap, practice with AI mock interviews, and focus on the skill gaps identified
            above. You've got this!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/mock-interview')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-900 dark:text-white rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-400/50 transition-all"
          >
            Start Mock Interview
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // ============ MAIN RENDER ============
  return (
    <div className="min-h-screen bg-[#f8f6f1] dark:bg-bg-primary text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="space-y-12">
          {/* Match Score - Full Width */}
          <MatchScoreCard />

          {/* Technical & Behavioral Questions */}
          <div className="grid lg:grid-cols-2 gap-12">
            <QuestionsSection
              title="Technical Questions"
              questions={report.technicalQuestions}
              type="technical"
              icon={Brain}
            />
            <QuestionsSection
              title="Behavioral Questions"
              questions={report.behavioralQuestions}
              type="behavioral"
              icon={BookOpen}
            />
          </div>

          {/* Preparation Roadmap */}
          <PreparationRoadmap />

          {/* Skill Gaps */}
          <SkillGapsSection />

          {/* Next Steps CTA */}
          <NextSteps />
        </div>
      </div>
    </div>
  );
};

export default InterviewResult;