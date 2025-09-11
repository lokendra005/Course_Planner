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