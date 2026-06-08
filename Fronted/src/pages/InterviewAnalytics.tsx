import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Award, 
  MessageSquare, 
  Loader2, 
  AlertTriangle,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { getAnalytics, AnalyticsResponse } from '../services/mockInterview.service';
import toast from 'react-hot-toast';

const COLORS = ['#10b981', '#06b6d4', '#ec4899'];

const InterviewAnalytics = () => {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await getAnalytics();
        setData(res);
      } catch (error) {
        toast.error('Failed to load performance analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading performance analytics...</p>
      </div>
    );
  }

  if (!data || data.totalInterviews === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg mx-auto">
        <AlertTriangle className="w-12 h-12 text-slate-350 mb-3" />
        <h2 className="text-xl font-bold">No Analytics Found</h2>
        <p className="text-slate-500 text-sm mt-1 max-w-sm">
          Please complete at least one mock interview to unlock progress metrics and competency charts.
        </p>
      </div>
    );
  }

  // Format type distribution for Recharts Pie
  const pieData = Object.entries(data.typeDistribution)
    .filter(([_, val]) => val > 0)
    .map(([key, val]) => ({
      name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      value: val,
    }));

  // Format category scores for Radar
  const radarData = Object.entries(data.averageCategoryScores).map(([key, val]) => ({
    subject: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    score: val,
    fullMark: 100,
  }));

  // Find strongest and weakest areas
  const categoryEntries = Object.entries(data.averageCategoryScores);
  const sortedCategories = [...categoryEntries].sort((a, b) => b[1] - a[1]);
  
  const strongestArea = sortedCategories[0];
  const weakestArea = sortedCategories[sortedCategories.length - 1];

  const formatKeyName = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8 text-slate-800 dark:text-slate-100">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-accent-cyan to-accent-green bg-clip-text text-transparent flex items-center gap-2.5">
          Performance Analytics
          <TrendingUp className="w-6 h-6 text-accent-cyan" />
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Detailed metrics showing your score progression, weakest dimensions, and category distributions.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Interviews */}
        <div className="p-5 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-sm space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-accent-cyan/5 rounded-full blur-xl" />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Mock Sessions</div>
          <div className="text-3xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-accent-cyan" />
            {data.totalInterviews}
          </div>
        </div>

        {/* Average Score */}
        <div className="p-5 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-sm space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-accent-green/5 rounded-full blur-xl" />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Evaluation Score</div>
          <div className="text-3xl font-black text-accent-green flex items-center gap-2">
            <Award className="w-6 h-6" />
            {data.averageOverallScore}%
          </div>
        </div>

        {/* Strongest Area */}
        <div className="p-5 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-sm space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-accent-green/5 rounded-full blur-xl" />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Strongest Competency</div>
          <div className="text-lg font-bold text-slate-850 dark:text-slate-100 truncate">
            {formatKeyName(strongestArea[0])}
          </div>
          <div className="text-xs text-accent-green font-semibold">Average: {strongestArea[1]}%</div>
        </div>

        {/* Weakest Area */}
        <div className="p-5 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-sm space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-accent-pink/5 rounded-full blur-xl" />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weakest Competency</div>
          <div className="text-lg font-bold text-slate-850 dark:text-slate-100 truncate">
            {formatKeyName(weakestArea[0])}
          </div>
          <div className="text-xs text-accent-pink font-semibold">Average: {weakestArea[1]}%</div>
        </div>
      </div>

      {/* Charts Layout Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Progression Chart */}
        <div className="lg:col-span-2 p-6 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-accent-cyan" />
            Evaluation Score Progression Trend
          </h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.scoresProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12 }} 
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }} 
                />
                <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Session Type distribution */}
        <div className="p-6 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <PieIcon className="w-4 h-4 text-accent-cyan" />
            Interview Type Distribution
          </h3>
          <div className="flex-1 w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12 }} 
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competencies Radar Chart */}
        <div className="lg:col-span-3 p-6 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-sm flex flex-col items-center">
          <h3 className="text-base font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 self-start mb-6">
            <Award className="w-4 h-4 text-accent-cyan" />
            Average Competency Score Profiles
          </h3>
          <div className="w-full max-w-md h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" opacity={0.3} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 8 }} />
                <Radar
                  name="Average Score"
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
      
    </div>
  );
};

export default InterviewAnalytics;
