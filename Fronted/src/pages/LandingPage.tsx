import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Zap,
  Target,
  Users,
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
  CheckCircle2,
  ChevronRight,
  Star,
  FileSearch,
  Brain,
  Code2,
  Mic,
  Menu,
  X,
} from 'lucide-react'

/* ─── tiny helpers ─── */
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="lp-badge">{children}</span>
)

const Chip = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="lp-chip">
    {icon}
    <span>{label}</span>
  </div>
)

/* ─── data ─── */
const features = [
  {
    id: 'resume',
    icon: <FileSearch className="lp-feat-icon" />,
    eyebrow: 'Resume X-Ray',
    title: 'Instantly know what recruiters see',
    body: 'Deep AI analysis scores your resume against real JDs, flags weak spots, and rewrites bullet points to pass ATS filters — in under 60 seconds.',
    tags: ['ATS Score', 'Gap Analysis', 'Rewrite Assist'],
    accent: '#22D3EE',
    size: 'large',
  },
  {
    id: 'questions',
    icon: <Target className="lp-feat-icon" />,
    eyebrow: 'Question Bank',
    title: 'Company-specific interview intelligence',
    body: 'Real questions sourced from Glassdoor, LeetCode discuss threads, and alumni networks — filtered by role and round.',
    tags: ['500+ Companies', 'Role-Filtered', 'Round-Aware'],
    accent: '#8B5CF6',
    size: 'small',
  },
  {
    id: 'projects',
    icon: <Code2 className="lp-feat-icon" />,
    eyebrow: 'Project Prep',
    title: 'Turn your GitHub into interview ammo',
    body: 'Connect your repos and get a curated list of deep-dive questions an interviewer would ask about your own projects.',
    tags: ['GitHub Sync', 'Depth Questions', 'Story Builder'],
    accent: '#FACC15',
    size: 'small',
  },
  {
    id: 'mock',
    icon: <Mic className="lp-feat-icon" />,
    eyebrow: 'Mock Interview',
    title: 'Practice under real pressure',
    body: 'AI interviewer adapts in real-time, holds follow-ups, and delivers post-session scorecards with improvement roadmaps.',
    tags: ['Adaptive AI', 'Voice Mode', 'Scorecards'],
    accent: '#10B981',
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
    <div className="lp-root">
      {/* ── Grid background ── */}
      <div className="lp-grid-bg" aria-hidden="true" />

      {/* ── Nav ── */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}
      >
        <div className="lp-nav-inner">
          {/* Logo */}
          <div className="lp-logo">
            <div className="lp-logo-mark">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="lp-logo-text">InterviewOS</span>
          </div>

          {/* Desktop links */}
          <nav className="lp-nav-links" aria-label="Main navigation">
            {navLinks.map(link => (
              <a key={link} onClick={(e) => {
                e.preventDefault()
                document
                  .getElementById(link.toLowerCase().replace(/ /g, '-'))
                  ?.scrollIntoView({ behavior: 'smooth' })
              }} className="lp-nav-link">
                {link}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="lp-nav-cta">
            <button id="nav-signin-btn" onClick={() => navigate('/signin')} className="lp-btn-ghost">
              Sign In
            </button>
            <button id="nav-signup-btn" onClick={() => navigate('/signup')} className="lp-btn-primary">
              Get Started <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lp-hamburger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lp-mobile-menu"
            >
              {navLinks.map(link => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/ /g, '-')}`}
                  className="lp-mobile-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {link}
                </a>
              ))}
              <div className="lp-mobile-menu-cta">
                <button onClick={() => navigate('/signin')} className="lp-btn-ghost w-full">Sign In</button>
                <button onClick={() => navigate('/signup')} className="lp-btn-primary w-full justify-center">Get Started</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── Hero ── */}
      <section className="lp-hero" id="hero">
        <div className="lp-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lp-hero-inner"
          >
            <Badge>AI-Powered Placement Co-Pilot</Badge>

            <h1 className="lp-hero-h1">
              Land your dream job —<br />
              <span className="lp-hero-h1-accent">not just any job.</span>
            </h1>

            <p className="lp-hero-sub">
              InterviewOS combines resume intelligence, company-specific prep, and real-time AI mock
              interviews into one focused workflow. Built for final-year students who are serious.
            </p>

            <div className="lp-hero-actions">
              <button
                id="hero-signup-btn"
                onClick={() => navigate('/signup')}
                className="lp-btn-primary lp-btn-lg"
              >
                Start Free — No Card Needed
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                id="hero-signin-btn"
                onClick={() => navigate('/signin')}
                className="lp-btn-outline lp-btn-lg"
              >
                Sign In
              </button>
            </div>

            <div className="lp-hero-trust">
              {['No credit card', 'Free tier forever', 'Cancel anytime'].map(t => (
                <Chip key={t} icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />} label={t} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="lp-stats-bar" aria-label="Key statistics">
        <div className="lp-container">
          <div className="lp-stats-grid">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                // transition={{ delay: parseInt(s.n) * 0.1 }}
                className="lp-stat"
              >
                <div className="lp-stat-value">{s.value}</div>
                <div className="lp-stat-label">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features bento ── */}
      <section className="lp-section" id="features">
        <div className="lp-container">
          <div className="lp-section-header">
            <p className="lp-eyebrow">Platform Features</p>
            <h2 className="lp-section-h2">Everything you need. Nothing you don't.</h2>
            <p className="lp-section-sub">
              Four precision tools that cover the entire placement journey — from profile to offer.
            </p>
          </div>

          <div className="lp-bento">
            {features.map((feat, i) => (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className={`lp-bento-card lp-bento-card--${feat.size}`}
                style={{ ['--feat-accent' as any]: feat.accent }}
              >
                <div className="lp-bento-icon-wrap">{feat.icon}</div>
                <p className="lp-bento-eyebrow">{feat.eyebrow}</p>
                <h3 className="lp-bento-title">{feat.title}</h3>
                <p className="lp-bento-body">{feat.body}</p>
                <div className="lp-bento-tags">
                  {feat.tags.map(tag => (
                    <span key={tag} className="lp-tag">{tag}</span>
                  ))}
                </div>
                <div className="lp-bento-card-glow" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="lp-section lp-section--alt" id="how-it-works">
        <div className="lp-container">
          <div className="lp-section-header">
            <p className="lp-eyebrow">How It Works</p>
            <h2 className="lp-section-h2">From profile to offer in four steps.</h2>
          </div>

          <div className="lp-steps">
            {steps.map((step, i) => (
              <motion.div
                key={step.n} // ✅ FIXED
                className="lp-step-card"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
              >
                <div className="lp-step-left">
                  <div className="lp-step-circle">{step.n}</div>
                  {i !== steps.length - 1 && <div className="lp-step-line" />}
                </div>

                <div className="lp-step-content">
                  <h3 className="lp-step-title">{step.title}</h3>
                  <p className="lp-step-body">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="lp-section" id="testimonials">
        <div className="lp-container">
          <div className="lp-section-header">
            <p className="lp-eyebrow">Testimonials</p>
            <h2 className="lp-section-h2">Students who made it.</h2>
          </div>
          <div className="lp-testimonials">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="lp-testimonial"
              >
                <div className="lp-stars">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="lp-testimonial-text">"{t.text}"</p>
                <div className="lp-testimonial-author">
                  <div className="lp-avatar">{t.avatar}</div>
                  <div>
                    <div className="lp-author-name">{t.name}</div>
                    <div className="lp-author-role">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-section lp-section--alt" id="cta">
        <div className="lp-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lp-cta-box"
          >
            <p className="lp-eyebrow" style={{ textAlign: 'center' }}>Get Started Today</p>
            <h2 className="lp-cta-h2">Your next offer is one session away.</h2>
            <p className="lp-cta-sub">
              Join 10,000+ students using InterviewOS to crack placements at top companies.
            </p>
            <button
              id="cta-signup-btn"
              onClick={() => navigate('/signup')}
              className="lp-btn-primary lp-btn-lg"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="lp-cta-footnote">No credit card required. Free tier forever.</p>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-inner">
            <div className="lp-logo">
              <div className="lp-logo-mark">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="lp-logo-text">InterviewOS</span>
            </div>

            <p className="lp-footer-copy">© 2026 InterviewOS. Built for students, by a student.</p>

            <div className="lp-footer-social">
              <a href="https://github.com/Rohit273848/InterviewOS" aria-label="GitHub" className="lp-social-link"><Github className="w-4 h-4" /></a>
              <a href="#" aria-label="LinkedIn" className="lp-social-link"><Linkedin className="w-4 h-4" /></a>
              <a href="#" aria-label="Twitter" className="lp-social-link"><Twitter className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
