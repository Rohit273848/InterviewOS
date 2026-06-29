import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  Network, 
  BookOpen, 
  MessageSquare
} from 'lucide-react';
import { ProjectPrepSession } from '../../services/projectPrep.service';

interface AICopilotPanelProps {
  session: ProjectPrepSession;
}

interface ChatMessage {
  id: string;
  sender: 'copilot' | 'user';
  text: string;
  timestamp: string;
}

export const AICopilotPanel: React.FC<AICopilotPanelProps> = ({ session }) => {
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: '1',
        sender: 'copilot',
        text: `Hi! I am your Project Copilot for **${session.repoName}**. Ask me to explain files, optimize your study answers, or perform structural reviews.`,
        timestamp: 'Just now'
      }
    ];
  });
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-scroll effect
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = (text?: string) => {
    const query = text || inputText;
    if (!query.trim()) return;

    // Append user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    // Simulate Copilot Response stream
    setTimeout(() => {
      setLoading(false);
      let responseText = '';
      if (query.includes('Explain Project')) {
        responseText = `Here is a structural audit of **${session.repoName}**: It acts as a full-stack tool built using React and Node.js. Business logic is separated into Express routers and services. Authentication relies on JWT tokens.`;
      } else if (query.includes('Architecture Review')) {
        responseText = `**Architecture Review**: Decoupling looks solid. Recommend adding compound indexes for userId, and moving heavy Git checkouts to queue workers to prevent Express event blockages.`;
      } else if (query.includes('LinkedIn optimization')) {
        responseText = `**LinkedIn Pitch**: "Proud to release my project: '${session.repoName}'! Built with ${session.languages.join(', ')} to explore system designs, token credentials middleware, and MongoDB schemas. Check out my GitHub demo!"`;
      } else {
        responseText = `I analyzed your query relative to **${session.repoName}**. I recommend writing a STAR story for this feature and optimizing DB indices under MongoDB configuration paths.`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'copilot',
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1100);
  };

  const quickActions = [
    { label: 'Explain Project', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { label: 'Architecture Review', icon: <Network className="w-3.5 h-3.5" /> },
    { label: 'LinkedIn optimization', icon: <MessageSquare className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-4 rounded-[20px] shadow-sm flex flex-col justify-between h-full min-h-[450px]">
      
      {/* Header info */}
      <div className="border-b border-slate-100 dark:border-slate-700/50 pb-3 flex justify-between items-center select-none text-left">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-teal-500/10 rounded-lg">
            <Bot className="w-4 h-4 text-teal-500 animate-bounce" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-white block">Project Copilot</span>
            <span className="text-[9px] text-green-500 font-extrabold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> AI Agent Connected
            </span>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-grow overflow-y-auto space-y-4 py-4 pr-1 scrollbar-thin select-text text-left">
        {messages.map((m) => {
          const isCopilot = m.sender === 'copilot';
          return (
            <div key={m.id} className={`flex ${isCopilot ? 'justify-start' : 'justify-end'} gap-2.5`}>
              {isCopilot && (
                <div className="w-6 h-6 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-500 flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div className={`max-w-[80%] p-3 rounded-2xl text-[11px] leading-relaxed font-medium ${
                isCopilot 
                  ? 'bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-350 rounded-tl-none' 
                  : 'bg-teal-500 text-white rounded-tr-none'
              }`}>
                {m.text}
                <span className={`block text-[8px] text-right mt-1.5 ${isCopilot ? 'text-slate-400' : 'text-teal-200'}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-500 flex-shrink-0 animate-spin">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl text-[11px] text-slate-400 font-bold rounded-tl-none animate-pulse">
              Copilot is analyzing code traces...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Actions & Input */}
      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
        <div className="flex flex-wrap gap-1.5 select-none">
          {quickActions.map((act) => (
            <button
              key={act.label}
              onClick={() => handleSend(act.label)}
              className="px-2.5 py-1 bg-slate-50 dark:bg-slate-900/60 hover:bg-teal-500/10 border border-slate-200 dark:border-slate-700 rounded-lg text-[9px] font-bold text-slate-550 dark:text-slate-450 hover:text-teal-500 dark:hover:text-teal-400 transition-all flex items-center gap-1 cursor-pointer"
            >
              {act.icon}
              {act.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask Copilot about repositories..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            className="flex-grow px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            className="p-2.5 bg-teal-500 hover:bg-teal-600 rounded-xl text-white transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
