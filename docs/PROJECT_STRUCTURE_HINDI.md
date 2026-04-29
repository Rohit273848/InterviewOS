# 📚 InterviewOS - Complete Project Structure (Hindi/Hinglish)

## 🎯 Project Ka Overview

Ye ek **AI-powered placement preparation platform** hai jo final-year CS students ke liye banaya gaya hai. Abhi frontend **completely ready** hai with beautiful UI/UX, lekin backend integration pending hai.

---

## 📁 Current Project Structure

```
interviewos/
│
├── src/                          # Main source code folder
│   ├── components/               # Reusable components
│   │   ├── Layout.tsx           # Sidebar + Header layout
│   │   └── ProtectedRoute.tsx   # Route protection wrapper
│   │
│   ├── pages/                    # All pages
│   │   ├── LandingPage.tsx      # Home page (public)
│   │   ├── SignIn.tsx           # Login page
│   │   ├── SignUp.tsx           # Registration page
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── ResumeXRay.tsx       # Resume analyzer
│   │   ├── QuestionBank.tsx     # Interview questions
│   │   ├── ProjectPrep.tsx      # GitHub project prep
│   │   ├── MockInterview.tsx    # AI interview practice
│   │   └── PeerReview.tsx       # Community reviews
│   │
│   ├── store/                    # Redux state management
│   │   ├── index.ts             # Store configuration
│   │   └── slices/              # Redux slices
│   │       ├── userSlice.ts     # User authentication state
│   │       └── resumeSlice.ts   # Resume analysis state
│   │
│   ├── services/                 # API services (TO BE CREATED)
│   │   ├── api.ts               # Axios configuration
│   │   ├── authService.ts       # Authentication APIs
│   │   ├── resumeService.ts     # Resume APIs
│   │   ├── questionService.ts   # Question Bank APIs
│   │   ├── interviewService.ts  # Mock Interview APIs
│   │   ├── videoService.ts      # Video recording
│   │   └── socketService.ts     # Real-time features
│   │
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
│
├── public/                       # Static files
├── package.json                  # Dependencies
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
└── .env                         # Environment variables (TO BE CREATED)
```

---

## 🔴 Kya Static Hai? (What's Static/Hardcoded?)

### 1. Authentication (Sign Up / Sign In)
**File:** `src/pages/SignIn.tsx`, `src/pages/SignUp.tsx`

**Current Status:** ⚠️ **SIMULATED**

**Kya hai abhi:**
```typescript
// Fake login - koi bhi email/password accept kar leta hai
setTimeout(() => {
  dispatch(setUser({ name, email, isAuthenticated: true }))
  navigate('/dashboard')
}, 1500)
```

**Problems:**
- ❌ Koi real database nahi hai
- ❌ Password check nahi hota
- ❌ JWT token nahi banta
- ❌ Session management nahi hai
- ❌ Logout karne par bhi data memory mein rehta hai

**Kya chahiye:**
- ✅ Backend API for signup/login
- ✅ Password hashing (bcrypt)
- ✅ JWT token generation
- ✅ Database mein user store karna
- ✅ Token verification

---

### 2. Resume X-Ray (Resume Analysis)
**File:** `src/pages/ResumeXRay.tsx`

**Current Status:** ⚠️ **SIMULATED**

**Kya hai abhi:**
```typescript
// Fake analysis - hardcoded results
setTimeout(() => {
  dispatch(setAnalysis({
    score: 85,
    strengths: ['Strong skills', 'Good projects'],
    weaknesses: ['Missing metrics'],
    suggestions: ['Add numbers']
  }))
}, 2000)
```

**Problems:**
- ❌ File upload nahi hota (sirf UI hai)
- ❌ Koi AI model nahi hai
- ❌ Resume parse nahi hota
- ❌ Har baar same result aata hai
- ❌ Database mein save nahi hota

**Kya chahiye:**
- ✅ File upload to server (AWS S3 / Cloudinary)
- ✅ Resume parsing library (pdf-parse, mammoth)
- ✅ AI/ML model for analysis (OpenAI API / Custom model)
- ✅ Database mein results save karna
- ✅ History feature

---

### 3. Question Bank
**File:** `src/pages/QuestionBank.tsx`

**Current Status:** ⚠️ **STATIC**

**Kya hai abhi:**
```typescript
// Hardcoded questions array
const questions = [
  { id: 1, company: 'Google', question: 'LRU Cache', difficulty: 'Hard' },
  { id: 2, company: 'Amazon', question: 'Two Sum', difficulty: 'Easy' },
  // ... sirf 4 questions
]
```

**Problems:**
- ❌ Sirf 4 hardcoded questions hain
- ❌ Database se fetch nahi hota
- ❌ Search kaam nahi karta (sirf UI hai)
- ❌ Filter kaam nahi karta
- ❌ New questions add nahi kar sakte

**Kya chahiye:**
- ✅ Database with 1000+ questions
- ✅ API to fetch questions
- ✅ Real search functionality
- ✅ Filter by company/difficulty
- ✅ Pagination
- ✅ User can submit questions

---

### 4. Project Prep (GitHub Analysis)
**File:** `src/pages/ProjectPrep.tsx`

**Current Status:** ⚠️ **SIMULATED**

**Kya hai abhi:**
```typescript
// Fake GitHub analysis
setTimeout(() => {
  setQuestions([
    'Explain architecture...',
    'What was challenging...',
    // ... hardcoded questions
  ])
}, 2000)
```

**Problems:**
- ❌ GitHub se connect nahi hota
- ❌ Repository analyze nahi hota
- ❌ AI questions generate nahi hote
- ❌ Har URL ke liye same questions

**Kya chahiye:**
- ✅ GitHub API integration
- ✅ Repository cloning/reading
- ✅ README parsing
- ✅ Code analysis
- ✅ AI model for question generation
- ✅ Tech stack detection

---

### 5. Mock Interview (Video Interview)
**File:** `src/pages/MockInterview.tsx`

**Current Status:** ⚠️ **SIMULATED (NO VIDEO)**

**Kya hai abhi:**
```typescript
// Fake video interface - sirf UI hai
const [isInterviewActive, setIsInterviewActive] = useState(false)
// Camera on nahi hota
// Video record nahi hota
// AI interviewer nahi hai
```

**Problems:**
- ❌ Camera access nahi hai
- ❌ Video record nahi hota
- ❌ Video save nahi hota
- ❌ AI feedback nahi milta
- ❌ Speech recognition nahi hai

**Kya chahiye:**
- ✅ WebRTC for camera access
- ✅ Video recording (RecordRTC)
- ✅ Video upload to server
- ✅ Speech-to-text API
- ✅ AI for feedback generation
- ✅ Store interview sessions

---

### 6. Peer Review
**File:** `src/pages/PeerReview.tsx`

**Current Status:** ⚠️ **STATIC**

**Kya hai abhi:**
```typescript
// Hardcoded reviews
const reviews = [
  { id: 1, author: 'Alex', rating: 4.5, comment: 'Great!' },
  // ... sirf 3 reviews
]
```

**Problems:**
- ❌ Reviews hardcoded hain
- ❌ Submit nahi kar sakte
- ❌ Like/Reply kaam nahi karta
- ❌ Real-time updates nahi hain

**Kya chahiye:**
- ✅ Database for submissions
- ✅ API for reviews
- ✅ Like/Reply functionality
- ✅ Real-time notifications (Socket.io)
- ✅ File upload for resumes

---

### 7. Dashboard (Statistics)
**File:** `src/pages/Dashboard.tsx`

**Current Status:** ⚠️ **STATIC**

**Kya hai abhi:**
```typescript
// Hardcoded stats
const stats = [
  { label: 'Resume Score', value: '85', change: '+12%' },
  // ... fake data
]
```

**Problems:**
- ❌ Sab data hardcoded hai
- ❌ Real user progress track nahi hota
- ❌ Charts ka data fake hai
- ❌ Database se fetch nahi hota

**Kya chahiye:**
- ✅ User progress tracking
- ✅ Real statistics calculation
- ✅ Activity logging
- ✅ API for dashboard data

---

## 🟢 Kya Dynamic Banane Ke Liye Chahiye?

### 1. Backend Setup

#### Technology Stack (Recommended)
```
Backend Framework: Node.js + Express / Python + FastAPI
Database: PostgreSQL / MongoDB
File Storage: AWS S3 / Cloudinary
AI/ML: OpenAI API / Custom models
Real-time: Socket.io
Video: WebRTC + AWS S3
Authentication: JWT
```

#### Required APIs

**Authentication APIs:**
```
POST /api/auth/signup       - User registration
POST /api/auth/login        - User login
POST /api/auth/logout       - User logout
GET  /api/auth/me           - Get current user
```

**Resume APIs:**
```
POST /api/resume/upload     - Upload resume file
POST /api/resume/analyze    - Analyze resume
GET  /api/resume/history    - Get user's resume history
```

**Question Bank APIs:**
```
GET  /api/questions         - Get all questions (with filters)
POST /api/questions         - Add new question
GET  /api/questions/:id     - Get single question
```

**Project Prep APIs:**
```
POST /api/project/analyze   - Analyze GitHub repository
GET  /api/project/history   - Get analysis history
```

**Mock Interview APIs:**
```
POST /api/interview/start   - Start interview session
POST /api/interview/upload  - Upload video
POST /api/interview/submit  - Submit interview
GET  /api/interview/feedback - Get AI feedback
```

**Peer Review APIs:**
```
POST /api/review/submit     - Submit resume for review
GET  /api/review/list       - Get all submissions
POST /api/review/add        - Add review
POST /api/review/:id/like   - Like a review
```

**Dashboard APIs:**
```
GET  /api/dashboard/stats   - Get user statistics
GET  /api/dashboard/progress - Get progress data
GET  /api/dashboard/activity - Get recent activity
```

---

### 2. Database Schema

**Users Table:**
```sql
- id (UUID)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- avatar_url (VARCHAR)
- created_at (TIMESTAMP)
```

**Resumes Table:**
```sql
- id (UUID)
- user_id (FK to users)
- file_name (VARCHAR)
- file_url (VARCHAR)
- score (INTEGER)
- analysis_data (JSON)
- uploaded_at (TIMESTAMP)
```

**Questions Table:**
```sql
- id (UUID)
- company (VARCHAR)
- question (TEXT)
- difficulty (VARCHAR)
- category (VARCHAR)
- solution (TEXT)
- created_at (TIMESTAMP)
```

**Mock Interviews Table:**
```sql
- id (UUID)
- user_id (FK to users)
- session_id (VARCHAR)
- video_url (VARCHAR)
- feedback_data (JSON)
- started_at (TIMESTAMP)
- completed_at (TIMESTAMP)
```

**Reviews Table:**
```sql
- id (UUID)
- submission_id (FK)
- reviewer_id (FK to users)
- rating (DECIMAL)
- comment (TEXT)
- likes (INTEGER)
- created_at (TIMESTAMP)
```

---

### 3. Video Integration (Mock Interview)

**Steps:**

1. **Camera Access:**
```typescript
const stream = await navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
})
```

2. **Video Recording:**
```typescript
import RecordRTC from 'recordrtc'

const recorder = new RecordRTC(stream, {
  type: 'video',
  mimeType: 'video/webm'
})
recorder.startRecording()
```

3. **Stop & Upload:**
```typescript
recorder.stopRecording(() => {
  const blob = recorder.getBlob()
  // Upload to server
  uploadVideo(blob)
})
```

4. **Backend Storage:**
- Upload to AWS S3
- Save URL in database
- Return URL to frontend

---

### 4. Real-time Features (Socket.io)

**Frontend:**
```typescript
import { io } from 'socket.io-client'

const socket = io('http://localhost:5000')

// Join interview room
socket.emit('join-interview', { sessionId })

// Receive next question
socket.on('next-question', (question) => {
  setCurrentQuestion(question)
})

// Send answer
socket.emit('submit-answer', { answer })
```

**Backend:**
```javascript
io.on('connection', (socket) => {
  socket.on('join-interview', ({ sessionId }) => {
    socket.join(sessionId)
  })

  socket.on('submit-answer', ({ answer }) => {
    // Process answer
    // Send feedback
    socket.emit('ai-feedback', feedback)
  })
})
```

---

## 🔧 Integration Steps (Step by Step)

### Step 1: Environment Setup

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GITHUB_TOKEN=your_github_token
VITE_OPENAI_API_KEY=your_openai_key
```

### Step 2: Create API Service

Create `src/services/api.ts`:
```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

### Step 3: Create Auth Service

Create `src/services/authService.ts`:
```typescript
import api from './api'

export const authService = {
  signup: async (data) => {
    const response = await api.post('/auth/signup', data)
    localStorage.setItem('token', response.data.token)
    return response.data
  },

  login: async (data) => {
    const response = await api.post('/auth/login', data)
    localStorage.setItem('token', response.data.token)
    return response.data
  },

  logout: async () => {
    await api.post('/auth/logout')
    localStorage.removeItem('token')
  }
}
```

### Step 4: Update Components

Update `src/pages/SignIn.tsx`:
```typescript
import { authService } from '../services/authService'

const handleSubmit = async (e) => {
  e.preventDefault()
  setIsLoading(true)

  try {
    const data = await authService.login(formData)
    dispatch(setUser(data.user))
    navigate('/dashboard')
  } catch (error) {
    toast.error('Login failed')
  } finally {
    setIsLoading(false)
  }
}
```

---

## 📋 Backend Team Ko Kya Dena Hai?

### Documents:
1. ✅ `BACKEND_INTEGRATION_GUIDE.md` - Complete technical guide
2. ✅ `PROJECT_STRUCTURE_HINDI.md` - This file
3. ✅ API requirements (endpoints list)
4. ✅ Database schema
5. ✅ Environment variables needed

### Information:
1. **Authentication:** JWT-based authentication chahiye
2. **File Upload:** AWS S3 ya Cloudinary use karna hai
3. **AI Integration:** OpenAI API ya custom model
4. **Video Storage:** AWS S3 for video files
5. **Real-time:** Socket.io for live features
6. **Database:** PostgreSQL recommended

---

## ✅ Complete Checklist

### Frontend (Already Done ✅)
- [x] All pages designed
- [x] Authentication UI
- [x] Protected routes
- [x] Redux state management
- [x] Beautiful animations
- [x] Responsive design
- [x] Form validation
- [x] Toast notifications

### Backend (Pending ⚠️)
- [ ] Setup Node.js/Python backend
- [ ] Create database
- [ ] Implement authentication
- [ ] File upload system
- [ ] AI integration
- [ ] Video recording backend
- [ ] Socket.io server
- [ ] Deploy backend

### Integration (Pending ⚠️)
- [ ] Connect frontend to backend APIs
- [ ] Test all features
- [ ] Handle errors
- [ ] Add loading states
- [ ] Test video recording
- [ ] Test real-time features

---

## 🎯 Summary

**Abhi kya hai:**
- ✅ Complete frontend with beautiful UI
- ✅ All pages designed and working
- ✅ Simulated/static data
- ✅ Ready for backend integration

**Kya chahiye:**
- ⚠️ Backend APIs
- ⚠️ Database
- ⚠️ AI/ML integration
- ⚠️ File upload system
- ⚠️ Video recording
- ⚠️ Real-time features

**Next Steps:**
1. Backend team ko ye documents share karo
2. Backend APIs develop karo
3. Frontend mein API integration karo
4. Testing karo
5. Deploy karo

---

**Ye complete guide hai backend team ke liye. Sab kuch detail mein explain kiya gaya hai!** 🚀
