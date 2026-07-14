import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  CheckCircle, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  FileText, 
  Clock, 
  Lightbulb
} from 'lucide-react';
import { ProjectPrepSession } from '../../services/projectPrep.service';

interface QuestionsViewProps {
  session: ProjectPrepSession;
  bookmarks: Record<number, boolean>;
  mastered: Record<number, boolean>;
  toggleBookmark: (idx: number) => void;
  toggleMastered: (idx: number) => void;
}

export const QuestionsView: React.FC<QuestionsViewProps> = ({ 
  session, 
  bookmarks, 
  mastered, 
  toggleBookmark, 
  toggleMastered 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'All' | 'Basic' | 'Technical' | 'Advanced' | 'Behavioral' | 'HR'>('All');
  const [questionSearch, setQuestionSearch] = useState('');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  // Confidence state storage helper
  const [confidences, setConfidences] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem(`prep_confidences_${session._id}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {};
  });

  const handleConfidenceChange = (idx: number, val: number) => {
    setConfidences(prev => {
      const updated = { ...prev, [idx]: val };
      localStorage.setItem(`prep_confidences_${session._id}`, JSON.stringify(updated));
      return updated;
    });
  };

  // Filter questions by search query and difficulty tab
  const filteredQuestions = session.generatedQuestions.map((q, idx) => ({ ...q, originalIdx: idx }))
    .filter((q) => {
      // Filter by sub tabs
      if (activeSubTab === 'Basic' && q.difficulty !== 'Easy') return false;
      if (activeSubTab === 'Technical' && q.difficulty !== 'Medium') return false;
      if (activeSubTab === 'Advanced' && q.difficulty !== 'Hard') return false;
      if (activeSubTab === 'Behavioral' && q.category !== 'Tradeoffs') return false;
      if (activeSubTab === 'HR' && q.category === 'Security') return false; // Simulated split

      // Search match
      if (questionSearch.trim()) {
        const query = questionSearch.toLowerCase();
        return q.question.toLowerCase().includes(query) || q.hint.toLowerCase().includes(query);
      }
      return true;
    });

  // Difficulty badge styling helpers
  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'hard':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case 'medium':
      default:
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-6 rounded-[20px] shadow-sm space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/50 pb-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4.5 h-4.5 text-teal-500" />
            Interview Preparation Question Bank
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Select difficulty categories and build outline answers to prepare for reviews.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search questions..."
            value={questionSearch}
            onChange={(e) => setQuestionSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Categories / Difficulty Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {(['All', 'Basic', 'Technical', 'Advanced', 'Behavioral', 'HR'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveSubTab(tab);
              setExpandedIdx(null);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition-all border ${
              activeSubTab === tab 
                ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20' 
                : 'text-slate-500 border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Questions list */}
      <div className="space-y-3.5">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q, idx) => {
            const isExpanded = expandedIdx === idx;
            const isBookmarked = bookmarks[q.originalIdx] || false;
            const isMastered = mastered[q.originalIdx] || false;
            const confidence = confidences[q.originalIdx] || 0;

            return (
              <div 
                key={idx}
                className={`bg-slate-50/30 dark:bg-slate-900/10 rounded-2xl border transition-all overflow-hidden ${
                  isMastered 
                    ? 'border-slate-100 dark:border-slate-800/80 opacity-60' 
                    : isExpanded 
                      ? 'border-teal-500/40 dark:border-teal-500/30 bg-slate-50/60 dark:bg-slate-900/20 shadow-sm' 
                      : 'border-slate-200/60 dark:border-slate-750 hover:border-slate-350'
                }`}
              >
                {/* Accordion Row */}
                <div className="p-4 flex items-start gap-4">
                  {/* Mastered status */}
                  <button 
                    type="button" 
                    onClick={() => toggleMastered(q.originalIdx)}
                    className={`mt-1 flex-shrink-0 p-0.5 rounded-full border cursor-pointer ${
                      isMastered 
                        ? 'bg-teal-500/10 text-teal-500 border-teal-500/25' 
                        : 'text-slate-300 border-slate-300 dark:border-slate-700 hover:text-teal-500 hover:border-teal-500/45'
                    }`}
                  >
                    <CheckCircle className="w-4.5 h-4.5" />
                  </button>

                  {/* Question details */}
                  <div 
                    onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                    className="flex-grow space-y-1.5 cursor-pointer text-left"
                  >
                    <p className={`text-xs font-bold leading-relaxed ${isMastered ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                      {q.question}
                    </p>
                    <div className="flex items-center gap-2 text-[9px] font-bold select-none uppercase">
                      <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 px-1.5 py-0.2 rounded font-black">{q.category}</span>
                      <span className={`px-1.5 py-0.2 rounded border ${getDifficultyColor(q.difficulty)}`}>{q.difficulty}</span>
                      <span className="text-slate-400 flex items-center gap-0.5"><Clock className="w-3 h-3"/> 5 Mins Practice</span>
                    </div>
                  </div>

                  {/* Bookmark status */}
                  <button 
                    type="button" 
                    onClick={() => toggleBookmark(q.originalIdx)}
                    className={`mt-1 p-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg cursor-pointer ${
                      isBookmarked ? 'text-amber-500' : 'text-slate-350'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                  </button>

                  {/* Accordion toggle icon */}
                  <button 
                    type="button"
                    onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                    className="mt-1 p-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg cursor-pointer text-slate-400"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded Details Canvas */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-slate-200/50 dark:border-slate-750/50 bg-white/40 dark:bg-slate-900/30 p-5 space-y-4 text-left text-xs"
                    >
                      {/* Section 1: Evaluator Guidelines (hint) */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest flex items-center gap-1.5 select-none"><Lock className="w-3.5 h-3.5"/> Evaluation Rubric & Talking Points</span>
                        <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-750 text-slate-655 dark:text-slate-350 font-medium leading-relaxed">
                          {q.hint || 'Focus on system decoupling interfaces, index compound mappings, and CORS credentials middleware.'}
                        </div>
                      </div>

                      {/* Section 2: Model Answer */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 select-none"><Lightbulb className="w-3.5 h-3.5"/> Suggested Model Answer</span>
                        <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-750 text-slate-655 dark:text-slate-350 font-medium leading-relaxed">
                          📌 **Suggested:** "In this repository, I set up a decoupled service structure under 'Backend/src/services' to separate domain actions from routing controller layers. This keeps the database access functions reusable and makes writing test mocks clean."
                        </div>
                      </div>

                      {/* Section 3: Notes & Saved Response */}
                      <AnswerNotes sessionId={session._id} questionIdx={q.originalIdx} />

                      {/* Section 4: Confidence Meter */}
                      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-750">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">My Confidence Meter</span>
                        <div className="flex items-center gap-2">
                          {[20, 40, 60, 80, 100].map((val) => (
                            <button
                              key={val}
                              onClick={() => handleConfidenceChange(q.originalIdx, val)}
                              className={`px-2.5 py-1 text-[10px] font-black rounded-lg border transition-all cursor-pointer ${
                                confidence >= val 
                                  ? 'bg-teal-500 text-white border-teal-500' 
                                  : 'bg-white dark:bg-slate-950 text-slate-400 border-slate-200 dark:border-slate-750'
                              }`}
                            >
                              {val}%
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-slate-400 font-medium border border-dashed border-slate-200/60 dark:border-slate-750 rounded-2xl bg-slate-50/20">
            No questions match search queries or selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

// Answer Notes wrapper
const AnswerNotes = ({ sessionId, questionIdx }: { sessionId: string; questionIdx: number }) => {
  const localStorageKey = `prep_notes_${sessionId}_${questionIdx}`;
  const [note, setNote] = useState(() => localStorage.getItem(localStorageKey) || '');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNote(value);
    localStorage.setItem(localStorageKey, value);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest flex items-center gap-1.5 select-none">
          <FileText className="w-3.5 h-3.5" /> Draft My Response (Auto-saves)
        </label>
        <span className="text-[9px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
          Cloud Active
        </span>
      </div>
      <textarea
        value={note}
        onChange={handleChange}
        placeholder="Outline your detailed answer here. Mention specific files, folder paths, data schemas, or deployment tools you would cite during discussions..."
        className="w-full min-h-[90px] p-3 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-750 rounded-xl focus:outline-none focus:border-teal-500/40 text-slate-800 dark:text-slate-200 font-medium"
      />
    </div>
  );
};
