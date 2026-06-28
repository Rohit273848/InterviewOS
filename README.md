# InterviewOS

> **Your AI-Powered Placement Co-Pilot** – Master interview preparation with intelligent resume analysis, real company questions, AI-driven mock interviews, and community peer reviews.

---

## 🎯 Status & Quick Links

![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Lightning-646CFF?style=flat-square&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

[🚀 Live Demo](#live-demo) • [📖 Documentation](#documentation) • [🎨 Design System](#design-system) • [⚡ Performance](#performance-optimization)


## 📌 About the Project

**InterviewOS** is a production-grade, AI-powered platform designed to help students ace their placement interviews. It combines intelligent resume analysis, company-specific question banks, AI-driven mock interviews, and community peer reviews—all wrapped in a sleek, modern interface.

Built for **final-year CS students** and **placement aspirants**, InterviewOS bridges the gap between interview preparation and real-world practice with tools powered by AI insights and real candidate experiences.

### Why InterviewOS?

- ✅ **No Camera/Mic Required** – Practice interviews comfortably without pressure
- ✅ **Company-Specific Questions** – Prepared by real candidates, not generic
- ✅ **Instant Resume Feedback** – AI analyzes and suggests improvements instantly
- ✅ **GitHub Integration** – Auto-generate interview questions from your projects
- ✅ **Community-Driven** – Get peer reviews and learn from others

---

## ✨ Core Features

### 🔐 **Secure Authentication System**
- Full sign-up and sign-in workflow with validation
- Password security with visibility toggle
- Social login UI (Google & GitHub ready)
- Persistent session management with Redux
- Protected routes with automatic redirects

### 📄 **Resume X-Ray**
- AI-powered resume analysis engine
- Automated strengths and weaknesses detection
- Actionable improvement suggestions
- Visual score breakdown
- Export-friendly insights

### 💼 **Company Question Bank**
- 500+ real interview questions from actual candidates
- Filter by company and role
- Difficulty level indicators
- Category-based organization
- Bookmark for personalized prep

### 🚀 **Project Prep**
- Paste GitHub URL → Get interview questions
- AI-generated questions specific to your project tech stack
- Detailed solutions and explanations
- Best practice tips included
- Multi-language support

### 🎤 **Mock Interview Engine**
- Text-based AI interviewer (no camera/mic)
- Real-time feedback on answers
- Interview progression tracking
- Customizable difficulty levels
- Interview history and analytics

### 👥 **Peer Review Community**
- Submit resumes for community feedback
- Structured review format with scoring
- Rate and discuss with other students
- Leaderboards and contribution stats
- Anonymous review option

### 📊 **Progress Dashboard**
- Real-time performance metrics
- Skill radar visualization
- Interview history tracking
- Personalized task list
- Activity feed with achievements

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18+ | UI component library |
| **Language** | TypeScript (Strict) | Type safety & scalability |
| **Styling** | Tailwind CSS 3+ | Utility-first CSS |
| **State** | Redux Toolkit | Global state management |
| **Routing** | React Router v6 | Client-side navigation |
| **Forms** | React Hook Form + Zod | Validation & submission |
| **Charts** | Recharts | Data visualization |
| **Icons** | Lucide React | Modern SVG icons |
| **Animation** | Framer Motion | Smooth transitions |
| **Notifications** | React Hot Toast | User feedback |
| **Build Tool** | Vite | Lightning-fast HMR |
| **Package Manager** | npm/pnpm | Dependency management |

---

## 📸 Screenshots

### Landing Page
![Landing Page Placeholder](https://via.placeholder.com/1200x600?text=Landing+Page+with+Hero+Section+and+Features)

### Dashboard
![Dashboard Placeholder](https://via.placeholder.com/1200x600?text=Main+Dashboard+with+Analytics)

### Resume X-Ray
![Resume Analysis Placeholder](https://via.placeholder.com/1200x600?text=Resume+Analysis+Results)

### Mock Interview
![Mock Interview Placeholder](https://via.placeholder.com/1200x600?text=AI+Mock+Interview+Interface)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/interviewos.git
   cd interviewos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   Navigate to http://localhost:5173
   ```

### Building for Production

```bash
npm run build
```

The optimized production build will be generated in the `dist/` folder.

---

## 📖 Usage Guide

### First Time Users

1. **Create an Account**
   - Sign up with email or social login
   - Complete your profile setup

2. **Upload Your Resume**
   - Go to Resume X-Ray
   - Upload your resume for instant AI analysis
   - Review suggestions and improve

3. **Explore Questions**
   - Browse the Question Bank by company
   - Filter by role and difficulty
   - Bookmark favorites

4. **Practice Interviews**
   - Start a mock interview
   - Answer AI-generated questions
   - Get instant feedback

5. **Get Peer Feedback**
   - Submit your resume for reviews
   - Review others' resumes
   - Build community connections

### Navigation

- **Dashboard** – View all metrics and progress
- **Resume X-Ray** – Upload and analyze resume
- **Question Bank** – Browse company-specific questions
- **Project Prep** – Generate questions from GitHub projects
- **Mock Interview** – Practice with AI interviewer
- **Peer Review** – Community feedback platform

---

## 📁 Project Structure

```
interviewos/
├── src/
│   ├── components/
│   │   ├── Layout.tsx              # Main layout wrapper
│   │   ├── ProtectedRoute.tsx      # Route security
│   │   └── ...other components
│   ├── pages/
│   │   ├── LandingPage.tsx         # Public landing
│   │   ├── SignIn.tsx              # Authentication
│   │   ├── SignUp.tsx              # Registration
│   │   ├── Dashboard.tsx           # Main hub
│   │   ├── ResumeXRay.tsx          # Resume analyzer
│   │   ├── QuestionBank.tsx        # Q&A library
│   │   ├── ProjectPrep.tsx         # GitHub integration
│   │   ├── MockInterview.tsx       # AI practice
│   │   └── PeerReview.tsx          # Community reviews
│   ├── store/
│   │   ├── index.ts                # Redux setup
│   │   └── slices/
│   │       ├── userSlice.ts        # Auth state
│   │       └── resumeSlice.ts      # Analysis state
│   ├── App.tsx                     # App root
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🎨 Design System

### Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Cyan | `#22D3EE` | Interactive elements, highlights |
| Secondary Purple | `#8B5CF6` | Accents, secondary actions |
| Success Green | `#10B981` | Success states, confirmations |
| Warning Yellow | `#FACC15` | Alerts, important info |
| Special Pink | `#F472B6` | Featured sections, CTAs |
| Dark Background | `#0F172A` | Primary dark theme |

### Typography

- **Headings** – Inter family (Bold, 600-700 weight)
- **Body Text** – Inter family (Regular, 400 weight)
- **Code** – JetBrains Mono (monospace)
- **Scale** – 12px to 64px with fluid sizing

### Design Principles

- **Dark Theme First** – Optimized for long study sessions
- **Card-Based Layout** – Clear information hierarchy
- **Generous Spacing** – Reduces cognitive load
- **Micro-Interactions** – Smooth hover and focus states
- **Gradient Accents** – Subtle visual depth
- **Accessible Colors** – WCAG AA compliant

---

## ⚡ Performance Optimization

### Build Performance
- **Vite HMR** – Sub-100ms hot module replacement
- **Code Splitting** – Automatic route-based splitting
- **Tree Shaking** – Unused code elimination
- **Production Bundle** – ~150KB gzipped

### Runtime Performance
- **Redux Selectors** – Optimized state subscriptions
- **Lazy Loading** – Route components loaded on-demand
- **Memoization** – Prevents unnecessary re-renders
- **Image Optimization** – WebP with fallbacks

### Lighthouse Metrics (Target)
- **Performance** – 90+
- **Accessibility** – 95+
- **Best Practices** – 95+
- **SEO** – 95+

---

## 📱 Responsive Design

- **Mobile First** – Optimized for small screens (375px+)
- **Tablet Enhanced** – Perfect layout at 768px+
- **Desktop Optimized** – Full experience at 1440px+
- **Fluid Typography** – Scales with viewport
- **Touch Friendly** – 48px minimum tap targets

### Tested on
- ✅ iOS Safari 14+
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Samsung Internet 14+

---

## 🔄 State Management

**Redux Architecture:**

```typescript
// User authentication
store.userSlice
  ├── isAuthenticated
  ├── userDetails
  └── sessionToken

// Resume analysis
store.resumeSlice
  ├── analysisResults
  ├── loading
  └── error
```

All state updates are logged for debugging in development.

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `README.md` | Project overview (this file) |
| `AUTH_GUIDE.md` | Authentication implementation details |
| `DEMO_GUIDE.md` | Step-by-step walkthrough of all features |
| `QUICKSTART.md` | 5-minute setup guide |
| `HOW_TO_RUN.md` | Detailed running instructions |

---

## 🎯 Live Demo

**Coming Soon!** The application will be live at:
- 🌐 [interviewos.vercel.app](https://interviewos.vercel.app) *(placeholder)*
- 📱 Mobile: [m.interviewos.vercel.app](https://m.interviewos.vercel.app) *(placeholder)*

**Demo Credentials:**
- Email: `demo@interviewos.com`
- Password: `Demo123!`

---

## 🚀 Future Improvements

### Phase 2 (Q2 2024)
- [ ] Video recording for mock interviews
- [ ] Real-time coding interview simulator
- [ ] LinkedIn integration for resume import
- [ ] Notification system (email/push)
- [ ] Interview scheduler with reminders

### Phase 3 (Q3 2024)
- [ ] ML-based resume scoring algorithm
- [ ] Speech-to-text for verbal practice
- [ ] Interview transcription & analysis
- [ ] Personalized learning recommendations
- [ ] Mentor matching system

### Phase 4 (Q4 2024)
- [ ] Mobile app (React Native)
- [ ] Batch processing for institutions
- [ ] Advanced analytics dashboard
- [ ] Gamification & leaderboards
- [ ] API for third-party integrations

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Code Standards:**
- TypeScript strict mode required
- Prettier formatting
- ESLint compliance
- 80%+ test coverage

---

## 📄 License

This project is licensed under the **MIT License** – see [LICENSE](./LICENSE) file for details.

Built with ❤️ by students, for students.

---

## 📞 Support & Feedback

- **Issues** – Report bugs on [GitHub Issues](https://github.com/yourusername/interviewos/issues)
- **Discussions** – Join our [GitHub Discussions](https://github.com/yourusername/interviewos/discussions)
- **Email** – support@interviewos.com *(placeholder)*
- **Twitter** – [@interviewos](https://twitter.com/interviewos) *(placeholder)*

---

## 🙏 Acknowledgments

- React community for excellent documentation
- Tailwind CSS for utility-first styling
- All students who provided feedback during beta testing
- Open-source contributors and libraries that made this possible

---

<div align="center">

**[⬆ Back to Top](#interviewos)**

Made with 🔥 for placement success

![GitHub Stars](https://img.shields.io/github/stars/yourusername/interviewos?style=social)
![GitHub Forks](https://img.shields.io/github/forks/yourusername/interviewos?style=social)
![GitHub Follow](https://img.shields.io/github/followers/yourusername?style=social)

</div>
