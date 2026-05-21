import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
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
} from 'lucide-react'
import bg from "../assets/bg.png"

/* ─── data ─── */
const features = [
  {
    id: 'resume',
    icon: <FileSearch className="w-7 h-7" />,
    eyebrow: 'Resume X-Ray',
    title: 'Instantly know what recruiters see',
    body: 'Deep AI analysis scores your resume against real JDs, flags weak spots, and rewrites bullet points to pass ATS filters — in under 60 seconds.',
    tags: ['ATS Score', 'Gap Analysis', 'Rewrite Assist'],
    size: 'large',
  },
  {
    id: 'questions',
    icon: <Target className="w-7 h-7" />,
    eyebrow: 'Question Bank',
    title: 'Company-specific interview intelligence',
    body: 'Real questions sourced from Glassdoor, LeetCode discuss threads, and alumni networks — filtered by role and round.',
    tags: ['500+ Companies', 'Role-Filtered', 'Round-Aware'],
    size: 'small',
  },
  {
    id: 'projects',
    icon: <Code2 className="w-7 h-7" />,
    eyebrow: 'Project Prep',
    title: 'Turn your GitHub into interview ammo',
    body: 'Connect your repos and get a curated list of deep-dive questions an interviewer would ask about your own projects.',
    tags: ['GitHub Sync', 'Depth Questions', 'Story Builder'],
    size: 'small',
  },
  {
    id: 'mock',
    icon: <Mic className="w-7 h-7" />,
    eyebrow: 'Mock Interview',
    title: 'Practice under real pressure',
    body: 'AI interviewer adapts in real-time, holds follow-ups, and delivers post-session scorecards with improvement roadmaps.',
    tags: ['Adaptive AI', 'Voice Mode', 'Scorecards'],
    size: 'large',
  },
]

const testimonials = [
  {
    name: 'Arjun Mehta',
    role: 'SDE @ Microsoft',
    avatar: 'AM',
    text: 'InterviewOS picked gaps in my resume I had missed for months. Got a Microsoft offer 3 weeks after using Resume X-Ray.',
    stars: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Data Analyst @ Flipkart',
    avatar: 'PS',
    text: 'The company-specific question bank is gold. Every question from my Flipkart round was in there.',
    stars: 5,
  },
  {
    name: 'Rohan Das',
    role: 'Backend Engineer @ Razorpay',
    avatar: 'RD',
    text: 'Mock interviews trained me to handle follow-ups calmly. The scorecard feedback was brutally honest and super helpful.',
    stars: 5,
  },
]

const stats = [
  { value: '10K+', label: 'Students Placed' },
  { value: '500+', label: 'Companies Covered' },
  { value: '95%', label: 'Offer Rate' },
  { value: '60s', label: 'Resume Analysis' },
]

const steps = [
  {
    n: '01',
    title: 'Upload Your Resume',
    body: 'Drop your PDF and let AI run a full diagnostic in under 60 seconds.',
  },
  {
    n: '02',
    title: 'Pick Your Target Companies',
    body: 'Select roles and companies to unlock tailored question banks and prep paths.',
  },
  {
    n: '03',
    title: 'Practice Daily',
    body: "Run timed mock interviews. Get scored. Iterate on weak areas until you're ready.",
  },
  {
    n: '04',
    title: 'Walk In Confident',
    body: 'Track progress, review scorecards, and go into every interview over-prepared.',
  },
]

const navLinks = ['Features', 'How It Works', 'Testimonials']

/* ─── main component ─── */
const LandingPage = () => {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto'
  }, [menuOpen])

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white selection:bg-[#B1F82A]/30 selection:text-[#B1F82A] font-sans relative overflow-x-hidden">
      {/* ── Dot Grid background ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
        aria-hidden="true"
      />

      {/* ── Nav ── */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/10 py-4' : 'bg-transparent py-6'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 rounded-lg bg-[#B1F82A] flex items-center justify-center">
                <Brain className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">InterviewOS</span>
            </div>

            {/* Desktop links */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {navLinks.map(link => (
                <a key={link} onClick={(e) => {
                  e.preventDefault()
                  document
                    .getElementById(link.toLowerCase().replace(/ /g, '-'))
                    ?.scrollIntoView({ behavior: 'smooth' })
                }} className="text-sm font-medium text-gray-300 hover:text-[#B1F82A] transition-colors cursor-pointer">
                  {link}
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <button id="nav-signin-btn" onClick={() => navigate('/signin')} className="text-sm font-medium text-white hover:text-[#B1F82A] transition-colors">
                Sign In
              </button>
              <button id="nav-signup-btn" onClick={() => navigate('/signup')} className="px-5 py-2.5 rounded-full bg-[#B1F82A] text-black text-sm font-bold hover:scale-105 transition-transform duration-300 flex items-center gap-1">
                Get Started <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
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
                    key={link}
                    href={`#${link.toLowerCase().replace(/ /g, '-')}`}
                    className="text-lg font-medium text-gray-300 hover:text-[#B1F82A] py-2 border-b border-white/5"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link}
                  </a>
                ))}
                <div className="flex flex-col gap-3 mt-4">
                  <button onClick={() => navigate('/signin')} className="w-full py-3 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 transition-colors">Sign In</button>
                  <button onClick={() => navigate('/signup')} className="w-full py-3 rounded-xl bg-[#B1F82A] text-black font-bold hover:bg-[#9DE024] transition-colors">Get Started</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── Hero ── */}
      <section
        id="hero"
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={bg}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center pt-32 pb-20">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-full px-4 py-2 text-sm text-white mb-8">
              <Sparkles className="w-4 h-4 text-[#B1F82A]" />
              AI Powered Placement Preparation
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
              Crack Your
              <span className="text-[#B1F82A]"> Dream Job</span>
              <br />
              With AI Guidance
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-lg leading-relaxed">
              InterviewOS helps students prepare smarter with AI resume reviews,
              company-specific questions, mock interviews, and personalized learning paths.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-4 rounded-full bg-[#B1F82A] text-black font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(177,248,42,0.3)] flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate('/signin')}
                className="px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white font-bold text-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300"
              >
                Sign In
              </button>
            </div>

            {/* Users */}
            {/* <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-4">
                <img
                  className="w-12 h-12 rounded-full border-2 border-black object-cover"
                  src="https://images.unsplash.com/photo-1554324178-c81140f30897"
                  alt="User"
                />
                <img
                  className="w-12 h-12 rounded-full border-2 border-black object-cover"
                  src="https://images.unsplash.com/photo-1694858532747-c6ab526ea760"
                  alt="User"
                />
                <img
                  className="w-12 h-12 rounded-full border-2 border-black object-cover"
                  src="https://images.unsplash.com/photo-1488475105717-be5a9aa6ad97"
                  alt="User"
                />
                <img
                  className="w-12 h-12 rounded-full border-2 border-black object-cover"
                  src="https://images.unsplash.com/photo-1539345834552-944c6df41392"
                  alt="User"
                />
              </div>

              <div>
                <p className="font-extrabold text-white text-xl">10K+</p>
                <p className="text-sm text-gray-400 font-medium">
                  Students preparing daily
                </p>
              </div>
            </div> */}
          </motion.div>

          {/* Right Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-4 w-full max-w-md mx-auto lg:ml-auto lg:mr-0"
          >
            {/* Card 1 */}
            <div className="cursor-pointer bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex items-start gap-5 hover:bg-white/10 hover:border-[#B1F82A]/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-[#B1F82A]/10 border border-[#B1F82A]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <FileSearch className="w-6 h-6 text-[#B1F82A]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Resume Analysis
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  AI scans your resume and improves ATS score instantly.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="cursor-pointer bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex items-start gap-5 hover:bg-white/10 hover:border-[#B1F82A]/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-[#B1F82A]/10 border border-[#B1F82A]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6 text-[#B1F82A]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Company Questions
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Practice real interview questions asked by top companies.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="cursor-pointer bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex items-start gap-5 hover:bg-white/10 hover:border-[#B1F82A]/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-[#B1F82A]/10 border border-[#B1F82A]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Mic className="w-6 h-6 text-[#B1F82A]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  AI Mock Interviews
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Simulate real interviews with adaptive AI feedback.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>



      {/* ── Features bento ── */}
      <section className="relative z-10 py-32" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <p className="text-[#B1F82A] font-bold tracking-wider uppercase text-sm mb-4">Platform Features</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">Everything you need. <span className="text-gray-500">Nothing you don't.</span></h2>
            <p className="text-xl text-gray-400">
              Four precision tools that cover the entire placement journey — from profile to offer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-10 hover:bg-white/10 hover:border-[#B1F82A]/50 transition-all duration-500 group flex flex-col ${feat.size === 'large' ? 'md:col-span-2' : 'md:col-span-1'}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#B1F82A]/10 border border-[#B1F82A]/20 flex items-center justify-center text-[#B1F82A] mb-8 group-hover:scale-110 group-hover:bg-[#B1F82A] group-hover:text-black transition-all duration-300">
                  {feat.icon}
                </div>
                <p className="text-[#B1F82A] text-xs font-bold uppercase tracking-wider mb-3">{feat.eyebrow}</p>
                <h3 className="text-2xl font-bold text-white mb-4">{feat.title}</h3>
                <p className="text-gray-400 mb-8 leading-relaxed flex-grow">{feat.body}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {feat.tags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 text-xs font-bold bg-black/30 border border-white/10 text-gray-300 rounded-full group-hover:border-white/20 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative z-10 py-32 bg-white/[0.02] border-y border-white/5" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-20">
            <p className="text-[#B1F82A] font-bold tracking-wider uppercase text-sm mb-4">How It Works</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">From profile to offer in <span className="text-[#B1F82A]">four steps.</span></h2>
          </div>

          <div className="max-w-3xl relative">
            <div className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#B1F82A]/50 via-white/10 to-transparent hidden sm:block" />

            <div className="flex flex-col gap-12 sm:gap-16">
              {steps.map((step, i) => (
                <motion.div
                  key={step.n}
                  className="flex flex-col sm:flex-row gap-6 sm:gap-10 relative group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.4 }}
                >
                  <div className="relative z-10 flex flex-col items-start sm:items-center">
                    <div className="w-14 h-14 rounded-full bg-black border-2 border-white/20 flex items-center justify-center text-white font-bold text-xl group-hover:bg-[#B1F82A] group-hover:text-black group-hover:border-[#B1F82A] transition-all duration-300 shadow-[0_0_15px_rgba(177,248,42,0)] group-hover:shadow-[0_0_30px_rgba(177,248,42,0.4)]">
                      {step.n}
                    </div>
                  </div>

                  <div className="pt-2">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#B1F82A] transition-colors duration-300">{step.title}</h3>
                    <p className="text-lg text-gray-400 leading-relaxed">{step.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="relative z-10 py-32" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <p className="text-[#B1F82A] font-bold tracking-wider uppercase text-sm mb-4">Testimonials</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">Students who <span className="text-[#B1F82A]">made it.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-10 hover:bg-white/10 hover:border-[#B1F82A]/50 transition-all duration-300 flex flex-col group"
              >
                <div className="flex gap-1 mb-8">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} className="w-5 h-5 fill-[#B1F82A] text-[#B1F82A]" />
                  ))}
                </div>
                <p className="text-lg text-gray-300 mb-10 flex-grow leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#B1F82A]/20 border border-[#B1F82A]/30 flex items-center justify-center text-[#B1F82A] font-bold text-lg group-hover:bg-[#B1F82A] group-hover:text-black transition-colors duration-300">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">{t.name}</div>
                    <div className="text-sm text-gray-500 font-medium">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-32" id="cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-[#B1F82A]/10 to-transparent backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 sm:p-20 text-center max-w-5xl mx-auto relative overflow-hidden group hover:border-[#B1F82A]/30 transition-colors duration-500"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-[#B1F82A] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#B1F82A]/20 blur-[100px] rounded-full pointer-events-none" />

            <p className="text-[#B1F82A] font-bold tracking-wider uppercase text-sm mb-6">Get Started Today</p>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-8 tracking-tight leading-[1.1]">
              Your next offer is<br />one session away.
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join 10,000+ students using InterviewOS to crack placements at top companies.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="cta-signup-btn"
                onClick={() => navigate('/signup')}
                className="px-10 py-5 rounded-full bg-[#B1F82A] text-black font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(177,248,42,0.3)] flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Create Free Account
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-8 font-medium">No credit card required. Free tier forever.</p>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-12 border-t border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B1F82A] flex items-center justify-center">
                <Brain className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">InterviewOS</span>
            </div>

            <p className="text-gray-500 text-sm font-medium">© 2026 InterviewOS. Built for students, by a student.</p>

            <div className="flex items-center gap-4">
              <a href="https://github.com/Rohit273848/InterviewOS" aria-label="GitHub" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#B1F82A] hover:bg-[#B1F82A]/10 hover:border-[#B1F82A]/30 transition-all duration-300">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#B1F82A] hover:bg-[#B1F82A]/10 hover:border-[#B1F82A]/30 transition-all duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Twitter" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#B1F82A] hover:bg-[#B1F82A]/10 hover:border-[#B1F82A]/30 transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
