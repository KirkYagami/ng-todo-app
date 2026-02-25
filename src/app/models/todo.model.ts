export type Priority   = 'low' | 'medium' | 'high';
export type FilterType = 'all' | 'active' | 'completed';

export interface Todo {
  id:          number;
  title:       string;
  description: string | null;   // maps to Task.description
  completed:   boolean;
  createdAt:   Date;
  priority:    Priority;
  dueDate:     Date | null;
}

// Shape returned by the backend (snake_case dates come as strings)
export interface TaskResponse {
  id:          number;
  title:       string;
  description: string | null;
  completed:   boolean;
  priority:    string;
  dueDate:     string | null;   // "YYYY-MM-DD"
  createdAt:   string;          // ISO datetime
  updatedAt:   string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email:    string;
  password: string;
}

export interface AuthResponse {
  token:    string;
  type:     string;
  username: string;
  email:    string;
  roles:    string[];
}