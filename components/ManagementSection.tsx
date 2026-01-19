
import React, { useState } from 'react';
import { MOCK_STUDENTS, MOCK_STAFF, MOCK_CLASSES, MOCK_SCHOOL_CONFIG } from '../constants';
import { generateSmartSchedule } from '../services/geminiService';
import { 
  Plus, Users, Settings2, MoreVertical, ArrowRightLeft, 
  LayoutGrid, Sparkles, Loader2, Calendar, Save, Trash2, Edit3,
  X, Phone, Mail, MapPin, User, HeartPulse, GraduationCap, Check, 
  AlertCircle, Camera
} from 'lucide-react';
import { ClassRoom, Student, StaffMember, AcademicStatus, FamilyContact } from '../types';

interface SectionProps {
  type: 'students' | 'staff' | 'logistics';
  selectedClassId?: string;
}

const ManagementSection: React.FC<SectionProps> = ({ type, selectedClassId = 'all' }) => {
  const [viewMode, setViewMode] = useState<'list' | 'config' | 'ai-schedule'>('list');
  const [filter, setFilter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSchedule, setAiSchedule] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  
  // Student Modal State
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const filteredStudents = students
    .filter(s => selectedClassId === 'all' || s.classId === selectedClassId)
    .filter(s => s.name.toLowerCase().includes(filter.toLowerCase()));

  const filteredStaff = MOCK_STAFF
    .filter(s => s.role === (type === 'staff' ? 'teacher' : s.role))
    .filter(s => s.name.toLowerCase().includes(filter.toLowerCase()));

  const handleGenerateSchedule = async () => {
    setIsGenerating(true);
    const result = await generateSmartSchedule(MOCK_STAFF.filter(s => s.role === 'teacher'), {
      opening: MOCK_SCHOOL_CONFIG.openingTime,
      closing: MOCK_SCHOOL_CONFIG.closingTime
    });
    setAiSchedule(result || "Errore nella generazione");
    setIsGenerating(false);
  };

  const openStudentModal = (student?: Student) => {
    if (student) {
      setEditingStudent({ ...student });
    } else {
      setEditingStudent({
        id: `s-${Date.now()}`,
        name: '',
        classId: selectedClassId === 'all' ? MOCK_CLASSES[0].id : selectedClassId,
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
                <button onClick={() => setViewMode('ai-schedule')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'ai-schedule' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>
                  <Sparkles size={14}/> AI Scheduler
                </button>
              )}
            </div>
            {type === 'students' && (
              <button 
                onClick={() => openStudentModal()}
                className="bg-indigo-600 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
              >
                <Plus size={18}/> Nuovo Alunno
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 p-8">
        {viewMode === 'config' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_CLASSES.map(cls => (
              <ClassCard key={cls.id} cls={cls} studentCount={students.filter(s => s.classId === cls.id).length} />
            ))}
            <button className="border-4 border-dashed border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 text-slate-300 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all">
              <Plus size={32} />
              <span className="font-bold text-xs uppercase tracking-widest">Aggiungi Sezione</span>
            </button>
          </div>
        ) : viewMode === 'ai-schedule' ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Generatore Orari AI</h3>
                <p className="text-indigo-100 text-sm">Calcola automaticamente i turni di copertura basandosi sulle disponibilità.</p>
              </div>
              <button 
                onClick={handleGenerateSchedule}
                disabled={isGenerating}
                className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={20}/> : <Sparkles size={20}/>}
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
                  <h3 className="text-xl font-black tracking-tight">{editingStudent.id.startsWith('s-') ? 'Aggiungi Alunno' : 'Modifica Alunno'}</h3>
                  <p className="text-white/50 text-[10px] font-black uppercase tracking-widest leading-none mt-1">Kinderly Enrollment System</p>
                </div>
              </div>
              <button onClick={() => setShowStudentModal(false)} className="bg-white/10 p-2 rounded-full hover:rotate-90 transition-all">
                <X size={20}/>
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
                      {MOCK_CLASSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
  <div className="p-6 border border-slate-200 rounded-3xl hover:border-indigo-500 transition-all hover:shadow-lg bg-white">
    <div className="flex justify-between items-start mb-6">
      <div className={`px-3 py-1 rounded-lg ${cls.color} text-[10px] font-black uppercase`}>{cls.id}</div>
      <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={18}/></button>
    </div>
    <h3 className="text-lg font-black text-slate-800 mb-1">{cls.name}</h3>
    <div className="flex justify-between items-end mt-4">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Occupazione</p>
        <p className="text-2xl font-black text-slate-800">{studentCount} <span className="text-sm text-slate-400">/ {cls.capacity}</span></p>
      </div>
      <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden mb-2">
        <div className="h-full bg-indigo-500" style={{width: `${(studentCount/cls.capacity)*100}%`}}></div>
      </div>
    </div>
  </div>
);

export default ManagementSection;
