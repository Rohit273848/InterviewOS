import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { 
  LayoutDashboard, 
  Sparkles, 
  Database, 
  FolderGit2, 
  Video, 
  Users,
  Bell,
  Settings,
  LogOut
} from 'lucide-react'
import { logout } from '../store/slices/userSlice'
import { RootState } from '../store'
import toast from 'react-hot-toast'

const Layout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { name, email } = useSelector((state: RootState) => state.user)

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
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-72 bg-bg-secondary border-r border-border-subtle flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">InterviewOS</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30'
                    : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border-subtle">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-tertiary mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white font-bold">
              {name ? name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{name || 'Student'}</div>
              <div className="text-xs text-text-muted truncate">{email || 'Free Plan'}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent-pink/10 text-accent-pink rounded-lg hover:bg-accent-pink/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-bg-secondary border-b border-border-subtle flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <input
              type="search"
              placeholder="Search..."
              className="w-80 px-4 py-2 bg-bg-tertiary border border-border-subtle rounded-xl text-sm focus:outline-none focus:border-accent-cyan transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-pink rounded-full" />
            </button>
            <button className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-text-secondary" />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors group"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-text-secondary group-hover:text-accent-pink transition-colors" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
