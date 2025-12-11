import React, { useState } from 'react';
import { ModuleType, UserRole } from './types';
import { SimulationProvider, useSimulation } from './context/SimulationContext';

// Modules
import { ReportAnalyzer } from './modules/ReportAnalyzer';
import { FacultyRecall } from './modules/FacultyRecall';
import { ProjectSearch } from './modules/ProjectSearch';
import { AdminDashboard } from './modules/AdminDashboard';
import { CreativeStudio } from './modules/CreativeStudio';
import { LandingPage } from './modules/LandingPage';
import { OrgAdmin } from './modules/OrgAdmin';
import { StudentHub } from './modules/StudentHub';

// Icons
import { 
  LayoutDashboard, 
  FileSearch, 
  History, 
  Search, 
  Wand2, 
  GraduationCap,
  Briefcase,
  Menu,
  X,
  Users,
  LogOut,
  Settings,
  ArrowLeft
} from 'lucide-react';
import { cn, Button } from './components/ui';

// --- Components for Auth & Layout ---

const AuthSelection: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { login, createOrganization, t, appMode } = useSimulation();
  const [view, setView] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [orgName, setOrgName] = useState('');
  const [adminName, setAdminName] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if(orgName && adminName) {
      createOrganization(orgName, adminName);
    }
  };

  const ModeIcon = appMode === 'EDUCATION' ? GraduationCap : Briefcase;

  if (view === 'SIGNUP') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Create {t('org')}</h2>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">{t('org')} Name</label>
              <input 
                className="w-full mt-1 p-2 border rounded-lg" 
                value={orgName} 
                onChange={e => setOrgName(e.target.value)} 
                placeholder={`e.g. ${appMode === 'EDUCATION' ? 'Stanford University' : 'Acme Corp'}`}
                required
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700">Admin Name</label>
              <input 
                className="w-full mt-1 p-2 border rounded-lg" 
                value={adminName} 
                onChange={e => setAdminName(e.target.value)} 
                placeholder="Your Name"
                required
              />
            </div>
            <Button type="submit" className="w-full">Create & Login</Button>
          </form>
          <button onClick={() => setView('LOGIN')} className="w-full text-center text-sm text-indigo-600 mt-4">
            Back to Login Simulation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative">
       {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        Back to Home
      </button>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <ModeIcon size={48} className="text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Welcome to ProjectRadar</h2>
        <p className="text-center text-slate-500 mb-8">Simulate a login for {appMode === 'EDUCATION' ? 'Education Mode' : 'Organization Mode'}.</p>
        
        <div className="space-y-3">
          <button 
            onClick={() => login('ADMIN')}
            className="w-full p-4 border border-slate-200 rounded-xl flex items-center gap-4 hover:bg-slate-50 hover:border-indigo-300 transition-all group"
          >
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Settings size={20} />
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-900">{t('org')} Admin</div>
              <div className="text-xs text-slate-500">Manage {t('faculty').toLowerCase()}s, view org stats</div>
            </div>
          </button>

          <button 
            onClick={() => login('FACULTY')}
            className="w-full p-4 border border-slate-200 rounded-xl flex items-center gap-4 hover:bg-slate-50 hover:border-teal-300 transition-all group"
          >
             <div className="bg-teal-100 p-2 rounded-lg text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Users size={20} />
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-900">{t('faculty')}</div>
              <div className="text-xs text-slate-500">Track {t('project').toLowerCase()}s, recall reports</div>
            </div>
          </button>

           <button 
            onClick={() => login('STUDENT')}
            className="w-full p-4 border border-slate-200 rounded-xl flex items-center gap-4 hover:bg-slate-50 hover:border-orange-300 transition-all group"
          >
             <div className="bg-orange-100 p-2 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <ModeIcon size={20} />
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-900">{t('student')}</div>
              <div className="text-xs text-slate-500">Upload reports, get feedback</div>
            </div>
          </button>
        </div>

        <div className="mt-8 border-t pt-6 text-center">
          <p className="text-sm text-slate-500 mb-3">Want to start fresh?</p>
          <Button variant="outline" onClick={() => setView('SIGNUP')} className="w-full">
            Create New {t('org')}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main App Layout & Logic
const MainApp: React.FC = () => {
  const { currentUser, logout, organization, t, appMode } = useSimulation();
  const [currentModule, setCurrentModule] = useState<ModuleType | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine Default Module based on Role
  React.useEffect(() => {
    if (!currentModule) {
      if (currentUser?.role === 'ADMIN') setCurrentModule(ModuleType.DASHBOARD);
      else if (currentUser?.role === 'FACULTY') setCurrentModule(ModuleType.DASHBOARD);
      else if (currentUser?.role === 'STUDENT') setCurrentModule(ModuleType.STUDENT_HUB);
    }
  }, [currentUser, currentModule]);

  // Define Navigation based on Role
  const getNavItems = () => {
    const role = currentUser?.role;
    const items = [];

    if (role === 'ADMIN') {
      items.push({ id: ModuleType.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard });
      items.push({ id: ModuleType.ORG_ADMIN, label: `Manage ${t('org')}`, icon: Settings });
      items.push({ id: ModuleType.SEARCH, label: `Search ${t('project')}s`, icon: Search });
    } else if (role === 'FACULTY') {
      items.push({ id: ModuleType.DASHBOARD, label: `My ${t('project')}s`, icon: LayoutDashboard });
      items.push({ id: ModuleType.RECALL, label: 'Memory Recall', icon: History });
      items.push({ id: ModuleType.ANALYZER, label: 'Analyze Report', icon: FileSearch });
      items.push({ id: ModuleType.SEARCH, label: 'Search DB', icon: Search });
      items.push({ id: ModuleType.CREATIVE, label: 'Visual Studio', icon: Wand2 });
    } else if (role === 'STUDENT') {
      items.push({ id: ModuleType.STUDENT_HUB, label: 'My Hub', icon: appMode === 'EDUCATION' ? GraduationCap : Briefcase });
      items.push({ id: ModuleType.CREATIVE, label: 'Visual Studio', icon: Wand2 });
    }
    return items;
  };

  const navItems = getNavItems();
  const ModeIcon = appMode === 'EDUCATION' ? GraduationCap : Briefcase;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white fixed h-full z-10">
        <div className="p-6 border-b border-slate-800">
           <div className="flex items-center gap-3 mb-1">
            <ModeIcon className="text-indigo-400" size={28} />
            <h1 className="font-bold text-lg tracking-tight">ProjectRadar</h1>
           </div>
           {organization && <div className="text-xs text-slate-400 truncate">{organization.name}</div>}
        </div>
        
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg">
             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
                {currentUser?.name.charAt(0)}
             </div>
             <div className="overflow-hidden">
                <div className="text-sm font-medium truncate">{currentUser?.name}</div>
                <div className="text-xs text-slate-400 truncate">{t(currentUser?.role === 'ADMIN' ? 'org' : currentUser?.role === 'FACULTY' ? 'faculty' : 'student')}</div>
             </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentModule(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                currentModule === item.id 
                  ? "bg-indigo-600 text-white" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
           <button onClick={logout} className="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-2 w-full text-sm">
             <LogOut size={16} />
             Sign Out
           </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 text-white z-20 flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <ModeIcon className="text-indigo-400" size={24} />
          <span className="font-bold">ProjectRadar</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900 z-10 pt-20 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentModule(item.id);
                setMobileMenuOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                currentModule === item.id 
                  ? "bg-indigo-600 text-white" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
          <div className="border-t border-slate-800 mt-4 pt-4">
            <button onClick={logout} className="flex items-center gap-3 text-slate-400 px-4 py-2 w-full">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 pt-20 md:pt-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {currentModule === ModuleType.DASHBOARD && <AdminDashboard />}
          {currentModule === ModuleType.ORG_ADMIN && <OrgAdmin />}
          {currentModule === ModuleType.STUDENT_HUB && <StudentHub />}
          
          {currentModule === ModuleType.ANALYZER && (
             <div className="space-y-8">
                <ReportAnalyzer mode="ANALYZE" />
             </div>
          )}

          {currentModule === ModuleType.RECALL && <FacultyRecall />}
          {currentModule === ModuleType.SEARCH && <ProjectSearch />}
          {currentModule === ModuleType.CREATIVE && <CreativeStudio />}
        </div>
      </main>
    </div>
  );
};

// Root Component Wrapper
const App: React.FC = () => {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  );
};

const AppContent: React.FC = () => {
  const { currentUser } = useSimulation();
  const [started, setStarted] = useState(false);

  if (!started) {
    return <LandingPage onGetStarted={() => setStarted(true)} />;
  }

  if (!currentUser) {
    return <AuthSelection onBack={() => setStarted(false)} />;
  }

  return <MainApp />;
};

export default App;