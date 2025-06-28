// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UserRole = 'admin' | 'teacher' | 'student';

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

// Student related types
export interface Student {
  id: string;
  userId: string;
  rollNumber: string;
  admissionDate: string;
  classId: string;
  section?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  address?: string;
  user?: User;
}

// Teacher related types
export interface Teacher {
  id: string;
  userId: string;
  employeeId: string;
  joinDate: string;
  qualification?: string;
  specialization?: string;
  user?: User;
}

// Class related types
export interface Class {
  id: string;
  name: string;
  code: string;
  academicYear: string;
  teacherId?: string;
  section?: string;
  capacity?: number;
  status: 'active' | 'inactive';
  schedule?: ClassSchedule[];
  teacher?: Teacher;
  studentCount?: number;
}

export interface ClassSchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  location?: string;
}

// Attendance related types
export interface Attendance {
  id: string;
  classId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  studentId: string;
  markedById: string;
  notes?: string;
  markedAt: string;
  student?: Student;
  markedBy?: User;
  class?: Class;
}

export interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
}

export interface AttendanceReport {
  studentId: string;
  studentName: string;
  rollNumber: string;
  attendance: {
    [date: string]: 'present' | 'absent' | 'late' | 'excused';
  };
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  totalDays: number;
  attendancePercentage: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form related types
export interface FormFieldOption {
  value: string | number;
  label: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'date' | 'time' | 'number' | 'textarea' | 'checkbox' | 'radio';
  required?: boolean;
  options?: FormFieldOption[];
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  validation?: {
    required?: string;
    pattern?: {
      value: RegExp;
      message: string;
    };
    minLength?: {
      value: number;
      message: string;
    };
    maxLength?: {
      value: number;
      message: string;
    };
    validate?: (value: any) => string | boolean;
  };
}

// UI related types
export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  roles?: UserRole[];
  divider?: boolean;
  onClick?: () => void;
}

export interface TableColumn<T> {
  field: keyof T | string;
  headerName: string;
  width?: number | string;
  renderCell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  align?: 'left' | 'center' | 'right';
  headerAlign?: 'left' | 'center' | 'right';
  valueFormatter?: (value: any, row: T) => string | number | React.ReactNode;
  cellClassName?: string | ((row: T) => string);
  headerClassName?: string;
}

// Chart related types
export interface ChartDataPoint {
  id: string | number;
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesDataPoint {
  date: string | Date;
  value: number;
  group?: string;
}

// Export related types
export type ExportFormat = 'csv' | 'excel' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  fileName?: string;
  includeHeaders?: boolean;
  columns?: string[];
  data: any[];
}
