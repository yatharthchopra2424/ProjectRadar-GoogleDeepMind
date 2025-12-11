export enum ModuleType {
  DASHBOARD = 'DASHBOARD',
  ANALYZER = 'ANALYZER',
  RECALL = 'RECALL',
  SEARCH = 'SEARCH',
  CREATIVE = 'CREATIVE',
  ORG_ADMIN = 'ORG_ADMIN',
  STUDENT_HUB = 'STUDENT_HUB',
}

export type AppMode = 'EDUCATION' | 'ORGANIZATION';

// Roles map as follows:
// ADMIN -> Org Admin / University Admin
// FACULTY -> Manager / Faculty
// STUDENT -> Team Member / Student
export type UserRole = 'ADMIN' | 'FACULTY' | 'STUDENT';

export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  mode: AppMode;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId: string;
  avatar?: string;
}

export interface Project {
  id: string;
  title: string;
  students: string[]; // Names of students or team members
  studentIds?: string[]; 
  facultyId?: string; // ID of faculty or manager
  technologies: string[];
  progress: number;
  status: 'On Track' | 'Delayed' | 'Completed' | 'At Risk';
  lastUpdated: string;
  description: string;
}

export interface AnalysisResult {
  markdown: string;
  loading: boolean;
  error?: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  image?: string;
}