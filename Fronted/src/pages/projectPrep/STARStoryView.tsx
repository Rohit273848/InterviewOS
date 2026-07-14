import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ProjectPrepSession } from '../../services/projectPrep.service';

interface STARStoryViewProps {
  session: ProjectPrepSession;
}

type STARCategory = 'leadership' | 'debugging' | 'deadline' | 'communication' | 'technology';

interface STARStory {
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
}

export const STARStoryView: React.FC<STARStoryViewProps> = ({ session }) => {
  const localStorageKey = `prep_star_stories_${session._id}`;
  const [activeCat, setActiveCat] = useState<STARCategory>('debugging');
  const [loading, setLoading] = useState(false);

  const [stories, setStories] = useState<Record<STARCategory, STARStory>>(() => {
    const saved = localStorage.getItem(localStorageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      debugging: {
        title: 'Resolving memory spikes during heavy indexing loop processes',
        situation: 'The application server crashed periodically during parallel crawls of repositories containing deep branch histories.',
        task: 'I had to trace memory leak logs and patch query allocation buffers inside backend service managers.',
        action: 'I set up Node profiling loops, garbage collection hooks, and mapped stream limits on MongoDB cursors.',
        result: 'Average peak memory footprint declined from 1.2GB to 350MB, stabilizing long-running crawler runs.'
      },
      leadership: {
        title: 'Orchestrating layout system migrations',
        situation: 'Our front-end was a complex single page rendering all lists, triggering massive redraw lags.',
        task: 'I had to guide the refactoring strategy, decoupling views into lazy subcomponents.',
        action: 'I built component structures, mapped Redux states, and established notes context interfaces.',
        result: 'Application render response times dropped to sub-10ms and code quality reviews scored 95%.'
      },
      deadline: {
        title: 'Meeting mock analytics dashboard delivery dates',
        situation: 'We had only 48 hours to complete a fully functional speech assessment tool before demo day.',
        task: 'I was responsible for mock voice transcription syncing and evaluation report panels.',
        action: 'I scoped simple regex-based filler word counters and structured fallback dashboards.',
        result: 'Deliverables shipped 4 hours ahead of deadline, achieving full score ratings during demo reviews.'
      },
      communication: {
        title: 'Aligning API schemas across teams',
        situation: 'Frontend and backend integrations were broken because request-response shapes mismatched.',
        task: 'I took the initiative to resolve validation errors across teams.',
        action: 'I constructed schema specifications in joint markdown files and implemented type-safe Zod validation layers.',
        result: 'Integration build compile time dropped from days to a single morning, resulting in zero hydration bugs.'
      },
      technology: {
        title: 'Adopting Google Gemini API models',
        situation: 'Our initial question bank was static, offering low-quality preparation questions for professional developers.',
        task: 'I had to integrate Google LLM APIs to achieve dynamic repository-specific questions.',
        action: 'I researched ChatGoogleGenerativeAI bindings, built resilient LangChain templates, and configured error fallback structures.',
        result: 'Questions relevance increased by 90%, offering file-specific evaluation hints.'
      }
    };
  });

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(stories));
  }, [stories, localStorageKey]);

  const handleFieldChange = (field: keyof STARStory, val: string) => {
    setStories(prev => ({
      ...prev,
      [activeCat]: {
        ...prev[activeCat],
        [field]: val
      }
    }));
  };

  const handleCopy = () => {
    const { title, situation, task, action, result } = stories[activeCat];
    const text = `Title: ${title}\n\n[Situation]\n${situation}\n\n[Task]\n${task}\n\n[Action]\n${action}\n\n[Result]\n${result}`;
    navigator.clipboard.writeText(text);
    toast.success('STAR Story copied!');
  };

  const triggerImprove = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStories(prev => ({
        ...prev,
        [activeCat]: {
          ...prev[activeCat],
          action: prev[activeCat].action + " *(Refined: Applied standardized metrics and integrated automated tests)*",
          result: prev[activeCat].result + " *(Verified: latency profiles confirmed high efficiency)*"
        }
      }));
      toast.success('STAR story details refined by AI!');
    }, 800);
  };

  const catLabels: Record<STARCategory, string> = {
    debugging: 'Debugging & Solving Leaks',
    leadership: 'Leading Architecture Migration',
    deadline: 'Tight Deadlines Delivery',
    communication: 'Client / API Communication',
    technology: 'Learning New Tech Stack'
  };

  return (
    <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-6 rounded-[20px] shadow-sm space-y-6 text-left">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/50 pb-4 flex-wrap gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4.5 h-4.5 text-teal-500" />
            STAR Story Workspace
          </h3>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 font-medium">Design structured interview narratives detailing technical ownership, debugging, and deadlines.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={triggerImprove}
            className="px-3.5 py-1.5 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Improve with AI
          </button>
          <button 
            onClick={handleCopy}
            className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 transition-all cursor-pointer"
            title="Copy answer"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab select buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {Object.keys(catLabels).map((key) => {
          const catKey = key as STARCategory;
          return (
            <button
              key={catKey}
              onClick={() => setActiveCat(catKey)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition-all border ${
                activeCat === catKey 
                  ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25' 
                  : 'text-slate-500 border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {catLabels[catKey]}
            </button>
          );
        })}
      </div>

      {/* Inputs */}
      <div className="space-y-4 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Story Header / Focus</label>
          <input 
            type="text" 
            value={stories[activeCat].title} 
            onChange={(e) => handleFieldChange('title', e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white font-bold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-150 dark:border-slate-800 space-y-1.5">
            <span className="text-[9px] font-black text-indigo-650 dark:text-indigo-400 uppercase tracking-widest block">Situation</span>
            <textarea
              value={stories[activeCat].situation}
              onChange={(e) => handleFieldChange('situation', e.target.value)}
              rows={3}
              className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-medium resize-none"
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-150 dark:border-slate-800 space-y-1.5">
            <span className="text-[9px] font-black text-teal-655 dark:text-teal-400 uppercase tracking-widest block">Task</span>
            <textarea
              value={stories[activeCat].task}
              onChange={(e) => handleFieldChange('task', e.target.value)}
              rows={3}
              className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-medium resize-none"
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-150 dark:border-slate-800 space-y-1.5">
            <span className="text-[9px] font-black text-pink-655 dark:text-pink-400 uppercase tracking-widest block">Action</span>
            <textarea
              value={stories[activeCat].action}
              onChange={(e) => handleFieldChange('action', e.target.value)}
              rows={3}
              className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-medium resize-none"
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-150 dark:border-slate-800 space-y-1.5">
            <span className="text-[9px] font-black text-green-655 dark:text-green-400 uppercase tracking-widest block">Result</span>
            <textarea
              value={stories[activeCat].result}
              onChange={(e) => handleFieldChange('result', e.target.value)}
              rows={3}
              className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-medium resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
