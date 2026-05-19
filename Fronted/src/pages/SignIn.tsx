import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Mail, Lock, Eye, EyeOff, Github, Linkedin, Target, FileText, Brain, Sparkles } from 'lucide-react'
import { setUser } from '../store/slices/userSlice'
import toast from 'react-hot-toast'

// Google icon component
function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

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
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 md:p-8 font-sans text-white selection:bg-[#B1F82A]/30 selection:text-[#B1F82A] relative overflow-hidden">
      
      {/* Background patterns */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
        aria-hidden="true"
      />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#B1F82A]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1200px] h-auto lg:h-[720px] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl flex flex-col lg:flex-row overflow-hidden relative z-10">
        
        {/* Left Section - Login Form (42%) */}
        <div className="w-full lg:w-[42%] flex flex-col p-8 md:p-[60px] justify-center relative">
          
          <div className="absolute top-8 left-8 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-[#B1F82A] flex items-center justify-center">
              <Brain className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">InterviewOS</span>
          </div>

          <div className="max-w-[400px] w-full mx-auto mt-12 lg:mt-0">
            <div className="mb-10">
              <h1 className="text-[32px] font-bold text-white tracking-tight mb-2">Welcome back!</h1>
              <p className="text-gray-400 text-[15px]">Prepare smarter with AI powered interview tools.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#B1F82A] transition-colors" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-5 h-[52px] bg-black/20 border border-white/10 rounded-full text-[15px] text-white focus:outline-none focus:border-[#B1F82A]/50 focus:ring-1 focus:ring-[#B1F82A]/50 transition-all placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#B1F82A] transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-12 h-[52px] bg-black/20 border border-white/10 rounded-full text-[15px] text-white focus:outline-none focus:border-[#B1F82A]/50 focus:ring-1 focus:ring-[#B1F82A]/50 transition-all placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <a href="#" className="text-[13px] text-gray-400 hover:text-[#B1F82A] transition-colors font-medium">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[52px] bg-[#B1F82A] text-black font-bold rounded-full hover:scale-[1.02] hover:bg-[#9DE024] hover:shadow-[0_0_20px_rgba(177,248,42,0.3)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8 mb-8 flex items-center justify-center gap-4">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-[13px] text-gray-500 font-medium">or continue with</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <div className="flex justify-center gap-4">
              <button onClick={() => handleSocialLogin('Google')} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#B1F82A]/30 transition-all group">
                <GoogleIcon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </button>
              <button onClick={() => handleSocialLogin('GitHub')} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#B1F82A]/30 transition-all group">
                <Github className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </button>
              <button onClick={() => handleSocialLogin('LinkedIn')} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#B1F82A]/30 transition-all group">
                <Linkedin className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </button>
            </div>

            <p className="text-center text-[14px] text-gray-400 mt-10">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#B1F82A] font-semibold hover:underline">
                Register now
              </Link>
            </p>
          </div>
        </div>

        {/* Right Section - Illustration (58%) */}
        <div className="w-full lg:w-[58%] h-[500px] lg:h-auto p-4 lg:p-6">
          <div className="w-full h-full bg-black/40 rounded-[24px] border border-white/5 relative overflow-hidden flex flex-col items-center justify-center backdrop-blur-sm">
            
            {/* Grid overlay specific to right section */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            
            {/* Main Illustration Area */}
            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center z-10">
              
              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-0 bg-white/5 backdrop-blur-md p-4 rounded-[20px] border border-white/10 shadow-2xl flex items-center gap-4 z-20"
              >
                <div className="w-12 h-12 rounded-full bg-[#B1F82A]/10 border border-[#B1F82A]/20 flex items-center justify-center text-[#B1F82A] font-bold text-lg relative">
                  82<span className="text-xs absolute -bottom-1 -right-1">%</span>
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#B1F82A" strokeWidth="3" strokeDasharray="82, 100" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Resume X-Ray</p>
                  <p className="text-xs text-gray-400">ATS Score</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-32 right-[-20px] bg-white/5 backdrop-blur-md p-4 rounded-[20px] border border-white/10 shadow-2xl flex items-center gap-3 z-20"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">AI Mock Interview</p>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B1F82A] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B1F82A]"></span>
                    </span>
                  </div>
                  <div className="flex items-end gap-1 mt-1 h-4">
                    <div className="w-1 bg-blue-500/30 h-2 rounded-full"></div>
                    <div className="w-1 bg-blue-500/50 h-3 rounded-full"></div>
                    <div className="w-1 bg-blue-500/70 h-4 rounded-full"></div>
                    <div className="w-1 bg-blue-500 h-3 rounded-full"></div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, -8, 0] }} 
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-20 left-10 bg-white/5 backdrop-blur-md p-4 rounded-[20px] border border-white/10 shadow-2xl z-20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-sm font-bold text-white">Top Interview Questions</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-white/10 rounded-md text-[10px] font-bold text-gray-300">React</span>
                  <span className="px-2 py-1 bg-white/10 rounded-md text-[10px] font-bold text-gray-300">System Design</span>
                  <span className="px-2 py-1 bg-white/10 rounded-md text-[10px] font-bold text-gray-300">DSA</span>
                </div>
              </motion.div>

              {/* Central Abstract Element */}
              <div className="w-64 h-64 bg-[#B1F82A]/5 rounded-full blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"></div>
              
              <div className="relative z-10 w-48 h-48 bg-white/5 rounded-[32px] rotate-12 backdrop-blur-xl border border-white/10 shadow-sm flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#B1F82A]/10 to-transparent rounded-[32px] opacity-50"></div>
                <div className="w-32 h-32 bg-black/50 rounded-2xl -rotate-12 border border-white/10 flex flex-col items-center justify-center gap-3 p-4">
                  <div className="w-12 h-12 bg-[#B1F82A]/10 border border-[#B1F82A]/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#B1F82A]" />
                  </div>
                  <div className="w-16 h-2 bg-white/10 rounded-full"></div>
                  <div className="w-10 h-2 bg-white/10 rounded-full"></div>
                </div>
              </div>

              {/* Particles */}
              <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-[#B1F82A] rounded-full animate-pulse shadow-[0_0_10px_#B1F82A]"></div>
              <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_#60A5FA]" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 right-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-[0_0_10px_#C084FC]" style={{ animationDelay: '0.5s' }}></div>
            </div>

            {/* Bottom Branding */}
            <div className="absolute bottom-10 text-center w-full px-8 z-10">
              <h2 className="text-lg font-bold text-white mb-2">Make your placement journey smarter</h2>
              <p className="text-xs text-gray-400 font-medium tracking-wide">RESUME X-RAY • MOCK INTERVIEWS • QUESTION BANK • PROJECT PREP</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
