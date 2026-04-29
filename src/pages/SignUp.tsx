import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Mail, Lock, User, Eye, EyeOff, Sparkles, Github, Chrome, CheckCircle2 } from 'lucide-react'
import { setUser } from '../store/slices/userSlice'
import toast from 'react-hot-toast'

const SignUp = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      dispatch(setUser({
        name: formData.name,
        email: formData.email,
        avatar: '',
        isAuthenticated: true
      }))
      
      toast.success('Account created successfully!')
      setIsLoading(false)
      navigate('/dashboard')
    }, 1500)
  }

  const handleSocialSignup = (provider: string) => {
    toast.success(`${provider} signup coming soon!`)
  }

  const features = [
    'AI-powered resume analysis',
    'Company-specific questions',
    'Mock interview practice',
    'Peer review system'
  ]

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-pink/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-5xl"
      >
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Features */}
          <div className="hidden lg:flex flex-col justify-center">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold gradient-text">InterviewOS</span>
            </Link>

            <h2 className="text-4xl font-black mb-4">
              Start Your Journey to <span className="gradient-text">Dream Job</span>
            </h2>
            <p className="text-xl text-text-secondary mb-8">
              Join thousands of students who've already transformed their placement preparation
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent-green/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-accent-green" />
                  </div>
                  <span className="text-lg text-text-secondary">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 rounded-2xl border border-accent-purple/30">
              <p className="text-text-secondary italic">
                "InterviewOS helped me land my dream job at Google. The AI-powered prep was a game-changer!"
              </p>
              <p className="text-sm text-text-muted mt-2">- Priya S., SDE at Google</p>
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <div className="flex flex-col justify-center">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold gradient-text">InterviewOS</span>
            </div>

            <div className="p-8 bg-bg-secondary rounded-2xl border border-border-subtle shadow-2xl">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-black mb-2">Create Account</h1>
                <p className="text-text-secondary">Start your placement prep journey</p>
              </div>

              {/* Social Signup */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => handleSocialSignup('Google')}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-bg-tertiary border border-border-subtle rounded-xl hover:border-border-accent transition-all"
                >
                  <Chrome className="w-5 h-5" />
                  <span className="font-semibold">Google</span>
                </button>
                <button
                  onClick={() => handleSocialSignup('GitHub')}
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
                  <span className="px-4 bg-bg-secondary text-text-muted">Or sign up with email</span>
                </div>
              </div>

              {/* Sign Up Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-bg-tertiary border border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan transition-colors"
                    />
                  </div>
                </div>

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
                      placeholder="Create a strong password"
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

                <div>
                  <label className="block text-sm font-semibold mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-bg-tertiary border border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan transition-colors"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 mt-1 rounded border-border-subtle" required />
                  <span className="text-sm text-text-secondary">
                    I agree to the{' '}
                    <a href="#" className="text-accent-cyan hover:text-accent-cyan/80">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-accent-cyan hover:text-accent-cyan/80">Privacy Policy</a>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-accent-purple to-accent-pink text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-accent-purple/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-text-secondary mt-6">
                Already have an account?{' '}
                <Link to="/signin" className="text-accent-cyan hover:text-accent-cyan/80 font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SignUp
