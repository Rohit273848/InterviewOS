# 🎯 InterviewOS — AI-Powered Placement Co-Pilot

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2+-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.19+-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208+-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4?logo=google&logoColor=white)](https://aistudio.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

> **InterviewOS** is an all-in-one AI placement preparation suite designed for Computer Science students and software engineering job seekers. It features ATS resume parsing, interactive simulated AI technical & behavioral interviews using Google Gemini models, GitHub repository architecture analysis for project defense questions, and real-time skill analytics.

---

## 📑 Table of Contents

- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [⚡ Quick Start (2 Minutes)](#-quick-start-2-minutes)
- [🛠️ Detailed Step-by-Step Setup Guide](#️-detailed-step-by-step-setup-guide)
  - [Step 1: Clone the Repository](#step-1-clone-the-repository)
  - [Step 2: Backend Setup & Configuration](#step-2-backend-setup--configuration)
  - [Step 3: Verify Backend & AI Connection](#step-3-verify-backend--ai-connection)
  - [Step 4: Frontend Setup & Configuration](#step-4-frontend-setup--configuration)
  - [Step 5: Run Both Applications](#step-5-run-both-applications)
- [🔑 Environment Variables Reference](#-environment-variables-reference)
  - [Backend (.env)](#backend-env)
  - [Frontend (.env)](#frontend-env)
- [How to Obtain API Keys for Free](#-how-to-obtain-api-keys-for-free)
- [Available Scripts](#-available-scripts)
- [API Endpoints Summary](#-api-endpoints-summary)
- [🚨 Troubleshooting & FAQ](#-troubleshooting--faq)
- [Project Structure](#-project-structure)
- [License](#-license)
- [Author](#-author)

---

## ✨ Features

- **📄 AI Resume X-Ray**:
  - Upload PDF resumes to extract clean text via `pdf-parse`.
  - Calculates ATS score and candidate-role alignment percentage based on target Job Descriptions.
  - Generates detailed keyword gap analysis, missing industry buzzwords, and STAR-format bullet recommendations.

- **🎤 Interactive AI Mock Interview**:
  - Live AI interviewer simulated via Google Gemini (Gemini 2.5 Flash).
  - Customize by category (*Technical, Behavioral, System Design*) and difficulty (*Easy, Medium, Hard*).
  - Multi-turn conversation feedback with comprehensive post-session evaluation using the STAR framework.

- **🚀 AI Project Prep (GitHub Repo Inspector)**:
  - Paste any public GitHub repository link.
  - Automatically analyzes file structures, tech stack dependencies, and `README.md`.
  - Generates tough interview questions covering system architecture, database choices, scalability bottlenecks, and security trade-offs.

- **💼 Curated Company Question Bank**:
  - Categorized interview questions asked by top tech firms (*Google, Amazon, Microsoft, Meta, Netflix, Uber*).
  - Filterable by difficulty, topic, and company with direct practice links.

- **📊 Visual Analytics Dashboard**:
  - Interactive radar charts, historical performance curves, and score tracking powered by Recharts.

- **🔐 Robust Authentication & Security**:
  - JWT session management with secure `httpOnly` cookies.
  - Redux Toolkit for centralized auth state management and React Router protected route guards.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    User([User Browser]) <--> |Port 5173 / React + Vite| Frontend[Client Frontend\nDirectory: Fronted]
    Frontend <--> |REST API / JSON / Cookies\nhttp://localhost:5000/api| Backend[Express Backend\nDirectory: Backend]
    
    Backend <--> |Mongoose ODM| DB[(MongoDB\nLocal or Atlas Cloud)]
    Backend <--> |@langchain/google-genai| Gemini[Google Gemini 2.5 Flash\nAI Analysis & Mock Chat]
    Backend <--> |Multer + SDK| Cloudinary[(Cloudinary Storage\nResume PDFs - Optional)]
    Backend <--> |Octokit / REST| GitHub[GitHub REST API\nRepo Code Inspection]
```

---

## 💻 Tech Stack

| Area | Technology |
|---|---|
| **Frontend Framework** | React 18+ (Vite builder), TypeScript |
| **Styling & UI** | Tailwind CSS 3.4, Lucide React, Framer Motion |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`), React Redux |
| **Server State & Caching**| TanStack Query v5 (`@tanstack/react-query`), Axios |
| **Charts & Visualization**| Recharts |
| **Forms & Validation** | React Hook Form, Zod |
| **Backend Runtime** | Node.js (v18+) with ES Modules (`"type": "module"`) |
| **Web Framework** | Express 4.19 |
| **Database** | MongoDB (v6+) with Mongoose 8+ ODM |
| **AI Orchestration** | LangChain Core, `@langchain/google-genai` (Gemini 2.5 Flash) |
| **PDF Extraction** | `pdf-parse` |
| **File Uploads** | Multer + Cloudinary SDK |
| **Authentication** | JWT (`jsonwebtoken`), `bcryptjs`, `cookie-parser` |

---

## 📋 Prerequisites

Before setting up the project, make sure you have the following installed on your computer:

1. **Node.js** (v18.0.0 or higher, Node 20 LTS recommended)
   - Verify with: `node -v`
   - Download from: [https://nodejs.org/](https://nodejs.org/)
2. **npm** (v9.0.0 or higher, bundled with Node)
   - Verify with: `npm -v`
3. **MongoDB**:
   - **Option A (Local)**: [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed and running locally on port `27017`.
   - **Option B (Cloud - Recommended)**: Free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) M0 sandbox database URI.
4. **Google Gemini API Key** (Free):
   - Obtainable in under 1 minute from [Google AI Studio](https://aistudio.google.com/).

---

## ⚡ Quick Start (2 Minutes)

If you already have Node.js and MongoDB running, run these commands from the root directory:

```bash
# 1. Install all dependencies (Backend + Frontend) in one command
npm run install:all

# 2. Configure Backend environment
cp Backend/.env.example Backend/.env
# (On Windows CMD: copy Backend\.env.example Backend\.env)
# (On Windows PowerShell: Copy-Item Backend/.env.example Backend/.env)
# Open Backend/.env and paste your GOOGLE_API_KEY and MONGO_URI

# 3. Configure Frontend environment
cp Fronted/.env.example Fronted/.env
# (On Windows CMD: copy Fronted\.env.example Fronted\.env)
# (On Windows PowerShell: Copy-Item Fronted/.env.example Fronted/.env)

# 4. Start both servers in separate terminals:
# Terminal 1:
npm run dev:backend

# Terminal 2:
npm run dev:frontend
```

Now open **http://localhost:5173** in your web browser! 🎉

---

## 🛠️ Detailed Step-by-Step Setup Guide

### Step 1: Clone the Repository

Open your terminal or command prompt and clone the repository:

```bash
git clone https://github.com/Rohit273848/InterviewOS.git
cd InterviewOS
```

> ⚠️ **Note on Directory Names**:
> The frontend folder in this repository is named `Fronted` (without the 'n'). Keep this in mind when navigating paths in the terminal!

---

### Step 2: Backend Setup & Configuration

1. **Navigate to the Backend directory**:
   ```bash
   cd Backend
   ```

2. **Install backend dependencies**:
   ```bash
   npm install
   ```

3. **Create the environment file**:
   - **macOS / Linux**:
     ```bash
     cp .env.example .env
     ```
   - **Windows (PowerShell)**:
     ```powershell
     Copy-Item .env.example .env
     ```
   - **Windows (Command Prompt)**:
     ```cmd
     copy .env.example .env
     ```

4. **Edit `Backend/.env`**:
   Open `Backend/.env` in your code editor. At minimum, ensure the following keys are set:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173

   # MongoDB Connection
   MONGO_URI=mongodb://localhost:27017/interviewos
   # OR your MongoDB Atlas URI:
   # MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/interviewos?retryWrites=true&w=majority

   # JWT Secret Key (Any random 32+ character string)
   JWT_SECRET=super_secret_jwt_key_interviewos_2026_change_me

   # Google Gemini API Key (Get for free at https://aistudio.google.com/)
   GOOGLE_API_KEY=AIzaSyYourGeminiApiKeyHere

   # Cloudinary (Optional - leave default placeholders if not using Cloudinary)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # GitHub Token (Optional - increases rate limits for Project Prep)
   GITHUB_TOKEN=
   ```

---

### Step 3: Verify Backend & AI Connection

Before launching the servers, you can test your Google Gemini API key immediately with the included test script:

```bash
# Run from the Backend directory:
node test-gemini.js
```

If your key is valid, you will see:
```text
SUCCESS:
Artificial intelligence is the simulation of human intelligence processes by computer systems...
```

Now start the backend server in development mode:
```bash
npm run dev
```

You should see:
```text
MongoDB connected !! DB HOST: ...
🚀 Server is running on port: 5000
```

Keep this terminal window running.

---

### Step 4: Frontend Setup & Configuration

Open a **new terminal window** and navigate to the project root:

1. **Navigate to the Frontend directory**:
   ```bash
   cd Fronted
   ```
   *(Remember: folder name is `Fronted`)*

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Create the frontend environment file**:
   - **macOS / Linux**:
     ```bash
     cp .env.example .env
     ```
   - **Windows (PowerShell)**:
     ```powershell
     Copy-Item .env.example .env
     ```
   - **Windows (Command Prompt)**:
     ```cmd
     copy .env.example .env
     ```

4. **Verify `Fronted/.env`**:
   Ensure it points to the backend API:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

5. **Start the frontend development server**:
   ```bash
   npm run dev
   ```

You will see:
```text
  VITE v5.1.0  ready in 450 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Step 5: Run Both Applications

1. Open your browser and go to: **[http://localhost:5173](http://localhost:5173)**
2. Click **Get Started** or visit **[http://localhost:5173/register](http://localhost:5173/register)** to create an account.
3. Log in with your new account and explore the full suite of InterviewOS features!

---

## 🔑 Environment Variables Reference

### Backend (`Backend/.env`)

| Variable | Required | Default | Description | Example |
|---|:---:|---|---|---|
| `PORT` | No | `5000` | Port on which the Express server listens | `5000` |
| `NODE_ENV` | Yes | `development` | Environment mode (`development` or `production`). *Keep `development` for local testing so cookies work over HTTP!* | `development` |
| `CLIENT_URL` | Yes | `http://localhost:5173` | Allowed origin for CORS & cookie validation | `http://localhost:5173` |
| `MONGO_URI` | **Yes** | `mongodb://localhost:27017/interviewos` | MongoDB connection string (Local or MongoDB Atlas) | `mongodb+srv://user:pass@cluster.mongodb.net/interviewos` |
| `JWT_SECRET` | **Yes** | — | Secret string used to sign and verify JSON Web Tokens | `e83f...c289` |
| `GOOGLE_API_KEY` | **Yes** | — | Google Gemini API key used by LangChain | `AIzaSy...` |
| `CLOUDINARY_CLOUD_NAME` | No | — | Cloudinary cloud name for uploaded PDF resumes | `mycloud` |
| `CLOUDINARY_API_KEY` | No | — | Cloudinary API Key | `1234567890` |
| `CLOUDINARY_API_SECRET` | No | — | Cloudinary API Secret | `abcdef123456` |
| `GITHUB_TOKEN` | No | — | GitHub Personal Access Token (prevents rate limits on Project Prep) | `ghp_...` |

### Frontend (`Fronted/.env`)

| Variable | Required | Default | Description | Example |
|---|:---:|---|---|---|
| `VITE_API_BASE_URL` | No | `http://localhost:5000/api` | Full base endpoint of the backend API | `http://localhost:5000/api` |

---

## 🌐 How to Obtain API Keys for Free

### 1. Google Gemini API Key (Required for AI Features)
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **Get API key** in the sidebar.
4. Click **Create API key** (in a new or existing Google Cloud project).
5. Copy the generated key and paste it as `GOOGLE_API_KEY` in `Backend/.env`.
> 💡 *The Google Gemini free tier is completely free with generous rate limits.*

### 2. MongoDB Database (Required)
- **Local MongoDB**: Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community). Start the MongoDB service. Your URI is: `mongodb://localhost:27017/interviewos`.
- **Free Cloud MongoDB Atlas (Recommended)**:
  1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and register for a free account.
  2. Create a free **M0 Shared Cluster**.
  3. Under **Database Access**, create a user with a password (note down username and password).
  4. Under **Network Access**, click **Add IP Address** and select **Allow Access from Anywhere (`0.0.0.0/0`)** for development.
  5. Go to your cluster, click **Connect** -> **Drivers (Node.js)**, copy the connection string, replace `<password>` with your database user password, and set it as `MONGO_URI` in `Backend/.env`.

### 3. JWT Secret (Required)
Generate a strong 32-byte secret right from your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the printed string and paste it as `JWT_SECRET` in `Backend/.env`.

### 4. Cloudinary (Optional - For Resume Hosting)
1. Sign up for a free account at [Cloudinary](https://cloudinary.com/).
2. On your dashboard, copy **Cloud Name**, **API Key**, and **API Secret**.
3. Paste them into `Backend/.env`.
*(If omitted, resume parsing still works locally via Multer).*

### 5. GitHub Personal Access Token (Optional)
1. Visit [GitHub Personal Access Tokens](https://github.com/settings/tokens).
2. Generate a classic token with standard public read permissions.
3. Paste it as `GITHUB_TOKEN` in `Backend/.env` to allow up to 5,000 GitHub API calls/hr in Project Prep.

---

## 📜 Available Scripts

### Root Directory
| Command | Description |
|---|---|
| `npm run install:all` | Installs dependencies in both `Backend` and `Fronted` |
| `npm run dev:backend` | Starts the Express backend server with nodemon |
| `npm run dev:frontend` | Starts the Vite React frontend client |
| `npm run build` | Builds the frontend for production |

### Backend Directory (`cd Backend`)
| Command | Description |
|---|---|
| `npm run dev` | Runs backend in development mode with auto-reload (`nodemon`) |
| `npm start` | Runs backend in production mode (`node src/server.js`) |
| `node test-gemini.js` | Standalone script to test your Gemini API key |

### Frontend Directory (`cd Fronted`)
| Command | Description |
|---|---|
| `npm run dev` | Starts Vite local dev server with Hot Module Replacement (HMR) |
| `npm run build` | Type-checks with TypeScript and compiles the production bundle in `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint over all `.ts` and `.tsx` files |

---

## 📡 API Endpoints Summary

All routes are prefixed by `/api`.

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new candidate account |
| `POST` | `/api/auth/login` | Public | Log in user and receive JWT cookie |
| `POST` | `/api/auth/logout` | Public | Clear auth cookie |
| `GET` | `/api/auth/me` | Protected | Fetch current logged-in user profile |

### Resume X-Ray (`/api/interview`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/interview/generate` | Protected | Upload PDF resume + Job Description & generate ATS analysis |
| `GET` | `/api/interview/latest` | Protected | Fetch the user's latest generated resume report |
| `GET` | `/api/interview/:id` | Protected | Fetch report by unique ID |
| `GET` | `/api/interview/:id/resume` | Protected | Retrieve stored resume PDF URL |

### Mock Interview (`/api/mock-interview`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/mock-interview/start` | Protected | Initialize mock interview session with topic/difficulty |
| `POST` | `/api/mock-interview/session/:id/answer` | Protected | Submit candidate answer & receive next AI question |
| `POST` | `/api/mock-interview/session/:id/complete` | Protected | Finalize interview & generate STAR evaluation report |
| `GET` | `/api/mock-interview/session/:id/report` | Protected | Fetch comprehensive scoring breakdown |
| `GET` | `/api/mock-interview/history` | Protected | List past mock interview sessions |
| `GET` | `/api/mock-interview/analytics` | Protected | Fetch aggregate performance stats for charts |

### Project Prep (`/api/project-prep`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/project-prep/generate` | Protected | Inspect GitHub repo URL & generate technical questions |
| `GET` | `/api/project-prep/history` | Protected | Fetch previous project prep runs |
| `GET` | `/api/project-prep/:sessionId` | Protected | View questions & hints for a session |
| `DELETE` | `/api/project-prep/:sessionId` | Protected | Delete a saved project prep run |

---

## 🚨 Troubleshooting & FAQ

<details>
<summary><b>1. MongoDB connection failed / MongooseServerSelectionError</b></summary>

**Symptom**: `MongoDB connection failed !!! MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions**:
- **If using local MongoDB**: Ensure the MongoDB service is running.
  - Windows: Open Services (`services.msc`) -> find **MongoDB Server** -> click **Start**.
  - macOS: Run `brew services start mongodb-community`.
  - Linux: Run `sudo systemctl start mongod`.
- **If using MongoDB Atlas**:
  1. In Atlas, go to **Network Access** and verify that your IP or `0.0.0.0/0` (allow from anywhere) is whitelisted.
  2. Double-check that your username and password in `MONGO_URI` are correct and special characters are URL-encoded.
</details>

<details>
<summary><b>2. Google Gemini API Error / API_KEY_INVALID</b></summary>

**Symptom**: `[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com... API_KEY_INVALID`

**Solutions**:
1. Run `node test-gemini.js` inside the `Backend/` directory to inspect the exact error.
2. Confirm you copied the key correctly without surrounding quotes or whitespace in `Backend/.env`.
3. Check that your Google Cloud / AI Studio project has the **Generative Language API** enabled.
4. If you hit a `429 Too Many Requests`, you have exceeded the per-minute quota on the free tier; wait 60 seconds and retry.
</details>

<details>
<summary><b>3. Port 5000 is already in use (`EADDRINUSE: address already in use :::5000`)</b></summary>

**Symptom**: Backend crashes on start with `Error: listen EADDRINUSE: address already in use :::5000`.

**Solutions**:
- **On macOS**: Port 5000 is reserved by macOS **AirPlay Receiver**. You can turn it off:
  - Go to **System Settings** > **General** > **AirDrop & AirPlay** > Turn off **AirPlay Receiver**.
- **Alternative**: Change the backend port to `8000`:
  1. In `Backend/.env`, set `PORT=8000`.
  2. In `Fronted/.env`, set `VITE_API_BASE_URL=http://localhost:8000/api`.
  3. Restart both backend and frontend.
</details>

<details>
<summary><b>4. CORS error in browser console</b></summary>

**Symptom**: `Access to XMLHttpRequest at 'http://localhost:5000/api/auth/...' from origin 'http://localhost:5174' has been blocked by CORS policy.`

**Solutions**:
- Vite automatically increments the port to `5174` or `5175` if port `5173` is occupied.
- In `Backend/.env`, verify that `CLIENT_URL` matches your exact frontend address (e.g. `CLIENT_URL=http://localhost:5174`).
- Alternatively, stop whatever process is running on port 5173 and restart Vite so it runs on `http://localhost:5173`.
</details>

<details>
<summary><b>5. Logged in successfully, but protected pages redirect back to login (Cookie issue)</b></summary>

**Symptom**: You register or log in, but refreshing the page or navigating to `/dashboard` immediately redirects back to `/login`.

**Solutions**:
- Check `NODE_ENV` in `Backend/.env`. It **must** be `development` for local testing (`NODE_ENV=development`).
- When `NODE_ENV=production`, authentication cookies are sent with `secure: true`, which modern browsers refuse to accept over unencrypted `http://localhost`.
</details>

<details>
<summary><b>6. Cannot find module or path "Frontend"</b></summary>

**Symptom**: `The system cannot find the path specified: Frontend` or `cd: no such file or directory: Frontend`.

**Solutions**:
- The repository directory is spelled `Fronted` (without the 'n'). Run `cd Fronted` instead of `cd Frontend`.
</details>

<details>
<summary><b>7. Windows PowerShell Execution Policy Error</b></summary>

**Symptom**: `File ... nodemon.ps1 cannot be loaded because running scripts is disabled on this system.`

**Solutions**:
- Open PowerShell as Administrator and run:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```
  Then re-run `npm run dev`.
</details>

---

## 📁 Project Structure

```text
interview-project/
├── package.json                 # Root package with multi-package convenience scripts
├── .gitignore                   # Excludes node_modules, build outputs, and .env files
├── README.md                    # Main documentation
│
├── Backend/                     # Express REST API
│   ├── .env.example             # Backend environment variables template
│   ├── package.json             # Backend dependencies & scripts
│   ├── test-gemini.js           # Verification test script for Google Gemini
│   └── src/
│       ├── config/              # MongoDB & Cloudinary configuration
│       │   ├── db.js
│       │   └── cloudinary.js
│       ├── controllers/         # Request handling & response serialization
│       │   ├── auth.controller.js
│       │   ├── interview.controller.js
│       │   ├── mockInterview.controller.js
│       │   └── projectPrep.controller.js
│       ├── middlewares/         # JWT verification, upload handling & error traps
│       ├── models/              # Mongoose database schemas
│       │   ├── user.model.js
│       │   ├── report.model.js
│       │   ├── mockInterview.model.js
│       │   └── projectPrep.model.js
│       ├── prompts/             # LangChain prompts & system instructions
│       ├── routes/              # Express API route mapping
│       ├── services/            # Gemini AI service, GitHub parser, and PDF extractor
│       ├── utils/               # ApiError, ApiResponse & token helpers
│       ├── app.js               # Express application setup, CORS & middlewares
│       └── server.js            # Database connector and HTTP server entrypoint
│
└── Fronted/                     # React + Vite client (Note the folder spelling)
    ├── .env.example             # Frontend environment variables template
    ├── package.json             # Frontend dependencies & scripts
    ├── vite.config.ts           # Vite build configuration
    ├── tailwind.config.js       # Tailwind CSS design system tokens
    ├── tsconfig.json            # TypeScript configuration
    └── src/
        ├── context/             # Redux Toolkit store & modal confirmation state
        ├── hooks/               # TanStack Query custom hooks
        ├── layouts/             # App shell with responsive sidebar & navigation
        ├── pages/               # Views: Dashboard, ResumeXRay, MockInterview, ProjectPrep, etc.
        ├── routes/              # Public & Protected route definitions
        ├── services/            # Axios instance with credentials & base API endpoints
        ├── styles/              # Global CSS & Tailwind layers
        ├── App.tsx              # Root React component with session restoration
        └── main.tsx             # React DOM root render
```

---

## 📄 License

This project is open-source software licensed under the **[ISC License](https://opensource.org/licenses/ISC)**.
See the `Backend/package.json` for license declaration.

---

## 👨‍💻 Author

**Rohit Mahajan**
- 🌐 **Portfolio**: [rohit-mahajan-ai.vercel.app](https://rohit-mahajan-ai.vercel.app/)
- 🐙 **GitHub**: [@Rohit273848](https://github.com/Rohit273848)
- 💼 **LinkedIn**: [Rohit Mahajan](https://www.linkedin.com/feed/)

---

<p align="center">
  Built with ❤️ by <a href="https://rohit-mahajan-ai.vercel.app/">Rohit Mahajan</a> for tech students and placement aspirants worldwide.
</p>
