import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  FileText, 
  Volume2
} from 'lucide-react';
import { ProjectPrepSession } from '../../services/projectPrep.service';

interface PresentationViewProps {
  session: ProjectPrepSession;
}

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  bulletPoints: string[];
  notes: string;
  script: string;
}

export const PresentationView: React.FC<PresentationViewProps> = ({ session }) => {
  const localStorageKey = `prep_presentation_${session._id}`;
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const [slides, setSlides] = useState<Slide[]>(() => {
    const saved = localStorage.getItem(localStorageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 1,
        title: `Welcome to ${session.repoName}`,
        subtitle: 'AI-driven code analysis and preparation copilot',
        bulletPoints: [
          'Full-stack system reverse-engineering',
          'Automated mock evaluation and progress scoring',
          'Designed to support fresh placement candidates'
        ],
        notes: 'Introduce yourself, state the project name clearly, and set up the pitch.',
        script: "Hello everyone, today I'm presenting my project, ProjectPrep, an enterprise platform built to help engineers reverse-engineer codebases and prep for reviews."
      },
      {
        id: 2,
        title: 'The Problem Statement',
        subtitle: 'Why codebase preparation is highly fragmented',
        bulletPoints: [
          'Manual documentation audits take hours',
          'Mock prep lacks project-specific file references',
          'Static question templates fail to test custom architectures'
        ],
        notes: 'Cite raw statistics, focus on developers time sink problems.',
        script: "Developers waste days creating interview rubrics manually. General mock tools don't crawl your git repository structures, leaving preparation generic."
      },
      {
        id: 3,
        title: 'Technology Integration Stack',
        subtitle: 'Decoupled services and Mongo persistence schemas',
        bulletPoints: [
          'React frontend configured with TanStack query caching',
          'Modular Node.js controller handlers backing MongoDB',
          'LangChain & Gemini-2.5-flash APIs crawling metadata content'
        ],
        notes: 'Describe routing, JWT middlewares, and repository indexes.',
        script: "We solved this by creating a modular Node backend that communicates directly with Gemini LLMs using structured Zod output validation pipelines."
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(slides));
  }, [slides, localStorageKey]);

  useEffect(() => {
    let interval: any;
    if (timerActive) {
      interval = setInterval(() => {
        setTimeElapsed(s => s + 1);
      }, 1000);
    } else {
      setTimeElapsed(0);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleNotesChange = (val: string) => {
    setSlides(prev => prev.map((s, idx) => idx === activeSlide ? { ...s, notes: val } : s));
  };

  const handleScriptChange = (val: string) => {
    setSlides(prev => prev.map((s, idx) => idx === activeSlide ? { ...s, script: val } : s));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimerActive(!isFullscreen);
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 text-left relative">
      {/* Practice fullscreen modal layer */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col justify-between p-10 text-white font-sans">
          {/* Top Panel */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-teal-400">Presentation Practice Mode</span>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-teal-400" /> Timer: {formatTime(timeElapsed)}</span>
              <span>Slide {activeSlide + 1} of {slides.length}</span>
            </div>
            <button 
              onClick={toggleFullscreen} 
              className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Center widescreen Slide container */}
          <div className="flex-grow flex items-center justify-center py-6">
            <div className="w-full max-w-4xl aspect-video bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-center p-12 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[90px]" />
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">{slides[activeSlide].title}</h2>
              <h4 className="text-base text-slate-400 font-medium">{slides[activeSlide].subtitle}</h4>
              <ul className="text-sm text-slate-350 list-disc pl-6 space-y-3 font-medium">
                {slides[activeSlide].bulletPoints.map((pt, i) => <li key={i}>{pt}</li>)}
              </ul>
            </div>
          </div>

          {/* Bottom Notes Panel */}
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-850 flex gap-6 text-left">
            <div className="w-1/2 space-y-1.5">
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">Speaker Notes</span>
              <p className="text-xs text-slate-400 font-medium">{slides[activeSlide].notes}</p>
            </div>
            <div className="w-1/2 space-y-1.5">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Speech Script</span>
              <p className="text-xs text-slate-400 font-medium font-mono">"{slides[activeSlide].script}"</p>
            </div>
          </div>

          {/* Control Navigation bar */}
          <div className="flex justify-center gap-4 pt-4 border-t border-slate-800">
            <button 
              onClick={() => setActiveSlide(s => Math.max(0, s - 1))}
              disabled={activeSlide === 0}
              className="p-3 bg-slate-800 rounded-full hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveSlide(s => Math.min(slides.length - 1, s + 1))}
              disabled={activeSlide === slides.length - 1}
              className="p-3 bg-slate-800 rounded-full hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Studio View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Slide deck list */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-4 rounded-[20px] shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2.5 pb-2 block border-b border-slate-100 dark:border-slate-700/50 mb-2">Slide Outlines</span>
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveSlide(idx)}
              className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                activeSlide === idx 
                  ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25' 
                  : 'text-slate-500 border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">SLIDE {s.id}</span>
                <span className="truncate block mt-0.5">{s.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Center: Slide Preview Widescreen */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-6 rounded-[20px] shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/50 pb-3 flex-wrap gap-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Tv className="w-4.5 h-4.5 text-teal-500" />
                Virtual Presentation Slide Deck
              </h3>
              <button 
                onClick={toggleFullscreen}
                className="px-3.5 py-1.5 bg-teal-555 text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 border border-teal-500/25 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" /> Practice Full Screen
              </button>
            </div>

            {/* Slide mockup */}
            <div className="w-full aspect-video bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-center p-8 space-y-4 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-[60px]" />
              <h3 className="text-xl font-black text-teal-400">{slides[activeSlide].title}</h3>
              <h5 className="text-xs text-slate-400 font-medium">{slides[activeSlide].subtitle}</h5>
              <ul className="text-xs text-slate-350 list-disc pl-6 space-y-2 font-medium">
                {slides[activeSlide].bulletPoints.map((pt, i) => <li key={i}>{pt}</li>)}
              </ul>
            </div>

            {/* Notes edit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Speaker Notes</label>
                <textarea
                  value={slides[activeSlide].notes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-850 dark:text-slate-350 leading-relaxed font-medium focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5"/> Suggested Demo Script</label>
                <textarea
                  value={slides[activeSlide].script}
                  onChange={(e) => handleScriptChange(e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-850 dark:text-slate-350 leading-relaxed font-medium focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
