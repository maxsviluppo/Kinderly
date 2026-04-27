
import React, { useState } from 'react';
import { MOCK_STUDENTS, MOCK_STAFF, MOCK_CLASSES, MOCK_SCHOOL_CONFIG } from '../constants';
import { generateSmartSchedule } from '../services/geminiService';
import {
  Plus, Users, Settings2, MoreVertical, ArrowRightLeft,
  LayoutGrid, Sparkles, Loader2, Calendar, Save, Trash2, Edit3,
  X, Phone, Mail, MapPin, User, HeartPulse, GraduationCap, Check,
  AlertCircle, Camera, Clock, BookOpen, RotateCcw, Info
} from 'lucide-react';
import { ClassRoom, Student, StaffMember, AcademicStatus, FamilyContact, AssignedTeacher, SchoolConfig } from '../types';

interface SectionProps {
  type: 'students' | 'staff' | 'logistics';
  selectedClassId?: string;
  schoolConfig: SchoolConfig;
}

const ManagementSection: React.FC<SectionProps> = ({ type, selectedClassId = 'all', schoolConfig }) => {
  const [viewMode, setViewMode] = useState<'list' | 'config' | 'ai-schedule' | 'attendance'>('list');
  const [filter, setFilter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSchedule, setAiSchedule] = useState<string | null>(null);

  // Data State
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [classes, setClasses] = useState<ClassRoom[]>(MOCK_CLASSES);

  // Staff Attendance State
  const [staffAttendance, setStaffAttendance] = useState<Record<string, { present: boolean, entryTime?: string, exitTime?: string, earlyExit?: boolean, note?: string }>>({});

  const toggleStaffAttendance = (staffId: string, action: 'enter' | 'exit' | 'early_exit') => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setStaffAttendance(prev => {
      const current = prev[staffId] || { present: false };

      if (action === 'enter') {
        return { ...prev, [staffId]: { ...current, present: true, entryTime: timeStr } };
      } else if (action === 'exit') {
        return { ...prev, [staffId]: { ...current, present: false, exitTime: timeStr } };
      } else if (action === 'early_exit') {
        const reason = prompt("Inserisci motivazione uscita anticipata:") || "Permesso personale";
        return { ...prev, [staffId]: { ...current, earlyExit: true, exitTime: timeStr, note: reason } };
      }
      return prev;
    });
  };

  // Modal States
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);

  const filteredStudents = students
    .filter(s => selectedClassId === 'all' || s.classId === selectedClassId)
    .filter(s => s.name.toLowerCase().includes(filter.toLowerCase()));

  const filteredStaff = MOCK_STAFF
    .filter(s => s.role === (type === 'staff' ? 'teacher' : s.role)) // If staff, default to teacher? Or show all? The prompt said "Staff (Docenti & ATA)".
    // The original code filtered s.role === type === 'staff' ? 'teacher' : s.role which is weird.
    // Let's assume if type is staff, we show all staff (teachers + ata + admin) or handle filtering elsewhere.
    // Reverting to original behavior but respecting filter.
    .filter(s => {
      if (type === 'staff') return true; // Show all staff in staff section
      return s.role === 'teacher'; // Default fallback
    })
    .filter(s => s.name.toLowerCase().includes(filter.toLowerCase()));

  const handleGenerateSchedule = async () => {
    setIsGenerating(true);
    // Include class data for better context
    const contextData = {
      staff: MOCK_STAFF.filter(s => s.role === 'teacher'),
      classes: classes,
      config: schoolConfig
    };

    // Simulate smart scheduling with advanced context
    const result = await generateSmartSchedule(contextData.staff, {
      opening: schoolConfig.openingTime,
      closing: schoolConfig.closingTime
    }, contextData.classes);
    setAiSchedule(result || "Errore nella generazione");
    setIsGenerating(false);
  };

  // --- Student Handlers ---
  const openStudentModal = (student?: Student) => {
    if (student) {
      setEditingStudent({ ...student });
    } else {
      setEditingStudent({
        id: `s-${Date.now()}`,
        name: '',
        classId: selectedClassId === 'all' ? classes[0]?.id || '' : selectedClassId,
        isPresent: false,
        paymentStatus: 'pending',
        allergies: [],
        dietaryProfile: 'none',
        parentName: '',
        birthDate: '',
        address: '',
        academicStatus: 'enrolled',
        contacts: [],
        familyNotes: ''
      });
    }
    setShowStudentModal(true);
  };

  const handleSaveStudent = () => {
    if (!editingStudent) return;
    if (students.find(s => s.id === editingStudent.id)) {
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? editingStudent : s));
    } else {
      setStudents(prev => [...prev, editingStudent]);
    }
    setShowStudentModal(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo alunno?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  // --- Class Handlers ---
  const openClassModal = (cls?: ClassRoom) => {
    if (cls) {
      setEditingClass({ ...cls });
    } else {
      setEditingClass({
        id: '',
        name: '',
        capacity: 20,
        teachers: [],
        color: 'bg-slate-100 text-slate-700'
      });
    }
    setShowClassModal(true);
  };

  const handleSaveClass = () => {
    if (!editingClass) return;
    if (classes.find(c => c.id === editingClass.id)) {
      setClasses(prev => prev.map(c => c.id === editingClass.id ? editingClass : c));
    } else {
      // For new classes, ensure ID is unique/set
      const newClass = { ...editingClass, id: editingClass.id || `Sezione ${classes.length + 1}` };
      setClasses(prev => [...prev, newClass]);
    }
    setShowClassModal(false);
    setEditingClass(null);
  };

  // --- Teacher Assignment Logic within Class ---
  const addTeacherToClass = () => {
    if (!editingClass) return;
    const newAssignment: AssignedTeacher = {
      teacherId: '',
      role: 'Prevalente',
      subject: '',
      hoursPerWeek: 10,
      rotationFrequency: 'none'
    };
    setEditingClass({ ...editingClass, teachers: [...editingClass.teachers, newAssignment] });
  };

  const updateTeacherAssignment = (index: number, field: keyof AssignedTeacher, value: any) => {
    if (!editingClass) return;
    const updatedTeachers = [...editingClass.teachers];
    updatedTeachers[index] = { ...updatedTeachers[index], [field]: value };
    setEditingClass({ ...editingClass, teachers: updatedTeachers });
  };

  const removeTeacherFromClass = (index: number) => {
    if (!editingClass) return;
    const updatedTeachers = editingClass.teachers.filter((_, i) => i !== index);
    setEditingClass({ ...editingClass, teachers: updatedTeachers });
  };

  const getStaffName = (id: string) => MOCK_STAFF.find(s => s.id === id)?.name || 'Seleziona Docente';

  const getAge = (dateString?: string) => {
    if (!dateString) return null;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
      {/* Header */}
      <div className="p-8 border-b border-slate-100 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {type === 'students' ? 'Gestione Classi e Alunni' : 'Docenti e Orari'}
            </h2>
            <p className="text-sm text-slate-500 font-medium italic">Configurazione sezioni e pianificazione didattica.</p>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Elenco</button>
              {type === 'students' && (
                <button onClick={() => setViewMode('config')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'config' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Classi</button>
              )}
              {type === 'staff' && (
                <>
                  <button onClick={() => setViewMode('attendance')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'attendance' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>
                    <Clock size={14} /> Registro Presenze
                  </button>
                  <button onClick={() => setViewMode('ai-schedule')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'ai-schedule' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>
                    <Sparkles size={14} /> AI Scheduler
                  </button>
                </>
              )}
            </div>
            {type === 'students' && (
              <button
                onClick={() => viewMode === 'config' ? openClassModal() : openStudentModal()}
                className="bg-indigo-600 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
              >
                <Plus size={18} /> {viewMode === 'config' ? 'Nuova Classe' : 'Nuovo Alunno'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 p-8">
        {viewMode === 'config' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map(cls => (
              <div key={cls.id} className="p-6 border border-slate-200 rounded-3xl hover:border-indigo-500 transition-all hover:shadow-lg bg-white group relative">
                <button
                  onClick={() => openClassModal(cls)}
                  className="absolute top-4 right-4 p-2 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Edit3 size={16} />
                </button>
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-3 py-1 rounded-lg ${cls.color} text-[10px] font-black uppercase`}>{cls.id}</div>
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2">{cls.name}</h3>

                {/* Team Docenti Preview */}
                <div className="mb-4 space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Docente</p>
                  <div className="flex -space-x-2">
                    {cls.teachers.slice(0, 4).map((t, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-600 bg-indigo-50" title={`${getStaffName(t.teacherId)} - ${t.role}`}>
                        {getStaffName(t.teacherId).charAt(0)}
                      </div>
                    ))}
                    {cls.teachers.length > 4 && (
                      <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                        +{cls.teachers.length - 4}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capienza</p>
                    <p className="text-xl font-black text-slate-800">{students.filter(s => s.classId === cls.id).length} <span className="text-sm text-slate-400">/ {cls.capacity}</span></p>
                  </div>
                  <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-indigo-500" style={{ width: `${(students.filter(s => s.classId === cls.id).length / cls.capacity) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => openClassModal()}
              className="border-4 border-dashed border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 text-slate-300 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all min-h-[250px]"
            >
              <Plus size={32} />
              <span className="font-bold text-xs uppercase tracking-widest">Aggiungi Sezione</span>
            </button>
          </div>
        ) : viewMode === 'ai-schedule' ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Generatore Orari AI</h3>
                <p className="text-indigo-100 text-sm">Crea piani orari ottimizzati sincronizzando le disponibilità docenti e i vincoli delle classi.</p>
              </div>
              <button
                onClick={handleGenerateSchedule}
                disabled={isGenerating}
                className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                Genera Ora
              </button>
            </div>

            {aiSchedule && (
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 font-mono text-sm whitespace-pre-wrap leading-relaxed animate-in fade-in slide-in-from-top-4">
                {aiSchedule}
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="mb-6 relative max-w-md">
              <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={`Cerca ${type === 'students' ? 'alunno' : 'docente'}...`}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 outline-none transition-all"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-4 py-4">{type === 'students' ? 'Alunno' : 'Nominativo'}</th>
                  <th className="px-4 py-4">{type === 'students' ? 'Sezione & Stato' : 'Ruolo'}</th>
                  <th className="px-4 py-4">{viewMode === 'attendance' ? 'Stato Presenza' : 'Salute / Allergeni'}</th>
                  <th className="px-4 py-4">Contatti</th>
                  <th className="px-4 py-4 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(type === 'students' ? filteredStudents : filteredStaff).map((item: any) => {
                  const att = staffAttendance[item.id];
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-lg overflow-hidden border border-indigo-100">
                            {item.photo ? <img src={item.photo} alt={item.name} className="w-full h-full object-cover" /> : item.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-none mb-1">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium italic">{item.birthDate ? new Date(item.birthDate).toLocaleDateString('it-IT') : 'Data non inserita'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="px-2 py-1 bg-slate-100 rounded self-start text-[10px] font-black uppercase text-slate-500">
                            {type === 'students' ? item.classId : item.specificRole}
                          </span>
                          {type === 'students' && (
                            <span className={`text-[9px] font-black uppercase tracking-tight ${item.academicStatus === 'promoted' ? 'text-emerald-500' :
                              item.academicStatus === 'held_back' ? 'text-rose-500' : 'text-slate-400'
                              }`}>
                              {item.academicStatus === 'promoted' ? '✓ Promosso' :
                                item.academicStatus === 'held_back' ? '⚠ Non Promosso' : 'Iscritto'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {viewMode === 'attendance' && type === 'staff' ? (
                          <div className="flex items-center gap-2">
                            {att?.present ? (
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black uppercase flex items-center gap-2">
                                <Check size={12} /> Presente
                                <span className="opacity-50">({att.entryTime})</span>
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-slate-100 text-slate-400 rounded-lg text-xs font-black uppercase">Assente</span>
                            )}
                            {att?.earlyExit && <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-bold uppercase">Uscita Ant. {att.exitTime}</span>}
                          </div>
                        ) : type === 'students' ? (
                          <div className="flex flex-wrap gap-1">
                            {item.allergies?.length > 0 ? item.allergies.map((a: string) => (
                              <span key={a} className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-md text-[9px] font-bold border border-rose-100">
                                {a}
                              </span>
                            )) : <span className="text-[10px] text-slate-300 italic">Nessuna allergia</span>}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">{item.hoursPerWeek}h settimanali</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Phone size={10} />
                            <span className="text-[10px] font-bold">{item.contacts?.[0]?.phone || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Mail size={10} />
                            <span className="text-[10px]">{item.contacts?.[0]?.email || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2 transition-opacity">
                          {viewMode === 'attendance' && type === 'staff' ? (
                            <>
                              {!att?.present && <button onClick={() => toggleStaffAttendance(item.id, 'enter')} className="px-3 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all">Entrata</button>}
                              {att?.present && !att?.earlyExit && <button onClick={() => toggleStaffAttendance(item.id, 'early_exit')} className="px-3 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-all">Uscita Anticipata</button>}
                              {att?.present && <button onClick={() => toggleStaffAttendance(item.id, 'exit')} className="px-3 py-2 bg-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-300 transition-all">Uscita</button>}
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => type === 'students' ? openStudentModal(item) : null}
                                className="p-2 text-slate-400 hover:text-indigo-600 bg-white shadow-sm border border-slate-100 rounded-xl transition-all"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() => type === 'students' ? handleDeleteStudent(item.id) : null}
                                className="p-2 text-slate-400 hover:text-rose-600 bg-white shadow-sm border border-slate-100 rounded-xl transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- CLASS MODAL (New Feature) --- */}
      {showClassModal && editingClass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowClassModal(false)} />
          <div className="bg-white rounded-[40px] w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
            <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black tracking-tight">{editingClass.id ? 'Modifica Classe & Team Docente' : 'Nuova Sezione'}</h3>
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mt-1">Kinderly Management System</p>
              </div>
              <button onClick={() => setShowClassModal(false)} className="bg-white/10 p-2 rounded-full hover:rotate-90 transition-all"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Sezione (ID)</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10"
                    value={editingClass.id}
                    onChange={(e) => setEditingClass({ ...editingClass, id: e.target.value })}
                    placeholder="es. Sezione C"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Esteso</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10"
                    value={editingClass.name}
                    onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
                    placeholder="es. Sezione C (Grandi)"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capienza Max</label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10"
                    value={editingClass.capacity}
                    onChange={(e) => setEditingClass({ ...editingClass, capacity: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              {/* Teacher Assignments */}
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <Users size={18} className="text-indigo-600" /> Team Docenti Assegnato
                  </h4>
                  <button
                    onClick={addTeacherToClass}
                    className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-2 rounded-xl hover:bg-indigo-100 transition-all flex items-center gap-2"
                  >
                    <Plus size={14} /> Aggiungi Docente
                  </button>
                </div>

                <div className="space-y-3">
                  {editingClass.teachers.map((teacher, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-4 items-center animate-in slide-in-from-left-2">
                      <div className="md:col-span-3">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Docente</label>
                        <select
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                          value={teacher.teacherId}
                          onChange={(e) => updateTeacherAssignment(idx, 'teacherId', e.target.value)}
                        >
                          <option value="">Seleziona...</option>
                          {MOCK_STAFF.filter(s => s.role === 'teacher').map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Ruolo</label>
                        <select
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                          value={teacher.role}
                          onChange={(e) => updateTeacherAssignment(idx, 'role', e.target.value)}
                        >
                          <option value="Prevalente">Prevalente</option>
                          <option value="Sostegno">Sostegno</option>
                          <option value="Religione">Religione</option>
                          <option value="Inglese">Inglese</option>
                          <option value="Potenziamento">Potenziamento</option>
                        </select>
                      </div>
                      <div className="md:col-span-3">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Materia / Focus</label>
                        <input
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                          placeholder="es. Logico-Matematica"
                          value={teacher.subject || ''}
                          onChange={(e) => updateTeacherAssignment(idx, 'subject', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Ore Sez.</label>
                        <div className="flex items-center gap-2">
                          <Clock size={12} className="text-slate-400" />
                          <input
                            type="number"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                            value={teacher.hoursPerWeek}
                            onChange={(e) => updateTeacherAssignment(idx, 'hoursPerWeek', parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="md:col-span-1 flex flex-col items-center justify-center">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center gap-1"><RotateCcw size={8} /> Freq.</label>
                        <select
                          className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-[10px] font-bold outline-none"
                          value={teacher.rotationFrequency}
                          onChange={(e) => updateTeacherAssignment(idx, 'rotationFrequency', e.target.value)}
                        >
                          <option value="none">--</option>
                          <option value="daily">GG</option>
                          <option value="weekly">SET</option>
                          <option value="monthly">MEN</option>
                        </select>
                      </div>
                      <div className="md:col-span-1 text-right">
                        <button onClick={() => removeTeacherFromClass(idx)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {editingClass.teachers.length === 0 && (
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                      <p className="text-slate-400 font-bold text-sm">Nessun docente assegnato a questa classe.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button
                onClick={() => setShowClassModal(false)}
                className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600"
              >
                Annulla
              </button>
              <button
                onClick={handleSaveClass}
                className="flex-[2] bg-indigo-600 text-white py-4 rounded-[24px] text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all"
              >
                Salva Configurazione Classe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Modal States */}
      {showStudentModal && editingStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowStudentModal(false)} />
          <div className="bg-white rounded-[40px] w-full max-w-4xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500 rounded-2xl">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">{editingStudent.id.startsWith('s-') ? 'Aggiungi Alunno' : 'Modifica Alunno'}</h3>
                  <p className="text-white/50 text-[10px] font-black uppercase tracking-widest leading-none mt-1">Kinderly Enrollment System</p>
                </div>
              </div>
              <button onClick={() => setShowStudentModal(false)} className="bg-white/10 p-2 rounded-full hover:rotate-90 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Photo & Basic Info */}
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-40 h-40 bg-slate-100 rounded-[32px] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 group cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all overflow-hidden">
                    {editingStudent.photo ? (
                      <img src={editingStudent.photo} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Camera size={32} />
                        <span className="text-[10px] font-black uppercase mt-2">Carica Foto</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                    <input
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all outline-none"
                      value={editingStudent.name}
                      onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Data di Nascita
                      {editingStudent.birthDate && (
                        <span className="ml-2 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {getAge(editingStudent.birthDate)} anni
                        </span>
                      )}
                    </label>
                    <input
                      type="date"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all outline-none"
                      value={editingStudent.birthDate}
                      onChange={(e) => setEditingStudent({ ...editingStudent, birthDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sezione / Classe</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all outline-none"
                      value={editingStudent.classId}
                      onChange={(e) => setEditingStudent({ ...editingStudent, classId: e.target.value })}
                    >
                      {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Evoluzione / Stato</label>
                    <div className="flex gap-2">
                      {['enrolled', 'promoted', 'held_back'].map(status => (
                        <button
                          key={status}
                          onClick={() => setEditingStudent({ ...editingStudent, academicStatus: status as AcademicStatus })}
                          className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase border transition-all ${editingStudent.academicStatus === status ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                            }`}
                        >
                          {status === 'enrolled' ? 'Iscritto' : status === 'promoted' ? 'Promosso' : 'Non Prom.'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Health & Allergies */}
              <div className="bg-rose-50/50 p-8 rounded-[40px] border border-rose-100 space-y-4">
                <h4 className="text-xs font-black text-rose-800 uppercase tracking-widest flex items-center gap-2">
                  <HeartPulse size={16} /> Salute & Intolleranze
                </h4>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Allergeni (Separati da virgola)</label>
                  <input
                    className="w-full bg-white border border-rose-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-400 transition-all outline-none"
                    placeholder="es. Glutine, Lattosio, Arachidi..."
                    value={editingStudent.allergies?.join(', ')}
                    onChange={(e) => setEditingStudent({ ...editingStudent, allergies: e.target.value.split(',').map(a => a.trim()).filter(a => a !== '') })}
                  />
                </div>
              </div>

              {/* Contacts & Family */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <Users size={16} /> Contatti & Famiglia
                  </h4>
                  <button
                    onClick={() => setEditingStudent({ ...editingStudent, contacts: [...editingStudent.contacts, { label: 'Delegato', name: '', phone: '', email: '' }] })}
                    className="text-[10px] font-black text-indigo-600 flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} /> Aggiungi Contatto
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {editingStudent.contacts.map((contact, idx) => (
                    <div key={idx} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4 relative group">
                      <button
                        onClick={() => setEditingStudent({ ...editingStudent, contacts: editingStudent.contacts.filter((_, i) => i !== idx) })}
                        className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="flex gap-4">
                        <div className="w-1/3">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Parentela</label>
                          <input
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                            value={contact.label}
                            onChange={(e) => {
                              const newContacts = [...editingStudent.contacts];
                              newContacts[idx].label = e.target.value;
                              setEditingStudent({ ...editingStudent, contacts: newContacts });
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Nome Cognome</label>
                          <input
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                            value={contact.name}
                            onChange={(e) => {
                              const newContacts = [...editingStudent.contacts];
                              newContacts[idx].name = e.target.value;
                              setEditingStudent({ ...editingStudent, contacts: newContacts });
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Telefono</label>
                          <input
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                            value={contact.phone}
                            onChange={(e) => {
                              const newContacts = [...editingStudent.contacts];
                              newContacts[idx].phone = e.target.value;
                              setEditingStudent({ ...editingStudent, contacts: newContacts });
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Email</label>
                          <input
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                            value={contact.email}
                            onChange={(e) => {
                              const newContacts = [...editingStudent.contacts];
                              newContacts[idx].email = e.target.value;
                              setEditingStudent({ ...editingStudent, contacts: newContacts });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><MapPin size={10} /> Indirizzo di Residenza</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 transition-all"
                  value={editingStudent.address}
                  onChange={(e) => setEditingStudent({ ...editingStudent, address: e.target.value })}
                  placeholder="Via, Civico, CAP, Città"
                />
              </div>

              {/* Family Notes */}
              <div className="space-y-1 pt-4 border-t border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1 text-amber-600">
                  <Info size={12} /> Note Familiari / Situazione
                </label>
                <textarea
                  className="w-full bg-amber-50/50 border border-amber-100 rounded-2xl px-5 py-3 text-sm font-medium text-slate-700 outline-none focus:border-amber-400 transition-all resize-none h-24 placeholder:text-amber-300"
                  value={editingStudent.familyNotes || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, familyNotes: e.target.value })}
                  placeholder="Es. Genitori separati, affidamento congiunto, ritira solo la nonna..."
                />
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button
                onClick={() => setShowStudentModal(false)}
                className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleSaveStudent}
                disabled={!editingStudent.name}
                className="flex-[2] bg-indigo-600 text-white py-4 rounded-[24px] text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all disabled:opacity-50"
              >
                Salva Alunno nel Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementSection;
