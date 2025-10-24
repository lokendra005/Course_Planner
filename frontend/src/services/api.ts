import axios from 'axios';
import { Course, CourseOrderResponse, PrerequisitesResponse, ValidationResult, User } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const AUTH_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export class ApiService {
  // Get all courses
  static async getCourses(): Promise<Course[]> {
    try {
      const response = await api.get('/courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new Error('Failed to fetch courses');
    }
  }

  // Add a new course
  static async addCourse(course: Omit<Course, 'id'> & { id: string }): Promise<Course> {
    try {
      const response = await api.post('/courses', course);
      return response.data.course;
    } catch (error: any) {
      console.error('Error adding course:', error);
      throw new Error(error.response?.data?.error || 'Failed to add course');
    }
  }

  // Update a course
  static async updateCourse(id: string, course: Partial<Course>): Promise<Course> {
    try {
      const response = await api.put(`/courses/${id}`, course);
      return response.data.course;
    } catch (error: any) {
      console.error('Error updating course:', error);
      throw new Error(error.response?.data?.error || 'Failed to update course');
    }
  }

  // Delete a course
  static async deleteCourse(id: string): Promise<void> {
    try {
      await api.delete(`/courses/${id}`);
    } catch (error: any) {
      console.error('Error deleting course:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete course');
    }
  }

  // Get recommended course order
  static async getCourseOrder(): Promise<CourseOrderResponse> {
    try {
      const response = await api.get('/courses/order');
      return response.data;
    } catch (error: any) {
      console.error('Error getting course order:', error);
      throw new Error(error.response?.data?.error || 'Failed to get course order');
    }
  }

  // Get prerequisites for a course
  static async getCoursePrerequisites(courseId: string): Promise<PrerequisitesResponse> {
    try {
      const response = await api.get(`/courses/${courseId}/prerequisites`);
      return response.data;
    } catch (error: any) {
      console.error('Error getting prerequisites:', error);
      throw new Error(error.response?.data?.error || 'Failed to get prerequisites');
    }
  }

  // Validate courses for cycles
  static async validateCourses(courses: Course[]): Promise<ValidationResult> {
    try {
      const response = await api.post('/courses/validate', courses);
      return response.data;
    } catch (error: any) {
      console.error('Error validating courses:', error);
      throw new Error(error.response?.data?.error || 'Failed to validate courses');
    }
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    try {
      await api.get('/health');
      return true;
    } catch (error) {
      return false;
    }
  }

  // Authentication methods
  static async login(email: string, password: string): Promise<{ token: string; user: User }> {
    try {
      const response = await authApi.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  static async register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    try {
      const response = await authApi.post('/auth/register', { name, email, password });
      return response.data;
    } catch (error: any) {
      console.error('Error registering:', error);
      throw error;
    }
  }

  static async getCurrentUser(): Promise<User> {
    try {
      const response = await authApi.get('/auth/me');
      return response.data.user;
    } catch (error: any) {
      console.error('Error getting current user:', error);
      throw new Error(error.response?.data?.error || 'Failed to get user info');
    }
  }

  static async logout(): Promise<void> {
    // Simple logout - just remove token locally
    return Promise.resolve();
  }
} 