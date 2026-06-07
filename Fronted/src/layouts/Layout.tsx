import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Sparkles,
  Database,
  FolderGit2,
  Video,
  Users,
  Bell,
  LogOut,
  Brain,
  Search,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react'
import { logout } from '../context/slices/userSlice'
import { RootState } from '../context'
import { logoutUser } from '../services/authService'
import toast from 'react-hot-toast'

const Layout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { name } = useSelector((state: RootState) => state.user)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDarkMode(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDarkMode(true)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (e) {
      console.error(e)
    }
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/signin')
  }

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/resume-xray', icon: <Sparkles className="w-5 h-5" />, label: 'Resume X-Ray' },
    { path: '/mock-interview', icon: <Video className="w-5 h-5" />, label: 'AI Mock Interview' },
    { path: '/question-bank', icon: <Database className="w-5 h-5" />, label: 'Question Bank' },
    { path: '/project-prep', icon: <FolderGit2 className="w-5 h-5" />, label: 'Project Prep' },
    { path: '/peer-review', icon: <Users className="w-5 h-5" />, label: 'Peer Review' },
  ]

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-100 flex relative overflow-hidden bg-gradient-to-br from-[#E0F7FA] via-[#E8F5E9] to-[#E3F2FD] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500">
      {/* Soft gradient background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-200/40 blur-[100px]" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-cyan-200/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] rounded-full bg-blue-200/30 blur-[100px]" />
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="hidden lg:flex w-[240px] m-4 mr-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-sm rounded-[24px] flex-col relative z-10 transition-colors duration-500"
      >
        {/* Logo */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800 dark:text-white tracking-tight transition-colors duration-500">InterviewOS</span>
          </div>
          <p className="text-[10px] uppercase font-bold text-teal-600 mt-1 ml-11 tracking-wider">AI Co-Pilot</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 group ${isActive
                  ? 'bg-gradient-to-r from-teal-500/10 to-cyan-500/10 dark:from-teal-500/20 dark:to-cyan-500/20 text-teal-700 dark:text-teal-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`transition-transform duration-300 ${isActive ? 'text-teal-600' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </div>
                  <span className="text-sm">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile / Logout */}
        <div className="p-4 mb-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/40 dark:bg-slate-700/40 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-full hover:bg-white dark:hover:bg-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:shadow-sm border border-white/50 dark:border-slate-600/50 transition-all duration-300 group"
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
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
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
            className="fixed left-0 top-0 h-screen w-[240px] bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl border-r border-white/50 dark:border-slate-700 shadow-2xl flex flex-col relative z-40 lg:hidden transition-colors duration-500"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-800 dark:text-white transition-colors duration-500">InterviewOS</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 ${isActive
                      ? 'bg-gradient-to-r from-teal-500/10 to-cyan-500/10 dark:from-teal-500/20 dark:to-cyan-500/20 text-teal-700 dark:text-teal-400 font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`${isActive ? 'text-teal-600' : ''}`}>
                        {item.icon}
                      </div>
                      <span className="text-sm">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="p-4">
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-700/40 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-full hover:bg-red-50 dark:hover:bg-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 z-20">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-white/50 rounded-xl transition-all text-slate-600 flex-shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="hidden sm:flex relative group max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-teal-500 transition-colors" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-full text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:bg-white/60 dark:focus:bg-slate-800/60 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="relative p-2 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-full transition-all text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 overflow-hidden"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDarkMode ? 'dark' : 'light'}
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
                </motion.div>
              </AnimatePresence>
            </button>

            <button className="relative p-2 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-full transition-all text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 border-2 border-[#E3F2FD] dark:border-slate-800 rounded-full" />
            </button>

            <div className="flex items-center gap-3 pl-2 lg:pl-4 border-l border-slate-300/40 dark:border-slate-700/50">
              <div className="hidden md:block text-right">
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-500">{name || 'Rohit'}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium transition-colors duration-500">Pro Plan</div>
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 p-[2px] shadow-sm cursor-pointer hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full border-2 border-white bg-white overflow-hidden flex items-center justify-center text-teal-600 font-bold text-sm">
                    {name ? name.charAt(0).toUpperCase() : 'R'}
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
