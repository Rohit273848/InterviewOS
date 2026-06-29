import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Download, 
  ArrowRight, 
  Check 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ProjectPrepSession } from '../../services/projectPrep.service';

interface SummaryViewProps {
  session: ProjectPrepSession;
}

type SummaryTemplate = 
  | 'pitch-15s' 
  | 'pitch-30s' 
  | 'pitch-1m' 
  | 'pitch-3m' 
  | 'pitch-5m' 
  | 'resume' 
  | 'linkedin' 
  | 'portfolio' 
  | 'readme';

export const SummaryView: React.FC<SummaryViewProps> = ({ session }) => {
  const localStorageKey = `prep_summaries_${session._id}`;
  const [activeTab, setActiveTab] = useState<SummaryTemplate>('pitch-1m');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load custom drafts from storage
  const [summaries, setSummaries] = useState<Record<SummaryTemplate, string>>(() => {
    const saved = localStorage.getItem(localStorageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }

    // Default template structures
    const title = session.repoName;
    const desc = session.description || 'a full-stack software project';
    const langs = session.languages.join(', ');

    return {
      'pitch-15s': `I built '${title}', ${desc}. It utilizes a robust architecture built with ${langs} to deliver high performance features and clean interfaces.`,
      'pitch-30s': `I developed '${title}', which is ${desc}. Constructed using ${langs}, the application incorporates advanced modular setups and database optimization to solve core user experience bottlenecks. I designed it to showcase professional development patterns and scalable architecture.`,
      'pitch-1m': `Hi! I'd love to tell you about '${title}'. It is ${desc}. On the technology side, I structured the platform using ${langs}. Some of the key engineering achievements were scaling the data persistence pipelines, containerizing modules for microservice architecture, and securing API endpoints. Ultimately, this project demonstrates my ability to design scalable distributed architectures and write clean, maintainable code.`,
      'pitch-3m': `I engineered '${title}' to address critical usability and scalability requirements. Built with ${langs}, the front-end features a highly responsive design while the backend acts as a high-throughput API gateway. During construction, I faced issues with query latencies and solved them through server-side caching and indexing optimizations. Additionally, I set up CI/CD automation to facilitate rapid features rollout. This project encapsulates end-to-end deployment ownership, secure middleware implementations, and robust architectural principles.`,
      'pitch-5m': `Let's deep dive into '${title}'. The problem statement I set out to solve was developing a high-fidelity system that aggregates user queries and generates structured AI prep materials. I implemented the solution using ${langs}. The frontend communicates with a modular Express backend backed by a MongoDB schema. Structurally, I decoupled the business workflows using repositories and routers. I hit performance roadblocks when scraping repository readmes, which I mitigated by implementing rate-limit logic and async queue runners. For security, I set up JSON Web Token authorization layers. In short, this project serves as a showcase of my capabilities across full-stack engineering, cloud hosting, and robust system designs.`,
      'resume': `Full Stack Developer for '${title}' (${langs}). Architected and built a scalable platform resolving core latency issues. Implemented secure JWT user authentication, optimized relational search indexing, and automated deployment pipelines using Docker, boosting release cycles by 25%.`,
      'linkedin': `🚀 Excited to share my latest software engineering project: '${title}'! \n\nI built this platform using ${langs} to explore full-stack development, DB indexing, and microservices architecture. It has been a fantastic journey scaling systems, debugging deployment pipelines, and building modular interfaces. Check it out on GitHub! \n\n#SoftwareEngineering #React #NodeJS #SystemDesign`,
      'portfolio': `### ${title} — Professional Full-Stack Application\n\n- **Role:** Creator & Lead Engineer\n- **Technologies:** ${langs}\n- **Core Accomplishment:** Engineered a fast code crawl engine using LangChain and Google Gemini APIs.\n- **Links:** [GitHub](${session.githubUrl}) | [Live Demo](https://demo.example.com)`,
      'readme': `# ${title}\n\n${desc}\n\n## Tech Stack\n- Frontend: React\n- Backend: Node.js, Express\n- Database: MongoDB\n\n## Getting Started\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``
    };
  });

  // Save to local storage when summaries are modified
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(summaries));
  }, [summaries, localStorageKey]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSummaries((prev) => ({
      ...prev,
      [activeTab]: value,
    }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summaries[activeTab]);
    setCopied(true);
    toast.success('Summary copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([summaries[activeTab]], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${session.repoName}_${activeTab}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Download initialized.');
  };

  // Simulates AI modification actions
  const triggerAIAction = (action: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      let suffix = '';
      if (action === 'improve') suffix = '\n\n*(Optimized by AI for clarity and structure)*';
      if (action === 'technical') suffix = '\n\n*(Refined with detailed tech metrics: decoupled repositories, optimized execution threads, O(1) route mappings)*';
      if (action === 'simplify') suffix = '\n\n*(Simplified for generic presentation and entry-level reviewers)*';
      
      setSummaries((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab] + suffix,
      }));
      toast.success(`Text adjusted with ${action} settings!`);
    }, 900);
  };

  const templateLabels: Record<SummaryTemplate, string> = {
    'pitch-15s': '15-Sec Pitch',
    'pitch-30s': '30-Sec Pitch',
    'pitch-1m': '1-Min Pitch',
    'pitch-3m': '3-Min Pitch',
    'pitch-5m': '5-Min Pitch',
    'resume': 'Resume Bio',
    'linkedin': 'LinkedIn Post',
    'portfolio': 'Portfolio Text',
    'readme': 'README Starter'
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left column: Template Selector */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800/85 border border-slate-100 dark:border-slate-700/60 p-4 rounded-[20px] shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2.5 pb-2 block border-b border-slate-100 dark:border-slate-700/50 mb-2">Pitches & Templates</span>
          {Object.keys(templateLabels).map((key) => {
            const templateKey = key as SummaryTemplate;
            const isActive = activeTab === templateKey;
            return (
              <button
                key={templateKey}
                onClick={() => setActiveTab(templateKey)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  isActive 
                    ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <span>{templateLabels[templateKey]}</span>
                <ArrowRight className={`w-3.5 h-3.5 opacity-0 transition-all ${isActive ? 'opacity-100 translate-x-0.5' : ''}`} />
              </button>
            );
          })}
        </div>

        {/* Right column: Workspace Playground */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-6 rounded-[20px] shadow-sm space-y-4 relative">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700/50">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-teal-500" />
              AI Copywriter Studio
            </h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleCopy} 
                className="p-2 hover:bg-slate-55 dark:hover:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-550 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 transition-all cursor-pointer"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button 
                onClick={handleDownload} 
                className="p-2 hover:bg-slate-55 dark:hover:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-550 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 transition-all cursor-pointer"
                title="Download txt"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Playground input block */}
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl z-20 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-3 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
                <span className="text-xs text-teal-555 font-bold animate-pulse">Running AI Refiner...</span>
              </div>
            )}
            <textarea
              value={summaries[activeTab]}
              onChange={handleTextChange}
              rows={8}
              className="w-full p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-teal-500/50 text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed"
            />
          </div>

          {/* AI Quick actions */}
          <div className="space-y-3.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">AI Refinement Filters</span>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => triggerAIAction('improve')}
                className="px-3.5 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl text-xs font-bold hover:shadow-md hover:scale-[1.01] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> Improve Content
              </button>
              <button 
                onClick={() => triggerAIAction('technical')}
                className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                💼 Technical Tone
              </button>
              <button 
                onClick={() => triggerAIAction('simplify')}
                className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                ✏️ Simplify Answer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
