import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { 
  LayoutDashboard, 
  Sparkles, 
  Database, 
  FolderGit2, 
  Video, 
  Users,
  Bell,
  Settings,
  LogOut,
  Brain,
  Search,
  Menu,
  X
} from 'lucide-react'
import { logout } from '../store/slices/userSlice'
import { RootState } from '../store'
import toast from 'react-hot-toast'

const Layout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { name, email } = useSelector((state: RootState) => state.user)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/signin')
  }

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/resume-xray', icon: <Sparkles className="w-5 h-5" />, label: 'Resume X-Ray' },
    { path: '/question-bank', icon: <Database className="w-5 h-5" />, label: 'Question Bank' },
    { path: '/project-prep', icon: <FolderGit2 className="w-5 h-5" />, label: 'Project Prep' },
    { path: '/mock-interview', icon: <Video className="w-5 h-5" />, label: 'Mock Interview' },
    { path: '/peer-review', icon: <Users className="w-5 h-5" />, label: 'Peer Review' },
  ]

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex font-sans selection:bg-[#B1F82A]/30 selection:text-[#B1F82A] relative overflow-hidden">
      {/* ── Dot Grid background ── */}
      <div 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px)', 
          backgroundSize: '32px 32px' 
        }} 
        aria-hidden="true" 
      />

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="hidden lg:flex w-72 bg-white/[0.02] backdrop-blur-xl border-r border-white/10 flex-col relative z-10"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-[#B1F82A] flex items-center justify-center shadow-[0_0_15px_rgba(177,248,42,0.3)] group-hover:scale-105 transition-transform duration-300">
              <Brain className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">InterviewOS</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-[#B1F82A]/10 text-[#B1F82A] border border-[#B1F82A]/30 shadow-[0_0_15px_rgba(177,248,42,0.05)]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </div>
                  <span className="font-medium tracking-wide">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 mb-3 hover:bg-white/10 hover:border-white/10 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-[#B1F82A]/20 border border-[#B1F82A]/30 flex items-center justify-center text-[#B1F82A] font-bold shadow-[0_0_10px_rgba(177,248,42,0.1)] group-hover:bg-[#B1F82A] group-hover:text-black transition-colors duration-300">
              {name ? name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-white truncate">{name || 'Student'}</div>
              <div className="text-xs text-gray-400 font-medium truncate">{email || 'Free Plan'}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 text-gray-400 font-semibold rounded-xl hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-300 group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed left-0 top-0 h-screen w-72 bg-white/[0.02] backdrop-blur-xl border-r border-white/10 flex flex-col relative z-40 lg:hidden"
          >
            {/* Logo */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}>
                <div className="w-10 h-10 rounded-xl bg-[#B1F82A] flex items-center justify-center shadow-[0_0_15px_rgba(177,248,42,0.3)] group-hover:scale-105 transition-transform duration-300">
                  <Brain className="w-6 h-6 text-black" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">InterviewOS</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? 'bg-[#B1F82A]/10 text-[#B1F82A] border border-[#B1F82A]/30 shadow-[0_0_15px_rgba(177,248,42,0.05)]'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {item.icon}
                      </div>
                      <span className="font-medium tracking-wide">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 mb-3 hover:bg-white/10 hover:border-white/10 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-[#B1F82A]/20 border border-[#B1F82A]/30 flex items-center justify-center text-[#B1F82A] font-bold shadow-[0_0_10px_rgba(177,248,42,0.1)] group-hover:bg-[#B1F82A] group-hover:text-black transition-colors duration-300">
                  {name ? name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-white truncate">{name || 'Student'}</div>
                  <div className="text-xs text-gray-400 font-medium truncate">{email || 'Free Plan'}</div>
                </div>
              </div>
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 text-gray-400 font-semibold rounded-xl hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-300 group"
              >
                <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/[0.02] backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 text-gray-400 hover:text-[#B1F82A] flex-shrink-0"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Search Bar */}
            <div className="relative group hidden sm:block flex-1 max-w-md">
              <input
                type="search"
                placeholder="Search resources..."
                className="w-full pl-11 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#B1F82A]/50 focus:bg-black/60 transition-all duration-300"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#B1F82A] transition-colors" />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 text-gray-400 hover:text-[#B1F82A]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#B1F82A] rounded-full shadow-[0_0_8px_rgba(177,248,42,0.8)]" />
            </button>
            <button className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 text-gray-400 hover:text-[#B1F82A]">
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2.5 hover:bg-red-500/10 rounded-xl transition-all duration-300 group ml-2 border border-transparent hover:border-red-500/20"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
