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
      fileName: 'Resume_2024.pdf',
      description: 'Looking for feedback on my technical skills section and project descriptions.',
      submittedAt: '1 day ago',
      reviewCount: 3,
      avgRating: 4.3
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
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
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

  const handleReply = (_reviewId: number) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply')
      return
    }
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
    
    // Update submission review count
    setAllSubmissions(allSubmissions.map(s => 
      s.id === submissionId 
        ? { ...s, reviewCount: s.reviewCount + 1, avgRating: ((s.avgRating * s.reviewCount) + reviewRating) / (s.reviewCount + 1) }
        : s
    ))

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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-accent-pink" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black">Peer Review</h1>
        </div>
        <p className="text-text-secondary text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
          Get feedback from the community and help others improve
        </p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8 p-4 sm:p-6 bg-bg-secondary rounded-2xl border border-border-subtle"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0">
              {getInitials(userName)}
            </div>
            <div className="flex-1">
              {isEditingProfile ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-tertiary border border-border-subtle rounded-lg focus:outline-none focus:border-accent-pink text-sm"
                    placeholder="Your Name"
                  />
                  <input
                    type="email"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-tertiary border border-border-subtle rounded-lg focus:outline-none focus:border-accent-pink text-sm"
                    placeholder="Your Email"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-lg sm:text-xl font-bold">{userName}</h2>
                  <p className="text-sm text-text-muted">{userEmail}</p>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {isEditingProfile ? (
              <>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 sm:flex-none px-4 py-2 bg-accent-pink text-white font-semibold rounded-lg hover:bg-accent-pink/90 transition-all flex items-center justify-center gap-2 text-sm"
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
                  className="flex-1 sm:flex-none px-4 py-2 bg-bg-tertiary text-text-primary font-semibold rounded-lg hover:bg-bg-tertiary/70 transition-all text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="flex-1 sm:flex-none px-4 py-2 bg-bg-tertiary text-text-primary font-semibold rounded-lg hover:bg-bg-tertiary/70 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Upload Section - Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="p-4 sm:p-6 bg-bg-secondary rounded-2xl border border-border-subtle lg:sticky lg:top-8">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Submit for Review</h2>
            
            <label className="block cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all ${
                selectedFile 
                  ? 'border-accent-pink bg-accent-pink/10' 
                  : 'border-border-subtle hover:border-accent-pink'
              }`}>
                <Upload className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 ${
                  selectedFile ? 'text-accent-pink' : 'text-text-muted'
                }`} />
                <p className="text-sm font-semibold mb-1">
                  {selectedFile ? selectedFile.name : 'Click to upload resume'}
                </p>
                <p className="text-xs text-text-muted">
                  {selectedFile 
                    ? `${(selectedFile.size / 1024).toFixed(1)} KB` 
                    : 'PDF, DOC, DOCX (Max 5MB)'}
                </p>
              </div>
            </label>

            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <label className="block text-sm font-semibold mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any specific areas you'd like feedback on..."
                  rows={3}
                  className="w-full px-4 py-3 bg-bg-tertiary border border-border-subtle rounded-xl focus:outline-none focus:border-accent-pink transition-colors resize-none text-sm"
                />
              </motion.div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!selectedFile}
              className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-accent-pink to-accent-purple text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-accent-pink/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
            >
              Submit for Review
            </button>

            <div className="mt-6 p-4 bg-bg-tertiary rounded-xl">
              <h3 className="font-semibold mb-2 text-sm">Community Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Active Reviewers</span>
                  <span className="font-semibold">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Reviews Today</span>
                  <span className="font-semibold">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Avg Response Time</span>
                  <span className="font-semibold">2 hours</span>
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
          <div className="flex gap-2 sm:gap-4 border-b border-border-subtle">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 sm:px-6 py-3 font-semibold transition-all text-sm sm:text-base ${
                activeTab === 'browse'
                  ? 'text-accent-pink border-b-2 border-accent-pink'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Browse Submissions ({allSubmissions.length})
            </button>
            <button
              onClick={() => setActiveTab('my-submissions')}
              className={`px-4 sm:px-6 py-3 font-semibold transition-all text-sm sm:text-base ${
                activeTab === 'my-submissions'
                  ? 'text-accent-pink border-b-2 border-accent-pink'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              My Submissions ({mySubmissions.length})
            </button>
          </div>

          {/* Browse Submissions Tab */}
          {activeTab === 'browse' && (
            <div className="space-y-4">
              {allSubmissions.map((submission, index) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 sm:p-6 bg-bg-secondary rounded-2xl border border-border-subtle hover:border-border-accent transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-white font-bold flex-shrink-0">
                      {submission.userAvatar}
                    </div>
                    
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-bold text-base sm:text-lg">{submission.userName}</h3>
                          <p className="text-xs sm:text-sm text-text-muted">{submission.submittedAt}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                  i < Math.floor(submission.avgRating)
                                    ? 'fill-accent-yellow text-accent-yellow'
                                    : 'text-text-muted'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs sm:text-sm text-text-muted">
                            ({submission.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3 text-sm">
                        <FileText className="w-4 h-4 text-accent-cyan" />
                        <span className="font-semibold">{submission.fileName}</span>
                      </div>
                      
                      <p className="text-sm sm:text-base text-text-secondary mb-4">
                        {submission.description}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button
                          onClick={() => setReviewingSubmission(submission.id)}
                          className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-accent-pink text-white font-semibold rounded-lg hover:bg-accent-pink/90 transition-all text-sm"
                        >
                          Review This
                        </button>
                        <button
                          onClick={() => setViewingSubmission(submission.id)}
                          className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-bg-tertiary text-text-primary font-semibold rounded-lg hover:bg-bg-tertiary/70 transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View Reviews
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* My Submissions Tab */}
          {activeTab === 'my-submissions' && (
            <div className="space-y-4">
              {mySubmissions.length === 0 ? (
                <div className="p-8 sm:p-12 bg-bg-secondary rounded-2xl border border-border-subtle text-center">
                  <Upload className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-text-muted" />
                  <h3 className="text-lg sm:text-xl font-bold mb-2">No Submissions Yet</h3>
                  <p className="text-sm sm:text-base text-text-secondary">
                    Upload your resume to get feedback from the community
                  </p>
                </div>
              ) : (
                mySubmissions.map((submission, index) => (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 sm:p-6 bg-bg-secondary rounded-2xl border border-border-subtle hover:border-border-accent transition-all"
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-white font-bold flex-shrink-0">
                        {submission.userAvatar}
                      </div>
                      
                      <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-bold text-base sm:text-lg">{submission.userName}</h3>
                            <p className="text-xs sm:text-sm text-text-muted">{submission.submittedAt}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                    i < Math.floor(submission.avgRating)
                                      ? 'fill-accent-yellow text-accent-yellow'
                                      : 'text-text-muted'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs sm:text-sm text-text-muted">
                              ({submission.reviewCount} reviews)
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3 text-sm">
                          <FileText className="w-4 h-4 text-accent-pink" />
                          <span className="font-semibold">{submission.fileName}</span>
                        </div>
                        
                        <p className="text-sm sm:text-base text-text-secondary mb-4">
                          {submission.description}
                        </p>
                        
                        <button
                          onClick={() => setViewingSubmission(submission.id)}
                          className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-accent-cyan text-bg-primary font-semibold rounded-lg hover:bg-accent-cyan/90 transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View Reviews ({submission.reviewCount})
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Reviews Display Section */}
          {viewingSubmission && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 sm:p-6 bg-bg-secondary rounded-2xl border border-border-subtle"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold">Reviews</h2>
                <button
                  onClick={() => setViewingSubmission(null)}
                  className="p-2 hover:bg-bg-tertiary rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-text-muted">
                  {sortedReviews.filter(r => r.submissionId === viewingSubmission).length} reviews
                </p>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-bg-tertiary border border-border-subtle rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent-pink"
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
                      className="p-4 bg-bg-tertiary rounded-xl border border-border-subtle"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                          {review.avatar}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-bold text-sm sm:text-base">{review.author}</h3>
                              <p className="text-xs text-text-muted">{review.date}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                    i < Math.floor(review.rating)
                                      ? 'fill-accent-yellow text-accent-yellow'
                                      : 'text-text-muted'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <p className="text-sm text-text-secondary mb-3">{review.comment}</p>
                          
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => handleLike(review.id)}
                              className={`flex items-center gap-2 text-xs sm:text-sm font-semibold transition-colors ${
                                likedReviews.includes(review.id)
                                  ? 'text-accent-pink'
                                  : 'text-text-muted hover:text-accent-pink'
                              }`}
                            >
                              <ThumbsUp className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                likedReviews.includes(review.id) ? 'fill-accent-pink' : ''
                              }`} />
                              <span>{review.likes}</span>
                            </button>
                            <button 
                              onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                              className="flex items-center gap-2 text-xs sm:text-sm text-text-muted hover:text-accent-cyan transition-colors font-semibold"
                            >
                              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>Reply</span>
                            </button>
                          </div>

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
                                    className="flex-1 px-3 py-2 bg-bg-secondary border border-border-subtle rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-xs sm:text-sm"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        handleReply(review.id)
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => handleReply(review.id)}
                                    className="px-3 py-2 bg-accent-cyan text-bg-primary font-semibold rounded-lg hover:bg-accent-cyan/90 transition-all"
                                  >
                                    <Send className="w-4 h-4" />
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

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSubmitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-bg-secondary rounded-2xl border border-border-subtle p-6 sm:p-8 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent-pink/20 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-accent-pink" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Submit Resume?</h3>
                <p className="text-sm sm:text-base text-text-secondary mb-6">
                  Your resume will be shared with the community for peer review. You'll receive feedback within 24 hours.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-bg-tertiary text-text-primary font-semibold rounded-xl hover:bg-bg-tertiary/70 transition-all text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSubmit}
                    className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-accent-pink text-white font-semibold rounded-xl hover:bg-accent-pink/90 transition-all text-sm sm:text-base"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Form Modal */}
      <AnimatePresence>
        {reviewingSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setReviewingSubmission(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-bg-secondary rounded-2xl border border-border-subtle p-6 sm:p-8 max-w-2xl w-full my-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold">Write a Review</h3>
                <button
                  onClick={() => setReviewingSubmission(null)}
                  className="p-2 hover:bg-bg-tertiary rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Rating Stars */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="transition-all hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 sm:w-10 sm:h-10 ${
                          star <= reviewRating
                            ? 'fill-accent-yellow text-accent-yellow'
                            : 'text-text-muted hover:text-accent-yellow'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Your Review</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your feedback on the resume. Be constructive and specific..."
                  rows={6}
                  className="w-full px-4 py-3 bg-bg-tertiary border border-border-subtle rounded-xl focus:outline-none focus:border-accent-pink transition-colors resize-none text-sm"
                />
                <p className="text-xs text-text-muted mt-2">
                  {reviewComment.length} characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  onClick={() => setReviewingSubmission(null)}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-bg-tertiary text-text-primary font-semibold rounded-xl hover:bg-bg-tertiary/70 transition-all text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmitReview(reviewingSubmission)}
                  disabled={!reviewComment.trim()}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-accent-pink text-white font-semibold rounded-xl hover:bg-accent-pink/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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
