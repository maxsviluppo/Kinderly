
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
  openingTime: "08:00",
  closingTime: "16:30",
  maxStudentsPerClass: 25,
  isSaturdayOpen: true // Attivato per testare la dinamicità
};

export const MOCK_INGREDIENTS: Ingredient[] = [
  { id: 'i1', name: 'Pasta di Grano Duro', unit: 'kg', averagePrice: 1.80, category: 'secco' },
  { id: 'i2', name: 'Pomodori Pelati', unit: 'kg', averagePrice: 1.20, category: 'freschi' },
  { id: 'i3', name: 'Carne Macinata Bovino', unit: 'kg', averagePrice: 9.50, category: 'freschi' },
  { id: 'i4', name: 'Patate', unit: 'kg', averagePrice: 0.90, category: 'freschi' },
  { id: 'i5', name: 'Mele Golden', unit: 'pz', averagePrice: 0.35, category: 'freschi' },
  { id: 'i6', name: 'Olio Extravergine', unit: 'l', averagePrice: 7.50, category: 'secco' },
  { id: 'i7', name: 'Pane Comune', unit: 'kg', averagePrice: 3.20, category: 'freschi' },
];

export const WEEKLY_MENU: MenuItem[] = [
  { day: 'Lunedì', firstCourse: 'Pasta al pomodoro', secondCourse: 'Polpette di manzo', side: 'Purè di patate', fruit: 'Mela' },
  { day: 'Martedì', firstCourse: 'Riso in bianco', secondCourse: 'Filetto di platessa', side: 'Carote al vapore', fruit: 'Pera' },
  { day: 'Mercoledì', firstCourse: 'Pasta al pesto', secondCourse: 'Formaggio fresco', side: 'Insalata mista', fruit: 'Banana' },
  { day: 'Giovedì', firstCourse: 'Passato di verdure', secondCourse: 'Uovo sodo', side: 'Spinaci saltati', fruit: 'Arancia' },
  { day: 'Venerdì', firstCourse: 'Pasta al ragù bianco', secondCourse: 'Arrosto di tacchino', side: 'Piselli', fruit: 'Macedonia' },
  { day: 'Sabato', firstCourse: 'Minestrina', secondCourse: 'Frittata alle erbe', side: 'Zucchine trifolate', fruit: 'Kiwi' },
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

// Added missing MOCK_TEACHERS export
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
  { id: '1', name: 'Marco Rossi', classId: 'Sezione A', isPresent: true, paymentStatus: 'paid', allergies: ['Lattosio'], parentName: 'Mario Rossi', birthDate: '2019-05-12', address: 'Via dei Mille 4, Roma', academicStatus: 'enrolled', contacts: [{ label: 'Padre', name: 'Mario Rossi', phone: '333 1122334', email: 'mario.rossi@email.it' }] },
  { id: '2', name: 'Giulia Bianchi', classId: 'Sezione A', isPresent: true, paymentStatus: 'pending', parentName: 'Anna Verdi', birthDate: '2019-09-22', address: 'Viale Europa 15, Roma', academicStatus: 'promoted', contacts: [{ label: 'Madre', name: 'Anna Verdi', phone: '334 9988776', email: 'anna.verdi@email.it' }] },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [];

// Added missing MOCK_FINANCE export
export const MOCK_FINANCE: FinancialRecord[] = [
  { id: '1', type: 'income', category: 'Rette Ottobre', amount: 16500, date: '2023-10-01', description: 'Incasso rette mensili' },
  { id: '2', type: 'expense', category: 'Affitto', amount: 3500, date: '2023-10-05', description: 'Canone locazione mensile' },
  { id: '3', type: 'expense', category: 'Utenze', amount: 1200, date: '2023-10-10', description: 'Luce, Gas e Acqua' },
  { id: '4', type: 'expense', category: 'Canteen', amount: 657, date: '2023-10-15', description: 'Approvvigionamenti mensa' },
];

// Added missing MOCK_MEETINGS export
export const MOCK_MEETINGS: Meeting[] = [
  { id: '1', title: 'Collegio Docenti Straordinario', date: '2023-10-25', time: '17:00', participants: 'Tutto lo staff docente', type: 'faculty' },
  { id: '2', title: 'Incontro Scuola-Famiglia Sezione A', date: '2023-10-28', time: '16:30', participants: 'Genitori Sezione A', type: 'parents' },
];

// Added missing MOCK_CONVERSATIONS export
export const MOCK_CONVERSATIONS = [
  { studentId: '1', lastMessage: 'Grazie per l\'informazione', timestamp: '10:30', unreadCount: 0 },
  { studentId: '2', lastMessage: 'Giulia domani sarà assente', timestamp: '09:15', unreadCount: 1 },
];

// Added missing MOCK_MESSAGES export
export const MOCK_MESSAGES: Record<string, {senderId: string, text: string, timestamp: string}[]> = {
  '1': [
    { senderId: 'parent', text: 'Buongiorno, Marco ha la febbre oggi.', timestamp: '08:00' },
    { senderId: 'school', text: 'Ricevuto, ci aggiorni presto!', timestamp: '08:15' },
    { senderId: 'parent', text: 'Grazie per l\'informazione', timestamp: '10:30' },
  ],
  '2': [
    { senderId: 'parent', text: 'Buongiorno, Giulia domani sarà assente per una visita.', timestamp: '09:15' },
  ]
};

// Added missing MOCK_DISCIPLINARY export
export const MOCK_DISCIPLINARY: DisciplinaryAction[] = [
  { 
    id: '1', 
    studentId: '1', 
    type: 'ammonimento', 
    description: 'Ha disturbato i compagni durante il riposino pomeridiano più volte.', 
    date: '2023-10-20', 
    consequence: 'Colloquio con i genitori e attività riparatoria assistita.', 
    status: 'active', 
    notifiedParent: true 
  },
];

// Added missing MOCK_MAINTENANCE export
export const MOCK_MAINTENANCE: MaintenanceTask[] = [
  { id: '1', area: 'Giardino Esterno', description: 'Riparazione della staccionata in legno vicino allo scivolo.', status: 'pending', priority: 'high', date: '2023-10-22' },
  { id: '2', area: 'Aula Piccoli', description: 'Sostituzione lampadine fulminate nel blocco centrale.', status: 'completed', priority: 'low', date: '2023-10-18' },
];

// Added missing MOCK_MEDICAL_CHECKS export
export const MOCK_MEDICAL_CHECKS: MedicalCheck[] = [
  { id: '1', targetId: '1', targetType: 'student', targetName: 'Marco Rossi', type: 'Visita Pediatrica', date: '2023-11-05', professional: 'Dott.ssa Bianchi', status: 'planned' },
  { id: '2', targetId: '1', targetType: 'staff', targetName: 'Maria Montessori', type: 'Controllo Medico Lavoro', date: '2023-10-15', professional: 'Dott. Neri', status: 'completed' },
];
