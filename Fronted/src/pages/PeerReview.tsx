import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, ThumbsUp, MessageSquare, Star, Upload, Send, X, Edit2, Save, FileText, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

interface Submission {
  id: number
  userId: string
  userName: string
  userAvatar: string
  fileName: string
  description: string
  submittedAt: string
  reviewCount: number
  avgRating: number
}

interface Review {
  id: number
  submissionId: number
  author: string
  avatar: string
  rating: number
  date: string
  timestamp: number
  comment: string
  likes: number
  replies: Reply[]
}

interface Reply {
  id: number
  author: string
  text: string
  date: string
}

const PeerReview = () => {
  // User Profile
  const [userName, setUserName] = useState('Student User')
  const [userEmail, setUserEmail] = useState('student@example.com')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [tempName, setTempName] = useState(userName)
  const [tempEmail, setTempEmail] = useState(userEmail)

  // File Upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [showSubmitModal, setShowSubmitModal] = useState(false)

  // Submissions
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([
    {
      id: 1,
      userId: 'current-user',
      userName: 'Student User',
      userAvatar: 'SU',
      fileName: 'Resume_2026.pdf',
      description: 'Looking for feedback on my technical skills section and project descriptions.',
      submittedAt: '1 day ago',
      reviewCount: 2,
      avgRating: 4.8
    }
  ])

  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([
    {
      id: 2,
      userId: 'user-2',
      userName: 'Priya Sharma',
      userAvatar: 'PS',
      fileName: 'Priya_Resume.pdf',
      description: 'Need help with formatting and making it more ATS-friendly.',
      submittedAt: '2 hours ago',
      reviewCount: 1,
      avgRating: 4.5
    },
    {
      id: 3,
      userId: 'user-3',
      userName: 'Rahul Kumar',
      userAvatar: 'RK',
      fileName: 'Rahul_CV.pdf',
      description: 'First resume, any feedback appreciated!',
      submittedAt: '5 hours ago',
      reviewCount: 2,
      avgRating: 4.0
    },
    {
      id: 4,
      userId: 'user-4',
      userName: 'Sneha Patel',
      userAvatar: 'SP',
      fileName: 'Sneha_Resume.pdf',
      description: 'Applying for frontend roles, need feedback on projects section.',
      submittedAt: '1 day ago',
      reviewCount: 4,
      avgRating: 4.7
    }
  ])

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      submissionId: 1,
      author: 'Alex Kumar',
      avatar: 'AK',
      rating: 4.5,
      date: '2 days ago',
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
      comment: 'Great resume! Your project descriptions are very detailed. Consider adding more quantifiable achievements.',
      likes: 12,
      replies: []
    },
    {
      id: 2,
      submissionId: 1,
      author: 'Priya Singh',
      avatar: 'PS',
      rating: 5,
      date: '3 days ago',
      timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
      comment: 'Excellent formatting and structure. The technical skills section is well-organized.',
      likes: 8,
      replies: []
    }
  ])

  // UI State
  const [sortBy, setSortBy] = useState('recent')
  const [likedReviews, setLikedReviews] = useState<number[]>([])
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [activeTab, setActiveTab] = useState<'browse' | 'my-submissions'>('browse')
  const [viewingSubmission, setViewingSubmission] = useState<number | null>(null)
  
  // Review Form
  const [reviewingSubmission, setReviewingSubmission] = useState<number | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB')
        return
      }
      const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      const isAllowedExtension = ['pdf', 'doc', 'docx'].includes(fileExtension || '')
      
      if (!allowedTypes.includes(file.type) && !isAllowedExtension) {
        toast.error('Only PDF, DOC, and DOCX files are allowed')
        return
      }
      setSelectedFile(file)
      toast.success('File selected successfully!')
    }
  }

  const handleSubmit = () => {
    if (!selectedFile) {
      toast.error('Please select a file first')
      return
    }
    setShowSubmitModal(true)
  }

  const confirmSubmit = () => {
    const newSubmission: Submission = {
      id: Date.now(),
      userId: 'current-user',
      userName: userName,
      userAvatar: userName.split(' ').map(n => n[0]).join(''),
      fileName: selectedFile!.name,
      description: description || 'No description provided',
      submittedAt: 'Just now',
      reviewCount: 0,
      avgRating: 0
    }
    
    setMySubmissions([newSubmission, ...mySubmissions])
    setAllSubmissions([newSubmission, ...allSubmissions])
    toast.success('Resume submitted for peer review!')
    setSelectedFile(null)
    setDescription('')
    setShowSubmitModal(false)
  }

  const handleSaveProfile = () => {
    setUserName(tempName)
    setUserEmail(tempEmail)
    setIsEditingProfile(false)
    toast.success('Profile updated!')
  }

  const handleLike = (reviewId: number) => {
    if (likedReviews.includes(reviewId)) {
      setLikedReviews(likedReviews.filter(id => id !== reviewId))
      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, likes: r.likes - 1 } : r
      ))
      toast('Like removed')
    } else {
      setLikedReviews([...likedReviews, reviewId])
      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, likes: r.likes + 1 } : r
      ))
      toast.success('Liked!')
    }
  }

  const handleReply = (reviewId: number) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply')
      return
    }
    setReviews(reviews.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          replies: [...r.replies, {
            id: Date.now(),
            author: userName,
            text: replyText,
            date: 'Just now'
          }]
        }
      }
      return r
    }))
    toast.success('Reply posted!')
    setReplyText('')
    setReplyingTo(null)
  }

  const handleSubmitReview = (submissionId: number) => {
    if (!reviewComment.trim()) {
      toast.error('Please write a review comment')
      return
    }

    const newReview: Review = {
      id: Date.now(),
      submissionId,
      author: userName,
      avatar: userName.split(' ').map(n => n[0]).join(''),
      rating: reviewRating,
      date: 'Just now',
      timestamp: Date.now(),
      comment: reviewComment,
      likes: 0,
      replies: []
    }

    setReviews([newReview, ...reviews])
    
    const updateCount = (list: Submission[]) =>
      list.map(s => 
        s.id === submissionId 
          ? { ...s, reviewCount: s.reviewCount + 1, avgRating: ((s.avgRating * s.reviewCount) + reviewRating) / (s.reviewCount + 1) }
          : s
      )
    setAllSubmissions(updateCount(allSubmissions))
    setMySubmissions(updateCount(mySubmissions))

    toast.success('Review submitted!')
    setReviewingSubmission(null)
    setReviewComment('')
    setReviewRating(5)
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.timestamp - a.timestamp
      case 'highest':
        return b.rating - a.rating
      case 'helpful':
        return b.likes - a.likes
      default:
        return 0
    }
  })

  const getInitials = (nameStr: string) => {
    return nameStr.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen text-[#F8FAFC] transition-colors relative">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-[#14B8A6]" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F8FAFC]">Peer Review</h1>
        </div>
        <p className="text-[#94A3B8] text-sm sm:text-base lg:text-lg">
          Get feedback from the community and help others improve
        </p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8 p-4 sm:p-6 bg-[#111827] rounded-3xl border border-[#334155] shadow-sm transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#1F2937] border border-[#334155] flex items-center justify-center text-[#F8FAFC] font-bold text-lg sm:text-xl shrink-0">
              {getInitials(userName)}
            </div>
            <div className="flex-1">
              {isEditingProfile ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1F2937] border border-[#334155] rounded-xl focus:outline-none focus:border-[#14B8A6] text-sm text-[#F8FAFC]"
                    placeholder="Your Name"
                  />
                  <input
                    type="email"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1F2937] border border-[#334155] rounded-xl focus:outline-none focus:border-[#14B8A6] text-sm text-[#F8FAFC]"
                    placeholder="Your Email"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-lg sm:text-xl font-semibold text-[#F8FAFC]">{userName}</h2>
                  <p className="text-sm text-[#94A3B8]">{userEmail}</p>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto shrink-0">
            {isEditingProfile ? (
              <>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 sm:flex-none px-4 py-2 bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#111827] font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditingProfile(false)
                    setTempName(userName)
                    setTempEmail(userEmail)
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 bg-[#111827] border border-[#334155] text-[#F8FAFC] font-semibold rounded-xl hover:bg-[#1F2937] active:scale-[0.98] transition-all text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="flex-1 sm:flex-none px-4 py-2 bg-[#111827] border border-[#334155] text-[#F8FAFC] font-semibold rounded-xl hover:bg-[#1F2937] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Edit2 className="w-4 h-4 text-[#14B8A6]" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* TWO-COLUMN GRID */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Upload Section - Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="p-4 sm:p-6 bg-[#111827] border border-[#334155] rounded-3xl lg:sticky lg:top-8 shadow-sm">
            <h2 className="text-lg font-semibold text-[#F8FAFC] mb-4">Submit for Review</h2>
            
            <label className="block cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
                selectedFile 
                  ? 'border-[#14B8A6] bg-[#14B8A6]/5' 
                  : 'border-[#334155] hover:border-[#14B8A6] hover:bg-white/[0.02]'
              }`}>
                <Upload className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 transition-colors ${
                  selectedFile ? 'text-[#14B8A6]' : 'text-[#94A3B8]'
                }`} />
                <p className="text-sm font-semibold mb-1 text-[#F8FAFC]">
                  {selectedFile ? selectedFile.name : 'Click to upload resume'}
                </p>
                <p className="text-xs text-[#94A3B8]">
                  {selectedFile 
                    ? `${(selectedFile.size / 1024).toFixed(1)} KB` 
                    : 'PDF, DOC, DOCX (Max 5MB)'}
                </p>
              </div>
            </label>

            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4"
              >
                <label className="block text-sm font-semibold text-[#94A3B8] mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any specific areas you'd like feedback on..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[#1F2937] border border-[#334155] rounded-xl focus:outline-none focus:border-[#14B8A6] text-[#F8FAFC] transition-colors resize-none text-sm placeholder-[#94A3B8]/50"
                />
              </motion.div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!selectedFile}
              className="w-full mt-4 px-6 py-3 bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#111827] font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base shadow-sm"
            >
              Submit for Review
            </button>

            <div className="mt-6 p-4 bg-[#1F2937]/50 border border-[#334155] rounded-2xl">
              <h3 className="font-semibold mb-3 text-sm text-[#F8FAFC]">Community Stats</h3>
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#94A3B8]">Active Reviewers</span>
                  <span className="font-bold text-[#F8FAFC]">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#94A3B8]">Reviews Today</span>
                  <span className="font-bold text-[#F8FAFC]">89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#94A3B8]">Avg Response Time</span>
                  <span className="font-bold text-[#14B8A6]">2 hours</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content - Tabs and Submissions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Tabs */}
          <div className="flex gap-2 sm:gap-4 border-b border-[#334155]">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 sm:px-6 py-3 font-semibold transition-all text-sm sm:text-base relative ${
                activeTab === 'browse'
                  ? 'text-[#14B8A6] font-bold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {activeTab === 'browse' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#14B8A6]"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
              Browse Submissions ({allSubmissions.length})
            </button>
            <button
              onClick={() => setActiveTab('my-submissions')}
              className={`px-4 sm:px-6 py-3 font-semibold transition-all text-sm sm:text-base relative ${
                activeTab === 'my-submissions'
                  ? 'text-[#14B8A6] font-bold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {activeTab === 'my-submissions' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#14B8A6]"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
              My Submissions ({mySubmissions.length})
            </button>
          </div>

          {/* Browse Submissions Tab */}
          <AnimatePresence mode="wait">
            {activeTab === 'browse' && (
              <motion.div
                key="browse-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {allSubmissions.map((submission, index) => (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -2, scale: 1.01, transition: { duration: 0.2 } }}
                    className="p-4 sm:p-6 bg-[#111827] rounded-3xl border border-[#334155] hover:border-[#14B8A6]/30 shadow-sm transition-all duration-300 relative group"
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#1F2937] border border-[#334155] flex items-center justify-center text-[#F8FAFC] font-bold shrink-0 uppercase text-sm">
                        {submission.userAvatar}
                      </div>
                      
                      <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-semibold text-base sm:text-lg text-[#F8FAFC] group-hover:text-[#14B8A6] transition-colors">{submission.userName}</h3>
                            <p className="text-xs text-[#94A3B8]">{submission.submittedAt}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < Math.floor(submission.avgRating)
                                      ? 'fill-yellow-500 text-yellow-500'
                                      : 'text-slate-700'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-[#94A3B8]">
                              ({submission.reviewCount} reviews)
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-200">
                          <FileText className="w-4 h-4 text-[#14B8A6]" />
                          <span>{submission.fileName}</span>
                        </div>
                        
                        <p className="text-sm text-[#94A3B8] mb-4 leading-relaxed">
                          {submission.description}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <button
                            onClick={() => setReviewingSubmission(submission.id)}
                            className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#111827] font-bold rounded-xl active:scale-[0.98] transition-all text-sm shadow-sm"
                          >
                            Review This
                          </button>
                          <button
                            onClick={() => setViewingSubmission(submission.id)}
                            className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-[#111827] border border-[#334155] text-[#F8FAFC] font-semibold rounded-xl hover:bg-[#1F2937] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
                          >
                            <Eye className="w-4 h-4 text-[#14B8A6]" />
                            View Reviews
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* My Submissions Tab */}
            {activeTab === 'my-submissions' && (
              <motion.div
                key="my-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {mySubmissions.length === 0 ? (
                  <div className="p-8 sm:p-12 bg-[#111827] rounded-3xl border border-[#334155] text-center shadow-sm">
                    <Upload className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-[#94A3B8]" />
                    <h3 className="text-lg font-semibold mb-2 text-[#F8FAFC]">No Submissions Yet</h3>
                    <p className="text-sm text-[#94A3B8]">
                      Upload your resume to get feedback from the community
                    </p>
                  </div>
                ) : (
                  mySubmissions.map((submission, index) => (
                    <motion.div
                      key={submission.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -2, scale: 1.01, transition: { duration: 0.2 } }}
                      className="p-4 sm:p-6 bg-[#111827] rounded-3xl border border-[#334155] hover:border-[#14B8A6]/30 shadow-sm transition-all duration-300 relative group"
                    >
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#1F2937] border border-[#334155] flex items-center justify-center text-[#F8FAFC] font-bold shrink-0 uppercase text-sm">
                          {submission.userAvatar}
                        </div>
                        
                        <div className="flex-1 w-full">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-semibold text-base sm:text-lg text-[#F8FAFC] group-hover:text-[#14B8A6] transition-colors">{submission.userName}</h3>
                              <p className="text-xs text-[#94A3B8]">{submission.submittedAt}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${
                                      i < Math.floor(submission.avgRating)
                                        ? 'fill-yellow-500 text-yellow-500'
                                        : 'text-slate-800'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-[#94A3B8]">
                                ({submission.reviewCount} reviews)
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-200">
                            <FileText className="w-4 h-4 text-[#14B8A6]" />
                            <span>{submission.fileName}</span>
                          </div>
                          
                          <p className="text-sm text-[#94A3B8] mb-4 leading-relaxed">
                            {submission.description}
                          </p>
                          
                          <button
                            onClick={() => setViewingSubmission(submission.id)}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-[#111827] border border-[#334155] text-[#F8FAFC] font-semibold rounded-xl hover:bg-[#1F2937] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs"
                          >
                            <Eye className="w-4 h-4 text-[#14B8A6]" />
                            View Reviews ({submission.reviewCount})
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reviews Display Section */}
          {viewingSubmission && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 sm:p-6 bg-[#111827] rounded-3xl border border-[#334155] shadow-lg relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-[#F8FAFC] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#14B8A6]" />
                  Reviews
                </h2>
                <button
                  onClick={() => setViewingSubmission(null)}
                  className="p-2 hover:bg-[#1F2937] text-[#94A3B8] hover:text-[#F8FAFC] rounded-xl transition-all border border-[#334155]/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#334155]">
                <p className="text-xs font-semibold text-[#94A3B8]">
                  {sortedReviews.filter(r => r.submissionId === viewingSubmission).length} reviews
                </p>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 bg-[#1F2937] border border-[#334155] rounded-xl text-xs font-bold text-slate-300 focus:outline-none focus:border-[#14B8A6] cursor-pointer"
                >
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rated</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>

              <div className="space-y-4">
                {sortedReviews
                  .filter(review => review.submissionId === viewingSubmission)
                  .map((review) => (
                    <div
                      key={review.id}
                      className="p-4 bg-[#1F2937]/40 rounded-2xl border border-[#334155]/50 hover:border-[#334155] transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1F2937] border border-[#334155] flex items-center justify-center text-[#F8FAFC] font-extrabold text-xs shrink-0 uppercase">
                          {review.avatar}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                            <div>
                              <h3 className="font-bold text-sm text-[#F8FAFC]">{review.author}</h3>
                              <p className="text-[10px] text-[#94A3B8] mt-0.5">{review.date}</p>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < Math.floor(review.rating)
                                      ? 'fill-yellow-500 text-yellow-500'
                                      : 'text-slate-800'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <p className="text-sm text-[#94A3B8] mb-3 leading-relaxed break-words">{review.comment}</p>
                          
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => handleLike(review.id)}
                              className={`flex items-center gap-1.5 text-xs font-semibold transition-all ${
                                likedReviews.includes(review.id)
                                  ? 'text-[#0EA5E9]'
                                  : 'text-[#94A3B8] hover:text-[#0EA5E9]'
                              }`}
                            >
                              <ThumbsUp className={`w-3.5 h-3.5 ${
                                likedReviews.includes(review.id) ? 'fill-[#0EA5E9]' : ''
                              }`} />
                              <span>{review.likes}</span>
                            </button>
                            <button 
                              onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                              className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#14B8A6] font-semibold transition-all"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Reply</span>
                            </button>
                          </div>

                          {/* Replies */}
                          {review.replies && review.replies.length > 0 && (
                            <div className="mt-3.5 space-y-2.5 pl-4 border-l border-[#334155]">
                              {review.replies.map((reply) => (
                                <div key={reply.id} className="bg-[#111827] p-2.5 rounded-xl border border-[#334155]/60">
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-bold text-[#F8FAFC]">{reply.author}</p>
                                    <p className="text-[10px] text-[#94A3B8]">{reply.date}</p>
                                  </div>
                                  <p className="text-xs text-[#94A3B8]">{reply.text}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply Box */}
                          <AnimatePresence>
                            {replyingTo === review.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3"
                              >
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="flex-1 px-3 py-1.5 bg-[#111827] border border-[#334155] rounded-xl focus:outline-none focus:border-[#14B8A6] text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        handleReply(review.id)
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => handleReply(review.id)}
                                    className="px-3 py-1.5 bg-[#14B8A6] text-[#111827] font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* SUBMIT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSubmitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111827] border border-[#334155] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center mx-auto mb-4 text-[#14B8A6]">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#F8FAFC]">Submit Resume?</h3>
                <p className="text-sm text-[#94A3B8] mb-6 leading-relaxed">
                  Your resume will be shared with the community for peer review. You'll receive feedback within 24 hours.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 px-4 py-2 bg-[#1F2937] border border-[#334155] text-[#F8FAFC] font-semibold rounded-xl hover:bg-[#1F2937]/80 active:scale-[0.98] transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSubmit}
                    className="flex-1 px-4 py-2 bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#111827] font-bold rounded-xl active:scale-[0.98] transition-all text-sm shadow-md"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REVIEW FORM MODAL */}
      <AnimatePresence>
        {reviewingSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setReviewingSubmission(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111827] border border-[#334155] rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#F8FAFC]">Write a Review</h3>
                <button
                  onClick={() => setReviewingSubmission(null)}
                  className="p-2 hover:bg-[#1F2937] text-[#94A3B8] hover:text-[#F8FAFC] rounded-xl transition-all border border-[#334155]/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Rating Stars */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#94A3B8] mb-3 select-none">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="transition-all hover:scale-110 duration-150"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= reviewRating
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-slate-800 hover:text-yellow-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#94A3B8] mb-2">Your Review</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your feedback on the resume. Be constructive and specific..."
                  rows={6}
                  className="w-full px-4 py-3 bg-[#1F2937] border border-[#334155] rounded-xl focus:outline-none focus:border-[#14B8A6] text-[#F8FAFC] transition-colors resize-none text-xs sm:text-sm placeholder-[#94A3B8]/60"
                />
                <p className="text-xs text-[#94A3B8] mt-2 font-medium">
                  {reviewComment.length} characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  onClick={() => setReviewingSubmission(null)}
                  className="flex-1 px-4 py-2.5 bg-[#1F2937] border border-[#334155] text-[#F8FAFC] font-semibold rounded-xl hover:bg-[#1F2937]/80 active:scale-[0.98] transition-all text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmitReview(reviewingSubmission)}
                  disabled={!reviewComment.trim()}
                  className="flex-1 px-4 py-2.5 bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#111827] font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-xs sm:text-sm shadow-md"
                >
                  Submit Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PeerReview
