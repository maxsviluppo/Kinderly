
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserRound, 
  Wallet, 
  Wrench, 
  CalendarDays, 
  Sparkles,
  Soup,
  ClipboardCheck,
  MessageSquare,
  Settings,
  ShieldAlert
} from 'lucide-react';
import { 
  AppSection, Student, StaffMember, ClassRoom, FinancialRecord, SchoolConfig, 
  AttendanceRecord, DisciplinaryAction, MaintenanceTask, MedicalCheck, MenuItem, 
  Ingredient, Meeting 
} from './types';

export const NAVIGATION_ITEMS = [
  { id: AppSection.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: AppSection.ATTENDANCE, label: 'Appello Digitale', icon: <ClipboardCheck size={20} /> },
  { id: AppSection.CLASSES, label: 'Classi e Alunni', icon: <Users size={20} /> },
  { id: AppSection.DISCIPLINARY, label: 'Disciplina', icon: <ShieldAlert size={20} /> },
  { id: AppSection.STAFF, label: 'Orari e Docenti', icon: <UserRound size={20} /> },
  { id: AppSection.COMMUNICATIONS, label: 'Comunicazioni', icon: <MessageSquare size={20} /> },
  { id: AppSection.CANTEEN, label: 'Mensa e Menù', icon: <Soup size={20} /> },
  { id: AppSection.ACCOUNTING, label: 'Contabilità', icon: <Wallet size={20} /> },
  { id: AppSection.LOGISTICS, label: 'Logistica e Manutenzione', icon: <Wrench size={20} /> },
  { id: AppSection.MEETINGS, label: 'Riunioni e Eventi', icon: <CalendarDays size={20} /> },
  { id: AppSection.AI_ADVISOR, label: 'Assistente AI', icon: <Sparkles size={20} /> },
  { id: AppSection.SETTINGS, label: 'Impostazioni', icon: <Settings size={20} /> },
];

export const MOCK_SCHOOL_CONFIG: SchoolConfig = {
  name: "Scuola Infanzia 'Il Girasole'",
  address: "Via delle Rose 12, 00100 Roma",
  phone: "06 1234567",
  mobilePhone: "333 9876543",
  emailPrimary: "info@ilgirasole.edu.it",
  emailSecondary: "direzione@ilgirasole.edu.it",
  pec: "ilgirasole@legalmail.it",
  website: "www.scuolailgirasole.it",
  socialFacebook: "facebook.com/scuolailgirasole",
  socialInstagram: "instagram.com/ilgirasole_kids",
  maxStudentsPerClass: 25,
  isSaturdayOpen: true,
  schedule: {
    weekdays: { open: "08:00", close: "16:30" },
    saturday: { open: "08:30", close: "12:30" }
  }
};

export const MOCK_INGREDIENTS: Ingredient[] = [
  { id: 'i1', name: 'Pasta di Grano Duro', unit: 'kg', averagePrice: 1.80, category: 'secco' },
  { id: 'i2', name: 'Pomodori Pelati', unit: 'kg', averagePrice: 1.20, category: 'freschi' },
  { id: 'i3', name: 'Carne Macinata Bovino', unit: 'kg', averagePrice: 9.50, category: 'freschi' },
  { id: 'i4', name: 'Patate', unit: 'kg', averagePrice: 0.90, category: 'freschi' },
  { id: 'i5', name: 'Mele Golden', unit: 'pz', averagePrice: 0.35, category: 'freschi' },
  { id: 'i6', name: 'Olio Extravergine', unit: 'l', averagePrice: 7.50, category: 'secco' },
  { id: 'i7', name: 'Pane Comune', unit: 'kg', averagePrice: 3.20, category: 'freschi' },
  { id: 'i8', name: 'Pasta Senza Glutine', unit: 'kg', averagePrice: 4.50, category: 'secco' },
];

export const WEEKLY_MENU: MenuItem[] = [
  { day: 'Lunedì', firstCourse: 'Pasta al pomodoro', secondCourse: 'Polpette di manzo', side: 'Purè di patate', fruit: 'Mela', allergens: ['glutine', 'lattosio'] },
  { day: 'Martedì', firstCourse: 'Riso in bianco', secondCourse: 'Filetto di platessa', side: 'Carote al vapore', fruit: 'Pera', allergens: [] },
  { day: 'Mercoledì', firstCourse: 'Pasta al pesto', secondCourse: 'Formaggio fresco', side: 'Insalata mista', fruit: 'Banana', allergens: ['glutine', 'lattosio', 'frutta_guscio'] },
  { day: 'Giovedì', firstCourse: 'Passato di verdure', secondCourse: 'Uovo sodo', side: 'Spinaci saltati', fruit: 'Arancia', allergens: ['uova'] },
  { day: 'Venerdì', firstCourse: 'Pasta al ragù bianco', secondCourse: 'Arrosto di tacchino', side: 'Piselli', fruit: 'Macedonia', allergens: ['glutine'] },
  { day: 'Sabato', firstCourse: 'Minestrina', secondCourse: 'Frittata alle erbe', side: 'Zucchine trifolate', fruit: 'Kiwi', allergens: ['glutine', 'uova'] },
];

export const CANTEEN_EXPENSES = [
  { id: '1', date: '2023-10-15', item: 'Frutta e Verdura Bio', vendor: 'Orto di Marco', amount: 245.50 },
  { id: '2', date: '2023-10-18', item: 'Carne e Affettati', vendor: 'Macelleria da Gino', amount: 412.00 },
];

export const MOCK_STAFF: StaffMember[] = [
  { id: '1', name: 'Maria Montessori', role: 'teacher', specificRole: 'Docente Prevalente', hoursPerWeek: 35, assignedClass: 'Sezione A', status: 'active' },
  { id: '2', name: 'Donatella Versa', role: 'teacher', specificRole: 'Docente Sostegno', hoursPerWeek: 18, assignedClass: 'Sezione B', status: 'active' },
  { id: '3', name: 'Giuseppe Verdi', role: 'ata', specificRole: 'Collaboratore Scolastico', hoursPerWeek: 36, status: 'active' },
  { id: '4', name: 'Anna Frank', role: 'admin', specificRole: 'Segreteria Didattica', hoursPerWeek: 20, status: 'active' },
  { id: '5', name: 'Pietro Micca', role: 'teacher', specificRole: 'Specialista Inglese', hoursPerWeek: 10, status: 'active' },
  { id: '6', name: 'Laura Bassi', role: 'teacher', specificRole: 'Docente Religione', hoursPerWeek: 6, status: 'active' },
];

export const MOCK_TEACHERS = MOCK_STAFF.filter(s => s.role === 'teacher');

export const MOCK_CLASSES: ClassRoom[] = [
  { 
    id: 'Sezione A', 
    name: 'Sezione A (Piccoli)', 
    capacity: 25, 
    assignedTeachers: [
      { teacherId: '1', role: 'prevalente', hoursPerWeek: 30, isRotation: false },
      { teacherId: '5', role: 'specialista', subject: 'Inglese', hoursPerWeek: 2, isRotation: true, rotationFrequency: 'weekly' }
    ], 
    color: 'bg-blue-100 text-blue-700' 
  },
  { 
    id: 'Sezione B', 
    name: 'Sezione B (Grandi)', 
    capacity: 25, 
    assignedTeachers: [
      { teacherId: '2', role: 'sostegno', hoursPerWeek: 18, isRotation: false },
      { teacherId: '6', role: 'specialista', subject: 'Religione', hoursPerWeek: 1, isRotation: true, rotationFrequency: 'weekly' }
    ], 
    color: 'bg-emerald-100 text-emerald-700' 
  },
];

export const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Marco Rossi', classId: 'Sezione A', isPresent: true, paymentStatus: 'paid', allergies: ['Lattosio'], dietaryPreference: 'senza_lattosio', parentName: 'Mario Rossi', birthDate: '2019-05-12', address: 'Via dei Mille 4, Roma', academicStatus: 'enrolled', contacts: [{ label: 'Padre', name: 'Mario Rossi', phone: '333 1122334', email: 'mario.rossi@email.it' }] },
  { id: '2', name: 'Giulia Bianchi', classId: 'Sezione A', isPresent: true, paymentStatus: 'pending', dietaryPreference: 'celiaco', parentName: 'Anna Verdi', birthDate: '2019-09-22', address: 'Viale Europa 15, Roma', academicStatus: 'promoted', contacts: [{ label: 'Madre', name: 'Anna Verdi', phone: '334 9988776', email: 'anna.verdi@email.it' }] },
  { id: '3', name: 'Luca Verdi', classId: 'Sezione B', isPresent: true, paymentStatus: 'overdue', dietaryPreference: 'vegetariano', parentName: 'Roberto Verdi', birthDate: '2018-02-14', address: 'Via Garibaldi 8, Roma', academicStatus: 'held_back', contacts: [{ label: 'Padre', name: 'Roberto Verdi', phone: '331 4455667', email: 'rob.verdi@email.it' }] },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [];
export const MOCK_FINANCE: FinancialRecord[] = [
  { id: '1', type: 'income', category: 'Rette Ottobre', amount: 16500, date: '2023-10-01', description: 'Incasso rette mensili' },
  { id: '2', type: 'expense', category: 'Affitto', amount: 3500, date: '2023-10-05', description: 'Canone locazione mensile' },
];
export const MOCK_MEETINGS: Meeting[] = [
  { id: '1', title: 'Collegio Docenti Straordinario', date: '2023-10-25', time: '17:00', participants: 'Tutto lo staff docente', type: 'faculty' },
];
export const MOCK_CONVERSATIONS = [
  { studentId: '1', lastMessage: 'Grazie per l\'informazione', timestamp: '10:30', unreadCount: 0 },
];
export const MOCK_MESSAGES: Record<string, any[]> = {
  '1': [{ senderId: 'parent', text: 'Buongiorno, Marco ha la febbre oggi.', timestamp: '08:00' }],
};
export const MOCK_DISCIPLINARY: DisciplinaryAction[] = [];
export const MOCK_MAINTENANCE: MaintenanceTask[] = [];
export const MOCK_MEDICAL_CHECKS: MedicalCheck[] = [];
