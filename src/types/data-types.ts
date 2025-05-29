export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email: string;
  roleType: "admin" | "user";
}

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assignees: string[];
  startDate?: string;
  endDate?: string;
  dueDate?: string;
  progress?: number;
  dependencies?: string[];
  projectId: string;
}

export interface Notification {
  id: string;
  type: string;
  userId: string;
  message: string;
  timestamp: string;
  read: boolean;
  taskId?: string;
}

export interface Comment {
  id: string;
  userId: string;
  taskId: string;
  content: string;
  timestamp: string;
  mentions: string[];
}

export interface TimeLog {
  id: string;
  userId: string;
  taskId: string;
  duration: number; // in minutes
  description: string;
  date: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  date: string;
  projectId: string;
  completed: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface ProjectMember {
  userId: string;
  projectId: string;
  role: "admin" | "member" | "viewer";
}