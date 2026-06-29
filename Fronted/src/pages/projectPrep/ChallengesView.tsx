import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  AlertOctagon, 
  FileSpreadsheet
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ProjectPrepSession } from '../../services/projectPrep.service';

interface ChallengesViewProps {
  session: ProjectPrepSession;
}

export interface ChallengeItem {
  id: string;
  challenge: string;
  rootCause: string;
  solution: string;
  alternative: string;
  result: string;
  lesson: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({ session }) => {
  const localStorageKey = `prep_challenges_${session._id}`;
  const [searchQuery, setSearchQuery] = useState('');

  const [challenges, setChallenges] = useState<ChallengeItem[]>(() => {
    const saved = localStorage.getItem(localStorageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: '1',
        challenge: 'Ingestion tasks timeout on heavy Git repos',
        rootCause: 'Fetching full commit layers sequentially blocks Node.js worker pools.',
        solution: 'Switched to shallow clone checkouts depth=1 skipping binary files.',
        alternative: 'Deploying isolated python git scraper containers.',
        result: 'Fetch latency decreased from 30s to 4s.',
        lesson: 'Avoid pulling redundant objects during metadata sweeps.',
        category: 'Performance',
        difficulty: 'Hard'
      },
      {
        id: '2',
        challenge: 'API query latencies on session lists',
        rootCause: 'MongoDB performs full sweeps instead of checking indexed fields.',
        solution: 'Implemented a compound index on userId and createdAt.',
        alternative: 'Setup local Redis memory cache key wrappers.',
        result: 'API response times dropped by 65%.',
        lesson: 'Indexes are critical for dashboard pagination arrays.',
        category: 'Database',
        difficulty: 'Medium'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(challenges));
  }, [challenges, localStorageKey]);

  const handleAddRow = () => {
    const newRow: ChallengeItem = {
      id: Date.now().toString(),
      challenge: 'New technical bottleneck description',
      rootCause: 'Identify primary root cause here...',
      solution: 'Applied correction mechanism...',
      alternative: 'Consider other caching or API queues...',
      result: 'Latencies or errors resolved...',
      lesson: 'Core learning outcomes for team...',
      category: 'Performance',
      difficulty: 'Medium'
    };
    setChallenges(prev => [...prev, newRow]);
    toast.success('New challenge row appended!');
  };

  const handleDeleteRow = (id: string) => {
    setChallenges(prev => prev.filter(c => c.id !== id));
    toast.success('Row deleted.');
  };

  const handleFieldChange = (id: string, field: keyof ChallengeItem, val: string) => {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
  };

  const handleCSVExport = () => {
    const headers = ['Challenge', 'Root Cause', 'Solution', 'Alternative', 'Result', 'Category', 'Difficulty'];
    const rows = challenges.map(c => [
      c.challenge, c.rootCause, c.solution, c.alternative, c.result, c.category, c.difficulty
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.map(v => `"${v.replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${session.repoName}_challenges.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV Download initiated!');
  };

  // Filter lists
  const filtered = challenges.filter(c => {
    return c.challenge.toLowerCase().includes(searchQuery.toLowerCase()) || 
           c.solution.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-6 rounded-[20px] shadow-sm space-y-6 text-left">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/50 pb-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertOctagon className="w-4.5 h-4.5 text-teal-500" />
            System Challenges & Mitigation Logs
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Document technical bottlenecks, root causes, solution designs, and results.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] focus:outline-none"
            />
          </div>

          <button 
            onClick={handleAddRow}
            className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Log
          </button>
          <button 
            onClick={handleCSVExport}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-755 hover:text-teal-500 rounded-lg text-[11px] font-extrabold flex items-center gap-1 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Interactive Grid Table */}
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60 text-[10px] uppercase font-bold text-slate-450 dark:text-slate-400 border-b border-slate-200 dark:border-slate-750">
              <th className="p-3 w-1/4">Challenge / Bottleneck</th>
              <th className="p-3 w-1/4">Root Cause</th>
              <th className="p-3 w-1/4">Applied Solution</th>
              <th className="p-3 w-1/8">Category</th>
              <th className="p-3 w-1/8">Difficulty</th>
              <th className="p-3 w-20 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-750/50 text-[11px]">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10">
                <td className="p-3">
                  <input 
                    type="text" 
                    value={item.challenge} 
                    onChange={(e) => handleFieldChange(item.id, 'challenge', e.target.value)}
                    className="w-full bg-transparent border-0 focus:ring-0 p-0 text-slate-800 dark:text-slate-250 font-bold"
                  />
                </td>
                <td className="p-3">
                  <textarea 
                    value={item.rootCause} 
                    rows={1}
                    onChange={(e) => handleFieldChange(item.id, 'rootCause', e.target.value)}
                    className="w-full bg-transparent border-0 focus:ring-0 p-0 text-slate-655 dark:text-slate-400 font-medium resize-none"
                  />
                </td>
                <td className="p-3">
                  <textarea 
                    value={item.solution} 
                    rows={1}
                    onChange={(e) => handleFieldChange(item.id, 'solution', e.target.value)}
                    className="w-full bg-transparent border-0 focus:ring-0 p-0 text-slate-655 dark:text-slate-400 font-medium resize-none"
                  />
                </td>
                <td className="p-3">
                  <select
                    value={item.category}
                    onChange={(e) => handleFieldChange(item.id, 'category', e.target.value)}
                    className="bg-transparent border-0 p-0 focus:ring-0 text-[11px] font-bold text-teal-600 dark:text-teal-400"
                  >
                    <option value="Performance">Performance</option>
                    <option value="Security">Security</option>
                    <option value="Database">Database</option>
                    <option value="Deployment">Deployment</option>
                  </select>
                </td>
                <td className="p-3">
                  <select
                    value={item.difficulty}
                    onChange={(e) => handleFieldChange(item.id, 'difficulty', e.target.value)}
                    className="bg-transparent border-0 p-0 focus:ring-0 text-[11px] font-bold"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </td>
                <td className="p-3 text-center">
                  <button 
                    onClick={() => handleDeleteRow(item.id)}
                    className="p-1 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400 font-medium bg-slate-50/20">
                  No challenge logs recorded. Click "Add Log" to insert.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
