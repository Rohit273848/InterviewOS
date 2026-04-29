import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Square, Send, Clock, CheckCircle2, MessageSquare, Sparkles, Settings as SettingsIcon } from 'lucide-react'
import toast from 'react-hot-toast'

const MockInterview = () => {
  const [isInterviewActive, setIsInterviewActive] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [answers, setAnswers] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  
  // Settings
  const [interviewType, setInterviewType] = useState('behavioral')
  const [difficulty, setDifficulty] = useState('medium')
  const [questionCount, setQuestionCount] = useState(5)
  const [questions, setQuestions] = useState<Array<{ id: number; question: string; hint: string }>>([])

  // Question banks by type and difficulty
  const questionBanks = {
    behavioral: {
      easy: [
        { question: 'Tell me about yourself.', hint: 'Focus on your education, skills, and career goals.' },
        { question: 'Why do you want to work here?', hint: 'Research the company and align with their values.' },
        { question: 'What are your strengths?', hint: 'Mention 2-3 key strengths with examples.' },
        { question: 'What are your weaknesses?', hint: 'Show self-awareness and how you\'re improving.' },
        { question: 'Where do you see yourself in 5 years?', hint: 'Show ambition while being realistic.' },
        { question: 'Why should we hire you?', hint: 'Highlight unique value you bring.' },
        { question: 'What motivates you?', hint: 'Connect motivation to the role.' },
        { question: 'Describe your ideal work environment.', hint: 'Align with company culture.' },
        { question: 'How do you handle stress?', hint: 'Give specific coping strategies.' },
        { question: 'What are your salary expectations?', hint: 'Research market rates first.' },
        { question: 'Do you prefer working alone or in a team?', hint: 'Show flexibility.' },
        { question: 'What is your greatest achievement?', hint: 'Use STAR method.' },
        { question: 'Why did you choose your major?', hint: 'Show passion and relevance.' },
        { question: 'What do you know about our company?', hint: 'Show you did research.' },
        { question: 'How do you prioritize tasks?', hint: 'Explain your system.' }
      ],
      medium: [
        { question: 'Describe a challenging project you worked on.', hint: 'Use STAR method: Situation, Task, Action, Result.' },
        { question: 'Tell me about a time you failed.', hint: 'Focus on what you learned.' },
        { question: 'How do you handle conflicts with team members?', hint: 'Show emotional intelligence.' },
        { question: 'Describe a time you showed leadership.', hint: 'Leadership isn\'t just about titles.' },
        { question: 'How do you handle criticism?', hint: 'Show you\'re open to feedback.' },
        { question: 'Tell me about a time you went above and beyond.', hint: 'Show initiative and dedication.' },
        { question: 'Describe a situation where you had to learn something quickly.', hint: 'Show adaptability.' },
        { question: 'How do you handle multiple deadlines?', hint: 'Explain prioritization strategy.' },
        { question: 'Tell me about a time you disagreed with your manager.', hint: 'Show respect while being honest.' },
        { question: 'Describe a time you had to work with a difficult person.', hint: 'Focus on resolution.' },
        { question: 'How do you stay updated with technology trends?', hint: 'Show continuous learning.' },
        { question: 'Tell me about a time you made a mistake.', hint: 'Show accountability and learning.' },
        { question: 'Describe your problem-solving process.', hint: 'Give a structured approach.' },
        { question: 'How do you handle ambiguity?', hint: 'Show you can work with incomplete info.' },
        { question: 'Tell me about a time you improved a process.', hint: 'Show initiative and impact.' }
      ],
      hard: [
        { question: 'Describe a time when you had to make a difficult decision with limited information.', hint: 'Show decision-making framework and risk assessment.' },
        { question: 'Tell me about a project that failed despite your best efforts.', hint: 'Show resilience and learning from failure.' },
        { question: 'How would you handle a situation where your team disagrees with your technical approach?', hint: 'Balance leadership with collaboration.' },
        { question: 'Describe a time you had to convince stakeholders to change direction.', hint: 'Show influence and communication skills.' },
        { question: 'Tell me about the most complex problem you\'ve solved.', hint: 'Break down complexity clearly.' },
        { question: 'How do you balance technical debt with feature development?', hint: 'Show strategic thinking.' },
        { question: 'Describe a time you had to deliver bad news to stakeholders.', hint: 'Show communication and accountability.' },
        { question: 'How would you handle a situation where you disagree with company direction?', hint: 'Show integrity and professionalism.' },
        { question: 'Tell me about a time you had to fire or let someone go.', hint: 'Show empathy and professionalism.' },
        { question: 'Describe your biggest professional regret.', hint: 'Show self-reflection and growth.' },
        { question: 'How do you handle ethical dilemmas at work?', hint: 'Show strong values.' },
        { question: 'Tell me about a time you had to choose between two important priorities.', hint: 'Show decision-making process.' },
        { question: 'Describe a situation where you had to influence without authority.', hint: 'Show leadership skills.' },
        { question: 'How do you handle burnout in yourself and your team?', hint: 'Show awareness and strategies.' },
        { question: 'Tell me about a time you had to adapt to major organizational change.', hint: 'Show flexibility and resilience.' }
      ]
    },
    technical: {
      easy: [
        { question: 'Explain the difference between var, let, and const in JavaScript.', hint: 'Focus on scope and mutability.' },
        { question: 'What is the difference between == and === in JavaScript?', hint: 'Explain type coercion.' },
        { question: 'Explain what REST API is.', hint: 'Cover HTTP methods and statelessness.' },
        { question: 'What is the difference between SQL and NoSQL?', hint: 'Compare structure and use cases.' },
        { question: 'Explain what Git is and why it\'s useful.', hint: 'Cover version control benefits.' },
        { question: 'What is the difference between frontend and backend?', hint: 'Explain client-server architecture.' },
        { question: 'Explain what an array is.', hint: 'Cover basic operations.' },
        { question: 'What is object-oriented programming?', hint: 'Explain key concepts: encapsulation, inheritance, polymorphism.' },
        { question: 'Explain what a function is.', hint: 'Cover parameters and return values.' },
        { question: 'What is the difference between HTTP and HTTPS?', hint: 'Focus on security.' },
        { question: 'Explain what a database is.', hint: 'Cover data storage and retrieval.' },
        { question: 'What is an API?', hint: 'Explain interface between systems.' },
        { question: 'Explain what debugging is.', hint: 'Cover common techniques.' },
        { question: 'What is the difference between a compiler and interpreter?', hint: 'Explain execution process.' },
        { question: 'Explain what a loop is.', hint: 'Give examples of different types.' }
      ],
      medium: [
        { question: 'Explain how closures work in JavaScript.', hint: 'Use examples with scope.' },
        { question: 'What is the event loop in JavaScript?', hint: 'Explain asynchronous execution.' },
        { question: 'Explain the difference between synchronous and asynchronous code.', hint: 'Use callbacks, promises, async/await.' },
        { question: 'What are the SOLID principles?', hint: 'Explain each principle with examples.' },
        { question: 'Explain how authentication differs from authorization.', hint: 'Use real-world examples.' },
        { question: 'What is middleware in Express.js?', hint: 'Explain request-response cycle.' },
        { question: 'Explain database indexing and why it\'s important.', hint: 'Cover performance implications.' },
        { question: 'What is the difference between PUT and PATCH in REST?', hint: 'Explain idempotency.' },
        { question: 'Explain how React hooks work.', hint: 'Cover useState and useEffect.' },
        { question: 'What is the difference between cookies and local storage?', hint: 'Compare security and use cases.' },
        { question: 'Explain what a promise is in JavaScript.', hint: 'Cover then, catch, finally.' },
        { question: 'What is the virtual DOM in React?', hint: 'Explain reconciliation.' },
        { question: 'Explain what dependency injection is.', hint: 'Show benefits for testing.' },
        { question: 'What is the difference between TCP and UDP?', hint: 'Compare reliability and speed.' },
        { question: 'Explain what a hash table is.', hint: 'Cover time complexity.' }
      ],
      hard: [
        { question: 'Design a URL shortening service like bit.ly.', hint: 'Cover database design, hashing, and scalability.' },
        { question: 'Explain how you would implement a rate limiter.', hint: 'Discuss algorithms like token bucket or sliding window.' },
        { question: 'How would you design a real-time chat application?', hint: 'Cover WebSockets, message queues, and scaling.' },
        { question: 'Explain database sharding and when you would use it.', hint: 'Discuss horizontal scaling and trade-offs.' },
        { question: 'How would you implement a caching strategy for a high-traffic API?', hint: 'Cover cache invalidation and consistency.' },
        { question: 'Design a notification system for millions of users.', hint: 'Discuss push notifications, queues, and reliability.' },
        { question: 'Explain how you would optimize a slow database query.', hint: 'Cover indexing, query optimization, and profiling.' },
        { question: 'How would you implement authentication in a microservices architecture?', hint: 'Discuss JWT, OAuth, and service-to-service auth.' },
        { question: 'Design a distributed file storage system.', hint: 'Cover replication, consistency, and fault tolerance.' },
        { question: 'Explain how you would handle race conditions in a distributed system.', hint: 'Discuss locks, transactions, and eventual consistency.' },
        { question: 'How would you design a search engine?', hint: 'Cover indexing, ranking, and distributed processing.' },
        { question: 'Explain how you would implement a recommendation system.', hint: 'Discuss collaborative filtering and machine learning.' },
        { question: 'Design a payment processing system.', hint: 'Cover security, transactions, and idempotency.' },
        { question: 'How would you implement a distributed lock?', hint: 'Discuss consensus algorithms.' },
        { question: 'Explain how you would design a video streaming service.', hint: 'Cover CDN, adaptive bitrate, and storage.' }
      ]
    },
    'system-design': {
      easy: [
        { question: 'Design a basic URL shortener.', hint: 'Focus on core functionality first.' },
        { question: 'Design a simple todo list application.', hint: 'Cover CRUD operations.' },
        { question: 'Design a basic blog platform.', hint: 'Think about posts, comments, users.' },
        { question: 'Design a contact management system.', hint: 'Cover data model and operations.' },
        { question: 'Design a simple voting system.', hint: 'Prevent duplicate votes.' },
        { question: 'Design a basic e-commerce cart.', hint: 'Handle add, remove, update.' },
        { question: 'Design a simple notification system.', hint: 'Cover different notification types.' },
        { question: 'Design a basic file upload service.', hint: 'Handle file storage and retrieval.' },
        { question: 'Design a simple authentication system.', hint: 'Cover login, logout, sessions.' },
        { question: 'Design a basic search functionality.', hint: 'Think about indexing.' },
        { question: 'Design a simple calendar application.', hint: 'Handle events and reminders.' },
        { question: 'Design a basic messaging system.', hint: 'One-to-one messaging.' },
        { question: 'Design a simple rating system.', hint: 'Calculate averages.' },
        { question: 'Design a basic booking system.', hint: 'Handle availability.' },
        { question: 'Design a simple analytics dashboard.', hint: 'Display key metrics.' }
      ],
      medium: [
        { question: 'Design Instagram.', hint: 'Cover feed, posts, likes, comments, and followers.' },
        { question: 'Design Twitter.', hint: 'Focus on tweets, timeline, and following.' },
        { question: 'Design a parking lot system.', hint: 'Handle different vehicle types and availability.' },
        { question: 'Design an online bookstore.', hint: 'Cover inventory, orders, and payments.' },
        { question: 'Design a ride-sharing service like Uber.', hint: 'Match drivers with riders efficiently.' },
        { question: 'Design a food delivery app.', hint: 'Handle restaurants, orders, and delivery.' },
        { question: 'Design a hotel booking system.', hint: 'Manage rooms, reservations, and availability.' },
        { question: 'Design a movie ticket booking system.', hint: 'Handle seats, shows, and payments.' },
        { question: 'Design a library management system.', hint: 'Track books, members, and loans.' },
        { question: 'Design a job portal.', hint: 'Match candidates with jobs.' },
        { question: 'Design an online learning platform.', hint: 'Handle courses, videos, and progress.' },
        { question: 'Design a music streaming service.', hint: 'Cover playlists, recommendations, and streaming.' },
        { question: 'Design a social media feed.', hint: 'Rank and display posts efficiently.' },
        { question: 'Design a collaborative document editor.', hint: 'Handle real-time collaboration.' },
        { question: 'Design a video conferencing system.', hint: 'Handle multiple participants and quality.' }
      ],
      hard: [
        { question: 'Design YouTube.', hint: 'Cover video upload, processing, streaming, recommendations, and scale.' },
        { question: 'Design Netflix.', hint: 'Focus on video streaming, CDN, recommendations, and global scale.' },
        { question: 'Design WhatsApp.', hint: 'Handle billions of messages, end-to-end encryption, and real-time delivery.' },
        { question: 'Design Google Search.', hint: 'Cover crawling, indexing, ranking, and distributed processing.' },
        { question: 'Design Amazon.', hint: 'Handle inventory, orders, payments, recommendations at massive scale.' },
        { question: 'Design Facebook News Feed.', hint: 'Rank billions of posts, handle real-time updates, and personalization.' },
        { question: 'Design Dropbox.', hint: 'Handle file sync, conflict resolution, and storage at scale.' },
        { question: 'Design a distributed cache like Redis.', hint: 'Cover consistency, replication, and fault tolerance.' },
        { question: 'Design a rate limiting system for APIs.', hint: 'Handle millions of requests per second.' },
        { question: 'Design a global payment system.', hint: 'Handle transactions, fraud detection, and compliance.' },
        { question: 'Design a stock trading platform.', hint: 'Handle real-time data, low latency, and high throughput.' },
        { question: 'Design a distributed database.', hint: 'Cover sharding, replication, and consistency.' },
        { question: 'Design a recommendation engine.', hint: 'Handle personalization at scale with ML.' },
        { question: 'Design a distributed message queue.', hint: 'Ensure reliability, ordering, and scalability.' },
        { question: 'Design a monitoring and alerting system.', hint: 'Handle metrics from millions of servers.' }
      ]
    }
  }

  // Generate questions based on settings
  const generateQuestions = () => {
    const bank = questionBanks[interviewType as keyof typeof questionBanks][difficulty as keyof typeof questionBanks.behavioral]
    const shuffled = [...bank].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, questionCount).map((q, index) => ({
      id: index + 1,
      question: q.question,
      hint: q.hint
    }))
    setQuestions(selected)
  }

  useEffect(() => {
    generateQuestions()
  }, [interviewType, difficulty, questionCount])

  const startInterview = () => {
    generateQuestions()
    setIsInterviewActive(true)
    setCurrentQuestion(0)
    setAnswers([])
    toast.success(`Interview started! ${questionCount} questions to answer.`)
  }

  const endInterview = () => {
    setIsInterviewActive(false)
    toast.success(`Interview completed! You answered ${answers.length} questions.`)
  }

  const submitAnswer = () => {
    if (!userAnswer.trim()) {
      toast.error('Please provide an answer')
      return
    }

    setIsTyping(true)
    
    setTimeout(() => {
      setAnswers([...answers, userAnswer])
      setUserAnswer('')
      setIsTyping(false)
      
      if (currentQuestion < questions.length - 1) {
        toast.success('Answer submitted! Next question...')
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1)
        }, 1000)
      } else {
        toast.success('All questions answered!')
        setTimeout(() => {
          endInterview()
        }, 1500)
      }
    }, 1500)
  }

  const skipQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setUserAnswer('')
      toast('Question skipped')
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-8 h-8 text-accent-green" />
          <h1 className="text-4xl font-black">Mock Interview</h1>
        </div>
        <p className="text-text-secondary text-lg mb-8">
          Practice with AI interviewer - Text-based simulation
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Interview Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interview Status Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative p-8 bg-gradient-to-br from-accent-green/20 to-accent-cyan/20 rounded-2xl border border-accent-green/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-green/10 to-accent-cyan/10 animate-pulse" />
            
            <div className="relative z-10">
              {!isInterviewActive ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 rounded-full bg-accent-green/20 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-12 h-12 text-accent-green" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
                  <p className="text-text-secondary mb-8 max-w-md mx-auto">
                    This is a text-based AI interview simulation. Answer questions thoughtfully and get instant feedback.
                  </p>
                  <button
                    onClick={startInterview}
                    className="px-8 py-4 bg-accent-green text-white font-bold rounded-xl hover:bg-accent-green/90 transition-all hover:scale-105 flex items-center gap-2 mx-auto"
                  >
                    <Play className="w-5 h-5" />
                    Start Interview
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-accent-green animate-pulse" />
                      <span className="font-semibold">Interview in Progress</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <Clock className="w-4 h-4" />
                      <span>Question {currentQuestion + 1} of {questions.length}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-bg-tertiary rounded-full mb-6 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                      className="h-full bg-gradient-to-r from-accent-green to-accent-cyan"
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  {/* AI Question */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQuestion}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="mb-6"
                    >
                      <div className="flex items-start gap-4 p-6 bg-bg-secondary rounded-xl border border-border-subtle">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-accent-cyan font-semibold mb-2">AI Interviewer</div>
                          <p className="text-lg mb-3">{questions[currentQuestion].question}</p>
                          <div className="flex items-start gap-2 text-sm text-text-muted">
                            <span className="text-accent-yellow">💡</span>
                            <span>{questions[currentQuestion].hint}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Answer Input */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Your Answer</label>
                      <textarea
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type your answer here... Be specific and use examples."
                        rows={6}
                        className="w-full px-4 py-3 bg-bg-tertiary border border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan transition-colors resize-none"
                        disabled={isTyping}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-text-muted">
                          {userAnswer.length} characters
                        </span>
                        <span className="text-sm text-text-muted">
                          Aim for 100-300 words
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={submitAnswer}
                        disabled={isTyping || !userAnswer.trim()}
                        className="flex-1 px-6 py-3 bg-accent-cyan text-bg-primary font-bold rounded-xl hover:bg-accent-cyan/90 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                      >
                        {isTyping ? (
                          <>
                            <div className="w-5 h-5 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Submit Answer
                          </>
                        )}
                      </button>
                      
                      {currentQuestion < questions.length - 1 && (
                        <button
                          onClick={skipQuestion}
                          disabled={isTyping}
                          className="px-6 py-3 bg-bg-tertiary border border-border-subtle text-text-secondary font-semibold rounded-xl hover:border-border-accent transition-all disabled:opacity-50"
                        >
                          Skip
                        </button>
                      )}

                      <button
                        onClick={endInterview}
                        disabled={isTyping}
                        className="px-6 py-3 bg-accent-pink/10 text-accent-pink font-semibold rounded-xl hover:bg-accent-pink/20 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        <Square className="w-4 h-4" />
                        End
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Answered Questions */}
          {answers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-bg-secondary rounded-2xl border border-border-subtle"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent-green" />
                Answered Questions ({answers.length})
              </h3>
              <div className="space-y-3">
                {answers.map((answer, index) => (
                  <div key={index} className="p-4 bg-bg-tertiary rounded-xl">
                    <div className="text-sm text-text-muted mb-2">
                      Q{index + 1}: {questions[index].question}
                    </div>
                    <div className="text-sm text-text-secondary line-clamp-2">
                      {answer}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 bg-bg-secondary rounded-2xl border border-border-subtle"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Interview Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Interview Type</label>
                <select 
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  disabled={isInterviewActive}
                  className="w-full px-4 py-2 bg-bg-tertiary border border-border-subtle rounded-lg focus:outline-none focus:border-accent-cyan disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="behavioral">Behavioral</option>
                  <option value="technical">Technical</option>
                  <option value="system-design">System Design</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Difficulty</label>
                <select 
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  disabled={isInterviewActive}
                  className="w-full px-4 py-2 bg-bg-tertiary border border-border-subtle rounded-lg focus:outline-none focus:border-accent-cyan disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Number of Questions</label>
                <select 
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  disabled={isInterviewActive}
                  className="w-full px-4 py-2 bg-bg-tertiary border border-border-subtle rounded-lg focus:outline-none focus:border-accent-cyan disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value={5}>5 questions</option>
                  <option value={10}>10 questions</option>
                  <option value={15}>15 questions</option>
                </select>
              </div>

              {!isInterviewActive && (
                <div className="p-3 bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg">
                  <p className="text-sm text-accent-cyan">
                    <strong>Selected:</strong> {questionCount} {interviewType} questions ({difficulty})
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-gradient-to-br from-accent-green/20 to-accent-cyan/20 rounded-2xl border border-accent-green/30"
          >
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-cyan" />
              Interview Tips
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-accent-green mt-1">✓</span>
                <span>Use the STAR method for behavioral questions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-green mt-1">✓</span>
                <span>Be specific and use real examples</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-green mt-1">✓</span>
                <span>Take your time to think before answering</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-green mt-1">✓</span>
                <span>Aim for 100-300 words per answer</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-green mt-1">✓</span>
                <span>Show enthusiasm and confidence</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-bg-secondary rounded-2xl border border-border-subtle"
          >
            <h3 className="font-bold mb-3">Your Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Interviews Completed</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Average Score</span>
                <span className="font-semibold text-accent-green">85%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Total Questions</span>
                <span className="font-semibold">60</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default MockInterview
