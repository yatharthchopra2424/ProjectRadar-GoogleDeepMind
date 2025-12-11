import React from 'react';
import { Card } from '../components/ui';
import { ReportAnalyzer } from './ReportAnalyzer';
import { useSimulation } from '../context/SimulationContext';
import { GraduationCap, Users, Briefcase, Clock, Star, FileText, Calendar } from 'lucide-react';

export const StudentHub: React.FC = () => {
  const { currentUser, projects, t, appMode } = useSimulation();

  const myProject = projects.find(p => p.students.includes(currentUser?.name || ''));

  // Mock submission history data
  const submissionHistory = [
    { id: 1, title: 'Monthly Progress Report', submittedAgo: '1 month', rating: 4, maxRating: 5 },
    { id: 2, title: 'Monthly Progress Report', submittedAgo: '2 months', rating: 5, maxRating: 5 },
    { id: 3, title: 'Initial Project Proposal', submittedAgo: '3 months', rating: 4, maxRating: 5 },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-teal-100 text-teal-600">
          {appMode === 'EDUCATION' ? <GraduationCap size={24} /> : <Briefcase size={24} />}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t('student')} Hub</h2>
          <p className="text-slate-500">Manage your {t('project').toLowerCase()} submissions and view feedback.</p>
        </div>
      </div>

      {/* Top Row: Project Info + Submission History side by side */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Project Card - Takes 3 columns */}
        <div className="lg:col-span-3">
          {myProject ? (
            <Card className="h-full border-l-4 border-l-teal-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs font-semibold uppercase text-teal-600 tracking-wider mb-1">Assigned {t('project')}</div>
                  <h3 className="text-xl font-bold text-slate-800">{myProject.title}</h3>
                  <div className="flex items-center gap-2 text-slate-500 mt-2">
                    <Users size={16} />
                    <span className="text-sm">{myProject.students.join(', ')}</span>
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-sm font-semibold 
                  ${myProject.status === 'On Track' ? 'bg-green-100 text-green-700' : 
                    myProject.status === 'Delayed' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                  {myProject.status}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-500">Current Progress</span>
                  <span className="text-sm font-semibold text-teal-600">{myProject.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-teal-500 to-teal-400 h-3 rounded-full transition-all duration-500 shadow-sm" style={{ width: `${myProject.progress}%` }}></div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full bg-slate-50 border-dashed border-2">
              <div className="text-center py-8 text-slate-500">
                <FileText size={40} className="mx-auto mb-3 text-slate-300" />
                <p className="font-medium">You are not assigned to a {t('project').toLowerCase()} yet.</p>
                <p className="text-sm mt-2">Ask your {t('faculty').toLowerCase()} to send you an invite link.</p>
              </div>
            </Card>
          )}
        </div>

        {/* Submission History - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-slate-400" />
                <h3 className="font-semibold text-slate-800">Submission History</h3>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{submissionHistory.length} submissions</span>
            </div>
            <div className="space-y-2">
              {submissionHistory.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <FileText size={14} className="text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-800">{submission.title}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar size={10} />
                        {submission.submittedAgo} ago
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-lg">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="text-xs font-semibold text-amber-700">{submission.rating}/{submission.maxRating}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Full Width Report Upload & Analysis Section */}
      <div className="w-full">
        <ReportAnalyzer mode="FEEDBACK" compact />
      </div>
    </div>
  );
};;
