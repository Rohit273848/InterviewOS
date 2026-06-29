import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Github, 
  Cpu, 
  FileText, 
  Info, 
  Plus, 
  X, 
  BookOpen 
} from 'lucide-react';
import { ProjectPrepSession } from '../../services/projectPrep.service';

interface ProjectInfoViewProps {
  session: ProjectPrepSession;
  onAutoSaveStatus: (status: 'saved' | 'saving' | 'error') => void;
}

export interface ProjectInfoState {
  title: string;
  subtitle: string;
  domain: string;
  category: string;
  difficulty: string;
  teamSize: string;
  role: string;
  duration: string;
  organization: string;
  mentor: string;
  githubLink: string;
  liveDemo: string;
  portfolio: string;
  docs: string;
  videoDemo: string;
  frontend: string[];
  backend: string[];
  database: string[];
  cloud: string[];
  aiModels: string[];
  apis: string[];
  auth: string[];
  devops: string[];
  deployment: string[];
  problemStatement: string;
  objectives: string;
  features: string;
  archSummary: string;
  learningOutcomes: string;
  futureScope: string;
  tags: string[];
}

export const ProjectInfoView: React.FC<ProjectInfoViewProps> = ({ session, onAutoSaveStatus }) => {
  const localStorageKey = `prep_info_${session._id}`;

  const [formData, setFormData] = useState<ProjectInfoState>(() => {
    const saved = localStorage.getItem(localStorageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved project info', e);
      }
    }
    // Default fallback from session details
    return {
      title: session.repoName || '',
      subtitle: session.description || '',
      domain: 'Web Development',
      category: 'Full Stack',
      difficulty: session.languages.length > 2 ? 'Hard' : 'Medium',
      teamSize: '1 (Solo)',
      role: 'Lead Developer',
      duration: '3 Months',
      organization: 'Personal Project',
      mentor: 'Self-guided',
      githubLink: session.githubUrl || '',
      liveDemo: '',
      portfolio: '',
      docs: '',
      videoDemo: '',
      frontend: session.languages.includes('TypeScript') || session.languages.includes('JavaScript') ? ['React', 'HTML5', 'CSS3'] : [],
      backend: session.languages.includes('Python') ? ['FastAPI'] : ['Node.js', 'Express'],
      database: ['MongoDB'],
      cloud: ['AWS'],
      aiModels: ['Gemini 2.5 Flash'],
      apis: ['REST API'],
      auth: ['JWT'],
      devops: ['Docker', 'GitHub Actions'],
      deployment: ['Vercel', 'Render'],
      problemStatement: 'Provide a quick outline of the core issue this application targets.',
      objectives: 'What were the key goals of building this software platform?',
      features: 'Detail core features: authentication, analytics, automated scheduling...',
      archSummary: 'MVC Architecture utilizing React for Frontend client and Node.js for Backend server.',
      learningOutcomes: 'Key learnings: state management patterns, system scalability issues, secure endpoints.',
      futureScope: 'Add WebSocket support, improve offline caching, integrate Redis queues.',
      tags: session.topics || [],
    };
  });

  // Handle auto-saving on change
  useEffect(() => {
    onAutoSaveStatus('saving');
    const timer = setTimeout(() => {
      localStorage.setItem(localStorageKey, JSON.stringify(formData));
      onAutoSaveStatus('saved');
    }, 800); // 800ms debounce
    return () => clearTimeout(timer);
  }, [formData, localStorageKey, onAutoSaveStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Stack tag helpers
  const [newTagVal, setNewTagVal] = useState<Record<string, string>>({});

  const handleAddStackTag = (field: keyof ProjectInfoState) => {
    const val = newTagVal[field]?.trim();
    if (!val) return;
    setFormData((prev) => {
      const arr = prev[field] as string[];
      if (arr.includes(val)) return prev;
      return {
        ...prev,
        [field]: [...arr, val],
      };
    });
    setNewTagVal((prev) => ({ ...prev, [field]: '' }));
  };

  const handleRemoveStackTag = (field: keyof ProjectInfoState, tag: string) => {
    setFormData((prev) => {
      const arr = prev[field] as string[];
      return {
        ...prev,
        [field]: arr.filter((t) => t !== tag),
      };
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent, field: keyof ProjectInfoState) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddStackTag(field);
    }
  };

  return (
    <div className="space-y-6">
      {/* 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Information Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-6 rounded-[20px] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/50 pb-2">
              <Info className="w-4.5 h-4.5 text-teal-500" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase">Project Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-teal-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase">Subtitle / Tagline</label>
                <input 
                  type="text" 
                  name="subtitle" 
                  value={formData.subtitle} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-teal-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase">Domain</label>
                <input 
                  type="text" 
                  name="domain" 
                  value={formData.domain} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-teal-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase">Difficulty</label>
                <select 
                  name="difficulty" 
                  value={formData.difficulty} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-teal-500/50"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase">Your Role</label>
                <input 
                  type="text" 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-teal-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase">Mentor</label>
                <input 
                  type="text" 
                  name="mentor" 
                  value={formData.mentor} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-teal-500/50"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Detailed Writeups */}
          <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-6 rounded-[20px] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/50 pb-2">
              <FileText className="w-4.5 h-4.5 text-teal-500" />
              Project Details
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase">Problem Statement</label>
                <textarea 
                  name="problemStatement" 
                  rows={2}
                  value={formData.problemStatement} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-teal-500/50 resize-none font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase">Core Features</label>
                <textarea 
                  name="features" 
                  rows={3}
                  value={formData.features} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-teal-500/50 resize-none font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase">Learning Outcomes</label>
                <textarea 
                  name="learningOutcomes" 
                  rows={2}
                  value={formData.learningOutcomes} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-teal-500/50 resize-none font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Links & Tech Stack */}
        <div className="space-y-6">
          {/* External Links */}
          <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-5 rounded-[20px] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/50 pb-2">
              <Globe className="w-4.5 h-4.5 text-teal-500" />
              Links & Resources
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1"><Github className="w-3.5 h-3.5"/> GitHub Repository</label>
                <input 
                  type="text" 
                  name="githubLink" 
                  value={formData.githubLink} 
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1"><Globe className="w-3.5 h-3.5"/> Live Demo URL</label>
                <input 
                  type="text" 
                  name="liveDemo" 
                  value={formData.liveDemo} 
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1"><BookOpen className="w-3.5 h-3.5"/> Documentation Link</label>
                <input 
                  type="text" 
                  name="docs" 
                  value={formData.docs} 
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Stack & Composition */}
          <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-5 rounded-[20px] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/50 pb-2">
              <Cpu className="w-4.5 h-4.5 text-teal-500" />
              Technology Stack
            </h3>

            {/* List input items */}
            {([
              { key: 'frontend', label: 'Frontend Client' },
              { key: 'backend', label: 'Backend Server' },
              { key: 'database', label: 'Database Storage' },
              { key: 'devops', label: 'Devops & CI/CD' }
            ] as const).map(({ key, label }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-455 dark:text-slate-400 uppercase">{label}</label>
                <div className="flex flex-wrap gap-1 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl">
                  {formData[key].map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-extrabold px-2 py-0.5 rounded">
                      {tag}
                      <button type="button" onClick={() => handleRemoveStackTag(key, tag)} className="hover:text-red-500 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <div className="flex w-full mt-1.5 gap-1">
                    <input 
                      type="text"
                      placeholder="Add tag..."
                      value={newTagVal[key] || ''}
                      onChange={(e) => setNewTagVal((prev) => ({ ...prev, [key]: e.target.value }))}
                      onKeyDown={(e) => handleKeyPress(e, key)}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 px-2 py-1 rounded text-[10px] text-slate-700 dark:text-white flex-grow focus:outline-none"
                    />
                    <button 
                      type="button" 
                      onClick={() => handleAddStackTag(key)}
                      className="bg-teal-500 text-white rounded p-1 hover:bg-teal-600 transition-all cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
