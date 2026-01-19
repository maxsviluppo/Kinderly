
import React, { useState, useEffect } from 'react';
import { MOCK_STUDENTS, MOCK_STAFF, MOCK_CLASSES, MOCK_SCHOOL_CONFIG } from '../constants';
import { generateSmartSchedule } from '../services/geminiService';
import { 
  Plus, Users, Settings2, MoreVertical, ArrowRightLeft, 
  LayoutGrid, Sparkles, Loader2, Calendar, Save, Trash2, Edit3,
  X, Phone, Mail, MapPin, User, HeartPulse, GraduationCap, Check, 
  AlertCircle, Camera, Palette, Info, CheckCircle2, BookOpen, Clock, 
  RefreshCw, ChevronRight
} from 'lucide-react';
import { ClassRoom, Student, StaffMember, AcademicStatus, FamilyContact, ClassTeacherAssignment, TeacherRole } from '../types';

interface SectionProps {
  type: 'students' | 'staff' | 'logistics';
  selectedClassId?: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const ManagementSection: React.FC<SectionProps> = ({ type, selectedClassId = 'all' }) => {
  const [viewMode, setViewMode] = useState<'list' | 'config' | 'ai-schedule'>('list');
  const [filter, setFilter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSchedule, setAiSchedule] = useState<string | null>(null);
  
  // Data State
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [classes, setClasses] = useState<ClassRoom[]>(MOCK_CLASSES);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modals State
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);

  // Toast System
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const filteredStudents = students
    .filter(s => selectedClassId === 'all' || s.classId === selectedClassId)
    .filter(s => s.name.toLowerCase().includes(filter.toLowerCase()));

  const filteredStaff = MOCK_STAFF
    .filter(s => s.role === (type === 'staff' ? 'teacher' : s.role))
    .filter(s => s.name.toLowerCase().includes(filter.toLowerCase()));

  const handleGenerateSchedule = async () => {
    setIsGenerating(true);
    // Prepariamo i dati arricchiti con le assegnazioni classi per Gemini
    const enrichedStaff = MOCK_STAFF.filter(s => s.role === 'teacher').map(teacher => {
      const teacherClasses = classes.filter(c => c.assignedTeachers.some(at => at.teacherId === teacher.id));
      return {
        ...teacher,
        assignments: teacherClasses.map(c => ({
          className: c.name,
          role: c.assignedTeachers.find(at => at.teacherId === teacher.id)?.role,
          hours: c.assignedTeachers.find(at => at.teacherId === teacher.id)?.hoursPerWeek,
          rotation: c.assignedTeachers.find(at => at.teacherId === teacher.id)?.isRotation
        }))
      };
    });

    const result = await generateSmartSchedule(enrichedStaff, {
      opening: MOCK_SCHOOL_CONFIG.openingTime,
      closing: MOCK_SCHOOL_CONFIG.closingTime
    });
    setAiSchedule(result || "Errore nella generazione");
    setIsGenerating(false);
    addToast("Orario AI sincronizzato con i team docenti!", "info");
  };

  // Student Actions
  const openStudentModal = (student?: Student) => {
    if (student) {
      setEditingStudent({ ...student });
    } else {
      setEditingStudent({
        id: `s-${Date.now()}`,
        name: '',
        classId: selectedClassId === 'all' ? classes[0]?.id : selectedClassId,
        isPresent: false,
        paymentStatus: 'pending',
        allergies: [],
        parentName: '',
        birthDate: '',
        address: '',
        academicStatus: 'enrolled',
        contacts: [{ label: 'Padre', name: '', phone: '', email: '' }]
      });
    }
    setShowStudentModal(true);
  };

  const handleSaveStudent = () => {
    if (!editingStudent) return;
    if (students.find(s => s.id === editingStudent.id)) {
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? editingStudent : s));
      addToast(`Anagrafica di ${editingStudent.name} aggiornata.`);
    } else {
      setStudents(prev => [...prev, editingStudent]);
      addToast(`Nuovo alunno ${editingStudent.name} inserito.`);
    }
    setShowStudentModal(false);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo alunno dal registro?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
      addToast("Alunno rimosso dal sistema.", "error");
    }
  };

  // Class Actions
  const openClassModal = (cls?: ClassRoom) => {
    if (cls) {
      setEditingClass({ ...cls });
    } else {
      setEditingClass({
        id: `Sezione ${String.fromCharCode(65 + classes.length)}`,
        name: '',
        capacity: 25,
        assignedTeachers: [],
        color: 'bg-indigo-100 text-indigo-700',
        description: ''
      });
    }
    setShowClassModal(true);
  };

  const handleSaveClass = () => {
    if (!editingClass) return;
    if (classes.find(c => c.id === editingClass.id)) {
      setClasses(prev => prev.map(c => c.id === editingClass.id ? editingClass : c));
      addToast(`Classe ${editingClass.name} e team docenti aggiornati.`);
    } else {
      setClasses(prev => [...prev, editingClass]);
      addToast(`Nuova sezione ${editingClass.name} creata con team assegnato.`);
    }
    setShowClassModal(false);
  };

  const addTeacherToClass = () => {
    if (!editingClass) return;
    const firstTeacherId = MOCK_STAFF.find(s => s.role === 'teacher')?.id || '';
    const newAssignment: ClassTeacherAssignment = {
      teacherId: firstTeacherId,
      role: 'prevalente',
      hoursPerWeek: 1,
      isRotation: false
    };
    setEditingClass({
      ...editingClass,
      assignedTeachers: [...editingClass.assignedTeachers, newAssignment]
    });
  };

  const updateTeacherAssignment = (idx: number, updates: Partial<ClassTeacherAssignment>) => {
    if (!editingClass) return;
    const newAssignments = [...editingClass.assignedTeachers];
    newAssignments[idx] = { ...newAssignments[idx], ...updates };
    setEditingClass({ ...editingClass, assignedTeachers: newAssignments });
  };

  const removeTeacherFromClass = (idx: number) => {
    if (!editingClass) return;
    setEditingClass({
      ...editingClass,
      assignedTeachers: editingClass.assignedTeachers.filter((_, i) => i !== idx)
    });
  };

  const handleDeleteClass = (id: string) => {
    const studentCount = students.filter(s => s.classId === id).length;
    if (studentCount > 0) {
      addToast(`Impossibile eliminare: ci sono ${studentCount} alunni assegnati a questa sezione.`, "error");
      return;
    }
    if (confirm('Eliminare definitivamente questa sezione?')) {
      setClasses(prev => prev.filter(c => c.id !== id));
      addToast("Sezione rimossa.", "error");
    }
  };

  return (
    <div className="relative">
      {/* Toast Notification Container */}
      <div className="fixed top-24 right-8 z-[150] space-y-3 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-[24px] shadow-2xl border animate-in slide-in-from-right-10 fade-in duration-300 ${
              toast.type === 'success' ? 'bg-white border-emerald-100 text-emerald-800' :
              toast.type === 'error' ? 'bg-white border-rose-100 text-rose-800' : 'bg-white border-indigo-100 text-indigo-800'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="text-emerald-500" size={20}/> : 
             toast.type === 'error' ? <AlertCircle className="text-rose-500" size={20}/> : <Info className="text-indigo-500" size={20}/>}
            <span className="text-sm font-black tracking-tight">{toast.message}</span>
          </div>
        ))}
      </div>

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
                  <button onClick={() => setViewMode('ai-schedule')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'ai-schedule' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>
                    <Sparkles size={14}/> AI Scheduler
                  </button>
                )}
              </div>
              {type === 'students' && (
                <button 
                  onClick={() => viewMode === 'config' ? openClassModal() : openStudentModal()}
                  className="bg-indigo-600 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                >
                  <Plus size={18}/> {viewMode === 'config' ? 'Nuova Sezione' : 'Nuovo Alunno'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 p-8">
          {viewMode === 'config' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
              {classes.map(cls => (
                <div key={cls.id} className="group relative">
                  <ClassCard cls={cls} studentCount={students.filter(s => s.classId === cls.id).length} />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => openClassModal(cls)} className="p-2 bg-white/90 backdrop-blur rounded-xl shadow-lg border border-slate-100 text-slate-400 hover:text-indigo-600"><Edit3 size={16}/></button>
                    <button onClick={() => handleDeleteClass(cls.id)} className="p-2 bg-white/90 backdrop-blur rounded-xl shadow-lg border border-slate-100 text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => openClassModal()}
                className="border-4 border-dashed border-slate-100 rounded-[40px] p-8 flex flex-col items-center justify-center gap-3 text-slate-300 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group"
              >
                <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all"><Plus size={32} /></div>
                <span className="font-black text-[10px] uppercase tracking-widest">Aggiungi Nuova Sezione</span>
              </button>
            </div>
          ) : viewMode === 'ai-schedule' ? (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Generatore Orari AI</h3>
                  <p className="text-indigo-100 text-sm">Calcola automaticamente i turni di copertura basandosi sui team docenti di sezione.</p>
                </div>
                <button 
                  onClick={handleGenerateSchedule}
                  disabled={isGenerating}
                  className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={20}/> : <Sparkles size={20}/>}
                  Sincronizza e Genera
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
                    <th className="px-4 py-4">Salute / Allergeni</th>
                    <th className="px-4 py-4">Contatti</th>
                    <th className="px-4 py-4 text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(type === 'students' ? filteredStudents : filteredStaff).map((item: any) => (
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
                             <span className={`text-[9px] font-black uppercase tracking-tight ${
                               item.academicStatus === 'promoted' ? 'text-emerald-500' : 
                               item.academicStatus === 'held_back' ? 'text-rose-500' : 'text-slate-400'
                             }`}>
                               {item.academicStatus === 'promoted' ? '✓ Promosso' : 
                                item.academicStatus === 'held_back' ? '⚠ Non Promosso' : 'Iscritto'}
                             </span>
                           )}
                         </div>
                      </td>
                      <td className="px-4 py-4">
                        {type === 'students' ? (
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
                             <Phone size={10}/>
                             <span className="text-[10px] font-bold">{item.contacts?.[0]?.phone || 'N/A'}</span>
                           </div>
                           <div className="flex items-center gap-1.5 text-slate-400">
                             <Mail size={10}/>
                             <span className="text-[10px]">{item.contacts?.[0]?.email || 'N/A'}</span>
                           </div>
                         </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => type === 'students' ? openStudentModal(item) : null}
                            className="p-2 text-slate-400 hover:text-indigo-600 bg-white shadow-sm border border-slate-100 rounded-xl transition-all"
                          >
                            <Edit3 size={16}/>
                          </button>
                          <button 
                            onClick={() => type === 'students' ? handleDeleteStudent(item.id) : null}
                            className="p-2 text-slate-400 hover:text-rose-600 bg-white shadow-sm border border-slate-100 rounded-xl transition-all"
                          >
                            <Trash2 size={16}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Class Management Modal - EVOLUTO PER MULTI-DOCENTE */}
      {showClassModal && editingClass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowClassModal(false)} />
          <div className="bg-white rounded-[40px] w-full max-w-4xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
             <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl"><LayoutGrid size={24}/></div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight">{classes.find(c => c.id === editingClass.id) ? 'Modifica Sezione' : 'Nuova Sezione'}</h3>
                    <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest mt-1">Configurazione Team & Struttura</p>
                  </div>
                </div>
                <button onClick={() => setShowClassModal(false)} className="bg-white/10 p-2 rounded-full hover:rotate-90 transition-all"><X size={20}/></button>
             </div>
             
             <div className="p-8 space-y-8 flex-1 overflow-y-auto">
                {/* Dati Base Sezione */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Codice Sezione (ID)</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 transition-all"
                      value={editingClass.id}
                      onChange={(e) => setEditingClass({...editingClass, id: e.target.value})}
                      placeholder="es. Sezione C"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Descrittivo</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 transition-all"
                      value={editingClass.name}
                      onChange={(e) => setEditingClass({...editingClass, name: e.target.value})}
                      placeholder="es. Sezione Gialla (Medi)"
                    />
                  </div>
                </div>

                {/* Team Docenti - SEZIONE CRITICA */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                        <GraduationCap size={16}/> Team Docenti Assegnati
                      </h4>
                      <button 
                        onClick={addTeacherToClass}
                        className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center gap-2"
                      >
                        <Plus size={14}/> Aggiungi Docente al Team
                      </button>
                   </div>

                   <div className="space-y-4">
                      {editingClass.assignedTeachers.map((assignment, idx) => (
                        <div key={idx} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl relative animate-in slide-in-from-left-4 duration-300">
                           <button 
                             onClick={() => removeTeacherFromClass(idx)}
                             className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors"
                           >
                             <Trash2 size={16}/>
                           </button>
                           
                           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                              <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Nominativo Docente</label>
                                <select 
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-indigo-400"
                                  value={assignment.teacherId}
                                  onChange={(e) => updateTeacherAssignment(idx, { teacherId: e.target.value })}
                                >
                                  {MOCK_STAFF.filter(s => s.role === 'teacher').map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Ruolo in Classe</label>
                                <select 
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-indigo-400"
                                  value={assignment.role}
                                  onChange={(e) => updateTeacherAssignment(idx, { role: e.target.value as TeacherRole })}
                                >
                                  <option value="prevalente">Prevalente</option>
                                  <option value="sostegno">Sostegno</option>
                                  <option value="specialista">Specialista</option>
                                  <option value="potenziamento">Potenziamento</option>
                                  <option value="assistente">Assistente</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Materia / Area</label>
                                <div className="relative">
                                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14}/>
                                  <input 
                                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold outline-none focus:border-indigo-400"
                                    value={assignment.subject || ''}
                                    onChange={(e) => updateTeacherAssignment(idx, { subject: e.target.value })}
                                    placeholder="es. Inglese"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Ore / Settimana</label>
                                <div className="relative">
                                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14}/>
                                  <input 
                                    type="number"
                                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold outline-none focus:border-indigo-400"
                                    value={assignment.hoursPerWeek}
                                    onChange={(e) => updateTeacherAssignment(idx, { hoursPerWeek: parseInt(e.target.value) || 0 })}
                                  />
                                </div>
                              </div>
                           </div>

                           <div className="mt-4 flex flex-wrap items-center gap-6 border-t border-slate-100 pt-4">
                              <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                  <input 
                                    type="checkbox" 
                                    className="peer hidden" 
                                    checked={assignment.isRotation}
                                    onChange={(e) => updateTeacherAssignment(idx, { isRotation: e.target.checked })}
                                  />
                                  <div className="w-10 h-6 bg-slate-200 rounded-full peer-checked:bg-emerald-500 transition-all"></div>
                                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4"></div>
                                </div>
                                <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-slate-800 flex items-center gap-1">
                                  <RefreshCw size={12}/> In Rotazione
                                </span>
                              </label>

                              {assignment.isRotation && (
                                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2">
                                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Frequenza:</label>
                                  <select 
                                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-bold outline-none"
                                    value={assignment.rotationFrequency}
                                    onChange={(e) => updateTeacherAssignment(idx, { rotationFrequency: e.target.value as any })}
                                  >
                                    <option value="weekly">Settimanale</option>
                                    <option value="biweekly">Ogni 2 settimane</option>
                                    <option value="monthly">Mensile</option>
                                  </select>
                                </div>
                              )}
                           </div>
                        </div>
                      ))}

                      {editingClass.assignedTeachers.length === 0 && (
                        <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-[32px] bg-slate-50/50">
                           <GraduationCap className="mx-auto text-slate-200 mb-3" size={32} />
                           <p className="text-xs text-slate-400 font-medium italic">Nessun docente assegnato a questa sezione.</p>
                        </div>
                      )}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capienza Alunni</label>
                    <input 
                      type="number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 transition-all"
                      value={editingClass.capacity}
                      onChange={(e) => setEditingClass({...editingClass, capacity: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Colore Identificativo</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        {v: 'bg-blue-100 text-blue-700', c: 'bg-blue-500'},
                        {v: 'bg-emerald-100 text-emerald-700', c: 'bg-emerald-500'},
                        {v: 'bg-amber-100 text-amber-700', c: 'bg-amber-500'},
                        {v: 'bg-rose-100 text-rose-700', c: 'bg-rose-500'},
                      ].map(color => (
                        <button 
                          key={color.v}
                          onClick={() => setEditingClass({...editingClass, color: color.v})}
                          className={`h-10 rounded-xl transition-all border-4 ${editingClass.color === color.v ? 'border-indigo-600 scale-105 shadow-lg' : 'border-transparent'} ${color.c}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
             </div>
             
             <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button onClick={() => setShowClassModal(false)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Annulla</button>
                <button onClick={handleSaveClass} className="flex-[2] bg-indigo-600 text-white py-4 rounded-[24px] text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                  <Save size={18}/> Salva Sezione e Sincronizza
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Student Management Modal */}
      {showStudentModal && editingStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowStudentModal(false)} />
          <div className="bg-white rounded-[40px] w-full max-w-4xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500 rounded-2xl">
                  <User size={24}/>
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">{students.find(s => s.id === editingStudent.id) ? 'Modifica Alunno' : 'Aggiungi Alunno'}</h3>
                  <p className="text-white/50 text-[10px] font-black uppercase tracking-widest leading-none mt-1">Kinderly Enrollment System</p>
                </div>
              </div>
              <button onClick={() => setShowStudentModal(false)} className="bg-white/10 p-2 rounded-full hover:rotate-90 transition-all">
                <X size={20}/></button>
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
                      onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data di Nascita</label>
                    <input 
                      type="date"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all outline-none"
                      value={editingStudent.birthDate}
                      onChange={(e) => setEditingStudent({...editingStudent, birthDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sezione / Classe</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all outline-none"
                      value={editingStudent.classId}
                      onChange={(e) => setEditingStudent({...editingStudent, classId: e.target.value})}
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
                           onClick={() => setEditingStudent({...editingStudent, academicStatus: status as AcademicStatus})}
                           className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase border transition-all ${
                             editingStudent.academicStatus === status ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
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
                   <HeartPulse size={16}/> Salute & Intolleranze
                 </h4>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Allergeni (Separati da virgola)</label>
                    <input 
                      className="w-full bg-white border border-rose-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-400 transition-all outline-none"
                      placeholder="es. Glutine, Lattosio, Arachidi..."
                      value={editingStudent.allergies?.join(', ')}
                      onChange={(e) => setEditingStudent({...editingStudent, allergies: e.target.value.split(',').map(a => a.trim()).filter(a => a !== '')})}
                    />
                 </div>
              </div>

              {/* Contacts & Family */}
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                   <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                     <Users size={16}/> Contatti & Famiglia
                   </h4>
                   <button 
                    onClick={() => setEditingStudent({...editingStudent, contacts: [...editingStudent.contacts, { label: 'Delegato', name: '', phone: '', email: '' }]})}
                    className="text-[10px] font-black text-indigo-600 flex items-center gap-1 hover:underline"
                   >
                     <Plus size={14}/> Aggiungi Contatto
                   </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editingStudent.contacts.map((contact, idx) => (
                      <div key={idx} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4 relative group">
                        <button 
                          onClick={() => setEditingStudent({...editingStudent, contacts: editingStudent.contacts.filter((_, i) => i !== idx)})}
                          className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={16}/>
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
                                setEditingStudent({...editingStudent, contacts: newContacts});
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
                                setEditingStudent({...editingStudent, contacts: newContacts});
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
                                  setEditingStudent({...editingStudent, contacts: newContacts});
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
                                  setEditingStudent({...editingStudent, contacts: newContacts});
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
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><MapPin size={10}/> Indirizzo di Residenza</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 transition-all"
                  value={editingStudent.address}
                  onChange={(e) => setEditingStudent({...editingStudent, address: e.target.value})}
                  placeholder="Via, Civico, CAP, Città"
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

const ClassCard: React.FC<{cls: ClassRoom, studentCount: number}> = ({cls, studentCount}) => (
  <div className="p-6 border border-slate-200 rounded-3xl hover:border-indigo-500 transition-all hover:shadow-lg bg-white h-full flex flex-col relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
       <Users size={64} />
    </div>
    
    <div className="flex justify-between items-start mb-6">
      <div className={`px-3 py-1 rounded-lg ${cls.color} text-[10px] font-black uppercase tracking-widest`}>{cls.id}</div>
      <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={18}/></button>
    </div>
    
    <h3 className="text-lg font-black text-slate-800 mb-2">{cls.name || 'Senza Nome'}</h3>
    
    <div className="space-y-2 mb-6">
       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Team Docente:</p>
       <div className="flex flex-col gap-1.5">
          {cls.assignedTeachers.slice(0, 3).map((at, i) => (
            <div key={i} className="flex items-center gap-2 group/t">
              <div className="w-5 h-5 rounded bg-indigo-50 flex items-center justify-center text-[8px] font-bold text-indigo-600">
                 {MOCK_STAFF.find(s => s.id === at.teacherId)?.name.charAt(0)}
              </div>
              <span className="text-[11px] font-bold text-slate-600 truncate">
                {MOCK_STAFF.find(s => s.id === at.teacherId)?.name}
                <span className="text-[9px] font-medium text-slate-400 ml-1">({at.role})</span>
              </span>
              {at.isRotation && <RefreshCw size={10} className="text-emerald-500" />}
            </div>
          ))}
          {cls.assignedTeachers.length > 3 && (
            <p className="text-[10px] text-indigo-600 font-bold italic">+{cls.assignedTeachers.length - 3} altri docenti</p>
          )}
       </div>
    </div>
    
    <div className="mt-auto">
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Occupazione</p>
          <p className="text-2xl font-black text-slate-800">{studentCount} <span className="text-sm text-slate-400">/ {cls.capacity}</span></p>
        </div>
        <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
          {Math.round((studentCount/cls.capacity)*100)}%
        </div>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 transition-all duration-1000" style={{width: `${Math.min((studentCount/cls.capacity)*100, 100)}%`}}></div>
      </div>
    </div>
  </div>
);

export default ManagementSection;
