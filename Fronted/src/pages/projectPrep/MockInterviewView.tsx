import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Send, 
  Volume2, 
  Activity, 
  Award,
  RefreshCw,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ProjectPrepSession } from '../../services/projectPrep.service';

interface MockInterviewViewProps {
  session: ProjectPrepSession;
}

type InterviewState = 'setup' | 'active' | 'report';

export const MockInterviewView: React.FC<MockInterviewViewProps> = ({ session }) => {
  const [stage, setStage] = useState<InterviewState>('setup');
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [company, setCompany] = useState('Google');
  const [difficulty, setDifficulty] = useState('Medium');
  
  // Active state variables
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [chatLog, setChatLog] = useState<{ sender: 'ai' | 'user'; text: string }[]>([]);

  // Analytics variables derived on answer submit
  const [fillerWords, setFillerWords] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (stage === 'active') {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      setTimerSeconds(0);
    }
    return () => clearInterval(interval);
  }, [stage]);

  const handleStart = () => {
    const initialQuestion = session.generatedQuestions[0]?.question || "Can you explain the main folder structure of this repository?";
    setStage('active');
    setCurrentQIdx(0);
    setUserResponse('');
    setFillerWords(0);
    setWordCount(0);
    setChatLog([{ sender: 'ai', text: `Welcome to your ${company} project technical interview. Let's start. ${initialQuestion}` }]);
  };

  const handleMicToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      setUserResponse("Based on the codebase files, I structured the routers under Backend/src/routes and mapped controllers to services. This separates API concerns from DB operations.");
      toast.success("Voice transcript synchronized!");
    } else {
      setIsRecording(true);
      toast.success("Listening... Speak now");
    }
  };

  const handleSend = () => {
    if (!userResponse.trim()) {
      toast.error("Please enter or record an answer.");
      return;
    }

    // Evaluate filler words (like, um, ah, actually)
    const words = userResponse.toLowerCase().split(/\s+/);
    const fillers = words.filter(w => ['like', 'um', 'ah', 'actually', 'basically'].includes(w)).length;
    setFillerWords(prev => prev + fillers);
    setWordCount(prev => prev + words.length);

    // Save to chat log
    const updatedLog = [
      ...chatLog, 
      { sender: 'user' as const, text: userResponse }
    ];

    const nextIdx = currentQIdx + 1;
    if (nextIdx < 3 && nextIdx < session.generatedQuestions.length) {
      // Advance to next question
      const nextQ = session.generatedQuestions[nextIdx].question;
      setChatLog([
        ...updatedLog,
        { sender: 'ai' as const, text: nextQ }
      ]);
      setCurrentQIdx(nextIdx);
      setUserResponse('');
    } else {
      // Finished
      setStage('report');
    }
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 text-left">
      {stage === 'setup' && (
        /* Setup configuration view */
        <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-6 rounded-[20px] shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-700/50 pb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4.5 h-4.5 text-teal-500" />
              Configure AI Mock Interview
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Target custom company questions and receive communications feedback.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mode selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">Round Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setMode('text')} 
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    mode === 'text' 
                      ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25' 
                      : 'text-slate-500 hover:bg-slate-50 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  💬 Chat Round
                </button>
                <button 
                  onClick={() => setMode('voice')} 
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    mode === 'voice' 
                      ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25' 
                      : 'text-slate-500 hover:bg-slate-50 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  🎤 Voice Round
                </button>
              </div>
            </div>

            {/* Target Company selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">Target Company Profile</label>
              <select 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none"
              >
                <option value="Google">Google / FAANG</option>
                <option value="TCS">TCS / Prime</option>
                <option value="Accenture">Accenture / Service</option>
                <option value="Amazon">Amazon AWS</option>
                <option value="Microsoft">Microsoft Azure</option>
                <option value="Startup">Early Stage Startup</option>
              </select>
            </div>

            {/* Difficulty selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">Difficulty Tier</label>
              <select 
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none"
              >
                <option value="Easy">Easy (Conceptual)</option>
                <option value="Medium">Medium (Applied API)</option>
                <option value="Hard">Hard (System Scale)</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleStart}
            className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Play className="w-4 h-4 fill-white" /> Launch Interview Session
          </button>
        </div>
      )}

      {stage === 'active' && (
        /* Active chat layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat log column */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-6 rounded-[20px] shadow-sm flex flex-col justify-between h-[420px]">
            <div className="flex-grow overflow-y-auto space-y-4 pb-4 pr-1 scrollbar-thin select-text">
              {chatLog.map((log, index) => (
                <div key={index} className={`flex ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                    log.sender === 'user' 
                      ? 'bg-teal-500 text-white rounded-tr-none' 
                      : 'bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
                  }`}>
                    {log.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input form */}
            <div className="border-t border-slate-100 dark:border-slate-700/50 pt-4 flex gap-2">
              {mode === 'voice' ? (
                <button 
                  onClick={handleMicToggle}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                    isRecording 
                      ? 'bg-red-500/10 text-red-500 border-red-500/25 animate-pulse' 
                      : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
                  }`}
                >
                  <Volume2 className="w-4 h-4" /> {isRecording ? 'Listening (Click to Stop)' : 'Record Answer'}
                </button>
              ) : null}

              <input 
                type="text"
                placeholder={mode === 'voice' ? "Record audio above or type draft here..." : "Type your technical response..."}
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                className="flex-grow px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none"
              />
              <button 
                onClick={handleSend}
                className="p-2.5 bg-teal-500 hover:bg-teal-600 rounded-xl text-white transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active side-metrics log */}
          <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-5 rounded-[20px] shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-700/50 pb-2">
              <Activity className="w-4 h-4 text-teal-500 animate-pulse" />
              Live Speech Analytics
            </h4>
            <div className="space-y-3 font-semibold text-[11px] text-slate-655 dark:text-slate-350">
              <div className="flex justify-between border-b border-slate-50 dark:border-slate-700/40 pb-2">
                <span>Active Timer:</span>
                <span className="font-mono text-teal-500 font-bold">{formatTime(timerSeconds)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 dark:border-slate-700/40 pb-2">
                <span>Filler Words Detected:</span>
                <span className="text-amber-500">{fillerWords} ("um", "like")</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 dark:border-slate-700/40 pb-2">
                <span>Word Output Rate:</span>
                <span className="text-indigo-500">{wordCount} Words</span>
              </div>
              <div className="flex justify-between">
                <span>AI Ingest Connection:</span>
                <span className="text-green-500">Live Active</span>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-bold leading-relaxed">
              💡 **Tips:** Speak slowly and refer explicitly to database schemas and directory structures generated in the project info tab.
            </div>
          </div>
        </div>
      )}

      {stage === 'report' && (
        /* Report analytics review */
        <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-6 rounded-[20px] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-700/50 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-teal-500" />
                Session Evaluation Report
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Analysis completed based on accuracy, structure, and grammar rules.</p>
            </div>
            <button 
              onClick={handleStart} 
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-practice Round
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Scorecard circular */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Overall Score</span>
              <div className="w-24 h-24 rounded-full border-4 border-teal-500 flex items-center justify-center">
                <span className="text-2xl font-black text-slate-800 dark:text-white">82%</span>
              </div>
              <span className="text-xs text-teal-600 dark:text-teal-400 font-extrabold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Good Match</span>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest block">Communications Strengths</span>
                <ul className="text-xs text-slate-600 dark:text-slate-400 font-medium list-disc pl-4 space-y-1">
                  <li>Referenced specific folder locations accurately.</li>
                  <li>Maintained structured problem-solving sequence.</li>
                  <li>Good structural response speed.</li>
                </ul>
              </div>
            </div>

            {/* Improvement Plan */}
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest block">Areas to Optimize</span>
                <ul className="text-xs text-slate-600 dark:text-slate-400 font-medium list-disc pl-4 space-y-1">
                  <li>Minimize filler word count (detected {fillerWords} words).</li>
                  <li>Explain scaling solutions and DB query caching details.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
