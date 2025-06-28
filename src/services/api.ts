import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Extend the AxiosRequestConfig interface to include custom headers
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  headers?: {
    Authorization?: string;
    [key: string]: any;
  };
}

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<never> => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError): Promise<never> => {
    if (error.response) {
      // Handle different HTTP status codes
      const { status } = error.response;
      
      if (status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (status === 403) {
        // Handle forbidden access
        console.error('Forbidden: You do not have permission to access this resource');
      } else if (status === 404) {
        // Handle not found
        console.error('Resource not found');
      } else if (status && status >= 500) {
        // Handle server errors
        console.error('Server error occurred');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  forgotPassword: (email: string) => 
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, newPassword: string) => 
    api.post('/auth/reset-password', { token, newPassword }),
  
  getProfile: () => 
    api.get('/auth/me'),
};

// Users API
export const usersAPI = {
  getAllUsers: (params = {}) => 
    api.get('/users', { params }),
    
  getUserById: (id: string) => 
    api.get(`/users/${id}`),
    
  createUser: (userData: any) => 
    api.post('/users', userData),
    
  updateUser: (id: string, userData: any) => 
    api.put(`/users/${id}`, userData),
    
  deleteUser: (id: string) => 
    api.delete(`/users/${id}`),
    
  updateUserStatus: (id: string, status: string) => 
    api.patch(`/users/${id}/status`, { status }),
};

// Students API
export const studentsAPI = {
  getAllStudents: (params = {}) => 
    api.get('/students', { params }),
    
  getStudentById: (id: string) => 
    api.get(`/students/${id}`),
    
  getStudentAttendance: (studentId: string, params = {}) => 
    api.get(`/students/${studentId}/attendance`, { params }),
    
  exportStudentAttendance: (studentId: string, format = 'csv') => 
    api.get(`/students/${studentId}/attendance/export`, { 
      params: { format },
      responseType: 'blob',
    }),
};

// Teachers API
export const teachersAPI = {
  getTeacherClasses: (teacherId: string) => 
    api.get(`/teachers/${teacherId}/classes`),
    
  getClassStudents: (classId: string) => 
    api.get(`/classes/${classId}/students`),
    
  markAttendance: (classId: string, attendanceData: any) => 
    api.post(`/classes/${classId}/attendance`, attendanceData),
    
  getClassAttendance: (classId: string, params = {}) => 
    api.get(`/classes/${classId}/attendance`, { params }),
    
  exportClassAttendance: (classId: string, format = 'csv') => 
    api.get(`/classes/${classId}/attendance/export`, { 
      params: { format },
      responseType: 'blob',
    }),
};

// Classes API
export const classesAPI = {
  getAllClasses: (params = {}) => 
    api.get('/classes', { params }),
    
  getClassById: (id: string) => 
    api.get(`/classes/${id}`),
    
  createClass: (classData: any) => 
    api.post('/classes', classData),
    
  updateClass: (id: string, classData: any) => 
    api.put(`/classes/${id}`, classData),
    
  deleteClass: (id: string) => 
    api.delete(`/classes/${id}`),
};

// Attendance API
export const attendanceAPI = {
  getAttendanceStats: (params = {}) => 
    api.get('/attendance/stats', { params }),
    
  getAttendanceReport: (params = {}) => 
    api.get('/attendance/report', { params }),
    
  exportAttendanceReport: (params = {}, format = 'csv') => 
    api.get('/attendance/export', { 
      params: { ...params, format },
      responseType: 'blob',
    }),
};

export default api;
