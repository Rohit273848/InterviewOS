import React, { useState } from 'react';
import { 
  Database, 
  Layers, 
  Lock, 
  BookOpen, 
  CheckCircle, 
  AlertOctagon, 
  Zap, 
  Server,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ProjectPrepSession } from '../../services/projectPrep.service';

interface DeepDiveViewProps {
  session: ProjectPrepSession;
}

interface DeepDiveCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  explanation: string;
  questions: string[];
  bestPractices: string[];
  mistakes: string[];
  optimizations: string[];
  scenario: string;
}

export const DeepDiveView: React.FC<DeepDiveViewProps> = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const cards: DeepDiveCard[] = [
    {
      id: 'frontend',
      title: 'Frontend Client Architecture',
      icon: <Layers className="w-5 h-5 text-teal-500" />,
      explanation: 'Decoupled SPA built using React hooks, styled layout components, and global state management slices.',
      questions: [
        'How does state flow from parent views into separate dashboard panels in this codebase?',
        'What lazy-loading patterns did you adopt to optimize initial page loading footprint?',
        'Explain how you handle visual loading skeletons and error boundaries during slow API calls.'
      ],
      bestPractices: [
        'Keep visual components presentation-only; isolate API triggers inside custom hooks.',
        'Use React.memo on heavy canvas or list panels to minimize re-render triggers.',
        'Adopt standard layout grid boundaries for mobile-first viewport styling.'
      ],
      mistakes: [
        'Triggering multiple independent state setters in quick succession, causing layout reflows.',
        'Hardcoding color themes instead of using Tailwind class variables.'
      ],
      optimizations: [
        'Debounce scroll and search query handlers (e.g. 300ms delay).',
        'Preload dashboard assets and font families.'
      ],
      scenario: 'Scenario: Client UI freezes during bulk list updates. Solution: Wrap mutations in transition updates and paginate content dynamically.'
    },
    {
      id: 'backend',
      title: 'Backend Services & Controllers',
      icon: <Server className="w-5 h-5 text-indigo-500" />,
      explanation: 'Express REST architecture utilizing controller actions, isolated service abstractions, and error handlers.',
      questions: [
        'Explain the flow of a client generate request through backend routes, controllers, and AI services.',
        'How does your backend catch uncaught controller errors without dropping the server connection?',
        'What advantages did you secure by placing third-party Git calls in services rather than route middleware?'
      ],
      bestPractices: [
        'Enforce centralized request parameter validation schemes (Zod/Joi).',
        'Wrap asynchronous operations in custom wrapper handlers to avoid boilerplate try-catch lines.'
      ],
      mistakes: [
        'Performing raw db queries directly from router mapping parameters.',
        'Allowing CORS configs to allow wildcards in staging and production servers.'
      ],
      optimizations: [
        'Optimize middleware chain sequence to filter invalid data before executing parsing loops.',
        'Implement cluster management in production to utilize multi-core servers.'
      ],
      scenario: 'Scenario: File parsing workers lock database connection limits. Solution: Move ingestion parsing routines to offline queue processes.'
    },
    {
      id: 'database',
      title: 'Database Persistence Schema',
      icon: <Database className="w-5 h-5 text-pink-500" />,
      explanation: 'NoSQL MongoDB collections configured with virtuals, compound indices, and schema constraints.',
      questions: [
        'Why did you choose NoSQL schema logic over SQL relations for storing session questions?',
        'Describe the compound indices you configured and their direct latency improvements on history queries.',
        'What happens when a question exceeds standard storage limit bounds?'
      ],
      bestPractices: [
        'Specify limit bounds on query selections (e.g. fetch metadata, exclude large readmes).',
        'Perform schema validation at application level via mongoose models.'
      ],
      mistakes: [
        'Missing index configurations on frequently queried fields like userId.',
        'Saving massive raw repository history files inside the main session document.'
      ],
      optimizations: [
        'Implement projection mappings to pull only the header titles for side navigation listings.',
        'Configure database connection pooling settings to handle traffic spikes.'
      ],
      scenario: 'Scenario: History dashboards load extremely slow under high volume. Solution: Create a compound index on userId and createdAt.'
    },
    {
      id: 'security',
      title: 'Authentication & Security Protocols',
      icon: <Lock className="w-5 h-5 text-amber-500" />,
      explanation: 'JSON Web Token authentication layer, CORS protection policies, and custom rate limits.',
      questions: [
        'How is user identity validated and passed down inside Express request chains?',
        'What is your mechanism to prevent cross-site request forgery and header exploits?',
        'Describe how private repository tokens are secure during the Git ingest phase.'
      ],
      bestPractices: [
        'Store access tokens in memory or secure HttpOnly cookies, not localStorage.',
        'Set strict rate limits on generation requests to prevent API credit exhaustion.'
      ],
      mistakes: [
        'Storing sensitive keys directly in repo code instead of using dotenv variables.',
        'Failing to sanitize user github URL parameters, opening server to injection risks.'
      ],
      optimizations: [
        'Implement strict Helmet header configuration sets.',
        'Auto-scrub third-party credentials before printing trace logging outputs.'
      ],
      scenario: 'Scenario: User details leaked through server debugging traces. Solution: Standardize logs sanitization using logger filters.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4.5 h-4.5 text-teal-500" />
          Technical Deep Dive
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Expand any layer to access code explanations, interview questions, and optimizations specific to the repository stack.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => {
          const isExpanded = expandedId === card.id;
          return (
            <div 
              key={card.id}
              className={`bg-white dark:bg-slate-800/80 border rounded-2xl transition-all overflow-hidden ${
                isExpanded 
                  ? 'border-teal-500/40 dark:border-teal-500/30 col-span-2 shadow-md bg-slate-50/20' 
                  : 'border-slate-100 dark:border-slate-700/60 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm'
              }`}
            >
              {/* Header Toggle */}
              <div 
                onClick={() => toggleExpand(card.id)}
                className="p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
                    {card.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">{card.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{card.explanation}</p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>

              {/* Expanded Panels */}
              {isExpanded && (
                <div className="border-t border-slate-100 dark:border-slate-750/50 p-6 space-y-6 select-text text-left">
                  {/* Explanation */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">Architecture Overview</span>
                    <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-medium">{card.explanation}</p>
                  </div>

                  {/* Interview Questions */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Target Interview Questions</span>
                    <div className="space-y-2">
                      {card.questions.map((q, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200">
                          {q}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Best practices */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5"/> Best Practices</span>
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium list-disc pl-4">
                        {card.bestPractices.map((item, idx) => <li key={idx}>{item}</li>)}
                      </ul>
                    </div>

                    {/* Common Mistakes */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-rose-650 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1.5"><AlertOctagon className="w-3.5 h-3.5"/> Common Pitfalls</span>
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium list-disc pl-4">
                        {card.mistakes.map((item, idx) => <li key={idx}>{item}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* Real World Scenario */}
                  <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl space-y-1.5">
                    <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1.5"><Zap className="w-3.5 h-3.5"/> System Scalability Scenario</span>
                    <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-medium">{card.scenario}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
