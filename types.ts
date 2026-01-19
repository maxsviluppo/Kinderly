
export enum AppSection {
  DASHBOARD = 'DASHBOARD',
  CLASSES = 'CLASSES',
  ATTENDANCE = 'ATTENDANCE',
  STAFF = 'STAFF',
  ACCOUNTING = 'ACCOUNTING',
  LOGISTICS = 'LOGISTICS',
  MEETINGS = 'MEETINGS',
  CANTEEN = 'CANTEEN',
  COMMUNICATIONS = 'COMMUNICATIONS',
  AI_ADVISOR = 'AI_ADVISOR',
  SETTINGS = 'SETTINGS',
  DISCIPLINARY = 'DISCIPLINARY'
}

export type DisciplinaryType = 'ammonimento' | 'educativo' | 'sospensione';

export interface DisciplinaryAction {
  id: string;
  studentId: string;
  type: DisciplinaryType;
  description: string;
  date: string;
  consequence: string;
  status: 'active' | 'resolved';
  notifiedParent: boolean;
}

export interface SchoolConfig {
  name: string;
  address: string;
  phone: string;
  mobilePhone?: string;
  emailPrimary: string;
  emailSecondary?: string;
  pec: string;
  website?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  openingTime: string;
  closingTime: string;
  maxStudentsPerClass: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'teacher' | 'ata' | 'admin';
  specificRole: string;
  hoursPerWeek: number;
  status: 'active' | 'absent' | 'on_leave';
  assignedClass?: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  capacity: number;
  assignedTeacherId: string;
  color: string;
  description?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent';
  arrivalTime?: string;
  departureTime?: string;
  notes?: string;
}

export type AcademicStatus = 'enrolled' | 'promoted' | 'held_back';

export interface FamilyContact {
  label: string; // es. Madre, Padre, Nonno
  name: string;
  phone: string;
  email: string;
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  isPresent: boolean;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  allergies?: string[];
  parentName: string; // Riferimento principale
  // Nuovi campi
  birthDate?: string;
  address?: string;
  photo?: string;
  academicStatus: AcademicStatus;
  contacts: FamilyContact[];
}

export interface Teacher extends StaffMember {
  role: 'teacher';
  schedule?: string[];
}

export interface MaintenanceTask {
  id: string;
  area: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  date: string;
}

export type MedicalCheckStatus = 'planned' | 'completed' | 'failed';

export interface MedicalCheck {
  id: string;
  targetId: string;
  targetType: 'student' | 'staff';
  targetName: string;
  type: string;
  date: string;
  professional: string;
  status: MedicalCheckStatus;
  notes?: string;
}

export interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
}
