import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Database, Search, Building2, Code, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

const QuestionBank = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  const companies = ['All', 'Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Uber']
  const difficulties = ['All', 'Easy', 'Medium', 'Hard']
  
  const allQuestions = [
    // Google Questions
    {
      id: 1,
      company: 'Google',
      question: 'Implement LRU Cache',
      difficulty: 'Hard',
      category: 'Data Structures',
      asked: '2024',
      description: 'Design and implement a data structure for Least Recently Used (LRU) cache.',
      link: 'https://leetcode.com/problems/lru-cache/'
    },
    {
      id: 2,
      company: 'Google',
      question: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      category: 'Strings',
      asked: '2024',
      description: 'Find the length of the longest substring without repeating characters.',
      link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/'
    },
    {
      id: 3,
      company: 'Google',
      question: 'Merge K Sorted Lists',
      difficulty: 'Hard',
      category: 'Linked Lists',
      asked: '2024',
      description: 'Merge k sorted linked lists and return it as one sorted list.',
      link: 'https://leetcode.com/problems/merge-k-sorted-lists/'
    },
    
    // Amazon Questions
    {
      id: 4,
      company: 'Amazon',
      question: 'Two Sum',
      difficulty: 'Easy',
      category: 'Arrays',
      asked: '2024',
      description: 'Given an array of integers, return indices of two numbers that add up to target.',
      link: 'https://leetcode.com/problems/two-sum/'
    },
    {
      id: 5,
      company: 'Amazon',
      question: 'Trapping Rain Water',
      difficulty: 'Hard',
      category: 'Arrays',
      asked: '2024',
      description: 'Calculate how much water can be trapped after raining.',
      link: 'https://leetcode.com/problems/trapping-rain-water/'
    },
    {
      id: 6,
      company: 'Amazon',
      question: 'Number of Islands',
      difficulty: 'Medium',
      category: 'Graphs',
      asked: '2024',
      description: 'Count the number of islands in a 2D grid.',
      link: 'https://leetcode.com/problems/number-of-islands/'
    },
    
    // Microsoft Questions
    {
      id: 7,
      company: 'Microsoft',
      question: 'Design a URL Shortener',
      difficulty: 'Medium',
      category: 'System Design',
      asked: '2024',
      description: 'Design a URL shortening service like bit.ly.',
      link: 'https://leetcode.com/discuss/interview-question/system-design/'
    },
    {
      id: 8,
      company: 'Microsoft',
      question: 'Reverse Linked List',
      difficulty: 'Easy',
      category: 'Linked Lists',
      asked: '2024',
      description: 'Reverse a singly linked list.',
      link: 'https://leetcode.com/problems/reverse-linked-list/'
    },
    {
      id: 9,
      company: 'Microsoft',
      question: 'Word Search',
      difficulty: 'Medium',
      category: 'Backtracking',
      asked: '2024',
      description: 'Find if a word exists in a 2D board.',
      link: 'https://leetcode.com/problems/word-search/'
    },
    
    // Meta Questions
    {
      id: 10,
      company: 'Meta',
      question: 'Binary Tree Level Order Traversal',
      difficulty: 'Medium',
      category: 'Trees',
      asked: '2024',
      description: 'Return the level order traversal of a binary tree.',
      link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/'
    },
    {
      id: 11,
      company: 'Meta',
      question: 'Valid Parentheses',
      difficulty: 'Easy',
      category: 'Stack',
      asked: '2024',
      description: 'Determine if the input string has valid parentheses.',
      link: 'https://leetcode.com/problems/valid-parentheses/'
    },
    {
      id: 12,
      company: 'Meta',
      question: 'Clone Graph',
      difficulty: 'Medium',
      category: 'Graphs',
      asked: '2024',
      description: 'Return a deep copy of an undirected graph.',
      link: 'https://leetcode.com/problems/clone-graph/'
    },
    
    // Apple Questions
    {
      id: 13,
      company: 'Apple',
      question: 'Maximum Subarray',
      difficulty: 'Easy',
      category: 'Dynamic Programming',
      asked: '2024',
      description: 'Find the contiguous subarray with the largest sum.',
      link: 'https://leetcode.com/problems/maximum-subarray/'
    },
    {
      id: 14,
      company: 'Apple',
      question: 'Serialize and Deserialize Binary Tree',
      difficulty: 'Hard',
      category: 'Trees',
      asked: '2024',
      description: 'Design an algorithm to serialize and deserialize a binary tree.',
      link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/'
    },
    {
      id: 15,
      company: 'Apple',
      question: 'Product of Array Except Self',
      difficulty: 'Medium',
      category: 'Arrays',
      asked: '2024',
      description: 'Return an array where each element is the product of all other elements.',
      link: 'https://leetcode.com/problems/product-of-array-except-self/'
    },
    
    // Netflix Questions
    {
      id: 16,
      company: 'Netflix',
      question: 'Design Netflix',
      difficulty: 'Hard',
      category: 'System Design',
      asked: '2024',
      description: 'Design a video streaming service like Netflix.',
      link: 'https://leetcode.com/discuss/interview-question/system-design/'
    },
    {
      id: 17,
      company: 'Netflix',
      question: 'Top K Frequent Elements',
      difficulty: 'Medium',
      category: 'Heap',
      asked: '2024',
      description: 'Find the k most frequent elements in an array.',
      link: 'https://leetcode.com/problems/top-k-frequent-elements/'
    },
    
    // Uber Questions
    {
      id: 18,
      company: 'Uber',
      question: 'Design Uber',
      difficulty: 'Hard',
      category: 'System Design',
      asked: '2024',
      description: 'Design a ride-sharing service like Uber.',
      link: 'https://leetcode.com/discuss/interview-question/system-design/'
    },
    {
      id: 19,
      company: 'Uber',
      question: 'Meeting Rooms II',
      difficulty: 'Medium',
      category: 'Intervals',
      asked: '2024',
      description: 'Find the minimum number of conference rooms required.',
      link: 'https://leetcode.com/problems/meeting-rooms-ii/'
    },
    {
      id: 20,
      company: 'Uber',
      question: 'Sliding Window Maximum',
      difficulty: 'Hard',
      category: 'Sliding Window',
      asked: '2024',
      description: 'Find the maximum value in each sliding window of size k.',
      link: 'https://leetcode.com/problems/sliding-window-maximum/'
    },
  ]

  // Filter questions based on search, company, and difficulty
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           q.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           q.company.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCompany = selectedCompany === 'all' || 
                            q.company.toLowerCase() === selectedCompany.toLowerCase()
      
      const matchesDifficulty = selectedDifficulty === 'all' || 
                               q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
      
      return matchesSearch && matchesCompany && matchesDifficulty
    })
  }, [searchQuery, selectedCompany, selectedDifficulty, allQuestions])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-accent-green'
      case 'Medium': return 'text-accent-yellow'
      case 'Hard': return 'text-accent-pink'
      default: return 'text-text-secondary'
    }
  }

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-accent-green/10 border-accent-green/30'
      case 'Medium': return 'bg-accent-yellow/10 border-accent-yellow/30'
      case 'Hard': return 'bg-accent-pink/10 border-accent-pink/30'
      default: return 'bg-bg-tertiary border-border-subtle'
    }
  }

  const handleSolve = (question: typeof allQuestions[0]) => {
    toast.success(`Opening ${question.question}...`)
    // Open in new tab
    window.open(question.link, '_blank')
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Database className="w-8 h-8 text-accent-purple" />
          <h1 className="text-4xl font-black">Question Bank</h1>
        </div>
        <p className="text-text-secondary text-lg mb-8">
          Company-specific interview questions from real candidates
        </p>
      </motion.div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search questions, categories, or companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-bg-secondary border border-border-subtle rounded-xl focus:outline-none focus:border-accent-cyan transition-colors"
          />
        </div>

        {/* Company Filter */}
        <div>
          <label className="block text-sm font-semibold mb-2">Filter by Company</label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {companies.map((company) => (
              <button
                key={company}
                onClick={() => setSelectedCompany(company.toLowerCase())}
                className={`px-6 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedCompany === company.toLowerCase()
                    ? 'bg-accent-purple text-white scale-105'
                    : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary border border-border-subtle'
                }`}
              >
                {company}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-semibold mb-2">Filter by Difficulty</label>
          <div className="flex gap-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty.toLowerCase())}
                className={`px-6 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedDifficulty === difficulty.toLowerCase()
                    ? difficulty === 'Easy' ? 'bg-accent-green text-white' :
                      difficulty === 'Medium' ? 'bg-accent-yellow text-bg-primary' :
                      difficulty === 'Hard' ? 'bg-accent-pink text-white' :
                      'bg-accent-cyan text-white'
                    : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary border border-border-subtle'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-muted">
            Showing {filteredQuestions.length} of {allQuestions.length} questions
          </p>
          {(searchQuery || selectedCompany !== 'all' || selectedDifficulty !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCompany('all')
                setSelectedDifficulty('all')
              }}
              className="text-sm text-accent-cyan hover:text-accent-cyan/80 font-semibold"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Questions Grid */}
      {filteredQuestions.length > 0 ? (
        <div className="grid gap-4">
          {filteredQuestions.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              className="p-6 bg-bg-secondary rounded-2xl border border-border-subtle hover:border-border-accent transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <div className="px-3 py-1 bg-bg-tertiary rounded-lg text-sm font-semibold flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {q.company}
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getDifficultyBg(q.difficulty)}`}>
                      <span className={getDifficultyColor(q.difficulty)}>{q.difficulty}</span>
                    </div>
                    <span className="text-sm text-text-muted">{q.asked}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-accent-cyan transition-colors">
                    {q.question}
                  </h3>
                  
                  <p className="text-sm text-text-secondary mb-3">
                    {q.description}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-text-muted" />
                    <span className="text-sm text-text-secondary">{q.category}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleSolve(q)}
                  className="px-6 py-3 bg-accent-cyan text-bg-primary font-semibold rounded-xl hover:bg-accent-cyan/90 transition-all hover:scale-105 flex items-center gap-2 flex-shrink-0"
                >
                  Solve
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Database className="w-16 h-16 mx-auto mb-4 text-text-muted" />
          <h3 className="text-2xl font-bold mb-2">No Questions Found</h3>
          <p className="text-text-secondary mb-6">
            Try adjusting your filters or search query
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCompany('all')
              setSelectedDifficulty('all')
            }}
            className="px-6 py-3 bg-accent-purple text-white font-semibold rounded-xl hover:bg-accent-purple/90 transition-all"
          >
            Clear All Filters
          </button>
        </motion.div>
      )}

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-6 bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 rounded-2xl border border-accent-purple/30"
      >
        <h3 className="text-xl font-bold mb-4">Your Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-black text-accent-green mb-1">12</div>
            <div className="text-sm text-text-muted">Solved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-accent-yellow mb-1">8</div>
            <div className="text-sm text-text-muted">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-accent-cyan mb-1">5</div>
            <div className="text-sm text-text-muted">Companies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-accent-pink mb-1">85%</div>
            <div className="text-sm text-text-muted">Success Rate</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default QuestionBank
