import React, { useState } from 'react';
import { 
  Settings, 
  Trash2, 
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ProjectPrepSession } from '../../services/projectPrep.service';

interface SettingsViewProps {
  session: ProjectPrepSession;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ session }) => {
  const [roleFocus, setRoleFocus] = useState('Full Stack Engineer');
  const [apiDelay, setApiDelay] = useState(1.5);
  const [geminiModel, setGeminiModel] = useState('gemini-2.5-flash');

  const handleClearCache = () => {
    // Clear project specific notes
    const keys = Object.keys(localStorage);
    keys.forEach(k => {
      if (k.includes(session._id)) {
        localStorage.removeItem(k);
      }
    });
    toast.success('Local database cache cleared successfully!');
  };

  const handleSaveSettings = () => {
    toast.success('Preferences updated!');
  };

  return (
    <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-6 rounded-[20px] shadow-sm space-y-6 text-left">
      <div className="border-b border-slate-100 dark:border-slate-700/50 pb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-4.5 h-4.5 text-teal-500" />
          Preparation Preferences & Settings
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">Configure target job profiles, API model parameters, and local data persistence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core preferences */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Career Profile Focus</label>
            <select
              value={roleFocus}
              onChange={(e) => setRoleFocus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none"
            >
              <option value="Full Stack Engineer">Full Stack Engineer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Services Engineer">Backend Services Engineer</option>
              <option value="Devops & Deployments Admin">Devops & Deployments Admin</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mock Stream Response Speed (Seconds)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.5"
                value={apiDelay}
                onChange={(e) => setApiDelay(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <span className="text-xs font-mono text-slate-700 dark:text-slate-350">{apiDelay}s</span>
            </div>
          </div>
        </div>

        {/* Model configurations */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Orchestrator Engine</label>
            <select
              value={geminiModel}
              onChange={(e) => setGeminiModel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Optimized)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning)</option>
              <option value="claude-3.5-sonnet">Anthropic Claude 3.5 Sonnet (Developer)</option>
            </select>
          </div>

          {/* Wipe Cache alert */}
          <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-xl space-y-2 flex flex-col justify-between">
            <div className="flex gap-2 items-start">
              <AlertTriangle className="w-4 h-4 text-red-550 flex-shrink-0" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-red-655 uppercase tracking-wider block">Clear Local Cached Progress</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">This deletes all custom notes, mock interview histories, and STAR templates associated with this repository session.</p>
              </div>
            </div>
            <button 
              onClick={handleClearCache}
              className="px-3.5 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-bold hover:bg-red-600 transition-all flex items-center gap-1 w-max cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Wipe Ingestion Data
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
        >
          Save Configurations
        </button>
      </div>
    </div>
  );
};
