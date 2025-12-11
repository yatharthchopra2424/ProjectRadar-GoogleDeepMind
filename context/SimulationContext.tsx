import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Organization, Project, UserRole, AppMode } from '../types';
import { MOCK_PROJECTS } from '../constants';

interface SimulationContextType {
  currentUser: User | null;
  organization: Organization | null;
  users: User[];
  projects: Project[];
  appMode: AppMode;
  
  // Vocabulary Helper
  t: (key: 'faculty' | 'student' | 'project' | 'org' | 'dept') => string;

  // Actions
  setAppMode: (mode: AppMode) => void;
  login: (role: UserRole, name?: string) => void;
  logout: () => void;
  createOrganization: (name: string, adminName: string) => void;
  inviteUser: (email: string, role: UserRole, name: string) => string; // returns invite link
  createProject: (project: Project) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

// Initial Mock Data
const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@demo.com', role: 'ADMIN', organizationId: 'org1' },
  { id: 'u2', name: 'Mentor User', email: 'mentor@demo.com', role: 'FACULTY', organizationId: 'org1' },
  { id: 'u3', name: 'Team User', email: 'team@demo.com', role: 'STUDENT', organizationId: 'org1' },
];

const INITIAL_ORG: Organization = {
  id: 'org1',
  name: 'Demo Organization',
  createdAt: new Date().toISOString(),
  mode: 'EDUCATION'
};

export const SimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appMode, setAppMode] = useState<AppMode>('EDUCATION');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(INITIAL_ORG);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  // Vocabulary Translation Helper
  const t = (key: 'faculty' | 'student' | 'project' | 'org' | 'dept'): string => {
    if (appMode === 'EDUCATION') {
      switch(key) {
        case 'faculty': return 'Faculty';
        case 'student': return 'Student';
        case 'project': return 'Project';
        case 'org': return 'University';
        case 'dept': return 'Department';
        default: return key;
      }
    } else {
      switch(key) {
        case 'faculty': return 'Manager';
        case 'student': return 'Team Member';
        case 'project': return 'Work Team';
        case 'org': return 'Organization';
        case 'dept': return 'Department';
        default: return key;
      }
    }
  };

  const login = (role: UserRole, name: string = 'Demo User') => {
    const existing = users.find(u => u.role === role);
    if (existing) {
      setCurrentUser(existing);
    } else {
      const newUser: User = {
        id: `u${Date.now()}`,
        name: name,
        email: `${name.toLowerCase().replace(' ', '.')}@demo.com`,
        role,
        organizationId: organization?.id || 'org1'
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const createOrganization = (name: string, adminName: string) => {
    const newOrg: Organization = {
      id: `org${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      mode: appMode
    };
    setOrganization(newOrg);
    
    // Create Admin User
    const admin: User = {
      id: `u${Date.now()}`,
      name: adminName,
      email: 'admin@projectradar.app',
      role: 'ADMIN',
      organizationId: newOrg.id,
    };
    
    // Reset state for new org
    setUsers([admin]);
    setProjects([]); 
    setCurrentUser(admin);
  };

  const inviteUser = (email: string, role: UserRole, name: string) => {
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      role,
      organizationId: organization?.id || '',
    };
    setUsers(prev => [...prev, newUser]);
    const roleSlug = role === 'FACULTY' ? (appMode === 'EDUCATION' ? 'faculty' : 'manager') : (appMode === 'EDUCATION' ? 'student' : 'member');
    return `https://projectradar.app/invite/${roleSlug}/${newUser.id}`;
  };

  const createProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
  };

  return (
    <SimulationContext.Provider value={{
      appMode,
      currentUser,
      organization,
      users,
      projects,
      t,
      setAppMode,
      login,
      logout,
      createOrganization,
      inviteUser,
      createProject
    }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
