import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../context'
import {
  Sparkles,
  Target,
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
  ChevronRight,
  Star,
  FileSearch,
  Brain,
  Code2,
  Mic,
  Menu,
  X,
  FileText,
  Users,
  Activity,
  Award,
  AlertCircle
} from 'lucide-react'
import bg from "../assets/bg.png"

/* ─── Data Arrays ─── */
const features = [
  {
    id: 'resume',
    icon: <FileSearch className="w-7 h-7" />,
    eyebrow: 'Resume Review',
    title: 'Find resume mistakes and fix them',
    body: 'Upload your resume to see if it matches the job description. Find missing skills and get a simple step-by-step plan to make it better.',
    tags: ['Match Score', 'Missing Skills', 'Study Plan', 'Fix Bullets'],
    size: 'large',
    color: '#38BDF8' // Cyan
  },
  {
    id: 'mock',
    icon: <Mic className="w-7 h-7" />,
    eyebrow: 'Mock Interview',
    title: 'Practice with an AI interviewer',
    body: 'Practice coding, system design, or behavioral questions. Choose your difficulty level and get a report card with helpful tips and suggested answers.',
    tags: ['AI Interviewer', 'Easy/Medium/Hard', 'Report Card', 'Study Guides'],
    size: 'large',
    color: '#B1F82A' // Brand Lime
  },
  {
    id: 'projects',
    icon: <Code2 className="w-7 h-7" />,
    eyebrow: 'Project Prep',
    title: 'Get questions on your GitHub projects',
    body: 'Paste your public GitHub link. The AI reads your project files and asks the exact questions a real interviewer would ask.',
    tags: ['GitHub Link', 'Project Questions', 'Hints', 'Study Notes'],
    size: 'small',
    color: '#A78BFA' // Purple
  },
  {
    id: 'questions',
    icon: <Target className="w-7 h-7" />,
    eyebrow: 'Question Bank',
    title: 'Real company interview questions',
    body: 'Browse real questions from companies like Google, Microsoft, and Amazon. Filter by job role and level, with direct links to LeetCode.',
    tags: ['Company Questions', 'Job Role Filters', 'LeetCode Links'],
    size: 'small',
    color: '#FBBF24' // Yellow
  },
  {
    id: 'analytics',
    icon: <Activity className="w-7 h-7" />,
    eyebrow: 'Progress Tracker',
    title: 'Track your interview preparation',
    body: 'See your interview scores and categories improve. View graphs of your progress so you know what areas to practice next.',
    tags: ['Readiness Score', 'Category Charts', 'Score Graphs'],
    size: 'small',
    color: '#F472B6' // Pink
  },
  {
    id: 'peer',
    icon: <Users className="w-7 h-7" />,
    eyebrow: 'Peer Board',
    title: 'Share and review with other students',
    body: 'Upload your resume to a shared board. Other students can read your resume, add star ratings, and leave helpful comments.',
    tags: ['Share Resume', 'Ratings', 'Comments', 'Student Community'],
    size: 'large',
    color: '#34D399' // Green
  },
]

const testimonials = [
  {
    name: 'Arjun Mehta',
    role: 'SDE @ Microsoft',
    avatar: 'AM',
    text: 'InterviewOS showed me the missing skills on my resume. I fixed them and got a software engineer job at Microsoft three weeks later.',
    stars: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Data Analyst @ Flipkart',
    avatar: 'PS',
    text: 'Practicing with the AI interviewer helped me answer questions confidently. The feedback card showed me exactly where I made mistakes.',
    stars: 5,
  },
  {
    name: 'Rohan Das',
    role: 'Backend Engineer @ Razorpay',
    avatar: 'RD',
    text: 'Connecting my GitHub project gave me the exact database and security questions that my interviewer ended up asking.',
    stars: 5,
  },
]

const steps = [
  {
    n: '01',
    title: 'Upload your resume',
    body: 'Drop your PDF resume and target job description. See your match score and find what skills you are missing.',
  },
  {
    n: '02',
    title: 'Scan your GitHub project',
    body: 'Paste your project link. The AI reads your code stack and finds important questions you should prepare.',
  },
  {
    n: '03',
    title: 'Start a mock interview',
    body: 'Practice with the AI chatbot. Choose technical, system design, or behavioral topics and select your difficulty.',
  },
  {
    n: '04',
    title: 'Read your feedback card',
    body: 'Get a scorecard showing how well you answered. Read suggested answers to improve your mistakes.',
  },
  {
    n: '05',
    title: 'Use question banks',
    body: 'Reference real company questions and track your learning progress daily.',
  },
]

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Interactive Demo', href: '#interactive-demo' },
  { label: 'Testimonials', href: '#testimonials' }
]

/* ─── Main Component ─── */
const LandingPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state: RootState) => state.user)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activePreviewTab, setActivePreviewTab] = useState<'dashboard' | 'resume' | 'interview'>('dashboard')

  // SEO & Meta tags configuration
  useEffect(() => {
    document.title = 'InterviewOS - Your AI Placement Co-Pilot'

    // Dynamic Meta Tags setup
    const updateMeta = (nameOrProperty: string, value: string, isProperty = false) => {
      const selector = isProperty 
        ? `meta[property="${nameOrProperty}"]` 
        : `meta[name="${nameOrProperty}"]`
      let element = document.querySelector(selector)
      if (!element) {
        element = document.createElement('meta')
        if (isProperty) {
          element.setAttribute('property', nameOrProperty)
        } else {
          element.setAttribute('name', nameOrProperty)
        }
        document.head.appendChild(element)
      }
      element.setAttribute('content', value)
    }

    updateMeta('description', 'Prepare for your placement interviews with simple AI tools. Review your resume, get questions on your GitHub code, and practice mock interviews.')
    updateMeta('keywords', 'interview preparation, resume checker, github code helper, mock interview practice, company questions, placement helper, code practice')
    
    // Open Graph
    updateMeta('og:title', 'InterviewOS - Your AI Placement Co-Pilot', true)
    updateMeta('og:description', 'Prepare for placement interviews. Review your resume, scan your GitHub code, and practice interviews with AI.', true)
    updateMeta('og:type', 'website', true)
    updateMeta('og:site_name', 'InterviewOS', true)
  }, [])

  // Header scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto'
  }, [menuOpen])

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white selection:bg-[#B1F82A]/30 selection:text-[#B1F82A] font-sans relative overflow-x-hidden">
      {/* ── Dot Grid Background ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
        aria-hidden="true"
      />

      {/* ── Navigation Header ── */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0B0F19]/90 backdrop-blur-lg border-b border-white/10 py-4' : 'bg-transparent py-6'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#B1F82A] to-emerald-400 flex items-center justify-center shadow-lg shadow-[#B1F82A]/10">
                <Brain className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">InterviewOS</span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  onClick={(e) => {
                    e.preventDefault()
                    document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-sm font-medium text-gray-400 hover:text-[#B1F82A] transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop CTA buttons */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <button 
                  id="nav-dashboard-btn" 
                  onClick={() => navigate('/dashboard')} 
                  className="px-5 py-2.5 rounded-xl bg-[#B1F82A] text-black text-sm font-extrabold hover:scale-102 hover:shadow-[0_0_20px_rgba(177,248,42,0.25)] transition-all duration-300 flex items-center gap-1.5"
                >
                  Dashboard <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button 
                    id="nav-signin-btn" 
                    onClick={() => navigate('/signin')} 
                    className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    id="nav-signup-btn" 
                    onClick={() => navigate('/signup')} 
                    className="px-5 py-2.5 rounded-xl bg-[#B1F82A] text-black text-sm font-extrabold hover:scale-102 hover:shadow-[0_0_20px_rgba(177,248,42,0.25)] transition-all duration-300 flex items-center gap-1.5"
                  >
                    Get Started <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 border-b border-white/10 overflow-hidden backdrop-blur-xl absolute top-full left-0 right-0 w-full z-40"
            >
              <div className="px-4 py-6 flex flex-col gap-4">
                {navLinks.map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-lg font-medium text-gray-300 hover:text-[#B1F82A] py-2 border-b border-white/5"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex flex-col gap-3 mt-4">
                  {isAuthenticated ? (
                    <button 
                      onClick={() => { setMenuOpen(false); navigate('/dashboard'); }} 
                      className="w-full py-3 rounded-xl bg-[#B1F82A] text-black font-extrabold hover:bg-[#9DE024] transition-colors"
                    >
                      Dashboard
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => { setMenuOpen(false); navigate('/signin'); }} 
                        className="w-full py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors"
                      >
                        Sign In
                      </button>
                      <button 
                        onClick={() => { setMenuOpen(false); navigate('/signup'); }} 
                        className="w-full py-3 rounded-xl bg-[#B1F82A] text-black font-extrabold hover:bg-[#9DE024] transition-colors"
                      >
                        Get Started
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── Hero Section ── */}
      <section id="hero" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Graphic */}
        <div className="absolute inset-0 z-0">
          <img
            src={bg}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/50 via-[#0B0F19]/90 to-[#0B0F19]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 text-left"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-full px-4.5 py-1.5 text-xs text-gray-300 mb-6 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#B1F82A]" />
              Placement Preparation Co-Pilot
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[4.2rem] font-extrabold text-white leading-[1.1] tracking-tight">
              Crack your next <br className="hidden sm:inline" />
              placement interview with 
              <span className="text-[#B1F82A] block sm:inline"> AI Help</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-lg leading-relaxed">
              Prepare with confidence. Check your resume for missing skills, get questions on your GitHub code, and practice interviews with AI.
            </p>

            {/* Badges list */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-gray-400">
                AI Assisted
              </span>
              <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-gray-400">
                Placement Ready
              </span>
              <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-gray-400">
                Resume Matcher
              </span>
              <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-gray-400">
                Project Helper
              </span>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-4">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-7 py-3.5 rounded-xl bg-[#B1F82A] text-black font-extrabold text-base hover:scale-102 transition-all duration-300 shadow-[0_0_30px_rgba(177,248,42,0.25)] flex items-center gap-2"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-7 py-3.5 rounded-xl bg-[#B1F82A] text-black font-extrabold text-base hover:scale-102 transition-all duration-300 shadow-[0_0_30px_rgba(177,248,42,0.25)] flex items-center gap-2"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigate('/signin')}
                    className="px-7 py-3.5 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md text-white font-extrabold hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>

            <div className="mt-8 text-xs text-gray-400 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Powered by Google Gemini AI
            </div>
          </motion.div>

          {/* Right Preview Column (Dashboard mini cards) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 flex flex-col gap-4 relative"
          >
            {/* Glow backing */}
            <div className="absolute inset-0 bg-[#B1F82A]/5 blur-3xl rounded-full" />

            <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              {/* Header mockup */}
              <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-[10px] text-gray-500 font-mono ml-2">localhost:5173/dashboard</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                  System Active
                </div>
              </div>

              <div className="space-y-4 text-left">
                {/* Metric 1 */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Resume Match Score</h4>
                      <p className="text-[11px] text-gray-400">Target: Software Engineer (MERN)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-sky-400">85%</div>
                    <span className="text-[9px] text-gray-400">Match Score</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#B1F82A]/10 rounded-lg text-[#B1F82A]">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">GitHub Project Prep</h4>
                      <p className="text-[11px] text-gray-400">facebook/react questions active</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-[#B1F82A]">8 Categories</div>
                    <span className="text-[9px] text-gray-500 font-semibold">Architecture, DB, Security</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Last Mock Interview</h4>
                      <p className="text-[11px] text-gray-400">Gemini Chat Score</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-purple-400">8.2 / 10</div>
                    <span className="text-[9px] text-gray-450">STAR Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features Bento Section ── */}
      <section className="relative z-10 py-28 border-t border-white/5" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 text-left">
            <p className="text-[#B1F82A] font-extrabold tracking-wider uppercase text-xs mb-4">What You Get</p>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Tools to help you <br className="hidden sm:inline" />
              <span className="text-gray-500">prepare for placements.</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
              We build simple tools to help college students prepare for interviews and get job offers.
            </p>
          </div>

          {/* Bento grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`bg-white/[0.03] border border-white/10 rounded-3xl p-8 sm:p-10 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-400 group flex flex-col justify-between relative overflow-hidden ${
                  feat.size === 'large' ? 'md:col-span-2' : 'md:col-span-1'
                }`}
              >
                {/* Border accent highlight */}
                <div 
                  className="absolute inset-x-0 top-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${feat.color}, transparent)` }}
                />

                <div>
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-8 border transition-all duration-300 group-hover:scale-105"
                    style={{ 
                      backgroundColor: `${feat.color}15`, 
                      borderColor: `${feat.color}30`,
                      color: feat.color
                    }}
                  >
                    {feat.icon}
                  </div>
                  
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: feat.color }}>
                    {feat.eyebrow}
                  </p>
                  
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                    {feat.title}
                  </h3>
                  
                  <p className="text-sm text-gray-400 leading-relaxed mb-8">
                    {feat.body}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-white/5">
                  {feat.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2.5 py-1 text-[10px] font-bold bg-white/5 border border-white/5 text-gray-450 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workflow Timeline Section ── */}
      <section className="relative z-10 py-28 bg-white/[0.01] border-y border-white/5" id="workflow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 text-left">
            <p className="text-[#B1F82A] font-extrabold tracking-wider uppercase text-xs mb-4">How It Works</p>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Get ready in <span className="text-[#B1F82A]">five simple steps.</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-400">
              A simple, step-by-step path to get ready for your job interviews.
            </p>
          </div>

          <div className="relative max-w-4xl">
            {/* Vertical connector line */}
            <div className="absolute left-6 sm:left-[35px] top-4 bottom-4 w-[1px] bg-white/10 hidden sm:block" />

            <div className="flex flex-col gap-10">
              {steps.map((step, i) => (
                <motion.div
                  key={step.n}
                  className="flex flex-col sm:flex-row gap-6 sm:gap-10 relative group text-left"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-55px' }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/15 flex items-center justify-center text-[#B1F82A] font-black text-sm group-hover:bg-[#B1F82A] group-hover:text-black group-hover:border-[#B1F82A] transition-all duration-300">
                      {step.n}
                    </div>
                  </div>

                  <div className="sm:pt-2 flex-1">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#B1F82A] transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-450 leading-relaxed max-w-2xl">
                      {step.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Live Preview Section ── */}
      <section className="relative z-10 py-28 border-b border-white/5" id="interactive-demo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 text-left">
            <p className="text-[#B1F82A] font-extrabold tracking-wider uppercase text-xs mb-4">Interactive Preview</p>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
              See the application in action.
            </h2>
            <p className="text-base sm:text-lg text-gray-400">
              Click the tabs below to preview the pages before you sign up.
            </p>
          </div>

          {/* Interactive tabs bar */}
          <div className="flex border-b border-white/10 mb-8 max-w-md">
            <button
              onClick={() => setActivePreviewTab('dashboard')}
              className={`flex-1 pb-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                activePreviewTab === 'dashboard' 
                  ? 'border-[#B1F82A] text-[#B1F82A]' 
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              Overview Dash
            </button>
            <button
              onClick={() => setActivePreviewTab('resume')}
              className={`flex-1 pb-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                activePreviewTab === 'resume' 
                  ? 'border-[#B1F82A] text-[#B1F82A]' 
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              Resume Matcher
            </button>
            <button
              onClick={() => setActivePreviewTab('interview')}
              className={`flex-1 pb-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                activePreviewTab === 'interview' 
                  ? 'border-[#B1F82A] text-[#B1F82A]' 
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              AI Chat Interview
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="bg-slate-950/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden min-h-[420px] text-left">
            <AnimatePresence mode="wait">
              {activePreviewTab === 'dashboard' && (
                <motion.div
                  key="dashboard-preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                >
                  {/* Left Column: sidebar mockup */}
                  <div className="lg:col-span-3 space-y-1 bg-white/[0.01] border border-white/5 rounded-2xl p-4">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-3 px-2">Pages</span>
                    <div className="px-3 py-2 rounded-lg bg-[#B1F82A]/10 text-[#B1F82A] text-xs font-bold flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5" /> Dashboard
                    </div>
                    <div className="px-3 py-2 rounded-lg text-gray-400 text-xs font-medium hover:bg-white/5 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" /> Resume Review
                    </div>
                    <div className="px-3 py-2 rounded-lg text-gray-400 text-xs font-medium hover:bg-white/5 flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5" /> Project Prep
                    </div>
                    <div className="px-3 py-2 rounded-lg text-gray-400 text-xs font-medium hover:bg-white/5 flex items-center gap-2">
                      <Mic className="w-3.5 h-3.5" /> Mock Interview
                    </div>
                    <div className="px-3 py-2 rounded-lg text-gray-400 text-xs font-medium hover:bg-white/5 flex items-center gap-2">
                      <Target className="w-3.5 h-3.5" /> Question Bank
                    </div>
                  </div>

                  {/* Right Column: main mockup dashboard */}
                  <div className="lg:col-span-9 space-y-6">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">Welcome back, Rohit 👋</h3>
                        <p className="text-xs text-gray-400">See your interview prep progress here.</p>
                      </div>
                      <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400">Overall Readiness: High</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Metric Card 1 */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Resume Match Score</span>
                        <div className="text-2xl font-black text-white">85%</div>
                        <div className="mt-2 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full" style={{ width: '85%' }} />
                        </div>
                      </div>

                      {/* Metric Card 2 */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Mock Interview Score</span>
                        <div className="text-2xl font-black text-white">8.2 <span className="text-xs text-gray-400">/ 10</span></div>
                        <div className="mt-2 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full" style={{ width: '82%' }} />
                        </div>
                      </div>

                      {/* Metric Card 3 */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Projects Checked</span>
                        <div className="text-2xl font-black text-white">5 Active</div>
                        <span className="text-[9px] text-gray-500 font-semibold block mt-2">MERN, Next.js, FastAPI</span>
                      </div>
                    </div>

                    {/* SVG Chart Preview */}
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-white">Your Score Over the Week</span>
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Recharts View</span>
                      </div>
                      <div className="h-32 w-full relative flex items-end">
                        {/* Beautiful inline SVG representation of scores line chart */}
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 600 120">
                          <defs>
                            <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#B1F82A" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#B1F82A" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M 50 100 Q 130 90 210 70 T 370 40 T 530 20"
                            fill="none"
                            stroke="#B1F82A"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 50 100 Q 130 90 210 70 T 370 40 T 530 20 L 530 120 L 50 120 Z"
                            fill="url(#chart-glow)"
                          />
                          <circle cx="50" cy="100" r="5" fill="#B1F82A" stroke="#0B0F19" strokeWidth="2" />
                          <circle cx="210" cy="70" r="5" fill="#B1F82A" stroke="#0B0F19" strokeWidth="2" />
                          <circle cx="370" cy="40" r="5" fill="#B1F82A" stroke="#0B0F19" strokeWidth="2" />
                          <circle cx="530" cy="20" r="5" fill="#B1F82A" stroke="#0B0F19" strokeWidth="2" />
                        </svg>
                        <div className="absolute inset-x-0 bottom-0 flex justify-between px-6 text-[10px] text-gray-500 font-bold pt-2 border-t border-white/5">
                          <span>Monday: 45</span>
                          <span>Wednesday: 62</span>
                          <span>Friday: 75</span>
                          <span>Sunday: 85</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activePreviewTab === 'resume' && (
                <motion.div
                  key="resume-preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3.5 border-b border-white/5 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                      <FileText className="w-5.5 h-5.5 text-sky-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Active Resume Check</h3>
                      <p className="text-xs text-gray-400">Find how well your resume matches the job.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Resume Info */}
                    <div className="space-y-4">
                      <div>
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Target Job Description</span>
                        <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3 text-xs text-gray-300 h-28 overflow-y-auto leading-relaxed">
                          Require 2+ years React experience, Node/Express backend routing, secure endpoints using JWT, and database query optimization on MongoDB. Familiarity with Docker.
                        </div>
                      </div>

                      <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                        <span className="text-xs text-gray-300 font-semibold">rohit_resume.pdf</span>
                        <span className="text-[10px] text-gray-500">142 KB</span>
                      </div>
                    </div>

                    {/* ATS scorecard details */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">Keyword Check</span>
                        <span className="text-xs font-bold text-sky-400">85% Match</span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Matching Skills</span>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">React.js</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">Node.js</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">Express.js</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">MongoDB</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">JWT</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Missing Skills</span>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400">Docker</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400">AWS</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-sky-500/5 rounded-xl border border-sky-500/10 text-xs leading-relaxed text-sky-200">
                        <strong>Tip:</strong> Add more detail to your projects. Explain how you built secure login pages.
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activePreviewTab === 'interview' && (
                <motion.div
                  key="interview-preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3.5 border-b border-white/5 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Brain className="w-5.5 h-5.5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">AI Mock Interview</h3>
                      <p className="text-xs text-gray-400">Practice answering questions from the AI.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Chat interface */}
                    <div className="lg:col-span-8 flex flex-col justify-between bg-black/40 border border-white/5 rounded-2xl p-4 h-64">
                      <div className="space-y-4 overflow-y-auto pr-2 text-xs">
                        <div className="flex gap-2">
                          <div className="w-5 h-5 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold flex-shrink-0">
                            AI
                          </div>
                          <div className="bg-white/5 p-2.5 rounded-lg text-gray-200 leading-relaxed max-w-[85%]">
                            Since your resume mentions MongoDB, how do indexes help make slow queries fast?
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <div className="bg-[#B1F82A]/10 p-2.5 rounded-lg text-gray-300 leading-relaxed max-w-[85%] border border-[#B1F82A]/10">
                            Indexes help search data faster. Compound indexes are used when we search by multiple fields at the same time.
                          </div>
                          <div className="w-5 h-5 rounded bg-[#B1F82A]/20 text-[#B1F82A] flex items-center justify-center font-bold flex-shrink-0">
                            ME
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
                        <input
                          type="text"
                          readOnly
                          placeholder="Type your answer here..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-500 focus:outline-none"
                        />
                        <button className="px-3 py-1.5 bg-purple-500 text-white rounded-lg text-xs font-bold opacity-50 cursor-not-allowed">
                          Send
                        </button>
                      </div>
                    </div>

                    {/* Evaluator scorecard panel */}
                    <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-between text-xs">
                      <div>
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Your Score</span>
                        <div className="text-lg font-black text-[#B1F82A] mb-3">8.5 / 10</div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Relevance</span>
                            <span className="text-white font-semibold">9.0/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Accuracy</span>
                            <span className="text-white font-semibold">8.5/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Structure</span>
                            <span className="text-white font-semibold">8.0/10</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/5 text-[11px] text-gray-400 leading-relaxed bg-white/[0.01] p-2.5 rounded-lg">
                        <AlertCircle className="w-3.5 h-3.5 inline text-[#B1F82A] mr-1.5" />
                        Tip: Also discuss how compound indexes need correct field order.
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ── */}
      <section className="relative z-10 py-28" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 text-left">
            <p className="text-[#B1F82A] font-extrabold tracking-wider uppercase text-xs mb-4">Student Success</p>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Hear from students who <span className="text-[#B1F82A]">got hired.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 sm:p-10 hover:bg-white/[0.04] hover:border-[#B1F82A]/30 transition-all duration-300 flex flex-col justify-between text-left group"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <Star key={si} className="w-4 h-4 fill-[#B1F82A] text-[#B1F82A]" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 mb-8 leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>
                
                <div className="flex items-center gap-3.5 pt-4 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#B1F82A]/30 to-teal-500/30 flex items-center justify-center text-[#B1F82A] font-black text-xs">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner Section ── */}
      <section className="relative z-10 py-28" id="cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-[#B1F82A]/10 to-transparent border border-white/10 rounded-[2.5rem] p-12 sm:p-20 text-center max-w-5xl mx-auto relative overflow-hidden group hover:border-[#B1F82A]/20 transition-all duration-500"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-[#B1F82A] to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#B1F82A]/15 blur-[100px] rounded-full pointer-events-none" />

            <p className="text-[#B1F82A] font-extrabold tracking-wider uppercase text-xs mb-6">Start Preparing</p>
            
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-8 tracking-tight leading-[1.15]">
              Get ready for your <br className="hidden sm:inline" />
              interviews today.
            </h2>
            
            <p className="text-base sm:text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Scan your projects, fix your resume, and practice interviews with AI.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <button
                  id="cta-dashboard-btn"
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 rounded-xl bg-[#B1F82A] text-black font-extrabold text-base hover:scale-102 transition-all duration-300 shadow-[0_0_30px_rgba(177,248,42,0.25)] flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  id="cta-signup-btn"
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 rounded-xl bg-[#B1F82A] text-black font-extrabold text-base hover:scale-102 transition-all duration-300 shadow-[0_0_30px_rgba(177,248,42,0.25)] flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  Create Account Free
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <p className="text-[11px] text-gray-500 mt-8 font-semibold">
              Gemini AI Powered • Simple Dashboard • Free to Try
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-16 border-t border-white/5 bg-black/60 backdrop-blur-md text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Branding Column */}
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#B1F82A] flex items-center justify-center">
                  <Brain className="w-4.5 h-4.5 text-black" />
                </div>
                <span className="text-lg font-black text-white tracking-tight">InterviewOS</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                A simple placement preparation tool for college students. Scan resumes, read GitHub projects, and practice interviews with AI.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Feature Pages</h4>
              <ul className="space-y-2 text-xs text-gray-550">
                <li><a onClick={() => navigate('/resume-xray')} className="hover:text-[#B1F82A] transition-colors cursor-pointer">Resume Review</a></li>
                <li><a onClick={() => navigate('/project-prep')} className="hover:text-[#B1F82A] transition-colors cursor-pointer">GitHub Prep Scan</a></li>
                <li><a onClick={() => navigate('/mock-interview')} className="hover:text-[#B1F82A] transition-colors cursor-pointer">Mock Interviews</a></li>
                <li><a onClick={() => navigate('/question-bank')} className="hover:text-[#B1F82A] transition-colors cursor-pointer">Company Questions</a></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-xs text-gray-555">
                <li><a href="https://github.com/Rohit273848/InterviewOS" className="hover:text-[#B1F82A] transition-colors">Project GitHub</a></li>
                <li><a onClick={() => navigate('/peer-review')} className="hover:text-[#B1F82A] transition-colors cursor-pointer">Peer Board</a></li>
                <li><a onClick={() => navigate('/admin')} className="hover:text-[#B1F82A] transition-colors cursor-pointer">Admin Dashboard</a></li>
              </ul>
            </div>

            {/* Version Statement */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">About Project</h4>
              <p className="text-xs text-gray-550 leading-relaxed">
                Version: <span className="text-gray-300 font-mono">1.0.0</span><br />
                Built with React, Express, MongoDB, and Gemini.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-semibold">
            <p>© 2026 InterviewOS. All rights reserved.</p>
            
            <div className="flex items-center gap-4">
              <a href="https://github.com/Rohit273848/InterviewOS" aria-label="GitHub" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-405 hover:text-[#B1F82A] hover:bg-[#B1F82A]/10 hover:border-[#B1F82A]/30 transition-all duration-300">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-405 hover:text-[#B1F82A] hover:bg-[#B1F82A]/10 hover:border-[#B1F82A]/30 transition-all duration-300">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-405 hover:text-[#B1F82A] hover:bg-[#B1F82A]/10 hover:border-[#B1F82A]/30 transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
