# 🚀 InterviewOS - Your AI Placement Co-Pilot

A world-class, production-grade frontend for an AI-powered placement preparation platform built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **🔐 Authentication System** - Complete sign up, sign in, and logout functionality
- **🛡️ Protected Routes** - Secure dashboard with route protection
- **📄 Resume X-Ray** - AI-powered resume analysis with actionable insights
- **💼 Question Bank** - Company-specific interview questions from real candidates
- **🚀 Project Prep** - AI generates interview questions from GitHub projects
- **🎤 Mock Interview** - Text-based AI interview practice (NO camera/mic needed)
- **👥 Peer Review** - Community resume feedback system
- **📊 Beautiful Dashboard** - Track your progress with stunning visualizations
- **💾 User Session Management** - Redux-powered state management

## 🛠️ Tech Stack

- **React 18+** with Vite
- **TypeScript** (strict mode)
- **Tailwind CSS 3+** for styling
- **Redux Toolkit** for state management
- **React Router v6** for navigation
- **Framer Motion** for smooth animations
- **Recharts** for data visualization
- **Lucide React** for modern icons
- **React Hook Form + Zod** for form validation
- **React Hot Toast** for notifications

## 🎨 Design System

- Dark theme by default
- Generous white space
- Subtle gradients and glows
- Smooth micro-interactions
- Card-based layouts
- Color-coded feature sections

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

## 📁 Project Structure

```
interviewos/
├── src/
│   ├── components/
│   │   ├── Layout.tsx          # Main layout with sidebar
│   │   └── ProtectedRoute.tsx  # Route protection component
│   ├── pages/
│   │   ├── LandingPage.tsx     # Hero landing page
│   │   ├── SignIn.tsx          # Sign in page
│   │   ├── SignUp.tsx          # Sign up page
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── ResumeXRay.tsx      # Resume analyzer
│   │   ├── QuestionBank.tsx    # Interview questions
│   │   ├── ProjectPrep.tsx     # GitHub project prep
│   │   ├── MockInterview.tsx   # AI mock interviews
│   │   └── PeerReview.tsx      # Community reviews
│   ├── store/
│   │   ├── index.ts            # Redux store
│   │   └── slices/             # Redux slices
│   │       ├── userSlice.ts    # User authentication state
│   │       └── resumeSlice.ts  # Resume analysis state
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── README.md
├── AUTH_GUIDE.md               # Authentication documentation
└── DEMO_GUIDE.md               # Complete demo walkthrough
```

## 🎯 Key Features Implemented

### Authentication System
- Sign up page with form validation
- Sign in page with password toggle
- Logout functionality (sidebar + header)
- Protected routes with automatic redirect
- User session management with Redux
- Social login UI (Google & GitHub ready)

### Landing Page
- Animated hero section with gradient backgrounds
- Feature showcase with hover effects
- Stats section
- Call-to-action sections
- Responsive design

### Dashboard
- Real-time stats cards
- Progress charts (Line & Area charts)
- Skills radar chart
- Upcoming tasks list
- Recent activity feed
- Quick action buttons

### Resume X-Ray
- File upload interface
- AI analysis simulation
- Score visualization
- Strengths, weaknesses, and suggestions
- Beautiful card layouts

### Question Bank
- Company filter
- Search functionality
- Difficulty badges
- Category tags
- Interactive question cards

### Project Prep
- GitHub URL input
- AI question generation
- Animated question list
- Pro tips section

### Mock Interview
- Video interface simulation
- Mic and camera controls
- Question progression
- Interview settings
- Tips sidebar

### Peer Review
- Review submission
- Community stats
- Review cards with ratings
- Like and reply functionality
- Call-to-action for reviewers

## 🎨 Design Highlights

- **Color Palette:**
  - Cyan (#22D3EE) - Primary accent
  - Purple (#8B5CF6) - Secondary accent
  - Yellow (#FACC15) - Warning/highlight
  - Pink (#F472B6) - Special features
  - Green (#10B981) - Success states

- **Typography:**
  - Inter for headings and body
  - JetBrains Mono for code

- **Animations:**
  - Framer Motion for page transitions
  - Hover effects on all interactive elements
  - Smooth micro-interactions
  - Gradient animations

## 🚀 Performance

- Vite for lightning-fast HMR
- Code splitting with React Router
- Protected route optimization
- Optimized bundle size
- Lazy loading ready
- Production-ready build

## 📚 Documentation

- **README.md** - Main documentation
- **AUTH_GUIDE.md** - Complete authentication guide
- **DEMO_GUIDE.md** - Step-by-step demo walkthrough
- **QUICKSTART.md** - Quick start instructions
- **HOW_TO_RUN.md** - Detailed run guide

## 📱 Responsive Design

- Mobile-first approach
- Tablet optimized
- Desktop enhanced
- Fluid typography
- Flexible layouts

## 🎓 Perfect For

- Final-year CS students
- Placement preparation
- Interview practice
- Resume building
- Skill tracking

## 📄 License

Built with ❤️ for students by students.

---

**Ready to ace your placement? Start your journey with InterviewOS today!** 🎯
