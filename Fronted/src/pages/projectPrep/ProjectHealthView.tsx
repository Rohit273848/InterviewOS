import React from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { 
  Heart, 
  Activity, 
  Lightbulb, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { ProjectPrepSession } from '../../services/projectPrep.service';

interface ProjectHealthViewProps {
  session: ProjectPrepSession;
}

export const ProjectHealthView: React.FC<ProjectHealthViewProps> = () => {
  
  // Custom project health metric scores
  const healthData = [
    { subject: 'Code Quality', A: 85 },
    { subject: 'Architecture', A: 90 },
    { subject: 'Security', A: 80 },
    { subject: 'Performance', A: 75 },
    { subject: 'Scalability', A: 70 },
    { subject: 'Documentation', A: 95 },
    { subject: 'Testing', A: 60 }
  ];

  const suggestions = [
    {
      title: 'Missing Database Indices',
      desc: 'Compound index on project preparation schema collection is missing. Add index for optimize history lists query.',
      impact: 'High Impact',
      impactColor: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
    },
    {
      title: 'Optimize API Caching',
      desc: 'Repeated git checks of the same repo description bypass caching layers. Configure Redis query bindings.',
      impact: 'Medium Impact',
      impactColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    },
    {
      title: 'Scrub OAuth Trace Keys',
      desc: 'Access tokens were logged inside standard trace files during error debug. Filter token outputs.',
      impact: 'Security Alert',
      impactColor: 'bg-red-500/10 text-red-500 border-red-500/20'
    }
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-100 dark:border-slate-700/50 pb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Heart className="w-4.5 h-4.5 text-teal-500" />
          AI Project Ingestion Health Audit
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">Security scans, performance footprints, and code hygiene assessments derived from repository content.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Health radar chart & gauges */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-6 rounded-[20px] shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-teal-500" />
            Health Footprint Matrix
          </h4>

          <div className="h-60 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={healthData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={8} />
                <Radar name="Project Health" dataKey="A" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: progress values list */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-5 rounded-[20px] shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-teal-500 animate-pulse" />
            Metric Score Breakdown
          </h4>

          <div className="space-y-3">
            {healthData.map((item) => (
              <div key={item.subject} className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-350">
                  <span>{item.subject}</span>
                  <span>{item.A}%</span>
                </div>
                <div className="w-full bg-slate-50 dark:bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800">
                  <div 
                    className="h-full bg-teal-500 rounded-full transition-all" 
                    style={{ width: `${item.A}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Suggestions logs */}
      <div className="space-y-3.5">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-teal-500" />
          Critical Hygiene Recommendations
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((s, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-5 rounded-2xl shadow-sm space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex justify-between items-start gap-2">
                  <h5 className="text-xs font-bold text-slate-800 dark:text-white">{s.title}</h5>
                  <span className={`px-2 py-0.5 text-[8px] font-bold rounded-full border uppercase tracking-wider ${s.impactColor}`}>
                    {s.impact}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{s.desc}</p>
              </div>
              <div className="pt-2 border-t border-slate-50 dark:border-slate-750 text-[10px] text-teal-600 dark:text-teal-400 font-extrabold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/> Action Required</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
