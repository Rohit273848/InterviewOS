import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Award,
  ArrowUpRight,
  Sparkles,
  Calendar,
  CheckCircle2
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const Dashboard = () => {
  const { name } = useSelector((state: RootState) => state.user)
  const stats = [
    {
      label: 'Resume Score',
      value: '85',
      change: '+12%',
      icon: <Award className="w-6 h-6" />,
      color: 'cyan',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      label: 'Questions Solved',
      value: '247',
      change: '+23',
      icon: <Target className="w-6 h-6" />,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Mock Interviews',
      value: '12',
      change: '+3',
      icon: <Clock className="w-6 h-6" />,
      color: 'yellow',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      label: 'Skill Rating',
      value: '4.2',
      change: '+0.5',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'green',
      gradient: 'from-green-500 to-emerald-500'
    },
  ]

  const progressData = [
    { month: 'Jan', score: 65 },
    { month: 'Feb', score: 70 },
    { month: 'Mar', score: 75 },
    { month: 'Apr', score: 85 },
  ]

  const skillsData = [
    { skill: 'DSA', score: 85 },
    { skill: 'System Design', score: 70 },
    { skill: 'Behavioral', score: 90 },
    { skill: 'Projects', score: 80 },
    { skill: 'Communication', score: 75 },
  ]

  const upcomingTasks = [
    { title: 'Complete LeetCode Daily', time: 'Today, 6:00 PM', priority: 'high' },
    { title: 'Mock Interview with Peer', time: 'Tomorrow, 10:00 AM', priority: 'medium' },
    { title: 'Review System Design Notes', time: 'Apr 23, 3:00 PM', priority: 'low' },
  ]

  const recentActivity = [
    { action: 'Completed Mock Interview', time: '2 hours ago', icon: '🎯' },
    { action: 'Solved 5 DSA Problems', time: '5 hours ago', icon: '💻' },
    { action: 'Updated Resume', time: '1 day ago', icon: '📄' },
    { action: 'Received Peer Feedback', time: '2 days ago', icon: '👥' },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-black mb-2">
          Welcome back, <span className="gradient-text">{name || 'Student'}</span>! 👋
        </h1>
        <p className="text-text-secondary text-lg">
          Here's your placement preparation progress
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group relative p-6 bg-bg-secondary rounded-2xl border border-border-subtle hover:border-border-accent transition-all cursor-pointer overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
                <div className="flex items-center gap-1 text-accent-green text-sm font-semibold">
                  <ArrowUpRight className="w-4 h-4" />
                  {stat.change}
                </div>
              </div>
              
              <div className="text-4xl font-black mb-1">{stat.value}</div>
              <div className="text-text-secondary text-sm">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 bg-bg-secondary rounded-2xl border border-border-subtle"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Progress Overview</h2>
            <Sparkles className="w-5 h-5 text-accent-cyan" />
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#111827', 
                  border: '1px solid #1F2937',
                  borderRadius: '12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#22D3EE" 
                strokeWidth={3}
                fill="url(#colorScore)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skills Radar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 bg-bg-secondary rounded-2xl border border-border-subtle"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Skills Analysis</h2>
            <Target className="w-5 h-5 text-accent-purple" />
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={skillsData}>
              <PolarGrid stroke="#1F2937" />
              <PolarAngleAxis dataKey="skill" stroke="#9CA3AF" />
              <PolarRadiusAxis stroke="#6B7280" />
              <Radar 
                name="Score" 
                dataKey="score" 
                stroke="#8B5CF6" 
                fill="#8B5CF6" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tasks and Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-bg-secondary rounded-2xl border border-border-subtle"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Upcoming Tasks</h2>
            <Calendar className="w-5 h-5 text-accent-yellow" />
          </div>
          
          <div className="space-y-4">
            {upcomingTasks.map((task, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-bg-tertiary rounded-xl hover:bg-bg-tertiary/70 transition-colors cursor-pointer"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  task.priority === 'high' ? 'bg-accent-pink' :
                  task.priority === 'medium' ? 'bg-accent-yellow' :
                  'bg-accent-green'
                }`} />
                <div className="flex-1">
                  <div className="font-semibold mb-1">{task.title}</div>
                  <div className="text-sm text-text-muted">{task.time}</div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-text-muted hover:text-accent-green transition-colors" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-bg-secondary rounded-2xl border border-border-subtle"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <Clock className="w-5 h-5 text-accent-green" />
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-bg-tertiary rounded-xl hover:bg-bg-tertiary/70 transition-colors"
              >
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold mb-1">{activity.action}</div>
                  <div className="text-sm text-text-muted">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 rounded-2xl border border-border-accent"
      >
        <h2 className="text-2xl font-bold mb-4">Ready for your next challenge?</h2>
        <p className="text-text-secondary mb-6">
          Continue your preparation journey with these recommended actions
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-accent-cyan text-bg-primary font-semibold rounded-xl hover:bg-accent-cyan/90 transition-all hover:scale-105">
            Start Mock Interview
          </button>
          <button className="px-6 py-3 bg-bg-secondary border border-border-subtle text-text-primary font-semibold rounded-xl hover:border-border-accent transition-all">
            Practice Questions
          </button>
          <button className="px-6 py-3 bg-bg-secondary border border-border-subtle text-text-primary font-semibold rounded-xl hover:border-border-accent transition-all">
            Analyze Resume
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
