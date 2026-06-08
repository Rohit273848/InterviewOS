import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  History, 
  Search, 
  Filter, 
  ChevronRight, 
  Calendar, 
  Award, 
  XCircle, 
  Loader2 
} from 'lucide-react';
import { getHistory, HistoryItem } from '../services/mockInterview.service';
import toast from 'react-hot-toast';

const InterviewHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getHistory();
        setHistory(data);
      } catch (error) {
        toast.error('Failed to load session history');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-accent-green border-accent-green/20 bg-accent-green/10';
    if (score >= 60) return 'text-accent-cyan border-accent-cyan/20 bg-accent-cyan/10';
    if (score >= 40) return 'text-accent-yellow border-accent-yellow/20 bg-accent-yellow/10';
    return 'text-accent-pink border-accent-pink/20 bg-accent-pink/10';
  };

  // Filtered and sorted list compilation
  const processedHistory = history
    .filter((item) => {
      const matchesSearch = item.interviewType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.difficulty.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = typeFilter === 'all' || item.interviewType === typeFilter;
      const matchesDifficulty = difficultyFilter === 'all' || item.difficulty === difficultyFilter;

      return matchesSearch && matchesType && matchesDifficulty;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'highest') return b.overallScore - a.overallScore;
      if (sortBy === 'lowest') return a.overallScore - b.overallScore;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8 text-slate-800 dark:text-slate-100">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-accent-cyan to-accent-green bg-clip-text text-transparent flex items-center gap-2.5">
          Mock Interview History
          <History className="w-6 h-6 text-accent-cyan" />
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Review, filter, and access evaluations from your previous mock preparation sessions.
        </p>
      </div>

      {/* Filters Control Toolbar */}
      <div className="p-5 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-sm grid md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keyword..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-250 dark:border-slate-800 rounded-xl focus:outline-none focus:border-accent-cyan text-sm"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-accent-cyan text-xs"
          >
            <option value="all">All Types</option>
            <option value="behavioral">Behavioral</option>
            <option value="technical">Technical</option>
            <option value="system-design">System Design</option>
          </select>
        </div>

        {/* Difficulty Filter */}
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-accent-cyan text-xs"
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-accent-cyan text-xs"
        >
          <option value="newest">Sort: Newest First</option>
          <option value="oldest">Sort: Oldest First</option>
          <option value="highest">Sort: Highest Score</option>
          <option value="lowest">Sort: Lowest Score</option>
        </select>
      </div>

      {/* History List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Fetching history logs...</p>
        </div>
      ) : processedHistory.length === 0 ? (
        <div className="p-12 text-center bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-3xl flex flex-col items-center gap-3">
          <XCircle className="w-8 h-8 text-slate-350" />
          <p className="text-slate-500 font-medium">No matching sessions found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {processedHistory.map((item) => (
            <motion.div
              key={item._id || item.sessionId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(`/mock-interview/report/${item._id || item.sessionId}`)}
              className="p-5 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-white dark:hover:bg-slate-900 hover:shadow-md transition-all group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase">
                  <span className="text-accent-cyan">{item.interviewType}</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-slate-400 capitalize">{item.difficulty}</span>
                </div>
                
                <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-200 group-hover:text-accent-cyan transition-colors">
                  {item.questionCount} Questions Preparation Run
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      dateStyle: 'long',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="text-right">
                  <div className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">Evaluation Score</div>
                  <div className={`text-base font-extrabold px-3 py-1 border rounded-lg inline-block mt-0.5 ${getScoreColor(item.overallScore)}`}>
                    <Award className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                    {item.overallScore}%
                  </div>
                </div>
                
                <ChevronRight className="w-5 h-5 text-slate-350 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default InterviewHistory;
