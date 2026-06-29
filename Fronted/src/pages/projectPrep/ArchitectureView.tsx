import React, { useState } from 'react';
import { 
  Network, 
  Download, 
  Copy, 
  Cpu, 
  FolderTree, 
  Code, 
  Database, 
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ProjectPrepSession } from '../../services/projectPrep.service';

interface ArchitectureViewProps {
  session: ProjectPrepSession;
}

type ArchTab = 'hld' | 'erd' | 'api-flow' | 'folder-structure';

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ session }) => {
  const [activeTab, setActiveTab] = useState<ArchTab>('hld');

  // Folder structure helper
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    root: true,
    src: true,
    backend: true,
    frontend: true,
  });

  const toggleFolder = (key: string) => {
    setOpenFolders(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopyMermaid = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Mermaid configuration code copied!');
  };

  const handleExportDiagram = (type: string) => {
    toast.success(`Diagram export as ${type} initialized.`);
  };

  // Generate Mermaid code blocks based on stacks
  const mermaidHLD = `graph TD
  User((Client User)) -->|HTTPS| CDN[Vercel CDN]
  CDN -->|Renders Client| SPA[React App/Client]
  SPA -->|API Requests| API[Express API Gateway / Render]
  
  subgraph Backend Controllers
    API --> Auth[Auth Middleware]
    Auth --> Route[Router Matches]
    Route --> C_Auth[Authentication Controller]
    Route --> C_Prep[ProjectPrep Controller]
  end

  subgraph Service Layers
    C_Auth --> S_Auth[Auth Services]
    C_Prep --> S_Github[GitHub Service API]
    C_Prep --> S_AI[Google Gemini LLM Service]
  end

  subgraph DB Persistence
    S_Auth --> Mongo[(MongoDB Instance)]
    S_Github --> Mongo
  end
`;

  const mermaidERD = `erDiagram
  USER {
    ObjectId id PK
    string email
    string passwordHash
    string fullName
  }
  PROJECT_PREP_SESSION {
    ObjectId id PK
    ObjectId userId FK
    string githubUrl
    string repoName
    string description
    string status
    Array generatedQuestions
    date createdAt
  }
  USER ||--o{ PROJECT_PREP_SESSION : owns
`;

  const mermaidAPIFlow = `sequenceDiagram
  autonumber
  Client App->>Backend Router: POST /api/project-prep/generate { githubUrl }
  Backend Router->>Auth Middleware: Validate Auth JWT
  Auth Middleware-->>Backend Router: Auth Token Approved
  Backend Router->>Github Service: Fetch Repo Files & Readme
  Github Service-->>Backend Router: Return Repo Metadata Payload
  Backend Router->>Gemini AI Service: Analyze Payload & Synthesize Questions
  Gemini AI Service-->>Backend Router: Returns JSON Array of Questions
  Backend Router->>Database: Save PrepSession Document
  Database-->>Client App: HTTP 201 Created (Session Document)
`;

  return (
    <div className="space-y-6">
      {/* Upper Tab selector */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-4 rounded-[20px] shadow-sm flex-wrap gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {([
            { id: 'hld', label: 'High Level Design', icon: <Network className="w-3.5 h-3.5" /> },
            { id: 'erd', label: 'Database ERD', icon: <Database className="w-3.5 h-3.5" /> },
            { id: 'api-flow', label: 'Sequence API Flow', icon: <Cpu className="w-3.5 h-3.5" /> },
            { id: 'folder-structure', label: 'Directory Studio', icon: <FolderTree className="w-3.5 h-3.5" /> }
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all border ${
                activeTab === tab.id 
                  ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20' 
                  : 'text-slate-500 border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleExportDiagram('SVG')} 
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-755 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 rounded-lg text-[10px] font-extrabold flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download SVG
          </button>
          <button 
            onClick={() => handleExportDiagram('PNG')} 
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-755 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 rounded-lg text-[10px] font-extrabold flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download PNG
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual Diagram / Tree View */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-6 rounded-[20px] shadow-sm flex items-center justify-center min-h-[360px]">
          {activeTab === 'folder-structure' ? (
            /* Directory tree browser mock */
            <div className="w-full text-left space-y-1.5 font-mono text-xs text-slate-655 dark:text-slate-350 select-none">
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-widest block pb-2 mb-2 border-b border-slate-100 dark:border-slate-700">Project Directory Layout</span>
              
              <div className="pl-0 cursor-pointer flex items-center gap-1" onClick={() => toggleFolder('root')}>
                {openFolders.root ? <ChevronDown className="w-3.5 h-3.5 text-teal-555" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <span className="text-teal-600 dark:text-teal-400 font-bold">{session.repoName}/</span>
              </div>

              {openFolders.root && (
                <div className="pl-4 space-y-1.5 border-l border-slate-200 dark:border-slate-700 ml-1.5">
                  <div className="cursor-pointer flex items-center gap-1" onClick={() => toggleFolder('frontend')}>
                    {openFolders.frontend ? <ChevronDown className="w-3.5 h-3.5 text-indigo-500" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">Fronted/</span>
                  </div>
                  {openFolders.frontend && (
                    <div className="pl-4 space-y-1 border-l border-slate-200 dark:border-slate-700 ml-1.5">
                      <div>📁 public/</div>
                      <div>📁 src/</div>
                      <div className="text-teal-655 font-bold">📄 package.json</div>
                      <div>📄 vite.config.ts</div>
                    </div>
                  )}

                  <div className="cursor-pointer flex items-center gap-1" onClick={() => toggleFolder('backend')}>
                    {openFolders.backend ? <ChevronDown className="w-3.5 h-3.5 text-indigo-500" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">Backend/</span>
                  </div>
                  {openFolders.backend && (
                    <div className="pl-4 space-y-1 border-l border-slate-200 dark:border-slate-700 ml-1.5">
                      <div>📁 src/</div>
                      <div className="text-teal-655 font-bold">📄 package.json</div>
                      <div>📄 server.js</div>
                    </div>
                  )}

                  <div>📄 README.md</div>
                  <div>📄 .gitignore</div>
                </div>
              )}
            </div>
          ) : activeTab === 'hld' ? (
            /* Premium custom design SVG flowchart */
            <div className="w-full flex justify-center">
              <svg viewBox="0 0 600 300" className="w-full max-w-lg h-auto">
                <defs>
                  <linearGradient id="gradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="gradIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                {/* Client Layer */}
                <rect x="20" y="110" width="120" height="60" rx="10" fill="url(#gradCyan)" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.05))" />
                <text x="80" y="145" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">React Application</text>
                
                <path d="M 140 140 L 220 140" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="4 4" />
                
                {/* Server Middleware Layer */}
                <rect x="230" y="60" width="140" height="60" rx="10" fill="url(#gradIndigo)" />
                <text x="300" y="95" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">Express Gateway</text>
                
                {/* AI / Controller Layer */}
                <rect x="230" y="170" width="140" height="60" rx="10" fill="url(#gradIndigo)" />
                <text x="300" y="205" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">Gemini AI Service</text>

                <path d="M 370 90 L 450 120" stroke="#94a3b8" strokeWidth="2" />
                <path d="M 370 200 L 450 150" stroke="#94a3b8" strokeWidth="2" />

                {/* MongoDB Persistence */}
                <rect x="460" y="110" width="120" height="60" rx="10" fill="#10b981" />
                <text x="520" y="145" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">MongoDB Persist</text>

                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                  </marker>
                </defs>
              </svg>
            </div>
          ) : activeTab === 'erd' ? (
            /* Database ERD design schematic */
            <div className="w-full flex justify-center">
              <svg viewBox="0 0 500 240" className="w-full max-w-md h-auto">
                <rect x="20" y="40" width="160" height="130" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
                <rect x="20" y="40" width="160" height="30" rx="8" fill="#1e293b" />
                <text x="100" y="60" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">USER TABLE</text>
                <text x="30" y="90" fill="#475569" fontSize="9" fontWeight="medium">🔑 id [PK] - ObjectId</text>
                <text x="30" y="110" fill="#475569" fontSize="9" fontWeight="medium">👤 name - String</text>
                <text x="30" y="130" fill="#475569" fontSize="9" fontWeight="medium">📧 email - String</text>

                <path d="M 180 100 L 300 100" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />

                <rect x="310" y="40" width="170" height="130" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
                <rect x="310" y="40" width="170" height="30" rx="8" fill="#0f766e" />
                <text x="395" y="60" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">PROJECT_PREP</text>
                <text x="320" y="90" fill="#475569" fontSize="9" fontWeight="medium">🔑 id [PK] - ObjectId</text>
                <text x="320" y="110" fill="#475569" fontSize="9" fontWeight="medium">👤 userId [FK] - ObjectId</text>
                <text x="320" y="130" fill="#475569" fontSize="9" fontWeight="medium">📁 repoName - String</text>
              </svg>
            </div>
          ) : (
            /* Sequence flow schematic */
            <div className="w-full flex justify-center text-xs font-mono bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl text-left text-slate-700 dark:text-slate-350 max-h-[300px] overflow-y-auto">
              <div className="space-y-2">
                <div>1. POST Request containing URL is dispatched from React Client.</div>
                <div>2. Middleware maps validation schema and approves token authenticity.</div>
                <div>3. Backend worker makes API query matching repository dependencies.</div>
                <div>4. Google Gemini models analyze repository details and structure.</div>
                <div>5. Database document created with state set to completed.</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Code configuration / exports */}
        <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 p-5 rounded-[20px] shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-700/50">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Code className="w-4 h-4 text-teal-500" />
              Mermaid.js Config Code
            </h4>
            <button 
              onClick={() => handleCopyMermaid(activeTab === 'erd' ? mermaidERD : activeTab === 'api-flow' ? mermaidAPIFlow : mermaidHLD)}
              className="p-1.5 hover:bg-slate-55 dark:hover:bg-slate-900 rounded-lg text-slate-500" 
              title="Copy code"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          <pre className="text-[10px] font-mono text-slate-650 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl max-h-[250px] overflow-y-auto whitespace-pre leading-relaxed select-text">
            {activeTab === 'erd' ? mermaidERD : activeTab === 'api-flow' ? mermaidAPIFlow : mermaidHLD}
          </pre>

          <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-4 rounded-xl text-[10px] text-slate-450 dark:text-slate-400 font-bold space-y-1 leading-relaxed">
            <span className="text-teal-600 block uppercase mb-1">Architecture Summary</span>
            <div>Primary Framework: Express Router</div>
            <div>Scraping API: GitHub REST v3</div>
            <div>AI Orchestrator: LangChain</div>
          </div>
        </div>
      </div>
    </div>
  );
};
