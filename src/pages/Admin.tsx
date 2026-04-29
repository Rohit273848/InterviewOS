import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, FileText, MessageSquare, TrendingUp, Activity, UserCheck, UserX, Trash2, Eye, Search } from 'lucide-react'
import toast from 'react-hot-toast'

interface User {
  id: number
  name: string
  email: string
  role: 'user' | 'admin'
  status: 'active' | 'inactive'
  joinedDate: string
  lastActive: string
  resumesSubmitted: number
  reviewsGiven: number
  interviewsTaken: number
}

interface Session {
  id: number
  userId: number
  userName: string
  email: string
  loginTime: string
  lastActivity: string
  ipAddress: string
  device: string
  status: 'active' | 'expired'
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'sessions' | 'content'>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  // Mock Users Data
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Priya Sharma',
      email: 'priya@example.com',
      role: 'user',
      status: 'active',
      joinedDate: '2024-01-15',
      lastActive: '2 hours ago',
      resumesSubmitted: 3,
      reviewsGiven: 12,
      interviewsTaken: 8
    },
    {
      id: 2,
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      role: 'user',
      status: 'active',
      joinedDate: '2024-02-20',
      lastActive: '1 day ago',
      resumesSubmitted: 2,
      reviewsGiven: 5,
      interviewsTaken: 4
    },
    {
      id: 3,
      name: 'Sneha Patel',
      email: 'sneha@example.com',
      role: 'user',
      status: 'inactive',
      joinedDate: '2024-03-10',
      lastActive: '1 week ago',
      resumesSubmitted: 1,
      reviewsGiven: 2,
      interviewsTaken: 1
    }
  ])

  // Mock Sessions Data
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 1,
      userId: 1,
      userName: 'Priya Sharma',
      email: 'priya@example.com',
      loginTime: '2024-04-24 10:30 AM',
      lastActivity: '2 hours ago',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      status: 'active'
    },
    {
      id: 2,
      userId: 2,
      userName: 'Rahul Kumar',
      email: 'rahul@example.com',
      loginTime: '2024-04-24 09:15 AM',
      lastActivity: '5 hours ago',
      ipAddress: '192.168.1.101',
      device: 'Safari on MacOS',
      status: 'active'
    },
    {
      id: 3,
      userId: 1,
      userName: 'Priya Sharma',
      email: 'priya@example.com',
      loginTime: '2024-04-23 02:00 PM',
      lastActivity: '1 day ago',
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      status: 'expired'
    },
    {
      id: 4,
      userId: 3,
      userName: 'Sneha Patel',
      email: 'sneha@example.com',
      loginTime: '2024-04-20 11:45 AM',
      lastActivity: '4 days ago',
      ipAddress: '192.168.1.102',
      device: 'Firefox on Linux',
      status: 'expired'
    }
  ])

  // Stats
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    activeSessions: sessions.filter(s => s.status === 'active').length,
    totalResumes: users.reduce((sum, u) => sum + u.resumesSubmitted, 0),
    totalReviews: users.reduce((sum, u) => sum + u.reviewsGiven, 0),
    totalInterviews: users.reduce((sum, u) => sum + u.interviewsTaken, 0)
  }

  const handleToggleUserStatus = (userId: number) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ))
    toast.success('User status updated')
  }

  const handleDeleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId))
      toast.success('User deleted')
    }
  }

  const handleTerminateSession = (sessionId: number) => {
    setSessions(sessions.map(s => 
      s.id === sessionId 
        ? { ...s, status: 'expired' }
        : s
    ))
    toast.success('Session terminated')
  }

  const handleDeleteSession = (sessionId: number) => {
    setSessions(sessions.filter(s => s.id !== sessionId))
    toast.success('Session deleted')
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const filteredSessions = sessions.filter(session => 
    session.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-accent-purple" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black">Admin Panel</h1>
        </div>
        <p className="text-text-secondary text-sm sm:text-base lg:text-lg">
          Manage users, sessions, and platform content
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-4 border-b border-border-subtle mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 sm:px-6 py-3 font-semibold transition-all text-sm sm:text-base whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'text-accent-purple border-b-2 border-accent-purple'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 sm:px-6 py-3 font-semibold transition-all text-sm sm:text-base whitespace-nowrap ${
            activeTab === 'users'
              ? 'text-accent-purple border-b-2 border-accent-purple'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-4 sm:px-6 py-3 font-semibold transition-all text-sm sm:text-base whitespace-nowrap ${
            activeTab === 'sessions'
              ? 'text-accent-purple border-b-2 border-accent-purple'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Sessions ({sessions.filter(s => s.status === 'active').length})
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 sm:px-6 py-3 font-semibold transition-all text-sm sm:text-base whitespace-nowrap ${
            activeTab === 'content'
              ? 'text-accent-purple border-b-2 border-accent-purple'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Content
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 sm:p-6 bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 rounded-2xl border border-accent-purple/30"
            >
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-accent-purple" />
                <span className="text-xs sm:text-sm text-accent-purple font-semibold">Total</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-1">{stats.totalUsers}</h3>
              <p className="text-xs sm:text-sm text-text-muted">Registered Users</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 sm:p-6 bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 rounded-2xl border border-accent-cyan/30"
            >
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8 text-accent-cyan" />
                <span className="text-xs sm:text-sm text-accent-cyan font-semibold">Active</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-1">{stats.activeUsers}</h3>
              <p className="text-xs sm:text-sm text-text-muted">Active Users</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 sm:p-6 bg-gradient-to-br from-accent-yellow/20 to-accent-pink/20 rounded-2xl border border-accent-yellow/30"
            >
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-accent-yellow" />
                <span className="text-xs sm:text-sm text-accent-yellow font-semibold">Live</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-1">{stats.activeSessions}</h3>
              <p className="text-xs sm:text-sm text-text-muted">Active Sessions</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 sm:p-6 bg-bg-secondary rounded-2xl border border-border-subtle"
            >
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-8 h-8 text-accent-pink" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-1">{stats.totalResumes}</h3>
              <p className="text-xs sm:text-sm text-text-muted">Resumes Submitted</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 sm:p-6 bg-bg-secondary rounded-2xl border border-border-subtle"
            >
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="w-8 h-8 text-accent-cyan" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-1">{stats.totalReviews}</h3>
              <p className="text-xs sm:text-sm text-text-muted">Reviews Given</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 sm:p-6 bg-bg-secondary rounded-2xl border border-border-subtle"
            >
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8 text-accent-purple" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-1">{stats.totalInterviews}</h3>
              <p className="text-xs sm:text-sm text-text-muted">Interviews Taken</p>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-4 sm:p-6 bg-bg-secondary rounded-2xl border border-border-subtle"
          >
            <h2 className="text-lg sm:text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-bg-tertiary rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent-cyan"></div>
                <p className="text-sm flex-1">Priya Sharma submitted a resume for review</p>
                <span className="text-xs text-text-muted">2h ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-bg-tertiary rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent-pink"></div>
                <p className="text-sm flex-1">Rahul Kumar completed a mock interview</p>
                <span className="text-xs text-text-muted">5h ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-bg-tertiary rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent-yellow"></div>
                <p className="text-sm flex-1">New user registered: Sneha Patel</p>
                <span className="text-xs text-text-muted">1d ago</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by name or email..."
                className="w-full pl-10 pr-4 py-3 bg-bg-secondary border border-border-subtle rounded-xl focus:outline-none focus:border-accent-purple transition-colors text-sm"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-4 py-3 bg-bg-secondary border border-border-subtle rounded-xl focus:outline-none focus:border-accent-purple transition-colors text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 sm:p-6 bg-bg-secondary rounded-2xl border border-border-subtle"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white font-bold flex-shrink-0">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-sm sm:text-base truncate">{user.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.status === 'active'
                            ? 'bg-accent-cyan/20 text-accent-cyan'
                            : 'bg-text-muted/20 text-text-muted'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-text-muted truncate">{user.email}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-text-muted">
                        <span>Joined: {user.joinedDate}</span>
                        <span>•</span>
                        <span>Last active: {user.lastActive}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 lg:gap-4">
                    <div className="text-center">
                      <p className="text-lg sm:text-xl font-bold">{user.resumesSubmitted}</p>
                      <p className="text-xs text-text-muted">Resumes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg sm:text-xl font-bold">{user.reviewsGiven}</p>
                      <p className="text-xs text-text-muted">Reviews</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg sm:text-xl font-bold">{user.interviewsTaken}</p>
                      <p className="text-xs text-text-muted">Interviews</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleUserStatus(user.id)}
                      className={`p-2 rounded-lg transition-all ${
                        user.status === 'active'
                          ? 'bg-accent-yellow/20 text-accent-yellow hover:bg-accent-yellow/30'
                          : 'bg-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan/30'
                      }`}
                      title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {user.status === 'active' ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-all"
                      title="Delete User"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-text-muted" />
              <p className="text-text-muted">No users found</p>
            </div>
          )}
        </div>
      )}

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sessions by user or email..."
                className="w-full pl-10 pr-4 py-3 bg-bg-secondary border border-border-subtle rounded-xl focus:outline-none focus:border-accent-purple transition-colors text-sm"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 sm:p-6 bg-bg-secondary rounded-2xl border border-border-subtle"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-white font-bold flex-shrink-0">
                      {session.userName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-sm sm:text-base truncate">{session.userName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          session.status === 'active'
                            ? 'bg-accent-cyan/20 text-accent-cyan'
                            : 'bg-text-muted/20 text-text-muted'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-text-muted truncate">{session.email}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-text-muted">
                        <span>Login: {session.loginTime}</span>
                        <span>•</span>
                        <span>IP: {session.ipAddress}</span>
                        <span>•</span>
                        <span>{session.device}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {session.status === 'active' && (
                      <button
                        onClick={() => handleTerminateSession(session.id)}
                        className="p-2 bg-accent-yellow/20 text-accent-yellow rounded-lg hover:bg-accent-yellow/30 transition-all"
                        title="Terminate Session"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-all"
                      title="Delete Session"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredSessions.length === 0 && (
            <div className="p-12 text-center">
              <Activity className="w-16 h-16 mx-auto mb-4 text-text-muted" />
              <p className="text-text-muted">No sessions found</p>
            </div>
          )}
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-bg-secondary rounded-2xl border border-border-subtle"
          >
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-accent-pink" />
              <h2 className="text-lg font-bold">Platform Content Overview</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-bg-tertiary rounded-xl text-center">
                <p className="text-2xl font-black text-accent-cyan">{stats.totalResumes}</p>
                <p className="text-sm text-text-muted mt-1">Total Resumes</p>
              </div>
              <div className="p-4 bg-bg-tertiary rounded-xl text-center">
                <p className="text-2xl font-black text-accent-purple">{stats.totalReviews}</p>
                <p className="text-sm text-text-muted mt-1">Total Reviews</p>
              </div>
              <div className="p-4 bg-bg-tertiary rounded-xl text-center">
                <p className="text-2xl font-black text-accent-yellow">{stats.totalInterviews}</p>
                <p className="text-sm text-text-muted mt-1">Total Interviews</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-bg-secondary rounded-2xl border border-border-subtle"
          >
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-accent-cyan" />
              <h2 className="text-lg font-bold">Moderation Queue</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg">
                <div>
                  <p className="text-sm font-semibold">Resume: "Senior Dev Portfolio"</p>
                  <p className="text-xs text-text-muted">Submitted by Priya Sharma • 2h ago</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-accent-cyan/20 text-accent-cyan text-xs rounded-lg hover:bg-accent-cyan/30 transition-all">Approve</button>
                  <button className="px-3 py-1 bg-red-500/20 text-red-500 text-xs rounded-lg hover:bg-red-500/30 transition-all">Reject</button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg">
                <div>
                  <p className="text-sm font-semibold">Review: "Great layout!"</p>
                  <p className="text-xs text-text-muted">By Rahul Kumar • 5h ago</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-accent-cyan/20 text-accent-cyan text-xs rounded-lg hover:bg-accent-cyan/30 transition-all">Approve</button>
                  <button className="px-3 py-1 bg-red-500/20 text-red-500 text-xs rounded-lg hover:bg-red-500/30 transition-all">Reject</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Admin
