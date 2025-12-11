import React, { useState } from 'react';
import { Card, Button } from '../components/ui';
import { useSimulation } from '../context/SimulationContext';
import { UserPlus, Building2, Users, CheckCircle, Copy } from 'lucide-react';

export const OrgAdmin: React.FC = () => {
  const { organization, users, inviteUser, t } = useSimulation();
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;
    
    // Defaulting to Faculty/Manager invite for admin dashboard
    const link = inviteUser(inviteEmail, 'FACULTY', inviteName);
    setGeneratedLink(link);
    setInviteEmail('');
    setInviteName('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
  };

  const facultyCount = users.filter(u => u.role === 'FACULTY').length;
  const studentCount = users.filter(u => u.role === 'STUDENT').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
          <Building2 size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{organization?.name} Admin</h2>
          <p className="text-slate-500">Manage your {t('org')}'s {t('faculty').toLowerCase()}s and settings.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-white">
          <div className="text-slate-500 text-sm font-medium">Total {t('faculty')}s</div>
          <div className="text-3xl font-bold text-indigo-600 mt-1">{facultyCount}</div>
        </Card>
        <Card className="bg-white">
          <div className="text-slate-500 text-sm font-medium">Total {t('student')}s</div>
          <div className="text-3xl font-bold text-indigo-600 mt-1">{studentCount}</div>
        </Card>
         <Card className="bg-white">
          <div className="text-slate-500 text-sm font-medium">Plan</div>
          <div className="text-3xl font-bold text-green-600 mt-1">PRO</div>
        </Card>
      </div>

      <Card title={`Invite ${t('faculty')}`}>
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('faculty')} Name</label>
              <input 
                type="text" 
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder={`e.g. ${t('faculty')} Name`}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>
          <Button type="submit">
            <UserPlus size={18} />
            Generate Invitation Link
          </Button>
        </form>

        {generatedLink && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-fade-in">
            <CheckCircle className="text-green-600 mt-1" size={20} />
            <div className="flex-1 overflow-hidden">
              <h4 className="font-semibold text-green-800">Invitation Created!</h4>
              <p className="text-sm text-green-700 mb-2">Share this link with the {t('faculty').toLowerCase()} to onboard them.</p>
              <div className="flex items-center gap-2 bg-white p-2 rounded border border-green-200">
                <code className="text-xs text-slate-600 truncate flex-1">{generatedLink}</code>
                <button onClick={copyToClipboard} className="text-slate-500 hover:text-indigo-600">
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card title={`Active ${t('faculty')}s`}>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 rounded-tr-lg">Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.filter(u => u.role === 'FACULTY').map(user => (
                        <tr key={user.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                            <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                            <td className="px-4 py-3 text-slate-500">{user.email}</td>
                            <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Active</span></td>
                            <td className="px-4 py-3 text-slate-500">{t('faculty')}</td>
                        </tr>
                    ))}
                    {users.filter(u => u.role === 'FACULTY').length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No {t('faculty').toLowerCase()}s added yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};
