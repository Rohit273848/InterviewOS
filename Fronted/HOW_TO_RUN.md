# 🎯 HOW TO RUN INTERVIEWOS

## Method 1: Quick Start (Recommended)

### Step 1: Open Terminal
Open your terminal in the project directory (where package.json is located)

### Step 2: Install Dependencies
```bash
npm install
```
⏱️ Wait 2-3 minutes for installation to complete

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Open Browser
Go to: **http://localhost:5173**

🎉 **That's it! You should see the InterviewOS landing page!**

---

## Method 2: Using Setup Script (macOS/Linux)

```bash
chmod +x setup.sh
./setup.sh
npm run dev
```

---

## 📱 What You'll See

### 1. Landing Page (/)
- Animated hero section
- "Your AI Placement Co-Pilot" tagline
- Feature cards with hover effects
- Stats: 10K+ Students, 500+ Companies, etc.
- "Get Started" button → takes you to Dashboard

### 2. Dashboard (/dashboard)
- Welcome message with your name
- 4 stat cards (Resume Score, Questions Solved, Mock Interviews, Skill Rating)
- Progress chart showing improvement over time
- Skills radar chart
- Upcoming tasks list
- Recent activity feed

### 3. Resume X-Ray (/resume-xray)
- Upload resume interface
- Click "Analyze Resume" button
- See AI-generated score (85/100)
- View strengths, weaknesses, and suggestions

### 4. Question Bank (/question-bank)
- Search bar for questions
- Company filter buttons (Google, Amazon, Microsoft, etc.)
- Question cards with difficulty levels
- "Solve" button on each question

### 5. Project Prep (/project-prep)
- GitHub URL input field
- "Generate Questions" button
- AI-generated interview questions about your project

### 6. Mock Interview (/mock-interview)
- Video interface (simulated)
- Mic and camera controls
- Start/Stop interview buttons
- Interview settings (type, difficulty, duration)
- Question progression

### 7. Peer Review (/peer-review)
- Upload resume for community review
- View reviews from other students
- Star ratings and comments
- Like and reply functionality

---

## 🎨 Design Features to Notice

✨ **Animations**
- Smooth page transitions
- Floating gradient orbs in background
- Hover effects on all cards
- Scale animations on buttons

🎨 **Colors**
- Cyan (#22D3EE) - Primary
- Purple (#8B5CF6) - Secondary
- Yellow (#FACC15) - Highlights
- Pink (#F472B6) - Special
- Green (#10B981) - Success

📊 **Charts**
- Area chart for progress
- Radar chart for skills
- Interactive tooltips

---

## 🔧 Available Commands

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🌐 URLs

- **Development:** http://localhost:5173
- **Landing Page:** http://localhost:5173/
- **Dashboard:** http://localhost:5173/dashboard
- **Resume X-Ray:** http://localhost:5173/resume-xray
- **Question Bank:** http://localhost:5173/question-bank
- **Project Prep:** http://localhost:5173/project-prep
- **Mock Interview:** http://localhost:5173/mock-interview
- **Peer Review:** http://localhost:5173/peer-review

---

## ✅ Checklist

- [ ] Node.js installed (v18 or higher)
- [ ] npm installed
- [ ] Terminal open in project directory
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Open http://localhost:5173
- [ ] See beautiful landing page
- [ ] Click "Get Started" button
- [ ] Explore all features

---

## 🚨 Common Issues

### Issue: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Issue: "Port 5173 already in use"
**Solution:** Vite will automatically use next available port (5174, 5175, etc.)

### Issue: "Module not found"
**Solution:** Run `npm install` again

### Issue: Styles not loading
**Solution:** Make sure Tailwind CSS is configured. Restart dev server.

---

## 🎓 Next Steps

1. ✅ Get the app running
2. 🎨 Explore all pages
3. 🔍 Check the code structure
4. 🛠️ Customize colors/content
5. 🚀 Deploy to production

---

## 📞 Need Help?

Check these files:
- `README.md` - Full documentation
- `QUICKSTART.md` - Quick start guide
- `package.json` - Dependencies and scripts

---

**Enjoy your world-class InterviewOS frontend!** 🎉✨
