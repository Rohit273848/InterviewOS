import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { 
  Sparkles, 
  Target, 
  Video, 
  Database, 
  FolderGit2, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Brain,
  Code2,
  FileText,
  AlertCircle,
  Users
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell
} from 'recharts'

const Dashboard = () => {
  const { name } = useSelector((state: RootState) => state.user)

  // Chart Data
  const weeklyProgressData = [
    { day: 'Mon', score: 45 },
    { day: 'Tue', score: 52 },
    { day: 'Wed', score: 48 },
    { day: 'Thu', score: 61 },
    { day: 'Fri', score: 65 },
    { day: 'Sat', score: 58 },
    { day: 'Sun', score: 72 },
  ]

  const mockInterviewData = [
    { name: '1', score: 60 },
    { name: '2', score: 65 },
    { name: '3', score: 62 },
    { name: '4', score: 75 },
    { name: '5', score: 82 },
  ]

  const resumeData = [
    { name: 'Impact', value: 85 },
    { name: 'Skills', value: 70 },
    { name: 'Format', value: 90 },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2 tracking-tight transition-colors duration-500">
          Welcome back, {name || 'Rohit'} <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium transition-colors duration-500">
          Track your placement preparation progress.
        </p>
      </motion.div>

      {/* Dashboard Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {/* CARD 1: Resume X-Ray Overview (col-span 2) */}
        <motion.div variants={itemVariants} className="xl:col-span-2 group bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-[24px] p-6 shadow-sm hover:shadow-md dark:shadow-none transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-300/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-100 dark:bg-teal-500/20 rounded-xl text-teal-600 dark:text-teal-400 transition-colors duration-500">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg transition-colors duration-500">Resume X-Ray</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-500">ATS Optimization</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-slate-800 dark:text-slate-100 transition-colors duration-500">82<span className="text-lg text-slate-400 dark:text-slate-500 font-medium transition-colors duration-500">/100</span></div>
              <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 transition-colors duration-500">Top 15%</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-300 font-medium transition-colors duration-500">ATS Match</span>
                <span className="text-slate-800 dark:text-slate-100 font-bold transition-colors duration-500">85%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden transition-colors duration-500">
                <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 transition-colors duration-500">Weak Areas Detected</div>
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-100 dark:border-amber-500/20 transition-colors duration-500">
                  <AlertCircle className="w-4 h-4" /> Action verbs missing
                </div>
              </div>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resumeData}>
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                    {resumeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#14B8A6' : index === 1 ? '#06B6D4' : '#334155'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <button className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-teal-500/20 transition-all flex items-center justify-center gap-2 group/btn">
            Improve Resume <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* CARD 5: Placement Readiness Score */}
        <motion.div variants={itemVariants} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-[24px] p-6 shadow-sm hover:shadow-md dark:shadow-none transition-all duration-500 flex flex-col items-center justify-center relative overflow-hidden">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 absolute top-6 left-6 transition-colors duration-500">Readiness Score</h3>
          <div className="relative w-40 h-40 mt-8 flex items-center justify-center">
            <svg width="160" height="160" viewBox="0 0 160 160" className="absolute inset-0 transform -rotate-90">
              <defs>
                <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#14B8A6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              {/* Background track */}
              <circle
                cx="80"
                cy="80"
                r="64"
                fill="transparent"
                stroke="currentColor"
                className="text-slate-100 dark:text-slate-700/50 transition-colors duration-500"
                strokeWidth="12"
              />
              {/* Progress ring */}
              <motion.circle
                cx="80"
                cy="80"
                r="64"
                fill="transparent"
                stroke="url(#score-gradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 64}
                initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 64 * (1 - 0.78) }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              />
            </svg>
            <div className="text-center z-10">
              <div className="text-4xl font-black text-slate-800 dark:text-slate-100 transition-colors duration-500">78%</div>
              <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-1 transition-colors duration-500">Ready</div>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-6 text-center transition-colors duration-500">
            You're in the top 20% of candidates. Focus on System Design next.
          </p>
        </motion.div>

        {/* CARD 2: Mock Interview Stats */}
        <motion.div variants={itemVariants} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-[24px] p-6 shadow-sm hover:shadow-md dark:shadow-none transition-all duration-500 relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 transition-colors duration-500">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-full transition-colors duration-500">AI Mock</span>
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1 transition-colors duration-500">Interviews</h3>
          <div className="flex items-end gap-2 mb-4">
            <div className="text-3xl font-black text-slate-800 dark:text-slate-100 transition-colors duration-500">12</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1 transition-colors duration-500">completed</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/50 dark:bg-slate-700/30 rounded-xl p-3 border border-white/50 dark:border-slate-600/30 transition-colors duration-500">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 transition-colors duration-500">Avg Score</div>
              <div className="font-bold text-slate-800 dark:text-slate-100 transition-colors duration-500">8.4/10</div>
            </div>
            <div className="bg-white/50 dark:bg-slate-700/30 rounded-xl p-3 border border-white/50 dark:border-slate-600/30 transition-colors duration-500">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 transition-colors duration-500">Confidence</div>
              <div className="font-bold text-teal-600 dark:text-teal-400 transition-colors duration-500">High</div>
            </div>
          </div>
          
          <div className="mt-auto h-16 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={mockInterviewData}>
                 <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} dot={false} />
               </LineChart>
             </ResponsiveContainer>
          </div>
        </motion.div>

        {/* CARD 3: Question Bank Progress */}
        <motion.div variants={itemVariants} className="xl:col-span-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-[24px] p-6 shadow-sm hover:shadow-md dark:shadow-none transition-all duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-500/20 rounded-xl text-purple-600 dark:text-purple-400 transition-colors duration-500">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 transition-colors duration-500">Question Bank Progress</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-500">Track your problem-solving stats</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2 transition-colors duration-500"><Code2 className="w-4 h-4 text-purple-500 dark:text-purple-400"/> DSA Solved</span>
                <span className="text-slate-800 dark:text-slate-100 font-bold transition-colors duration-500">248 / 400</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden transition-colors duration-500">
                <motion.div initial={{ width: 0 }} animate={{ width: '62%' }} transition={{ duration: 1, delay: 0.3 }} className="h-full bg-purple-500 rounded-full" />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2 transition-colors duration-500"><TrendingUp className="w-4 h-4 text-cyan-500 dark:text-cyan-400"/> System Design</span>
                <span className="text-slate-800 dark:text-slate-100 font-bold transition-colors duration-500">12 / 30</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden transition-colors duration-500">
                <motion.div initial={{ width: 0 }} animate={{ width: '40%' }} transition={{ duration: 1, delay: 0.4 }} className="h-full bg-cyan-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2 transition-colors duration-500"><Users className="w-4 h-4 text-orange-400 dark:text-orange-400"/> HR Preparation</span>
                <span className="text-slate-800 dark:text-slate-100 font-bold transition-colors duration-500">45 / 50</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden transition-colors duration-500">
                <motion.div initial={{ width: 0 }} animate={{ width: '90%' }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-orange-400 rounded-full" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* CARD 8: Daily Progress Chart */}
        <motion.div variants={itemVariants} className="xl:col-span-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-[24px] p-6 shadow-sm hover:shadow-md dark:shadow-none transition-all duration-500">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 transition-colors duration-500">Weekly Analytics</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-500">Time spent on preparation</p>
            </div>
            <select className="bg-white/50 dark:bg-slate-700/50 border border-white/60 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none transition-colors duration-500">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyProgressData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.2} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#14B8A6" 
                  strokeWidth={3}
                  fill="url(#colorScore)" 
                  activeDot={{ r: 6, fill: '#14B8A6', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* CARD 4: Project Prep */}
        <motion.div variants={itemVariants} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-[24px] p-6 shadow-sm hover:shadow-md dark:shadow-none transition-all duration-500 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-800 dark:bg-slate-700 rounded-xl text-white transition-colors duration-500">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 transition-colors duration-500">Project Prep</h3>
          </div>
          
          <div className="bg-white/50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-600/50 rounded-xl p-4 mb-4 flex-1 transition-colors duration-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 transition-colors duration-500">GitHub Analyzed</span>
            </div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-1 transition-colors duration-500">E-Commerce Microservices</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 transition-colors duration-500">Node.js, Docker, React, MongoDB integration with payment gateway.</p>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300 flex items-center gap-2 transition-colors duration-500"><Sparkles className="w-4 h-4 text-teal-500 dark:text-teal-400"/> AI Questions</span>
              <span className="font-bold text-slate-800 dark:text-slate-100 transition-colors duration-500">15 Ready</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300 flex items-center gap-2 transition-colors duration-500"><FileText className="w-4 h-4 text-blue-500 dark:text-blue-400"/> Cheat Sheet</span>
              <span className="font-bold text-teal-600 dark:text-teal-400 transition-colors duration-500">Generated</span>
            </div>
          </div>
          
          <button className="w-full py-2 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-semibold text-sm transition-colors mt-auto">
            Review Project
          </button>
        </motion.div>

        {/* CARD 7: AI Suggestions Panel */}
        <motion.div variants={itemVariants} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-[24px] p-6 shadow-sm hover:shadow-md dark:shadow-none transition-all duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl text-white shadow-sm">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 transition-colors duration-500">AI Co-Pilot</h3>
          </div>
          
          <div className="space-y-3">
            {[
              { text: "Improve resume impact words in experience section", icon: "📄" },
              { text: "Practice system design for scalable architectures", icon: "🏗️" },
              { text: "Revise DBMS indexing and normalization concepts", icon: "🗄️" },
            ].map((suggestion, idx) => (
              <div key={idx} className="bg-white/70 dark:bg-slate-700/40 border border-white dark:border-slate-600/30 p-3 rounded-xl flex items-start gap-3 hover:shadow-sm transition-all cursor-pointer group">
                <span className="text-lg">{suggestion.icon}</span>
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{suggestion.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CARD 6: Upcoming Tasks */}
        <motion.div variants={itemVariants} className="xl:col-span-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-[24px] p-6 shadow-sm hover:shadow-md dark:shadow-none transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 transition-colors duration-500">Upcoming Tasks</h3>
            <button className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors duration-500">View All</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Resume Review", time: "Today, 4:00 PM", type: "Urgent", color: "text-red-500 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10" },
              { title: "Mock Interview: React", time: "Tomorrow, 10:00 AM", type: "Prep", color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
              { title: "DSA Revision: Graphs", time: "Thu, 6:00 PM", type: "Study", color: "text-purple-500 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10" },
              { title: "HR Behavioral Prep", time: "Fri, 2:00 PM", type: "Study", color: "text-orange-500 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10" },
            ].map((task, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-600/50 rounded-xl hover:bg-white/80 dark:hover:bg-slate-700 transition-colors cursor-pointer group duration-500">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 group-hover:bg-teal-50 dark:group-hover:bg-teal-500/20 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-500">
                    <CheckCircle2 className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors duration-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-0.5 transition-colors duration-500">{task.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-500">{task.time}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider transition-colors duration-500 ${task.color} ${task.bg}`}>
                  {task.type}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  )
}

export default Dashboard
