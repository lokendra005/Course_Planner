export interface Course {
  id: string;
  name: string;
  credits: number;
  description: string;
  prerequisites: string[];
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface CourseOrderResponse {
  order: Course[];
  message: string;
}

export interface PrerequisitesResponse {
  course: string;
  prerequisites: Course[];
}

export interface GraphNode {
  id: string;
  label: string;
  color?: string;
  level?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  arrows?: string;
  color?: string;
}

export interface ValidationResult {
  valid: boolean;
  message: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
} 