import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Mail, Lock, Eye, EyeOff, Sparkles, Github, Chrome } from 'lucide-react'
import { setUser } from '../store/slices/userSlice'
import toast from 'react-hot-toast'

const SignIn = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      dispatch(setUser({
        name: formData.email.split('@')[0],
        email: formData.email,
        avatar: '',
        isAuthenticated: true
      }))
      
      toast.success('Welcome back!')
      setIsLoading(false)
      navigate('/dashboard')
    }, 1500)
  }

  const handleSocialLogin = (provider: string) => {
    toast.success(`${provider} login coming soon!`)
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold gradient-text">InterviewOS</span>
        </Link>

        {/* Sign In Card */}
        <div className="p-8 bg-bg-secondary rounded-2xl border border-border-subtle shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black mb-2">Welcome Back!</h1>
            <p className="text-text-secondary">Sign in to continue your journey</p>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-bg-tertiary border border-border-subtle rounded-xl hover:border-border-accent transition-all"
            >
              <Chrome className="w-5 h-5" />
              <span className="font-semibold">Google</span>
            </button>
            <button
              onClick={() => handleSocialLogin('GitHub')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-bg-tertiary border border-border-subtle rounded-xl hover:border-border-accent transition-all"
            >
              <Github className="w-5 h-5" />
              <span className="font-semibold">GitHub</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-subtle"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-bg-secondary text-text-muted">Or continue with email</span>
            </div>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-bg-tertiary border border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 bg-bg-tertiary border border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border-subtle" />
                <span className="text-text-secondary">Remember me</span>
              </label>
              <a href="#" className="text-accent-cyan hover:text-accent-cyan/80 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-accent-cyan/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent-cyan hover:text-accent-cyan/80 font-semibold transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  )
}

export default SignIn
