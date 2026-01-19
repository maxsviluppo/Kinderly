
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
import { AppSection, Student, StaffMember, ClassRoom, FinancialRecord, SchoolConfig, AttendanceRecord, DisciplinaryAction, MaintenanceTask, MedicalCheck } from './types';

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
  maxStudentsPerClass: 25
};

export const MOCK_CLASSES: ClassRoom[] = [
  { id: 'Sezione A', name: 'Sezione A (Piccoli)', capacity: 25, assignedTeacherId: '1', color: 'bg-blue-100 text-blue-700' },
  { id: 'Sezione B', name: 'Sezione B (Grandi)', capacity: 25, assignedTeacherId: '2', color: 'bg-emerald-100 text-emerald-700' },
];

export const MOCK_STUDENTS: Student[] = [
  { 
    id: '1', 
    name: 'Marco Rossi', 
    classId: 'Sezione A', 
    isPresent: true, 
    paymentStatus: 'paid', 
    allergies: ['Lattosio'], 
    parentName: 'Mario Rossi',
    birthDate: '2019-05-12',
    address: 'Via dei Mille 4, Roma',
    academicStatus: 'enrolled',
    contacts: [
      { label: 'Padre', name: 'Mario Rossi', phone: '333 1122334', email: 'mario.rossi@email.it' },
      { label: 'Madre', name: 'Elena Bianchi', phone: '333 5566778', email: 'elena.bianchi@email.it' }
    ]
  },
  { 
    id: '2', 
    name: 'Giulia Bianchi', 
    classId: 'Sezione A', 
    isPresent: true, 
    paymentStatus: 'pending', 
    parentName: 'Anna Verdi',
    birthDate: '2019-09-22',
    address: 'Viale Europa 15, Roma',
    academicStatus: 'promoted',
    contacts: [
      { label: 'Madre', name: 'Anna Verdi', phone: '334 9988776', email: 'anna.verdi@email.it' }
    ]
  },
  { 
    id: '3', 
    name: 'Luca Verdi', 
    classId: 'Sezione B', 
    isPresent: false, 
    paymentStatus: 'overdue', 
    parentName: 'Roberto Verdi',
    birthDate: '2018-02-14',
    address: 'Via Garibaldi 8, Roma',
    academicStatus: 'held_back',
    contacts: [
      { label: 'Padre', name: 'Roberto Verdi', phone: '331 4455667', email: 'rob.verdi@email.it' }
    ]
  },
  { 
    id: '4', 
    name: 'Sofia Neri', 
    classId: 'Sezione B', 
    isPresent: true, 
    paymentStatus: 'paid', 
    allergies: ['Glutine'], 
    parentName: 'Paolo Neri',
    birthDate: '2018-11-30',
    address: 'Piazza Navona 1, Roma',
    academicStatus: 'promoted',
    contacts: [
      { label: 'Padre', name: 'Paolo Neri', phone: '335 0099881', email: 'paolo.neri@email.it' },
      { label: 'Nonna (Delegata)', name: 'Maria Neri', phone: '06 998877', email: '' }
    ]
  },
];

export const MOCK_DISCIPLINARY: DisciplinaryAction[] = [
  { 
    id: 'd1', 
    studentId: '1', 
    type: 'ammonimento', 
    description: 'Comportamento aggressivo durante il gioco libero.', 
    date: '2023-10-18', 
    consequence: 'Riflessione guidata con la maestra.', 
    status: 'resolved', 
    notifiedParent: true 
  },
  { 
    id: 'd2', 
    studentId: '3', 
    type: 'educativo', 
    description: 'Danneggiamento volontario di un libro della biblioteca.', 
    date: '2023-10-20', 
    consequence: 'Aiutare la maestra a riparare i libri per una settimana.', 
    status: 'active', 
    notifiedParent: true 
  },
  { 
    id: 'd3', 
    studentId: '2', 
    type: 'sospensione', 
    description: 'Episodio grave di pericolo per i compagni (lancio di oggetti pesanti).', 
    date: '2023-10-23', 
    consequence: 'Sospensione dalle attività per 2 giorni e colloquio con psicopedagogista.', 
    status: 'active', 
    notifiedParent: false 
  }
];

export const MOCK_STAFF: StaffMember[] = [
  { id: '1', name: 'Maria Montessori', role: 'teacher', specificRole: 'Maestra Prevalente', hoursPerWeek: 35, assignedClass: 'Sezione A', status: 'active' },
  { id: '2', name: 'Donatella Versa', role: 'teacher', specificRole: 'Maestra Sostegno', hoursPerWeek: 18, assignedClass: 'Sezione B', status: 'active' },
  { id: '3', name: 'Giuseppe Verdi', role: 'ata', specificRole: 'Collaboratore Scolastico', hoursPerWeek: 36, status: 'active' },
  { id: '4', name: 'Anna Frank', role: 'admin', specificRole: 'Segreteria Didattica', hoursPerWeek: 20, status: 'active' },
];

export const MOCK_MAINTENANCE: MaintenanceTask[] = [
  { id: '1', area: 'Giardino', description: 'Controllo sicurezza altalene e pavimentazione antitrauma.', status: 'pending', priority: 'high', date: '2023-10-25' },
  { id: '2', area: 'Mensa', description: 'Manutenzione straordinaria forno cucina.', status: 'completed', priority: 'medium', date: '2023-10-15' },
  { id: '3', area: 'Sezione A', description: 'Sostituzione neon fulminato.', status: 'in_progress', priority: 'low', date: '2023-10-21' },
];

export const MOCK_MEDICAL_CHECKS: MedicalCheck[] = [
  { id: '1', targetId: '1', targetType: 'student', targetName: 'Marco Rossi', type: 'Screening Vista', date: '2023-11-05', professional: 'Dr. Occhiali', status: 'planned' },
  { id: '2', targetId: '1', targetType: 'staff', targetName: 'Maria Montessori', type: 'Visita Medicina del Lavoro', date: '2023-10-10', professional: 'Centro Medico Sicuro', status: 'completed' },
  { id: '3', targetId: '4', targetType: 'student', targetName: 'Sofia Neri', type: 'Controllo Posturale', date: '2023-10-18', professional: 'Dr. Schiena', status: 'completed', notes: 'Consigliati esercizi di gioco dinamico.' },
];

export const MOCK_TEACHERS = MOCK_STAFF.filter(s => s.role === 'teacher');

export const MOCK_FINANCE: FinancialRecord[] = [
  { id: '1', type: 'income', category: 'Rette', amount: 4500, date: '2023-10-05', description: 'Pagamento rette Ottobre' },
  { id: '2', type: 'expense', category: 'Utenze', amount: 850, date: '2023-10-10', description: 'Bolletta Luce' },
];

export const MOCK_MEETINGS = [
  { id: '1', title: 'Collegio Docenti', date: '2023-10-25', time: '16:45', type: 'faculty', participants: 'Tutto il personale' },
  { id: '2', title: 'Incontro Sezione A', date: '2023-10-28', time: '17:00', type: 'parents', participants: 'Genitori Sez. A' },
  { id: '3', title: 'Consiglio di Amministrazione', date: '2023-11-02', time: '15:30', type: 'admin', participants: 'Membri CDA' },
];

export const WEEKLY_MENU = [
  { day: 'Lunedì', firstCourse: 'Pasta al pomodoro', secondCourse: 'Polpette di manzo', side: 'Purè di patate', fruit: 'Mela' },
  { day: 'Martedì', firstCourse: 'Risotto allo zafferano', secondCourse: 'Filetto di platessa', side: 'Erbette ripassate', fruit: 'Banana' },
  { day: 'Mercoledì', firstCourse: 'Pasta e fagioli', secondCourse: 'Frittata alle verdure', side: 'Carote julienne', fruit: 'Pera' },
  { day: 'Giovedì', firstCourse: 'Lasagna bianca', secondCourse: 'Spezzatino di tacchino', side: 'Piselli al vapore', fruit: 'Uva' },
  { day: 'Venerdì', firstCourse: 'Minestrone di verdure', secondCourse: 'Bastoncini di pesce', side: 'Insalata mista', fruit: 'Macedonia' },
];

export const CANTEEN_EXPENSES = [
  { id: '1', date: '2023-10-15', item: 'Frutta e Verdura Bio', vendor: 'Orto di Marco', amount: 245.50 },
  { id: '2', date: '2023-10-18', item: 'Carni e Latticini', vendor: 'Fattoria San Giuseppe', amount: 412.30 },
  { id: '3', date: '2023-10-20', item: 'Prodotti Secchi', vendor: 'Metro Cash & Carry', amount: 189.90 },
];

const generateHistory = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const students = ['1', '2', '3', '4'];
  const now = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    students.forEach(sId => {
      records.push({
        id: `hist-${sId}-${dateStr}`,
        studentId: sId,
        date: dateStr,
        status: Math.random() > 0.1 ? 'present' : 'absent',
        arrivalTime: '08:15',
        departureTime: '16:00'
      });
    });
  }
  return records;
};

export const MOCK_ATTENDANCE: AttendanceRecord[] = generateHistory();

export const MOCK_CONVERSATIONS = [
  { studentId: '1', lastMessage: 'Ok, grazie per l\'informazione.', timestamp: '10:30', unreadCount: 0 },
  { studentId: '2', lastMessage: 'Giulia domani non ci sarà.', timestamp: 'Ieri', unreadCount: 2 },
  { studentId: '4', lastMessage: 'Posso portare la torta?', timestamp: 'Lunedì', unreadCount: 0 },
];

export const MOCK_MESSAGES: Record<string, {text: string, senderId: string, timestamp: string}[]> = {
  '1': [
    { text: 'Buongiorno, volevo avvisare che Marco oggi arriverà leggermente in ritardo.', senderId: 'parent', timestamp: '08:05' },
    { text: 'Ricevuto, non si preoccupi. Lo aspettiamo per l\'attività di pittura.', senderId: 'school', timestamp: '08:15' },
    { text: 'Ok, grazie per l\'informazione.', senderId: 'parent', timestamp: '08:20' },
  ],
  '2': [
    { text: 'Ci sono novità per la gita?', senderId: 'parent', timestamp: 'Ieri' },
    { text: 'Stiamo definendo gli ultimi dettagli burocratici.', senderId: 'school', timestamp: 'Ieri' },
  ],
  '4': [
    { text: 'Buongiorno, è possibile festeggiare il compleanno di Sofia venerdì?', senderId: 'parent', timestamp: 'Lunedì' },
  ]
};
