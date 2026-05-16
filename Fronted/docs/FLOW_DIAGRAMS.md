# 🔄 InterviewOS - Complete Flow Diagrams

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         React Frontend (Port 5173)                  │    │
│  │                                                      │    │
│  │  • Pages (Landing, Dashboard, Features)            │    │
│  │  • Components (Layout, Forms, Charts)              │    │
│  │  • Redux Store (State Management)                  │    │
│  │  • Services (API calls, WebRTC, Socket)           │    │
│  └────────────────────────────────────────────────────┘    │
│                          ↓ ↑                                │
└──────────────────────────┼─┼────────────────────────────────┘
                           │ │
                    HTTP   │ │   WebSocket
                    REST   │ │   Socket.io
                    APIs   │ │
                           ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER                            │
│                   (Node.js/Python)                           │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   REST API   │  │  Socket.io   │  │   WebRTC     │     │
│  │   Server     │  │   Server     │  │   Server     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         ↓                 ↓                  ↓              │
│  ┌──────────────────────────────────────────────────┐     │
│  │         Business Logic Layer                      │     │
│  │  • Authentication  • Resume Analysis              │     │
│  │  • Question Bank   • Mock Interview               │     │
│  │  • Peer Review     • Dashboard Stats              │     │
│  └──────────────────────────────────────────────────┘     │
│         ↓                                                   │
└─────────┼───────────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │   AWS S3     │  │    Redis     │     │
│  │  Database    │  │ File Storage │  │    Cache     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES                            │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  OpenAI API  │  │  GitHub API  │  │  Email       │     │
│  │  (AI Model)  │  │  (Repo Data) │  │  Service     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  1. User visits /signup or /signin                      │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  2. Fills form (name, email, password)                  │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  3. Frontend validates form                             │
│     • Email format check                                │
│     • Password length check                             │
│     • Password match check (signup)                     │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  4. Send POST request to backend                        │
│     POST /api/auth/signup or /api/auth/login           │
│     Body: { name, email, password }                     │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  5. Backend processes request                           │
│     • Hash password (bcrypt)                            │
│     • Check if user exists                              │
│     • Create user in database                           │
│     • Generate JWT token                                │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  6. Backend sends response                              │
│     {                                                    │
│       success: true,                                     │
│       user: { id, name, email, avatar },                │
│       token: "jwt_token_here"                           │
│     }                                                    │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  7. Frontend receives response                          │
│     • Store token in localStorage                       │
│     • Update Redux state (setUser)                      │
│     • Show success toast                                │
│     • Redirect to /dashboard                            │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  8. User is now authenticated                           │
│     • Can access protected routes                       │
│     • Token sent with every API request                 │
└─────────────────────────────────────────────────────────┘
```

---

## 📄 Resume Analysis Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  1. User goes to /resume-xray                           │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  2. Clicks upload area or drags file                    │
│     • Accepts: PDF, DOC, DOCX                           │
│     • Max size: 5MB                                     │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  3. File selected, stored in state                      │
│     setFile(uploadedFile)                               │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  4. User clicks "Analyze Resume"                        │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  5. Frontend uploads file                               │
│     POST /api/resume/upload                             │
│     Content-Type: multipart/form-data                   │
│     Body: { file, userId }                              │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  6. Backend receives file                               │
│     • Validate file type and size                       │
│     • Upload to AWS S3 / Cloudinary                     │
│     • Generate unique fileId                            │
│     • Save metadata to database                         │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  7. Backend returns file info                           │
│     { success: true, fileId, fileUrl }                  │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  8. Frontend requests analysis                          │
│     POST /api/resume/analyze                            │
│     Body: { fileId, userId }                            │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  9. Backend analyzes resume                             │
│     • Download file from S3                             │
│     • Parse PDF/DOC (pdf-parse, mammoth)               │
│     • Extract text content                              │
│     • Send to AI model (OpenAI API)                     │
│     • Calculate ATS score                               │
│     • Generate insights                                 │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  10. AI model processes resume                          │
│      • Identify strengths                               │
│      • Find weaknesses                                  │
│      • Generate suggestions                             │
│      • Extract keywords                                 │
│      • Calculate score (0-100)                          │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  11. Backend sends analysis                             │
│      {                                                   │
│        success: true,                                    │
│        analysis: {                                       │
│          score: 85,                                      │
│          strengths: [...],                              │
│          weaknesses: [...],                             │
│          suggestions: [...],                            │
│          keywords: [...],                               │
│          atsScore: 78                                   │
│        }                                                 │
│      }                                                   │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  12. Frontend displays results                          │
│      • Update Redux state                               │
│      • Show score with animation                        │
│      • Display strengths (green)                        │
│      • Display weaknesses (yellow)                      │
│      • Display suggestions (cyan)                       │
│      • Show success toast                               │
└─────────────────────────────────────────────────────────┘
```

---

## 🎥 Mock Interview Flow (with Video)

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  1. User goes to /mock-interview                        │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  2. Selects interview settings                          │
│     • Type: Behavioral/Technical/System Design          │
│     • Difficulty: Easy/Medium/Hard                      │
│     • Duration: 15/30/45/60 minutes                     │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  3. Clicks "Start Interview" button                     │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  4. Frontend requests camera permission                 │
│     navigator.mediaDevices.getUserMedia({               │
│       video: true,                                       │
│       audio: true                                        │
│     })                                                   │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  5. Browser shows permission popup                      │
│     "Allow camera and microphone access?"               │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  6. User allows access                                  │
│     • Camera turns on                                   │
│     • Video stream starts                               │
│     • Display in video element                          │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  7. Frontend creates interview session                  │
│     POST /api/interview/start                           │
│     Body: { userId, type, difficulty, duration }        │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  8. Backend creates session                             │
│     • Generate unique sessionId                         │
│     • Fetch questions from database                     │
│     • Create interview record                           │
│     • Setup WebSocket room                              │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  9. Backend sends session data                          │
│     {                                                    │
│       success: true,                                     │
│       sessionId: "uuid",                                 │
│       questions: [...],                                  │
│       token: "webrtc_token"                             │
│     }                                                    │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  10. Frontend starts recording                          │
│      • Initialize RecordRTC                             │
│      • Start video recording                            │
│      • Connect to WebSocket                             │
│      • Display first question                           │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  11. User answers questions                             │
│      • Speaks to camera                                 │
│      • Video + audio recorded                           │
│      • Can skip to next question                        │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  12. Real-time features (WebSocket)                     │
│      socket.emit('submit-answer', { answer })           │
│      socket.on('next-question', (question) => {})       │
│      socket.on('ai-feedback', (feedback) => {})         │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  13. User clicks "Stop Interview"                       │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  14. Frontend stops recording                           │
│      • Stop RecordRTC                                   │
│      • Get video blob                                   │
│      • Stop camera stream                               │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  15. Upload video to server                             │
│      POST /api/interview/upload-video                   │
│      Content-Type: multipart/form-data                  │
│      Body: { video: blob, sessionId }                   │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  16. Backend processes video                            │
│      • Upload to AWS S3                                 │
│      • Generate video URL                               │
│      • Extract audio                                    │
│      • Send to speech-to-text API                       │
│      • Get transcript                                   │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  17. AI analyzes performance                            │
│      • Analyze transcript                               │
│      • Check communication skills                       │
│      • Evaluate technical accuracy                      │
│      • Assess confidence level                          │
│      • Generate feedback                                │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  18. Backend sends feedback                             │
│      {                                                   │
│        success: true,                                    │
│        feedback: {                                       │
│          overallScore: 85,                              │
│          communication: 90,                             │
│          technical: 80,                                 │
│          confidence: 85,                                │
│          suggestions: [...]                             │
│        }                                                 │
│      }                                                   │
└─────────────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  19. Frontend displays results                          │
│      • Show scores with animations                      │
│      • Display feedback                                 │
│      • Option to download video                         │
│      • Save to history                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Real-time Communication (Socket.io)

```
┌──────────────────┐                    ┌──────────────────┐
│   Frontend       │                    │   Backend        │
│   (Client)       │                    │   (Server)       │
└────────┬─────────┘                    └────────┬─────────┘
         │                                       │
         │  1. Connect to Socket.io              │
         │────────────────────────────────────>  │
         │                                       │
         │  2. Connection established            │
         │  <────────────────────────────────────│
         │     socket.id assigned                │
         │                                       │
         │  3. Join interview room               │
         │  emit('join-interview', {sessionId})  │
         │────────────────────────────────────>  │
         │                                       │
         │  4. Room joined                       │
         │  <────────────────────────────────────│
         │     on('room-joined', {})             │
         │                                       │
         │  5. Receive first question            │
         │  <────────────────────────────────────│
         │     on('next-question', {question})   │
         │                                       │
         │  6. User answers                      │
         │  emit('submit-answer', {answer})      │
         │────────────────────────────────────>  │
         │                                       │
         │                                       │  7. Process answer
         │                                       │     • Save to DB
         │                                       │     • Analyze with AI
         │                                       │
         │  8. Receive AI feedback               │
         │  <────────────────────────────────────│
         │     on('ai-feedback', {feedback})     │
         │                                       │
         │  9. Request next question             │
         │  emit('next-question-request')        │
         │────────────────────────────────────>  │
         │                                       │
         │  10. Receive next question            │
         │  <────────────────────────────────────│
         │     on('next-question', {question})   │
         │                                       │
         │  ... (repeat for all questions)       │
         │                                       │
         │  11. End interview                    │
         │  emit('end-interview', {sessionId})   │
         │────────────────────────────────────>  │
         │                                       │
         │  12. Final results                    │
         │  <────────────────────────────────────│
         │     on('interview-complete', {data})  │
         │                                       │
         │  13. Disconnect                       │
         │  disconnect()                         │
         │────────────────────────────────────>  │
         │                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Summary

### Current State (Static)
```
User Action → Frontend State Update → Display UI
(No backend, no database, no persistence)
```

### After Integration (Dynamic)
```
User Action
    ↓
Frontend Validation
    ↓
API Request (Axios)
    ↓
Backend Processing
    ↓
Database Query/Update
    ↓
External Services (AI, GitHub, etc.)
    ↓
Backend Response
    ↓
Frontend State Update (Redux)
    ↓
Display UI with Real Data
```

---

## 🎯 Integration Priority

### Phase 1: Core Features (Week 1-2)
1. ✅ Authentication (signup, login, logout)
2. ✅ User profile management
3. ✅ Dashboard with real stats

### Phase 2: Main Features (Week 3-4)
4. ✅ Resume upload and analysis
5. ✅ Question bank with database
6. ✅ Project prep with GitHub API

### Phase 3: Advanced Features (Week 5-6)
7. ✅ Mock interview with video
8. ✅ Peer review system
9. ✅ Real-time notifications

### Phase 4: Polish (Week 7-8)
10. ✅ Performance optimization
11. ✅ Error handling
12. ✅ Testing
13. ✅ Deployment

---

**These flow diagrams show exactly how data moves through the system!** 🚀
