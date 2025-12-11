import React, { useState } from 'react';
import { Button, Card, FileUpload } from '../components/ui';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { compareReports } from '../services/geminiService';
import { getSystemInstructionRecall } from '../constants';
import { useSimulation } from '../context/SimulationContext';
import { History, ArrowRight, RefreshCw, Clock, CheckCircle2, Sparkles, BarChart3 } from 'lucide-react';

export const FacultyRecall: React.FC = () => {
  const { appMode, t } = useSimulation();
  const [oldFile, setOldFile] = useState<File | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [retryStatus, setRetryStatus] = useState<{ attempt: number; delay: number } | null>(null);
  const [analysisTime, setAnalysisTime] = useState<number | null>(null);

  const handleRetry = (attempt: number, delay: number) => {
    setRetryStatus({ attempt, delay });
  };

  const handleCompare = async () => {
    if (!oldFile || !newFile) return;
    setLoading(true);
    setResult('');
    setRetryStatus(null);
    setAnalysisTime(null);
    
    const startTime = Date.now();

    try {
      const text = await compareReports(oldFile, newFile, getSystemInstructionRecall(appMode), handleRetry);
      setResult(text);
      setAnalysisTime(Math.round((Date.now() - startTime) / 1000));
    } catch (err) {
      console.error(err);
      setResult("Error processing recall after multiple attempts.");
    } finally {
      setLoading(false);
      setRetryStatus(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
          <History size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t('faculty')} Memory Recall</h2>
          <p className="text-slate-500">Compare monthly reports to track progress and recall context instantly.</p>
        </div>
      </div>

      <Card>
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Previous Month</span>
            <FileUpload 
              label="Upload Previous Report" 
              onChange={setOldFile} 
              accept="image/*,application/pdf"
            />
          </div>
          
          <div className="hidden md:flex justify-center text-slate-300">
            <ArrowRight size={32} />
          </div>

          <div className="space-y-2">
             <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Current Month</span>
            <FileUpload 
              label="Upload Current Report" 
              onChange={setNewFile} 
              accept="image/*,application/pdf"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <Button 
            onClick={handleCompare} 
            disabled={!oldFile || !newFile} 
            isLoading={loading}
            className="w-full"
            variant="primary"
          >
            {loading ? (
              retryStatus ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="animate-spin" size={16} />
                  Retrying ({retryStatus.attempt}/3) - waiting {retryStatus.delay / 1000}s...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="animate-pulse" size={16} />
                  Analyzing with AI...
                </span>
              )
            ) : (
              'Run Recall Analysis'
            )}
          </Button>

          {/* Retry status indicator */}
          {loading && retryStatus && (
            <div className="p-4 bg-amber-50 text-amber-700 rounded-lg flex items-center gap-3 animate-pulse">
              <Clock size={18} className="animate-spin" />
              <div>
                <div className="font-medium">Processing request...</div>
                <div className="text-sm">Retry attempt {retryStatus.attempt} of 3. Please wait...</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Analysis Metadata Header */}
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 rounded-2xl p-6 border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white shadow-sm">
                  <CheckCircle2 className="text-emerald-500" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Recall Analysis Complete</h3>
                  <p className="text-sm text-slate-500">
                    Compared {oldFile?.name} → {newFile?.name} • {analysisTime ? `${analysisTime}s` : 'Just now'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm text-sm">
                  <BarChart3 size={16} className="text-orange-500" />
                  <span className="text-slate-600">Powered by Gemini 2.5 Flash</span>
                </div>
                <Button variant="outline" onClick={handleCompare} disabled={loading}>
                  <RefreshCw size={16} />
                  Re-analyze
                </Button>
              </div>
            </div>
          </div>

          {/* Main Result Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-orange-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <History className="text-orange-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-800">Recall Briefing</h3>
                  <p className="text-sm text-slate-500">
                    Progress comparison and contextual memory recall
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <MarkdownRenderer content={result} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
