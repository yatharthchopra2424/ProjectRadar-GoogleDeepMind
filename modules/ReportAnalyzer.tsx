import React, { useState } from 'react';
import { Button, Card, FileUpload } from '../components/ui';
import { MarkdownRenderer, ScoreDisplay } from '../components/MarkdownRenderer';
import { analyzeReport } from '../services/geminiService';
import { getSystemInstructionAnalyzer, getSystemInstructionFeedback } from '../constants';
import { useSimulation } from '../context/SimulationContext';
import { FileText, Award, AlertCircle, RefreshCw, Clock, CheckCircle2, Sparkles, TrendingUp, BarChart3 } from 'lucide-react';

interface ReportAnalyzerProps {
  mode: 'ANALYZE' | 'FEEDBACK';
  compact?: boolean;
}

export const ReportAnalyzer: React.FC<ReportAnalyzerProps> = ({ mode, compact = false }) => {
  const { appMode, t } = useSimulation();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryStatus, setRetryStatus] = useState<{ attempt: number; delay: number } | null>(null);
  const [analysisTime, setAnalysisTime] = useState<number | null>(null);

  const handleRetry = (attempt: number, delay: number) => {
    setRetryStatus({ attempt, delay });
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult('');
    setRetryStatus(null);
    setAnalysisTime(null);
    
    const startTime = Date.now();

    try {
      const prompt = mode === 'ANALYZE' 
        ? `Analyze this ${t('project').toLowerCase()} report.` 
        : `Provide ${t('faculty').toLowerCase()} feedback for this report.`;
      
      const instruction = mode === 'ANALYZE' 
        ? getSystemInstructionAnalyzer(appMode)
        : getSystemInstructionFeedback(appMode);

      // Use gemini-2.5-flash for deep image/doc understanding with retry support
      const text = await analyzeReport([file], prompt, instruction, 'gemini-2.5-flash', handleRetry);
      setResult(text);
      setAnalysisTime(Math.round((Date.now() - startTime) / 1000));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      setRetryStatus(null);
    }
  };

  return (
    <div className={compact ? "w-full space-y-6" : "max-w-4xl mx-auto space-y-6"}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-lg ${mode === 'ANALYZE' ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600'}`}>
          {mode === 'ANALYZE' ? <FileText size={24} /> : <Award size={24} />}
        </div>
        <div>
          <h2 className={compact ? "text-xl font-bold text-slate-800" : "text-2xl font-bold text-slate-800"}>
            {mode === 'ANALYZE' ? 'Report Analysis' : `Auto-Feedback for ${t('student')}s`}
          </h2>
          <p className="text-slate-500 text-sm">
            {mode === 'ANALYZE' 
              ? `Extract insights, progress, and risks from ${t('project').toLowerCase()} documents.` 
              : `Generate constructive feedback and ratings for ${t('student').toLowerCase()}s.`}
          </p>
        </div>
      </div>

      <Card>
        <div className="space-y-4">
          <FileUpload 
            label="Upload Report (Image/PDF)" 
            onChange={setFile} 
            accept="image/*,application/pdf"
          />
          
          <Button 
            onClick={handleAnalyze} 
            disabled={!file} 
            isLoading={loading}
            className="w-full"
            variant={mode === 'ANALYZE' ? 'primary' : 'secondary'}
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
              mode === 'ANALYZE' ? 'Analyze Report' : 'Generate Feedback'
            )}
          </Button>

          {/* Retry status indicator - no error shown */}
          {loading && retryStatus && (
            <div className="p-4 bg-amber-50 text-amber-700 rounded-lg flex items-center gap-3 animate-pulse">
              <Clock size={18} className="animate-spin" />
              <div>
                <div className="font-medium">Processing request...</div>
                <div className="text-sm">Retry attempt {retryStatus.attempt} of 3. Please wait...</div>
              </div>
            </div>
          )}

          {/* Only show error if all retries fail */}
          {error && !loading && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle size={18} />
              <div>
                <div className="font-medium">Analysis failed after multiple attempts</div>
                <div className="text-sm">{error}</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Analysis Metadata Header */}
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-teal-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white shadow-sm">
                  <CheckCircle2 className="text-emerald-500" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Analysis Complete</h3>
                  <p className="text-sm text-slate-500">
                    {file?.name} • {analysisTime ? `${analysisTime}s` : 'Just now'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm text-sm">
                  <BarChart3 size={16} className="text-indigo-500" />
                  <span className="text-slate-600">Powered by Gemini 2.5 Flash</span>
                </div>
                <Button variant="outline" onClick={handleAnalyze} disabled={loading}>
                  <RefreshCw size={16} />
                  Re-analyze
                </Button>
              </div>
            </div>
          </div>

          {/* Main Result Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Result Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100">
                  {mode === 'ANALYZE' ? (
                    <TrendingUp className="text-indigo-600" size={20} />
                  ) : (
                    <Award className="text-indigo-600" size={20} />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-800">
                    {mode === 'ANALYZE' ? 'Detailed Analysis Report' : 'Feedback & Assessment'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    AI-generated insights based on your uploaded document
                  </p>
                </div>
              </div>
            </div>
            
            {/* Markdown Content */}
            <div className="p-6">
              <MarkdownRenderer content={result} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
