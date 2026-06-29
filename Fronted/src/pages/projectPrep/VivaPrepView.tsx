import React, { useState } from 'react';
import { 
  HelpCircle, 
  AlertTriangle, 
  Award, 
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { ProjectPrepSession } from '../../services/projectPrep.service';

interface VivaPrepViewProps {
  session: ProjectPrepSession;
}

type VivaTab = 'beginner' | 'intermediate' | 'advanced' | 'external' | 'faculty';

interface VivaQA {
  question: string;
  expectedAnswer: string;
  crossQuestion: string;
  counterQuestion: string;
  mistake: string;
}

export const VivaPrepView: React.FC<VivaPrepViewProps> = () => {
  const [activeTab, setActiveTab] = useState<VivaTab>('external');

  const vivaData: Record<VivaTab, VivaQA[]> = {
    beginner: [
      {
        question: 'What is the absolute core purpose of this repository, and what problem does it solve?',
        expectedAnswer: 'This repository is designed to reverse engineer source codebases and synthesize project-specific interview preparation materials dynamically.',
        crossQuestion: 'Why did you choose this stack instead of other alternatives?',
        counterQuestion: 'Could this have been achieved with a simple client-side parser script?',
        mistake: 'Failing to mention the AI integration and dynamic ingestion processing layers.'
      }
    ],
    intermediate: [
      {
        question: 'How did you handle user session state, and is user data isolated properly?',
        expectedAnswer: 'I implemented standard JWT token authentication middleware on the backend. Every query is filtered by the authenticated user id (req.user._id).',
        crossQuestion: 'Where are the tokens stored, and what happens if they expire?',
        counterQuestion: 'If local storage is vulnerable, why did you not use HTTPOnly cookies?',
        mistake: 'Failing to explain the token verification and middleware execution order.'
      }
    ],
    advanced: [
      {
        question: 'If ingestion files increase to 100MB, how will your parser prevent event-loop blockages?',
        expectedAnswer: 'Large datasets must be processed asynchronously using child processes or job queues (like Bull/Redis) rather than parsing inline inside the main controller thread.',
        crossQuestion: 'How would you track queue status in real time on the frontend client?',
        counterQuestion: 'Does MongoDB support streaming these bulk structures directly?',
        mistake: 'Stating that inline async-await handles heavy file parsing without blockages (Node.js single-thread limits!).'
      }
    ],
    external: [
      {
        question: 'Explain the technical reason for choosing MongoDB for persistent session history.',
        expectedAnswer: 'MongoDB document models fit the unstructured format of generated JSON questions and metadata tags perfectly, avoiding complex relational joins.',
        crossQuestion: 'How do you prevent data redundancy or stale cache structures?',
        counterQuestion: 'What compound index would you declare to optimize session queries?',
        mistake: 'Not citing the flexibility of JSON formats or querying indexing options.'
      }
    ],
    faculty: [
      {
        question: 'What are the main learning outcomes and what future work do you suggest?',
        expectedAnswer: 'I learned details about AI integration, async ingestion, and modular design. Future enhancements include voice analytics and offline database cache synchronizations.',
        crossQuestion: 'How much of this code is boilerplate vs custom business logic?',
        counterQuestion: 'If Gemini APIs are deprecated, how easily can this be refactored?',
        mistake: 'Saying the project is completely finished with no scope for improvements.'
      }
    ]
  };

  return (
    <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-6 rounded-[20px] shadow-sm space-y-6 text-left">
      <div className="border-b border-slate-100 dark:border-slate-700/50 pb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4.5 h-4.5 text-teal-500" />
          Viva / Oral Exam Preparation
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">Anticipate examiner questions, cross questions, and verbal strategies.</p>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {([
          { id: 'beginner', label: 'Beginner' },
          { id: 'intermediate', label: 'Intermediate' },
          { id: 'advanced', label: 'Advanced' },
          { id: 'external', label: 'External Examiner' },
          { id: 'faculty', label: 'Faculty Board' }
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition-all border ${
              activeTab === tab.id 
                ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25' 
                : 'text-slate-500 border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Q&A Cards */}
      <div className="space-y-6">
        {vivaData[activeTab].map((qa, index) => (
          <div key={index} className="space-y-4">
            {/* Primary Question */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-150 dark:border-slate-800">
              <span className="text-[9px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest block mb-1">Examiner Question</span>
              <p className="text-xs font-bold text-slate-800 dark:text-white leading-relaxed">{qa.question}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Expected Answer */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5"><Award className="w-3.5 h-3.5"/> Expected Answer</span>
                <p className="text-[11px] text-slate-655 dark:text-slate-350 leading-relaxed font-medium">{qa.expectedAnswer}</p>
              </div>

              {/* Cross & Counter questions */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5"/> Anticipated Cross-Question</span>
                  <p className="text-[11px] text-slate-655 dark:text-slate-350 font-bold">"{qa.crossQuestion}"</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5"/> Counter-Defense</span>
                  <p className="text-[11px] text-slate-655 dark:text-slate-350 leading-relaxed font-medium">"{qa.counterQuestion}"</p>
                </div>
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-xl space-y-1">
              <span className="text-[9px] font-bold text-rose-600 dark:text-rose-455 uppercase tracking-widest flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5"/> Common Mistakes to Avoid</span>
              <p className="text-[11px] text-slate-650 dark:text-slate-400 font-medium">{qa.mistake}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
