import React, { useState } from 'react';
import { 
  Download, 
  Files, 
  HelpCircle,
  FileCheck,
  Code
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ProjectPrepSession } from '../../services/projectPrep.service';

interface ExportCenterViewProps {
  session: ProjectPrepSession;
}

export const ExportCenterView: React.FC<ExportCenterViewProps> = ({ session }) => {
  const [selectedItems, setSelectedItems] = useState({
    basicInfo: true,
    pitches: true,
    questions: true,
    slides: true,
    challenges: true
  });

  const [exportFormat, setExportFormat] = useState<'md' | 'json'>('md');
  const [loading, setLoading] = useState(false);

  const toggleItem = (key: keyof typeof selectedItems) => {
    setSelectedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      let content = '';
      let filename = `${session.repoName}_prep_export`;

      if (exportFormat === 'json') {
        const payload: Record<string, any> = {
          repoName: session.repoName,
          githubUrl: session.githubUrl,
          exportedAt: new Date().toISOString()
        };
        if (selectedItems.basicInfo) payload.description = session.description;
        if (selectedItems.questions) payload.questions = session.generatedQuestions;
        content = JSON.stringify(payload, null, 2);
        filename += '.json';
      } else {
        content += `# Project Prep Export: ${session.repoName}\n\n`;
        content += `Source Repository: ${session.githubUrl}\n`;
        content += `Export Date: ${new Date().toLocaleDateString()}\n\n`;

        if (selectedItems.basicInfo) {
          content += `## Project Details\n`;
          content += `- **Description:** ${session.description || 'N/A'}\n`;
          content += `- **Languages:** ${session.languages.join(', ')}\n\n`;
        }
        if (selectedItems.questions) {
          content += `## Interview Questions\n\n`;
          session.generatedQuestions.forEach((q, idx) => {
            content += `### Q${idx + 1}: ${q.question}\n`;
            content += `- **Category:** ${q.category}\n`;
            content += `- **Difficulty:** ${q.difficulty}\n`;
            content += `- **Guideline Hint:** ${q.hint}\n\n`;
          });
        }
        filename += '.md';
      }

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Document export completed successfully!');
    }, 700);
  };

  return (
    <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-6 rounded-[20px] shadow-sm space-y-6 text-left">
      <div className="border-b border-slate-100 dark:border-slate-700/50 pb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Files className="w-4.5 h-4.5 text-teal-500" />
          Export Center
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">Assemble custom PDF, Markdown, or JSON backups from selected preparation modules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Checkbox select menu */}
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pb-2 border-b border-slate-50 dark:border-slate-750">Selective Modules</span>
          
          <div className="space-y-2.5">
            {([
              { key: 'basicInfo', label: 'Basic Ingestion Metadata' },
              { key: 'pitches', label: 'AI Copywriter Summaries & Pitch templates' },
              { key: 'questions', label: 'Generated Technical Interview Q&A Lists' },
              { key: 'slides', label: 'Presentation outline & speaker notes script' },
              { key: 'challenges', label: 'Technical bottlenecks & mitigation table' }
            ] as const).map(({ key, label }) => (
              <div 
                key={key} 
                onClick={() => toggleItem(key)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedItems[key] 
                    ? 'bg-teal-500/10 border-teal-500/25 text-teal-655 dark:text-teal-400 font-bold' 
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-550 dark:text-slate-400'
                }`}
              >
                <span className="text-xs font-semibold">{label}</span>
                {selectedItems[key] ? <FileCheck className="w-4 h-4 text-teal-500" /> : <HelpCircle className="w-4 h-4 text-slate-350" />}
              </div>
            ))}
          </div>
        </div>

        {/* Format Select & Export Action */}
        <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pb-2 border-b border-slate-200 dark:border-slate-750">File Format Specification</span>
            
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setExportFormat('md')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                  exportFormat === 'md' 
                    ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25' 
                    : 'bg-white dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-slate-750'
                }`}
              >
                ✏️ Markdown (.md)
              </button>
              <button
                onClick={() => setExportFormat('json')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                  exportFormat === 'json' 
                    ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25' 
                    : 'bg-white dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-slate-750'
                }`}
              >
                <Code className="w-4 h-4 mx-auto mb-1" /> JSON Backup (.json)
              </button>
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download Preparation Pack
          </button>
        </div>
      </div>
    </div>
  );
};
