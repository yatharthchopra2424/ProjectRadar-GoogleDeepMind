import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button, Card } from '../components/ui';
import { searchProjectsAI } from '../services/geminiService';
import { useSimulation } from '../context/SimulationContext';
import { Search, Database } from 'lucide-react';

export const ProjectSearch: React.FC = () => {
  const { projects, t } = useSimulation();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setResult('');
    
    try {
      const projectsJson = JSON.stringify(projects, null, 2);
      const text = await searchProjectsAI(query, projectsJson);
      setResult(text);
    } catch (err) {
      console.error(err);
      setResult("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
          <Database size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Intelligent {t('project')} Search</h2>
          <p className="text-slate-500">Find {t('project').toLowerCase()}s using natural language queries across {projects.length} active records.</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`e.g., Show me all AI ${t('project').toLowerCase()}s using Python...`}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <Button type="submit" isLoading={loading} disabled={!query.trim()}>
            Search
          </Button>
        </form>
      </Card>

      {result && (
        <Card title="Search Results">
          <div className="prose prose-blue max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </Card>
      )}

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Sample Data in Memory</h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 6).map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-lg border border-slate-200 text-sm hover:shadow-md transition-shadow">
              <div className="font-semibold text-slate-800 mb-1 truncate">{p.title}</div>
              <div className="text-slate-500 mb-2">{p.technologies.slice(0, 3).join(', ')}</div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                p.status === 'On Track' ? 'bg-green-100 text-green-700' :
                p.status === 'Delayed' ? 'bg-amber-100 text-amber-700' :
                p.status === 'At Risk' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
