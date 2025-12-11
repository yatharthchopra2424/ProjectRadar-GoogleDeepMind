import React from 'react';
import { Card } from '../components/ui';
import { useSimulation } from '../context/SimulationContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LayoutDashboard } from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export const AdminDashboard: React.FC = () => {
  const { projects, organization, t } = useSimulation();
  
  const totalProjects = projects.length;
  
  const statusData = [
    { name: 'On Track', value: projects.filter(p => p.status === 'On Track').length },
    { name: 'Completed', value: projects.filter(p => p.status === 'Completed').length },
    { name: 'Delayed', value: projects.filter(p => p.status === 'Delayed').length },
    { name: 'At Risk', value: projects.filter(p => p.status === 'At Risk').length },
  ].filter(d => d.value > 0);

  // Simple tech frequency map
  const techMap: Record<string, number> = {};
  projects.forEach(p => {
    p.technologies.forEach(t => {
      techMap[t] = (techMap[t] || 0) + 1;
    });
  });

  const techData = Object.entries(techMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
          <LayoutDashboard size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{organization?.name} Dashboard</h2>
          <p className="text-slate-500">Overview of {t('project').toLowerCase()} statuses and technology trends across the {t('org').toLowerCase()}.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Total {t('project')}s</p>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{totalProjects}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <p className="text-sm font-medium text-slate-500">Avg. Completion</p>
           <p className="text-3xl font-bold text-teal-600 mt-2">
             {totalProjects > 0 ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / totalProjects) : 0}%
           </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <p className="text-sm font-medium text-slate-500">At Risk</p>
           <p className="text-3xl font-bold text-red-500 mt-2">
             {projects.filter(p => p.status === 'At Risk').length}
           </p>
        </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <p className="text-sm font-medium text-slate-500">Completed</p>
           <p className="text-3xl font-bold text-green-500 mt-2">
             {projects.filter(p => p.status === 'Completed').length}
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={`${t('project')} Status Distribution`}>
          <div className="h-64 w-full">
            {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                    <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    >
                    {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-slate-400">No data available</div>
            )}
          </div>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {statusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm text-slate-600">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </Card>

        <Card title="Top Technologies Used">
           <div className="h-64 w-full">
            {techData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={techData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} />
                    <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
                </ResponsiveContainer>
            ) : (
                 <div className="flex items-center justify-center h-full text-slate-400">No data available</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};