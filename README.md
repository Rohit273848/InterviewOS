# InterviewOS

> **Your AI-Powered Placement Co-Pilot** – An advanced, full-stack application designed to help final-year CS students and placement aspirants master interview preparation. It parses PDF resumes, runs mock interview chat sessions, parses GitHub repositories to generate project-specific technical questions, and tracks preparation progress using rich data visualization.

---
## Features

### 📄 AI Resume X-Ray
- **Text Extraction**: Uses `pdf-parse` to extract clean text from uploaded PDF resumes.
- **ATS & Fit Assessment**: Calculates ATS compatibility and candidate fit percentages matching target job descriptions.
- **Keyword Analysis**: Performs keyword coverage analysis, highlighting matching and missing resume keywords.
- **Actionable Roadmaps**: Generates step-by-step roadmap plans divided into immediate, short-term, medium-term, and long-term milestones.
- **Tailored Additions & Removals**: Recommends specific bullet points to add (including STAR-structured examples) and low-value content to remove.

### 🎤 AI Mock Interview Engine
- **Interactive Chat Interface**: A text-based, interactive mock interview chatbot simulated via Google Gemini AI models.
- **Flexible Configurations**: Tailors interview focus (Technical, Behavioral, System Design) and difficulty levels (Easy, Medium, Hard).
- **STAR-Method Evaluation**: Provides granular scoring across relevance, technical accuracy, communication, confidence, structure, and problem solving.
- **Action Plan**: Outlines a 3-step prioritized study roadmap focusing on key areas for improvement.

### 🚀 AI Project Prep
- **GitHub Integration**: Pastes a public GitHub repository URL to fetch codebase metadata, languages, and README files.
- **Codebase-Specific Questions**: AI reviews project elements to generate specific technical questions on Architecture, Database choice, Security, Performance, Scalability, Deployment, and Design Trade-offs.
- **Detailed Hints**: Accompanying guidelines for each question to direct the candidate's talking points.

### 💼 Company Question Bank
- Curated catalog of actual interview questions from top tech companies including Google, Amazon, Microsoft, Meta, Apple, Netflix, and Uber.
- Filters questions by target company and difficulty level.
- Direct external links to LeetCode and System Design forums.

### 👥 Interactive Prototypes (Local State)
- **Peer Review Community**: High-fidelity prototype page to share uploaded resumes for community rating, commenting, and likes.
- **Admin Dashboard**: Frontend management desk to inspect session activities, user registrations, and toggle status blocks.

### 📊 Progress Analytics Hub
- Real-time visual progress monitoring using Recharts.
- Radar charts for category-wise mock interview skill ratings.
- Line/Area charts showing historical mock interview score trends.

### 🔐 Secure Authentication
- JWT-based authentication storing tokens in HTTPOnly secure cookies.
- Persistent session storage in React frontend utilizing Redux Toolkit.
- Client-side routing protections separating public and protected pages.

---

## Tech Stack

### Frontend
- **Framework**: React 18+ (Vite)
- **Programming Language**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **State Management**: Redux Toolkit (auth & session)
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Form Validation**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB (Mongoose ODM)
- **AI Orchestration**: LangChain Core + `@langchain/google-genai` (Gemini 2.5 Flash)
- **PDF Processing**: `pdf-parse`
- **File Upload**: Multer + Cloudinary (resume hosting)
- **Auth Utilities**: `jsonwebtoken` (JWT) + `bcryptjs`
- **Logging**: Morgan

---

## Project Structure

```
interview-project/
├── Backend/                 # Express backend server
│   ├── src/
│   │   ├── config/          # DB & Cloudinary configuration
│   │   ├── controllers/     # Route controller endpoints
│   │   ├── middlewares/     # Authentication & Multer upload middlewares
│   │   ├── models/          # MongoDB Mongoose schemas
│   │   ├── prompts/         # LangChain AI prompt templates
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # AI, GitHub API, PDF parse & business services
│   │   ├── utils/           # Error handling & API response formatting
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Main entry point (starts server and DB connection)
│   └── package.json
└── Fronted/                 # React frontend client
    ├── src/
    │   ├── context/         # Redux store configuration & Confirmation context
    │   ├── hooks/           # Custom React hooks (React Query integrations)
    │   ├── layouts/         # App Layout wrapper with sidebar navigation
    │   ├── pages/           # Client views & dashboards
    │   ├── routes/          # Public & protected React Router routes
    │   ├── services/        # Axios API fetch calls
    │   ├── styles/          # Tailwind custom variables & global index.css
    │   ├── App.tsx          # Root React component (restores user sessions)
    │   └── main.tsx         # Application entry point
    └── package.json
```
---

## Environment Variables

### Backend (`Backend/.env`)

Configure these keys in a `.env` file under the `/Backend` directory:

| Variable | Description | Example |
|---|---|---|
| `PORT` | Local port for Express API server | `5000` |
| `NODE_ENV` | Mode environment | `development` |
| `CLIENT_URL` | Frontend client origin URL | `http://localhost:5173` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/interviewos` |
| `JWT_SECRET` | Secret key used to sign JWT auth | `your_jwt_secret_key` |
| `GOOGLE_API_KEY` | Google AI Studio developer API key | `AIzaSy...` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary storage account name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `your_api_secret` |

### Frontend (`Fronted/.env`)

Configure this key in a `.env` file under the `/Fronted` directory:

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base endpoint path for the backend API | `http://localhost:5000/api` |

---

## Getting Started

### Prerequisites
- **Node.js** (v18.0 or higher)
- **MongoDB** (Local instance or Atlas cloud URI)
- **Google Gemini API Key** (obtained from [Google AI Studio](https://aistudio.google.com/))
- *(Optional)* **Cloudinary Account** (for saving PDF resumes in the cloud)

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/interview-project.git
   cd interview-project
   ```

2. **Configure environment variables**:
   - Create `Backend/.env` using `Backend/.env.example` as a template and fill in your keys.
   - Create `Fronted/.env` and verify the `VITE_API_BASE_URL` value.

3. **Start the Backend**:
   ```bash
   cd Backend
   npm install
   npm run dev
   ```
   *The backend will run on http://localhost:5000*

4. **Start the Frontend**:
   - Open a separate terminal window at the project root.
   ```bash
   cd Fronted
   npm install
   npm run dev
   ```
   *The frontend client will run on http://localhost:5173*

---

## Key Modules

- **Dashboard**: Central dashboard rendering aggregate stats, weekly improvement graphs, radar evaluations, upcoming tasks, and preparation logs.
- **Resume X-Ray**: Input target job descriptions and upload your resume PDF to receive granular keyword analysis, ATS reports, and structural suggestions.
- **Mock Interview**: Practice interactive text sessions against an AI interviewer (Technical, Behavioral, System Design) and get graded reports showing suggested model answers.
- **Project Prep**: Type in a public GitHub URL to inspect your repository's tech stack and immediately generate customized architecture, database, security, and scalability interview questions.
- **Question Bank**: Explore curated sets of interview questions categorized by top companies and difficulty levels.
- **Peer Review & Admin Dashboards**: Fully functioning frontend mockup dashboards allowing users to view student resumes, add stars, rate details, and simulate active session logs.

---

## Screenshots

### Dashboard
*Placeholder: Dashboard with stats, progress tracking chart, and radar visualization*

### AI Interview
*Placeholder: AI mock interview chat prompt and interactive feedback loop*

### Project Preparation
*Placeholder: Project Prep repository analyzer interface and tech-stack questions list*

### Mock Interview
*Placeholder: Active text mock session screen with timer, hint displays, and answering panel*

### Presentation Mode
*Placeholder: Interactive mock interview report outlining scores and better answer structures*

---

## Future Improvements

- **Database Persistence for Peer Reviews**: Connect the Peer Review Community module to a persistent backend database schema for sharing actual candidate reviews.
- **Verbal Practice (Speech-to-Text)**: Enable verbal mock interviews using browser speech recognition API to capture spoken answers.
- **Live Code Execution Sandbox**: Embed a web-based code editor (such as Monaco) to enable real-time programming challenge tests.
- **Advanced Admin Management**: Implement backend admin routers to manage actual user profiles, view metrics logs, and delete expired session entries.

---

## License

This project is licensed under the **ISC License** – see the `Backend/package.json` for details.
