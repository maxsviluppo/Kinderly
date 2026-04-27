
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
  isSaturdayOpen: boolean;
  openingTimeSaturday?: string;
  closingTimeSaturday?: string;
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

export interface AssignedTeacher {
  teacherId: string;
  role: string; // e.g. "Main", "Support", "English"
  subject?: string;
  hoursPerWeek: number;
  rotationFrequency: 'none' | 'daily' | 'weekly' | 'monthly';
}

export interface ClassRoom {
  id: string;
  name: string;
  capacity: number;
  teachers: AssignedTeacher[];
  color: string;
  description?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId?: string; // Optional if it's a staff record
  staffId?: string;   // Optional if it's a student record
  date: string;
  status: 'present' | 'absent' | 'late' | 'early_exit';
  arrivalTime?: string; // Entry punch
  departureTime?: string; // Exit punch
  isEarlyExit?: boolean;
  earlyExitReason?: string;
  delegatedPickup?: string; // For students
  notes?: string;
}

export type AcademicStatus = 'enrolled' | 'promoted' | 'held_back';

export interface FamilyContact {
  label: string; // es. Madre, Padre, Nonno
  name: string;
  phone: string;
  email: string;
}

export type DietaryProfile = 'standard' | 'vegetarian' | 'vegan' | 'gluten_free' | 'lactose_free' | 'pescatarian' | 'halal' | 'kosher';

export interface Student {
  id: string;
  name: string;
  classId: string;
  isPresent: boolean;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  allergies?: string[];
  dietaryProfile: DietaryProfile; // New field
  parentName: string; // Riferimento principale
  // Nuovi campi
  birthDate?: string;
  address?: string;
  photo?: string;
  academicStatus: AcademicStatus;
  contacts: FamilyContact[];
  familyNotes?: string;
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

// --- CANTEEN TYPES ---

export interface Ingredient {
  id: string;
  name: string;
  unit: string; // kg, l, pz
  costPerUnit: number;
}

export interface Dish {
  name: string;
  ingredients: string[]; // List of ingredient names (simplification)
  allergens: string[];
  calories?: number;
  foodCost: number; // Costo materie prime per porzione
}

export interface DailyMenu {
  day: string; // Lunedì, Martedì, etc
  date?: string; // Optional for specific dates
  firstCourse: Dish;
  secondCourse: Dish;
  side: Dish;
  fruit: Dish;
  notes?: string;
}

export interface CanteenExpense {
  id: string;
  date: string;
  item: string;
  vendor: string;
  amount: number;
  category?: string;
}
