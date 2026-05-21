# InterviewOS - Backend Integration & Frontend Architecture Guide

This documentation serves as the single source of truth for backend developers to understand frontend requirements, API contracts, state management, and real-time socket flows for **InterviewOS – Your AI Placement Co-Pilot**.

---

## 1. Product Overview

**What it does:** InterviewOS is an AI-driven platform that helps students prepare for placements through automated resume evaluation (X-Ray), AI-led mock interviews, and peer review systems. 

**User Journey:**
1. User registers/logs in and lands on the Dashboard.
2. User uploads their resume for an AI X-Ray analysis.
3. User configures a Mock Interview (provides JD/Role).
4. User participates in a real-time AI interview (via Socket.io).
5. User views detailed feedback and analytics to track improvement.

**Data Flow:** The application relies heavily on real-time duplex communication (WebSockets) for interviews, standard REST APIs for CRUD operations, and async background tasks for heavy AI processing (Resume parsing).

---

## 2. Frontend Architecture

**Tech Stack:** React, Vite, Tailwind CSS, Redux Toolkit, React Router DOM, Axios, Socket.io Client.

*   **Feature-Based Folder Structure:** Code is organized by domain (e.g., `/src/features/auth`, `/src/features/interview`) rather than by type (components, hooks).
*   **Shared Components:** UI atoms like Buttons, Modals, Forms, and Loaders reside in `/src/components/shared`.
*   **Service Layer:** `/src/services/apiClient.ts` handles all Axios configuration, request interceptors (JWT injection), and response interceptors (token refreshing/error handling).
*   **Redux Architecture:** Centralized store using standard Redux Toolkit slices (`authSlice`, `interviewSlice`, etc.) combined with Thunks for async state management.
*   **API Abstraction Layer:** Every backend endpoint is abstracted into specific service files (e.g., `resumeService.ts`) so UI components never call `axios` directly.

---

## 3. Complete Route Mapping

| Route Path | Auth Required | Frontend Purpose | Backend Dependency |
| :--- | :---: | :--- | :--- |
| `/` | No | Landing / Marketing Page | None |
| `/login` | No | User authentication | `POST /api/auth/login` |
| `/register` | No | User registration | `POST /api/auth/register` |
| `/dashboard` | Yes | Main Analytics & Progress | `GET /api/user/analytics` |
| `/resume/upload` | Yes | Upload Resume interface | `POST /api/resume/upload` |
| `/resume/xray/:id` | Yes | View parsed AI resume score | `GET /api/resume/:id/analysis` |
| `/interview/setup` | Yes | Select role, JD, difficulty | `POST /api/interview/init` |
| `/interview/live/:id`| Yes | Real-time AI Mock Interview | `Socket.io` connection |
| `/interview/result/:id`| Yes | View feedback & metrics | `GET /api/interview/:id/feedback` |
| `/peer-review` | Yes | Review other candidates | `GET /api/review/pool` |
| `/resources` | Yes | View suggested materials | `GET /api/resources` |

---

## 4. Backend API Requirements

*All requests must accept and return `application/json` (except file uploads).*

### Auth
*   **POST `/api/auth/register`** - Body: `{ name, email, password }` | Response: `{ user, tokens }`
*   **POST `/api/auth/login`** - Body: `{ email, password }` | Response: `{ user, tokens }`
*   **POST `/api/auth/refresh`** - Body: `{ refreshToken }` | Response: `{ accessToken }`

### Resume X-Ray
*   **POST `/api/resume/upload`** 
    *   *Method*: `multipart/form-data`
    *   *Body*: `file` (PDF, max 5MB)
    *   *Response*: `{ success: true, resumeId, url }`
*   **GET `/api/resume/:id/analysis`**
    *   *Response*: `{ score: 85, atsMatch: 70, feedback: [...], missingKeywords: [...] }`

### JD Matching & Project Analysis
*   **POST `/api/resume/match-jd`**
    *   *Body*: `{ resumeId, jobDescriptionText }`
    *   *Response*: `{ matchPercentage, gapAnalysis, suggestedProjects }`

### Mock Interview
*   **POST `/api/interview/init`**
    *   *Body*: `{ role, difficulty, resumeId, jobDescription }`
    *   *Response*: `{ interviewSessionId, initialPrompt }` (Socket handles the rest)
*   **GET `/api/interview/:id/feedback`**
    *   *Response*: `{ overallScore, metrics: { communication, technical }, transcript: [...] }`

### Question Bank & Resources
*   **GET `/api/questions`** - Query: `?category=react&difficulty=medium` | Response: `{ questions: [...] }`
*   **GET `/api/resources`** - Query: `?topic=system-design` | Response: `{ resources: [...] }`

### Peer Review
*   **GET `/api/review/pool`** - Response: `{ resumeId, anonymizedData }`
*   **POST `/api/review/submit`** - Body: `{ resumeId, rating, comments }`

### Dashboard
*   **GET `/api/analytics`** - Response: `{ interviewsTaken, averageScore, recentActivity: [...] }`

---

## 5. MongoDB Schema Suggestions

```javascript
// User
{
  name: String, email: String, passwordHash: String, 
  role: { type: String, enum: ['student', 'admin'] },
  createdAt: Date
}

// Resume
{
  userId: ObjectId(User),
  fileUrl: String,      // Cloudinary URL
  parsedText: String,
  aiAnalysis: {
    score: Number, atsMatch: Number, feedback: [String], keywords: [String]
  },
  createdAt: Date
}

// InterviewSession
{
  userId: ObjectId(User),
  resumeId: ObjectId(Resume),
  role: String, difficulty: String,
  status: { type: String, enum: ['in-progress', 'completed', 'aborted'] },
  transcript: [{ speaker: String, text: String, timestamp: Date }],
  finalScore: Number,
  feedback: { technical: String, communication: String },
  createdAt: Date
}

// QuestionBank
{
  category: String, text: String, difficulty: String, expectedPoints: [String]
}
```
*   **Indexes Required**: `userId` on Resume/InterviewSession, `email` on User.

---

## 6. Redux + Backend Dependency Mapping

| Slice Name | Cached Data | API Endpoints | Optimistic Updates? |
| :--- | :--- | :--- | :--- |
| **authSlice** | user profile, JWT state | `/api/auth/*` | No |
| **resumeSlice** | active resume data, X-Ray scores, loading states | `/api/resume/*` | Yes (deletions) |
| **interviewSlice** | current session ID, live transcript, timer | `/api/interview/*`, Socket.io | No (relies on real-time) |
| **reviewSlice** | assigned peer resumes to review | `/api/review/*` | Yes (skipping reviews) |
| **dashboardSlice**| user analytics, historical scores | `/api/analytics` | No |
| **themeSlice** | dark/light mode preference | LocalStorage only | N/A |

---

## 7. Authentication Flow

1.  **Login**: User submits credentials.
2.  **API Response**: Backend sends `{ accessToken, refreshToken }`.
3.  **Storage**: Frontend stores `accessToken` in Redux/Memory and `refreshToken` in an HttpOnly secure cookie (preferred) or encrypted LocalStorage.
4.  **Protected Requests**: Axios interceptor attaches `Authorization: Bearer <accessToken>` to every outgoing request.
5.  **Token Expiry Handling**: If API returns `401 Unauthorized`, interceptor automatically calls `/api/auth/refresh`, updates the token, and retries the original request seamlessly.
6.  **Logout**: Clear Redux, delete cookies/storage, redirect to `/login`.

---

## 8. File Upload Architecture

**Resume PDF Upload Flow:**
1.  **Frontend**: Validates file locally (type: `application/pdf`, size: `< 5MB`).
2.  **Request**: `multipart/form-data` sent to Backend.
3.  **Backend**: Receives file -> Uploads directly to **Cloudinary** (do not store locally).
4.  **Parsing Trigger**: Backend extracts raw text from PDF (using `pdf-parse` or similar).
5.  **AI Scoring Trigger**: Backend sends extracted text to Claude/OpenAI for X-Ray scoring.
6.  **Response**: Backend saves DB record and returns structured analysis to frontend.
7.  **Failure Handling**: If AI parsing fails, return a graceful error requiring manual retry.

---

## 9. AI Integration Flow

*   **Prompt Management**: Keep prompts on the backend. Frontend should only send contextual data (e.g., `resumeText`, `jobDescription`).
*   **LLM Provider**: OpenAI (GPT-4o-mini) or Claude (3.5 Sonnet) recommended for fast responses.
*   **Rate Limiting**: Implement strict IP/User based rate limits on AI endpoints to prevent cost blowouts.
*   **Response Formatting**: Instruct the LLM to strictly return JSON. Use `response_format: { type: "json_object" }` if using OpenAI.
*   **Timeout Handling**: AI APIs can be slow. Set backend timeout to ~30s. If it fails, fallback to a standard error message: `"AI evaluation taking longer than expected. Please try again."`

---

## 10. Socket.io Architecture (CRITICAL FOR MOCK INTERVIEW)

**Connection**: Authenticate socket via JWT in the handshake query/headers.

**Event Naming Conventions:**
*   `client:*` - Events originating from frontend.
*   `server:*` - Events originating from backend.

**Real-time Flow:**
1.  `client:join_interview` (Payload: `{ sessionId }`)
2.  `server:interview_ready`
3.  `server:ask_question` (Payload: `{ text: "Tell me about...", audioUrl: "..." }`)
4.  `client:typing_start` / `client:typing_stop`
5.  `client:submit_answer` (Payload: `{ text: "My experience is..." }`)
6.  *Backend processes answer via AI...*
7.  `server:answer_feedback` (Payload: `{ rating: "Good", correction: "..." }`)
8.  `server:ask_question` (Loop continues...)
9.  `client:end_interview`
10. `server:interview_finished`

---

## 11. State + API Data Flow

**Example: Submitting a Mock Interview Answer**

```text
[User clicks Submit]
  → Redux Action: dispatch(addMessageToTranscript(msg))
  → Socket Emit: socket.emit('client:submit_answer', { text: "..." })
  → Backend Controller: Validates answer, adds to DB session
  → Backend AI Layer: LLM evaluates answer quality
  → Socket Broadcast: socket.emit('server:answer_feedback', { feedback })
  → Redux Action: dispatch(updateFeedback(feedback))
  → UI Update: Shows AI feedback and next question
```

---

## 12. Error Handling Standards

**Standardized JSON Error Format:**
Backend MUST return this format for ALL errors (400, 401, 403, 404, 500):
```json
{
  "success": false,
  "error": {
    "code": "VAL_ERROR",
    "message": "Invalid input provided.",
    "details": ["Email is required", "Password must be 8 chars"]
  }
}
```
*   `401` triggers interceptor logout/refresh.
*   `400`/`422` highlights form fields.
*   `500` displays a generic toast "Something went wrong".

---

## 13. Backend Folder Structure Recommendation

To maintain sanity, organize the Node.js/Express backend as follows:
```text
/src
 ├── config/         # Env vars, DB connection, Cloudinary config
 ├── controllers/    # Route logic (Auth, Resume, Interview)
 ├── middlewares/    # AuthGuard, ErrorHandler, RateLimiter, Upload
 ├── models/         # Mongoose schemas
 ├── routes/         # Express router definitions
 ├── services/       # AI logic, Cloudinary upload, Business logic
 ├── sockets/        # Socket.io event handlers
 └── utils/          # Helpers (Token generation, prompt templates)
```

---

## 14. Security Requirements

1.  **CORS**: Allow strictly from Frontend URL (`localhost:5173` in dev, Vercel URL in prod).
2.  **Helmet**: Implement `helmet()` middleware for basic HTTP headers.
3.  **Sanitization**: Use `xss-clean` or `express-mongo-sanitize` to prevent NoSQL injection.
4.  **File Validation**: Backend MUST verify MIME type is PDF before processing.
5.  **Rate Limiting**: `express-rate-limit` on `/api/auth` and `/api/resume/upload`.

---

## 15. Deployment Requirements

*   **Frontend**: Deployed to Vercel. 
    *   `VITE_API_BASE_URL` = `https://api.interviewos.com`
    *   `VITE_SOCKET_URL` = `https://api.interviewos.com`
*   **Backend**: Deployed to Render, Railway, or AWS.
    *   Requires ENV vars: `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_URL`, `OPENAI_API_KEY`, `CLIENT_URL`.
*   **CORS Config**: Must allow credentials (cookies/tokens) to pass if using HttpOnly cookies.

---

## 16. MVP Development Order

*   **Week 1**: Setup Backend, DB, Authentication (JWT), and User Models. Connect Frontend login/register.
*   **Week 2**: Cloudinary File Uploads, PDF parsing, Resume X-Ray AI Integration.
*   **Week 3**: Socket.io Server, Mock Interview logic, Session tracking.
*   **Week 4**: Dashboard Analytics, Peer Review system, Bug fixing, and Final Polish.

---

## 17. Final Deliverables

**Checklists for Backend:**
- [ ] Centralized error handling middleware implemented.
- [ ] JWT Auth and protected route middleware working.
- [ ] Standardized API response format enforced.
- [ ] Cloudinary integration handles PDFs properly.
- [ ] Socket server allows connections only with valid JWT.
- [ ] Prompts are optimized to return strict JSON from LLMs.
- [ ] CORS is properly configured for the frontend client.
