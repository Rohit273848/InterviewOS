import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { 
  Trophy, 
  ShieldCheck, 
  Clock, 
  Lightbulb, 
  TrendingUp, 
  CheckCircle, 
  Activity, 
  AlertTriangle,
  Award
} from 'lucide-react';
import { ProjectPrepSession } from '../../services/projectPrep.service';

interface DashboardViewProps {
  session: ProjectPrepSession;
  mastered: Record<number, boolean>;
  bookmarks: Record<number, boolean>;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ session, mastered, bookmarks }) => {
  const totalQuestions = session.generatedQuestions?.length || 0;
  const masteredCount = session.generatedQuestions?.filter((_, idx) => mastered[idx]).length || 0;
  const bookmarkedCount = session.generatedQuestions?.filter((_, idx) => bookmarks[idx]).length || 0;
  const readinessScore = totalQuestions > 0 ? Math.round((masteredCount / totalQuestions) * 100) : 0;

  // Derive category counts
  const categoryStats = session.generatedQuestions?.reduce((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Derive mastered category counts
  const masteredCategoryStats = session.generatedQuestions?.reduce((acc, q, idx) => {
    if (mastered[idx]) {
      acc[q.category] = (acc[q.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  // Recharts Radar Chart Data format
  const radarData = Object.keys(categoryStats).map((cat) => {
    const total = categoryStats[cat] || 0;
    const mastered = masteredCategoryStats[cat] || 0;
    const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
    return {
      subject: cat,
      A: pct, // Candidate Mastery %
      B: 100, // Standard / Full Coverage
    };
  });

  // Fallback radar data if empty
  const finalRadarData = radarData.length > 0 ? radarData : [
    { subject: 'Architecture', A: 40, B: 100 },
    { subject: 'Database', A: 50, B: 100 },
    { subject: 'Security', A: 30, B: 100 },
    { subject: 'Performance', A: 60, B: 100 },
    { subject: 'Scalability', A: 20, B: 100 },
    { subject: 'Deployment', A: 70, B: 100 },
  ];

  // Practice History Area Chart Data (simulated progress over last 7 days)
  const historyData = [
    { day: 'Mon', hours: 0.8, readiness: Math.max(0, readinessScore - 15) },
    { day: 'Tue', hours: 1.2, readiness: Math.max(0, readinessScore - 12) },
    { day: 'Wed', hours: 1.5, readiness: Math.max(0, readinessScore - 8) },
    { day: 'Thu', hours: 2.1, readiness: Math.max(0, readinessScore - 5) },
    { day: 'Fri', hours: 1.8, readiness: Math.max(0, readinessScore - 2) },
    { day: 'Sat', hours: 2.5, readiness: readinessScore },
    { day: 'Sun', hours: 3.0, readiness: readinessScore },
  ];

  // Dynamic strengths and weaknesses lists
  const weakTopics = Object.keys(categoryStats).filter(
    (cat) => ((masteredCategoryStats[cat] || 0) / (categoryStats[cat] || 1)) < 0.5
  );
  const strongTopics = Object.keys(categoryStats).filter(
    (cat) => ((masteredCategoryStats[cat] || 0) / (categoryStats[cat] || 1)) >= 0.5
  );

  return (
    <div className="space-y-6">
      {/* Upper Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1: Readiness Score */}
        <div className="bg-white dark:bg-slate-800/80 backdrop-blur border border-slate-100 dark:border-slate-700/60 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" /> Readiness Score
            </span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">{readinessScore}%</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{masteredCount} of {totalQuestions} mastered</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-teal-100/40 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Project Health */}
        <div className="bg-white dark:bg-slate-800/80 backdrop-blur border border-slate-100 dark:border-slate-700/60 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Project Health
            </span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">92/100</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Production Ingest Quality</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-100/40 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Practice Hours */}
        <div className="bg-white dark:bg-slate-800/80 backdrop-blur border border-slate-100 dark:border-slate-700/60 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Practice Time
            </span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">12.9 hrs</h3>
            <p className="text-[10px] text-slate-550 dark:text-slate-400 font-semibold font-medium">Total active prep time</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-pink-100/40 dark:bg-pink-500/10 flex items-center justify-center text-pink-600 dark:text-pink-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Bookmarks */}
        <div className="bg-white dark:bg-slate-800/80 backdrop-blur border border-slate-100 dark:border-slate-700/60 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Bookmarked Topics
            </span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">{bookmarkedCount}</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{bookmarkedCount} questions saved</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-100/40 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Readiness progress Area Chart */}
        <div className="bg-white dark:bg-slate-800/80 backdrop-blur border border-slate-100 dark:border-slate-700/60 p-6 rounded-[20px] shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-teal-500" />
              Readiness & Study Trend
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-400">Overall confidence growth and preparation hours over the week.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                    borderColor: '#475569', 
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px' 
                  }} 
                />
                <Area type="monotone" dataKey="readiness" name="Readiness Score %" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReadiness)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill coverage Radar Chart */}
        <div className="bg-white dark:bg-slate-800/80 backdrop-blur border border-slate-100 dark:border-slate-700/60 p-6 rounded-[20px] shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-indigo-500" />
              Topic Coverage Distribution
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-400">Breakdown of mastery levels mapped across repository architectures.</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={finalRadarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={8} />
                <Radar name="My Mastery" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.25} />
                <Radar name="Recommended" dataKey="B" stroke="#06b6d4" fill="transparent" strokeWidth={1} strokeDasharray="3 3" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                    borderColor: '#475569', 
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px' 
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weak & Strong Topics Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Strong Topics */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-5 rounded-2xl shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-teal-655 dark:text-teal-400 uppercase tracking-widest flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-teal-500" />
            Strong Categories
          </h4>
          <div className="space-y-2">
            {strongTopics.length > 0 ? (
              strongTopics.map((topic) => (
                <div key={topic} className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{topic}</span>
                  <span className="text-[9px] bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full font-black">
                    {masteredCategoryStats[topic] || 0} / {categoryStats[topic] || 0}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-slate-400 py-4 font-medium">Continue studying questions to build strong areas!</p>
            )}
          </div>
        </div>

        {/* Column 2: Weak Topics */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-5 rounded-2xl shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-rose-655 dark:text-rose-400 uppercase tracking-widest flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Areas of Focus
          </h4>
          <div className="space-y-2">
            {weakTopics.length > 0 ? (
              weakTopics.map((topic) => (
                <div key={topic} className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{topic}</span>
                  <span className="text-[9px] bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full font-black">
                    {masteredCategoryStats[topic] || 0} / {categoryStats[topic] || 0}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-slate-400 py-4 font-medium">No high priority weak areas! Excellent work.</p>
            )}
          </div>
        </div>

        {/* Column 3: AI Smart Suggestions */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-5 rounded-2xl shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-indigo-655 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-indigo-500" />
            AI Recommendations
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-650 dark:text-slate-350 font-medium">
            <li className="flex gap-2 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-450 mt-1.5 flex-shrink-0" />
              <span>Review architecture choices in **README** relative to database indexing.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-450 mt-1.5 flex-shrink-0" />
              <span>Generate a **STAR Story** detailing a technical deployment bottleneck.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-450 mt-1.5 flex-shrink-0" />
              <span>Practise a **Mock Interview** round for Accenture technical screening.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
