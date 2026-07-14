import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  Copy
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ProjectPrepSession } from '../../services/projectPrep.service';

interface HRInterviewViewProps {
  session: ProjectPrepSession;
}

type HRTab = 'leadership' | 'teamwork' | 'ownership' | 'conflict' | 'failure' | 'innovation';

interface STARAnswer {
  question: string;
  situation: string;
  task: string;
  action: string;
  result: string;
}

export const HRInterviewView: React.FC<HRInterviewViewProps> = ({ session }) => {
  const localStorageKey = `prep_hr_${session._id}`;
  const [activeTab, setActiveTab] = useState<HRTab>('ownership');
  const [loading, setLoading] = useState(false);

  const [starAnswers, setStarAnswers] = useState<Record<HRTab, STARAnswer>>(() => {
    const saved = localStorage.getItem(localStorageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }

    return {
      ownership: {
        question: 'Tell me about a time you took complete ownership of a feature or problem in this project.',
        situation: 'During the repository crawl execution, our server hit continuous timeout errors when pulling massive binary files.',
        task: 'I had to re-engineer the Git download service to skip heavy binary assets dynamically before parsing metadata.',
        action: 'I configured the checkout depth and branch filter rules inside github.service.js, explicitly excluding media files.',
        result: 'Crawl failures fell to zero and average session fetch latency improved by 40%.'
      },
      leadership: {
        question: 'How did you lead or coordinate the architectural choices for this system?',
        situation: 'Our initial developers proposed building a monolithic state workspace, which would hinder codebase updates.',
        task: 'I had to lead the modular migration effort, setting up isolated views and clear contexts.',
        action: 'I drafted layout schemas, set up tanstack queries, and decoupled notes persistence hooks.',
        result: 'Code review cycles dropped from days to hours, and rendering re-runs decreased significantly.'
      },
      teamwork: {
        question: 'Describe how you collaborated with others or resolved tool/dependency disputes.',
        situation: 'The frontend client and backend models had mismatching typings, causing build breaks on deployment runs.',
        task: 'I had to coordinate schema alignment without blocking parallel feature releases.',
        action: 'I created unified zod parser endpoints and documented API request models on shared readme docs.',
        result: 'The build compile succeeded with zero typescript error logs and deployment sync times halved.'
      },
      conflict: {
        question: 'Tell me about a technical conflict you faced and how you handled it.',
        situation: 'We had a conflict between using local caching variables vs implementing full database compound indexing.',
        task: 'I had to demonstrate which approach offered stable resource consumption under load.',
        action: 'I set up express performance traces, comparing load-testing latency logs for both structures.',
        result: 'Indexing proved 60% faster; the team adopted indices, reducing memory usage logs.'
      },
      failure: {
        question: 'Tell me about a mistake you made or a development failure and your learnings.',
        situation: 'I initially deployed credentials directly to public repositories, leaking keys to git crawlers.',
        task: 'I had to scrub all repository history files and secure access configurations immediately.',
        action: 'I rotated access keys, implemented dotenv parameter configurations, and added strict gitignore files.',
        result: 'Learned the absolute priority of environment vaults; established credentials hygiene rules.'
      },
      innovation: {
        question: 'Describe a creative or innovative solution you designed for this project.',
        situation: 'Creating mock questions resulted in repetitive template questions that lacked project-specific context.',
        task: 'I wanted to generate unique, file-level questions matching the actual repository languages.',
        action: 'I integrated Google Gemini-2.5-flash with customized LangChain prompts that extract core Readme snippets.',
        result: 'Users received extremely custom architecture questions tailored directly to their codebase structures.'
      }
    };
  });

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(starAnswers));
  }, [starAnswers, localStorageKey]);

  const handleFieldChange = (field: keyof STARAnswer, value: string) => {
    setStarAnswers(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value
      }
    }));
  };

  const handleCopy = () => {
    const { question, situation, task, action, result } = starAnswers[activeTab];
    const text = `Question: ${question}\n\n[Situation]\n${situation}\n\n[Task]\n${task}\n\n[Action]\n${action}\n\n[Result]\n${result}`;
    navigator.clipboard.writeText(text);
    toast.success('STAR response copied!');
  };

  // Simulate AI rewriting action
  const handleAIRewrite = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStarAnswers(prev => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          action: prev[activeTab].action + " *(Refined: Applied robust design standards and analyzed profiling logs)*",
          result: prev[activeTab].result + " *(Optimized outcome: verified by trace benchmarks)*"
        }
      }));
      toast.success('Response refined to sound more professional!');
    }, 850);
  };

  const tabLabels: Record<HRTab, string> = {
    ownership: 'Ownership',
    leadership: 'Leadership',
    teamwork: 'Teamwork',
    conflict: 'Conflict Resolution',
    failure: 'Handling Failure',
    innovation: 'Innovation'
  };

  return (
    <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-6 rounded-[20px] shadow-sm space-y-6 text-left">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/50 pb-4 flex-wrap gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-4.5 h-4.5 text-teal-500" />
            Behavioral & HR Prep (STAR Format)
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Answer project behavioral questions following the Situation-Task-Action-Result format.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleAIRewrite}
            className="px-3.5 py-1.5 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Professional Tone
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

      {/* Horizontal Tabs selection */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {Object.keys(tabLabels).map((key) => {
          const tabKey = key as HRTab;
          return (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition-all border ${
                activeTab === tabKey 
                  ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25' 
                  : 'text-slate-500 border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tabLabels[tabKey]}
            </button>
          );
        })}
      </div>

      {/* Primary Question box */}
      <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
          </div>
        )}
        <span className="text-[9px] font-black text-indigo-650 dark:text-indigo-400 uppercase tracking-widest block">HR Question</span>
        <p className="text-xs font-bold text-slate-800 dark:text-white leading-relaxed">
          {starAnswers[activeTab].question}
        </p>
      </div>

      {/* STAR Form inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {([
          { key: 'situation', label: 'Situation (Context/Problem)', color: 'border-l-indigo-500' },
          { key: 'task', label: 'Task (Role/Responsibilities)', color: 'border-l-teal-500' },
          { key: 'action', label: 'Action (Your detailed implementation)', color: 'border-l-pink-500' },
          { key: 'result', label: 'Result (Quantitative Outcome/Learnings)', color: 'border-l-green-500' }
        ] as const).map(({ key, label, color }) => (
          <div key={key} className={`bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-750 border-l-4 ${color} space-y-2`}>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{label}</label>
            <textarea
              value={starAnswers[activeTab][key]}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              rows={3}
              className="w-full bg-transparent p-0 border-0 focus:outline-none focus:ring-0 text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-medium resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
