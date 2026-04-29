import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Sparkles, 
  Zap, 
  Target, 
  Users, 
  ArrowRight,
  Github,
  Linkedin,
  Twitter
} from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Resume X-Ray',
      description: 'AI-powered resume analysis with actionable insights',
      color: 'cyan',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Question Bank',
      description: 'Company-specific interview questions from real candidates',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Project Prep',
      description: 'AI generates interview questions from your GitHub projects',
      color: 'yellow',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Mock Interview',
      description: 'Practice with AI interviewer in real-time simulation',
      color: 'green',
      gradient: 'from-green-500 to-emerald-500'
    },
  ]

  const stats = [
    { value: '10K+', label: 'Students Placed' },
    { value: '500+', label: 'Companies' },
    { value: '95%', label: 'Success Rate' },
    { value: '24/7', label: 'AI Support' },
  ]

  return (
    <div className="min-h-screen bg-bg-primary overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-cyan/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 px-6 py-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">InterviewOS</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/signin')}
              className="px-5 py-2 text-text-primary font-semibold rounded-xl hover:bg-bg-secondary transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2.5 bg-accent-cyan text-bg-primary font-semibold rounded-xl hover:bg-accent-cyan/90 transition-all hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-bg-secondary/50 border border-border-accent rounded-full mb-8">
              <Zap className="w-4 h-4 text-accent-yellow" />
              <span className="text-sm text-text-secondary">Your AI Placement Co-Pilot</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              Ace Your Dream Job
              <br />
              <span className="gradient-text">With AI Power</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-12">
              Built by a final-year student, for every final-year student. 
              Get personalized interview prep, AI-powered insights, and land your dream placement.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="group px-8 py-4 bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-accent-cyan/50 transition-all hover:scale-105 flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/signin')}
                className="px-8 py-4 bg-bg-secondary border border-border-subtle text-text-primary font-semibold rounded-xl hover:border-border-accent transition-all"
              >
                Sign In
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-black gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-32 bg-bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black mb-4">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-xl text-text-secondary">
              Comprehensive tools powered by cutting-edge AI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative p-8 bg-bg-secondary rounded-2xl border border-border-subtle hover:border-border-accent transition-all cursor-pointer overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-text-secondary text-lg">{feature.description}</p>
                
                <ArrowRight className="absolute bottom-8 right-8 w-6 h-6 text-text-muted group-hover:text-accent-cyan group-hover:translate-x-2 transition-all" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-32">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-12 bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 rounded-3xl border border-border-accent overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 to-accent-purple/10 animate-pulse" />
            
            <div className="relative z-10 text-center">
              <h2 className="text-5xl font-black mb-6">
                Ready to Land Your <span className="gradient-text">Dream Job?</span>
              </h2>
              <p className="text-xl text-text-secondary mb-8">
                Join thousands of students who've already transformed their placement journey
              </p>
              <button
                onClick={() => navigate('/signup')}
                className="px-10 py-5 bg-white text-bg-primary font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-white/30 transition-all hover:scale-105"
              >
                Start Your Journey Today
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-border-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">InterviewOS</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-text-secondary hover:text-accent-cyan transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-accent-cyan transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-accent-cyan transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            
            <p className="text-text-muted text-sm">
              © 2026 InterviewOS. Built with ❤️ for students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
