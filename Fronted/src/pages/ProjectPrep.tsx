import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderGit2,
  Github,
  Sparkles,
  Trash2,
  History,
  Code,
  BookOpen,
  Key,
  Search,
  FileText,
  Activity,
  Terminal,
  ArrowRight,
  Filter,
  Settings as SettingsIcon,
  HelpCircle,
  Briefcase,
  AlertOctagon,
  Award,
  Tv,
  Heart,
  Download,
  Menu,
  X,
  Network,
  Video,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useProjectPrep } from '../hooks/useProjectPrep';
import { useConfirm } from '../context/ConfirmContext';

// Import subcomponents
import { DashboardView } from './projectPrep/DashboardView';
import { ProjectInfoView } from './projectPrep/ProjectInfoView';
import { SummaryView } from './projectPrep/SummaryView';
import { ArchitectureView } from './projectPrep/ArchitectureView';
import { DeepDiveView } from './projectPrep/DeepDiveView';
import { QuestionsView } from './projectPrep/QuestionsView';
import { MockInterviewView } from './projectPrep/MockInterviewView';
import { VivaPrepView } from './projectPrep/VivaPrepView';
import { HRInterviewView } from './projectPrep/HRInterviewView';
import { ChallengesView } from './projectPrep/ChallengesView';
import { STARStoryView } from './projectPrep/STARStoryView';
import { PresentationView } from './projectPrep/PresentationView';
import { ProjectHealthView } from './projectPrep/ProjectHealthView';
import { ExportCenterView } from './projectPrep/ExportCenterView';
import { SettingsView } from './projectPrep/SettingsView';
import { AICopilotPanel } from './projectPrep/AICopilotPanel';

const DEMO_REPOSITORIES = [
  { name: 'React', url: 'https://github.com/facebook/react', desc: 'UI library' },
  { name: 'Next.js', url: 'https://github.com/vercel/next.js', desc: 'React Framework' },
  { name: 'Express', url: 'https://github.com/expressjs/express', desc: 'Node.js server framework' },
  { name: 'Tailwind CSS', url: 'https://github.com/tailwindlabs/tailwindcss', desc: 'Utility CSS engine' }
];

type WorkspaceTab =
  | 'dashboard'
  | 'info'
  | 'summary'
  | 'architecture'
  | 'deepdive'
  | 'questions'
  | 'mock'
  | 'viva'
  | 'hr'
  | 'challenges'
  | 'star'
  | 'presentation'
  | 'health'
  | 'export'
  | 'settings';

const ProjectPrep = () => {
  const confirm = useConfirm();
  const [githubUrl, setGithubUrl] = useState('');
  const [token, setToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>(undefined);

  // Navigation states
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('dashboard');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showDesktopSidebar, setShowDesktopSidebar] = useState(true);

  // Ingestion terminal states
  const [progress, setProgress] = useState(0);
  const [progressLogs, setProgressLogs] = useState<{ msg: string; type: string; timestamp: string }[]>([]);
  const [visualLoading, setVisualLoading] = useState(false);

  // Autosave status indicator
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // Bookmarked & Mastered list states
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});
  const [mastered, setMastered] = useState<Record<number, boolean>>({});

  // History search configurations
  const [historySearch, setHistorySearch] = useState('');
  const [historyLangFilter, setHistoryLangFilter] = useState('All');

  // Hook mappings
  const {
    history,
    isLoadingHistory,
    activeSession,
    generateQuestions,
    isGenerating,
    deleteSessionRecord
  } = useProjectPrep(selectedSessionId);

  // Sync Bookmarks & Mastered states when activeSession changes
  useEffect(() => {
    if (activeSession) {
      const savedBookmarks = localStorage.getItem(`prep_bookmarks_${activeSession._id}`);
      if (savedBookmarks) {
        try { setBookmarks(JSON.parse(savedBookmarks)); } catch { setBookmarks({}); }
      } else {
        setBookmarks({});
      }

      const savedMastered = localStorage.getItem(`prep_mastered_${activeSession._id}`);
      if (savedMastered) {
        try { setMastered(JSON.parse(savedMastered)); } catch { setMastered({}); }
      } else {
        setMastered({});
      }
    }
  }, [activeSession]);

  const toggleBookmark = (idx: number) => {
    if (!activeSession) return;
    const newBookmarks = { ...bookmarks, [idx]: !bookmarks[idx] };
    setBookmarks(newBookmarks);
    localStorage.setItem(`prep_bookmarks_${activeSession._id}`, JSON.stringify(newBookmarks));
    toast.success(newBookmarks[idx] ? 'Question bookmarked!' : 'Bookmark removed.');
  };

  const toggleMastered = (idx: number) => {
    if (!activeSession) return;
    const newMastered = { ...mastered, [idx]: !mastered[idx] };
    setMastered(newMastered);
    localStorage.setItem(`prep_mastered_${activeSession._id}`, JSON.stringify(newMastered));
    toast.success(newMastered[idx] ? 'Marked as mastered!' : 'Unmarked question.');
  };

  // Ingestion logger effect
  useEffect(() => {
    if (isGenerating) {
      setVisualLoading(true);
      setProgress(5);
      setProgressLogs([
        { msg: 'Establishing WebSocket connection to system stream...', type: 'ws', timestamp: '00:00.02' }
      ]);

      const startTime = Date.now();
      const getElapsed = () => {
        const ms = Date.now() - startTime;
        const s = Math.floor(ms / 1000);
        const centi = Math.floor((ms % 1000) / 10);
        return `${s.toString().padStart(2, '0')}:${centi.toString().padStart(2, '0')}`;
      };

      const logsSequence = [
        { trigger: 15, msg: '[WS] Authenticated. Codebase analysis session initialized.', type: 'ws' },
        { trigger: 30, msg: '[GIT] Pulling repository hierarchy, branches and config manifest...', type: 'git' },
        { trigger: 48, msg: '[PARSE] Mapping file structures & dependency tree schemas...', type: 'parse' },
        { trigger: 65, msg: '[ANALYSIS] Scanning README.md for deployment trade-offs & details...', type: 'analysis' },
        { trigger: 82, msg: '[AI] Dispatching repository payload metadata to Gemini-2.5-flash...', type: 'ai' },
        { trigger: 94, msg: '[AI] Formulating questions, answer hints, and conceptual rubrics...', type: 'ai' },
      ];

      const interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return 95;
          const next = prev + Math.floor(Math.random() * 4) + 2;

          logsSequence.forEach((item) => {
            if (next >= item.trigger) {
              setProgressLogs((prevLogs) => {
                if (prevLogs.some((l) => l.msg === item.msg)) return prevLogs;
                return [...prevLogs, { msg: item.msg, type: item.type, timestamp: getElapsed() }];
              });
            }
          });

          return next > 95 ? 95 : next;
        });
      }, 350);

      return () => clearInterval(interval);
    } else {
      if (progress > 0) {
        setProgress(100);
        setProgressLogs((prev) => [
          ...prev,
          { msg: '[DONE] Context parsed! System prep questions synthesized successfully.', type: 'success', timestamp: 'Done' }
        ]);

        const transition = window.setTimeout(() => {
          setVisualLoading(false);
          setProgress(0);
          setProgressLogs([]);
        }, 900);

        return () => clearTimeout(transition);
      }
    }
  }, [isGenerating]);

  const handleGenerate = async (targetUrl?: string) => {
    const url = targetUrl || githubUrl;
    if (!url) {
      toast.error('Please enter a GitHub URL');
      return;
    }

    try {
      const session = await generateQuestions({
        githubUrl: url,
        token: token ? token.trim() : null
      });
      setSelectedSessionId(session._id);
      setGithubUrl('');
      setToken('');
      setShowTokenInput(false);
    } catch (error) { }
  };

  const handleSelectHistory = (id: string) => {
    setSelectedSessionId(id);
    setActiveTab('dashboard');
  };

  const handleDeleteHistory = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const isConfirmed = await confirm('Are you sure you want to delete this session?', {
      title: 'Delete Session',
      confirmText: 'Delete',
      variant: 'danger'
    });
    if (isConfirmed) {
      try {
        await deleteSessionRecord(id);
        if (selectedSessionId === id) {
          setSelectedSessionId(undefined);
        }
      } catch (error) { }
    }
  };

  const allLanguagesInHistory = Array.from(
    new Set(history.flatMap((item) => item.languages || []))
  );

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.repoName.toLowerCase().includes(historySearch.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(historySearch.toLowerCase());
    const matchesLang = historyLangFilter === 'All' ||
      item.languages.some((lang) => lang.toLowerCase() === historyLangFilter.toLowerCase());
    return matchesSearch && matchesLang;
  });

  const totalQuestions = activeSession?.generatedQuestions?.length || 0;
  const masteredCount = activeSession ? activeSession.generatedQuestions.filter((_, i) => mastered[i]).length : 0;
  const readinessPercentage = totalQuestions > 0 ? Math.round((masteredCount / totalQuestions) * 100) : 0;

  // Sidebar list configurations
  const sidebarItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
    { id: 'info' as const, label: 'Project Info', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'summary' as const, label: 'Project Summary', icon: <FileText className="w-4 h-4" /> },
    { id: 'architecture' as const, label: 'Architecture Studio', icon: <Network className="w-4 h-4" /> },
    { id: 'deepdive' as const, label: 'Technical Deep Dive', icon: <Code className="w-4 h-4" /> },
    { id: 'questions' as const, label: 'Interview Questions', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'mock' as const, label: 'AI Mock Interview', icon: <Video className="w-4 h-4" /> },
    { id: 'viva' as const, label: 'Viva Preparation', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'hr' as const, label: 'HR Interview', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'challenges' as const, label: 'Challenges Logs', icon: <AlertOctagon className="w-4 h-4" /> },
    { id: 'star' as const, label: 'STAR Stories', icon: <Award className="w-4 h-4" /> },
    { id: 'presentation' as const, label: 'Presentation Studio', icon: <Tv className="w-4 h-4" /> },
    { id: 'health' as const, label: 'Project Health', icon: <Heart className="w-4 h-4" /> },
    { id: 'export' as const, label: 'Export Center', icon: <Download className="w-4 h-4" /> },
    { id: 'settings' as const, label: 'Settings', icon: <SettingsIcon className="w-4 h-4" /> }
  ];

  return (
    <div className="p-1 md:p-4 max-w-7xl mx-auto space-y-6 select-none text-slate-800 dark:text-slate-100">

      {/* Visual Ingest In progress overlays */}
      <AnimatePresence>
        {visualLoading && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-teal-400 animate-pulse" />
                  <span className="text-xs font-mono text-slate-400">Ingestion Terminal (Agent Stream)</span>
                </div>
                <span className="text-xs font-mono font-bold text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded border border-teal-500/20">
                  {progress}% Complete
                </span>
              </div>

              <div className="space-y-1">
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-gradient-to-r from-teal-400 to-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Logs */}
              <div className="bg-black/50 border border-slate-800 rounded-xl p-4 font-mono text-[10px] text-slate-300 h-64 overflow-y-auto space-y-2 text-left">
                {progressLogs.map((log, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-slate-500">{log.timestamp}</span>
                    <span className="text-slate-500">|</span>
                    <span className={log.type === 'success' ? 'text-green-400' : 'text-slate-350'}>{log.msg}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RENDER ACTIVE DASHBOARD WORKSPACE LAYOUT */}
      {activeSession && !visualLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Top Sticky Header Panel */}
          <div className="lg:col-span-12 bg-white dark:bg-slate-800/80 backdrop-blur-md border border-slate-100 dark:border-slate-700/60 p-4 rounded-[20px] shadow-sm flex items-center justify-between sticky top-4 z-30">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                className="p-2 lg:hidden hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Desktop Sidebar Toggle Button */}
              <button
                onClick={() => setShowDesktopSidebar(!showDesktopSidebar)}
                className="hidden lg:flex p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                title={showDesktopSidebar ? "Hide Modules Menu" : "Show Modules Menu"}
              >
                {showDesktopSidebar ? (
                  <ChevronLeft className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>

              <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500 font-bold shadow-inner">
                {activeSession.repoName[0].toUpperCase()}
              </div>
              <div className="text-left">
                <h2 className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-2">
                  {activeSession.repoName}
                  <span className="text-[8px] bg-teal-500/10 text-teal-600 dark:text-teal-400 px-1.5 py-0.2 rounded font-black uppercase">Active</span>
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-slate-400 flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${autoSaveStatus === 'saved' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'
                      }`} />
                    {autoSaveStatus === 'saved' ? 'Saved' : 'Saving...'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Radial Completion Percentage */}
              <div className="hidden sm:flex items-center gap-2 border-r border-slate-100 dark:border-slate-700/50 pr-4">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Prep Progress:</span>
                <span className="text-xs font-black text-slate-800 dark:text-white bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-lg">{readinessPercentage}%</span>
              </div>

              <button
                onClick={() => setSelectedSessionId(undefined)}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-500 animate-pulse" /> Import Repo
              </button>
            </div>
          </div>

          {/* Left Navigation Sidebar */}
          {showDesktopSidebar && (
            <div className="lg:col-span-3 space-y-4 sticky top-24 hidden lg:block">
              <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-4 rounded-[20px] shadow-sm text-left">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pb-2 border-b border-slate-50 dark:border-slate-750 mb-2">Preparation Modules</span>
                <div className="space-y-0.5">
                  {sidebarItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${isActive
                          ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                          : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-850 dark:hover:text-slate-350'
                          }`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Mobile Sidebar drawer */}
          <AnimatePresence>
            {showMobileSidebar && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden">
                <motion.div
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  className="w-64 h-full bg-white dark:bg-slate-900 p-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-150">
                      <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Modules Menu</span>
                      <button onClick={() => setShowMobileSidebar(false)} className="p-1 hover:bg-slate-50 rounded-lg">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-1 overflow-y-auto max-h-[80vh] text-left">
                      {sidebarItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setShowMobileSidebar(false);
                          }}
                          className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${activeTab === item.id
                            ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                            }`}
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Center Main Workspace */}
          <div className={`${showDesktopSidebar ? 'lg:col-span-6' : 'lg:col-span-9'} min-h-[500px]`}>
            {activeTab === 'dashboard' && <DashboardView session={activeSession} mastered={mastered} bookmarks={bookmarks} />}
            {activeTab === 'info' && <ProjectInfoView session={activeSession} onAutoSaveStatus={setAutoSaveStatus} />}
            {activeTab === 'summary' && <SummaryView session={activeSession} />}
            {activeTab === 'architecture' && <ArchitectureView session={activeSession} />}
            {activeTab === 'deepdive' && <DeepDiveView session={activeSession} />}
            {activeTab === 'questions' && (
              <QuestionsView
                session={activeSession}
                bookmarks={bookmarks}
                mastered={mastered}
                toggleBookmark={toggleBookmark}
                toggleMastered={toggleMastered}
              />
            )}
            {activeTab === 'mock' && <MockInterviewView session={activeSession} />}
            {activeTab === 'viva' && <VivaPrepView session={activeSession} />}
            {activeTab === 'hr' && <HRInterviewView session={activeSession} />}
            {activeTab === 'challenges' && <ChallengesView session={activeSession} />}
            {activeTab === 'star' && <STARStoryView session={activeSession} />}
            {activeTab === 'presentation' && <PresentationView session={activeSession} />}
            {activeTab === 'health' && <ProjectHealthView session={activeSession} />}
            {activeTab === 'export' && <ExportCenterView session={activeSession} />}
            {activeTab === 'settings' && <SettingsView session={activeSession} />}
          </div>

          {/* Right Copilot Panel */}
          <div className="lg:col-span-3 sticky top-24">
            <AICopilotPanel session={activeSession} />
          </div>

        </div>
      ) : (
        /* HERO CONFIGURATION LANDING STATE */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left"
        >
          {/* Left Import Module */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-800/80 border border-slate-150 dark:border-slate-700/60 rounded-3xl p-8 md:p-10 space-y-8 relative overflow-hidden shadow-sm">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="space-y-3.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-bold rounded-full uppercase tracking-wider select-none">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  AI Ingestion Pipeline Active
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  Import repository, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-500">
                    reverse-engineer prep.
                  </span>
                </h2>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed font-medium">
                  Provide any public or private GitHub repository URL. Our system maps code trees, profiles files, parses readmes, and builds dynamic evaluation rubrics.
                </p>
              </div>

              {/* Ingestion form */}
              <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-750 rounded-2xl space-y-4">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Repository URL</label>
                    <div className="relative">
                      <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="https://github.com/username/repository"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-750 rounded-xl focus:outline-none focus:border-teal-500/50 text-xs text-slate-800 dark:text-white font-semibold"
                      />
                    </div>
                  </div>

                  {/* Token */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowTokenInput(!showTokenInput)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-teal-500 transition-colors cursor-pointer"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>{showTokenInput ? 'Hide GitHub Access Token' : 'Add GitHub Access Token (for Private Repos)'}</span>
                    </button>
                    {showTokenInput && (
                      <div className="mt-2.5">
                        <input
                          type="password"
                          placeholder="ghp_PersonalAccessToken"
                          value={token}
                          onChange={(e) => setToken(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-750 rounded-xl text-xs font-mono text-slate-850 dark:text-white focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleGenerate()}
                    disabled={isGenerating || !githubUrl}
                    className="w-full py-4 bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 fill-white" /> Build Interview Rubric
                  </button>
                </div>
              </div>

              {/* Demo repos */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pb-2 border-b border-slate-100 dark:border-slate-700/60">Demo Sandbox Repositories</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {DEMO_REPOSITORIES.map((repo) => (
                    <div
                      key={repo.name}
                      onClick={() => {
                        setGithubUrl(repo.url);
                        handleGenerate(repo.url);
                      }}
                      className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/60 hover:border-teal-500/30 transition-all flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-350">{repo.name}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block truncate font-medium">{repo.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Runs History column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-800/80 border border-slate-150 dark:border-slate-700/60 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700/50">
                <History className="w-4 h-4 text-teal-500" />
                <h4 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider">Runs Ingestion History</h4>
              </div>

              {history.length > 0 && (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search history..."
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] focus:outline-none"
                    />
                  </div>
                  {allLanguagesInHistory.length > 0 && (
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase select-none">
                      <span className="flex items-center gap-1"><Filter className="w-3.5 h-3.5 text-teal-500" /> Filter:</span>
                      <select
                        value={historyLangFilter}
                        onChange={(e) => setHistoryLangFilter(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 px-2 py-0.5 rounded text-[10px] focus:outline-none font-bold"
                      >
                        <option value="All">All Languages</option>
                        {allLanguagesInHistory.map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {isLoadingHistory ? (
                <div className="flex flex-col items-center py-8 gap-2 text-slate-400">
                  <div className="w-6 h-6 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
                  <span className="text-[10px]">Syncing history cache...</span>
                </div>
              ) : filteredHistory.length > 0 ? (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                  {filteredHistory.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleSelectHistory(item._id)}
                      className="group flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-900/35 hover:bg-slate-50 hover:border-teal-500/20 cursor-pointer transition-all"
                    >
                      <div className="flex flex-col min-w-0 text-left">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-350 truncate">{item.repoName}</span>
                        <span className="text-[9px] text-slate-400 font-medium mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteHistory(e, item._id)}
                        className="p-1 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl font-semibold bg-slate-50/10">
                  No ingest history found.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default ProjectPrep;
