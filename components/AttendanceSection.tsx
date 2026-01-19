
import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_STUDENTS, MOCK_ATTENDANCE as INITIAL_ATTENDANCE, MOCK_CLASSES } from '../constants';
import { 
  Check, 
  X, 
  Clock, 
  History, 
  Save, 
  Search, 
  ArrowRight,
  Calendar,
  AlertCircle,
  Users,
  LayoutGrid,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  CalendarDays,
  Edit2
} from 'lucide-react';
import { AttendanceRecord } from '../types';

interface AttendanceProps {
  selectedClassId?: string;
}

const AttendanceSection: React.FC<AttendanceProps> = ({ selectedClassId = 'all' }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'archive'>('daily');
  const [localClassFilter, setLocalClassFilter] = useState<string>(selectedClassId);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  
  // Stato per l'archivio
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Sincronizza il filtro locale con quello globale all'avvio o al cambio prop
  useEffect(() => {
    if (selectedClassId !== 'all') {
      setLocalClassFilter(selectedClassId);
    }
  }, [selectedClassId]);

  const todayStr = new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

  // Helper per calcolare statistiche veloci per il selettore
  const getClassStats = (classId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const classStudents = MOCK_STUDENTS.filter(s => classId === 'all' || s.classId === classId);
    const present = classStudents.filter(s => {
      const record = attendanceRecords.find(r => r.studentId === s.id && r.date === today);
      return record?.status === 'present';
    }).length;
    return { total: classStudents.length, present };
  };

  const handleQuickDelay = (studentId: string) => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const today = now.toISOString().split('T')[0];
    
    setAttendanceRecords(prev => {
      const existingIdx = prev.findIndex(r => r.studentId === studentId && r.date === today);
      const updatedRecords = [...prev];
      
      if (existingIdx > -1) {
        updatedRecords[existingIdx] = {
          ...updatedRecords[existingIdx],
          status: 'present',
          arrivalTime: currentTime,
          notes: 'Entrata in ritardo'
        };
      } else {
        updatedRecords.push({
          id: `new-${Date.now()}`,
          studentId,
          date: today,
          status: 'present',
          arrivalTime: currentTime,
          notes: 'Entrata in ritardo'
        });
      }
      return updatedRecords;
    });
  };

  const updateStatus = (studentId: string, status: 'present' | 'absent', dateStr?: string) => {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    setAttendanceRecords(prev => {
      const existingIdx = prev.findIndex(r => r.studentId === studentId && r.date === targetDate);
      const updatedRecords = [...prev];
      if (existingIdx > -1) {
        updatedRecords[existingIdx] = { ...updatedRecords[existingIdx], status };
      } else {
        updatedRecords.push({
          id: `new-${Date.now()}`,
          studentId,
          date: targetDate,
          status
        });
      }
      return updatedRecords;
    });
  };

  const filteredStudentsList = MOCK_STUDENTS
    .filter(s => localClassFilter === 'all' || s.classId === localClassFilter)
    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Logica Archivio
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentMonth]);

  const changeMonth = (offset: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Appello Digitale</h2>
          <p className="text-slate-500 italic font-medium">Gestione presenze, ritardi e registri storici.</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm self-start">
          <button 
            onClick={() => setActiveTab('daily')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 uppercase tracking-widest ${activeTab === 'daily' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Clock size={14} /> Oggi
          </button>
          <button 
            onClick={() => setActiveTab('archive')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 uppercase tracking-widest ${activeTab === 'archive' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <CalendarDays size={14} /> Registro Archivio
          </button>
        </div>
      </div>

      {activeTab === 'daily' ? (
        <div className="space-y-8">
          {/* Selettore di Classe Avanzato */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              onClick={() => setLocalClassFilter('all')}
              className={`p-4 rounded-3xl border transition-all flex flex-col items-start gap-2 relative overflow-hidden group ${localClassFilter === 'all' ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'}`}
            >
              <div className={`p-2 rounded-xl mb-1 ${localClassFilter === 'all' ? 'bg-white/20' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                <LayoutGrid size={18} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Tutte le Classi</span>
              <div className="flex items-center gap-1.5 mt-1">
                 <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${localClassFilter === 'all' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {getClassStats('all').present} / {getClassStats('all').total}
                 </span>
                 <span className="text-[10px] opacity-60">Alunni Presenti</span>
              </div>
            </button>

            {MOCK_CLASSES.map(cls => {
              const stats = getClassStats(cls.id);
              const isActive = localClassFilter === cls.id;
              return (
                <button 
                  key={cls.id}
                  onClick={() => setLocalClassFilter(cls.id)}
                  className={`p-4 rounded-3xl border transition-all flex flex-col items-start gap-2 relative overflow-hidden group ${isActive ? 'bg-white border-indigo-600 ring-2 ring-indigo-600 shadow-xl shadow-indigo-50' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'}`}
                >
                  <div className={`p-2 rounded-xl mb-1 ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                    <Users size={18} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">{cls.name}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${(stats.present / stats.total) * 100}%` }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600">{stats.present}/{stats.total}</span>
                  </div>
                  {isActive && <div className="absolute top-2 right-2 text-indigo-600 animate-in zoom-in"><Check size={16} strokeWidth={3} /></div>}
                </button>
              );
            })}
          </div>

          {/* Barra di Ricerca e Info */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 flex-1 w-full">
              <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cerca alunno..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-indigo-50 px-4 py-2.5 rounded-2xl border border-indigo-100">
              <Calendar size={18} className="text-indigo-600" />
              <div className="text-right">
                <p className="text-[10px] font-black text-indigo-400 uppercase leading-none tracking-tighter">Data Odierna</p>
                <p className="text-xs font-black text-indigo-800">{todayStr}</p>
              </div>
            </div>
          </div>

          {/* Tabella Appello Giornaliero */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5">Identificativo Alunno</th>
                  <th className="px-8 py-5">Stato</th>
                  <th className="px-8 py-5">Orario</th>
                  <th className="px-8 py-5">Note</th>
                  <th className="px-8 py-5 text-right">Opzioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudentsList.map(student => {
                  const today = new Date().toISOString().split('T')[0];
                  const record = attendanceRecords.find(r => r.studentId === student.id && r.date === today);
                  const isLate = record?.notes === 'Entrata in ritardo';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400">{student.name.charAt(0)}</div>
                           <div>
                             <p className="font-bold text-slate-800">{student.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">{student.classId}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(student.id, 'present')} className={`p-2 rounded-lg border transition-all ${record?.status === 'present' ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-white text-slate-300'}`}><Check size={16}/></button>
                          <button onClick={() => handleQuickDelay(student.id)} className={`p-2 rounded-lg border transition-all ${isLate ? 'bg-amber-500 border-amber-600 text-white' : 'bg-white text-slate-300'}`}><AlertCircle size={16}/></button>
                          <button onClick={() => updateStatus(student.id, 'absent')} className={`p-2 rounded-lg border transition-all ${record?.status === 'absent' ? 'bg-rose-500 border-rose-600 text-white' : 'bg-white text-slate-300'}`}><X size={16}/></button>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <span className="text-xs font-bold text-slate-600">{record?.arrivalTime || '--:--'}</span>
                      </td>
                      <td className="px-8 py-5">
                         <span className="text-xs italic text-slate-400">{record?.notes || '-'}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <button className="p-2 text-slate-300 hover:text-indigo-600"><Save size={18}/></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Sezione Registro Archivio Mensile */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft size={20}/></button>
                <div className="text-center min-w-[160px]">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                    {currentMonth.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
                  </h3>
                </div>
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronRight size={20}/></button>
              </div>
              <div className="h-8 w-px bg-slate-100"></div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sezione:</span>
                <select 
                  className="text-xs font-bold text-indigo-600 bg-indigo-50 border-none rounded-lg px-2 py-1 outline-none"
                  value={localClassFilter}
                  onChange={(e) => setLocalClassFilter(e.target.value)}
                >
                  <option value="all">Tutte</option>
                  {MOCK_CLASSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
                <Download size={16}/> Esporta PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                <FileText size={16}/> Report Mensile
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 min-w-[200px] sticky left-0 bg-slate-50 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nominativo Alunno</span>
                    </th>
                    {daysInMonth.map(date => {
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                      return (
                        <th key={date.getTime()} className={`px-2 py-4 text-center min-w-[36px] border-l border-slate-100 ${isWeekend ? 'bg-slate-100/50' : ''}`}>
                          <div className="flex flex-col">
                            <span className="text-[8px] font-bold text-slate-400 uppercase leading-none mb-1">
                              {date.toLocaleDateString('it-IT', { weekday: 'short' })}
                            </span>
                            <span className={`text-xs font-black ${isWeekend ? 'text-slate-400' : 'text-slate-800'}`}>
                              {date.getDate()}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                    <th className="px-6 py-4 bg-emerald-50/50 border-l border-emerald-100 text-center z-10">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Presenze</span>
                    </th>
                    <th className="px-6 py-4 bg-rose-50/50 border-l border-rose-100 text-center z-10">
                      <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Assenze</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudentsList.map(student => {
                    let totalPresent = 0;
                    let totalAbsent = 0;

                    return (
                      <tr key={student.id} className="hover:bg-indigo-50/10 group transition-colors">
                        <td className="px-6 py-4 sticky left-0 bg-white group-hover:bg-slate-50 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                              {student.name.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-slate-800 whitespace-nowrap">{student.name}</span>
                          </div>
                        </td>
                        {daysInMonth.map(date => {
                          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                          const dateStr = date.toISOString().split('T')[0];
                          const record = attendanceRecords.find(r => r.studentId === student.id && r.date === dateStr);
                          
                          if (!isWeekend) {
                            if (record?.status === 'present') totalPresent++;
                            if (record?.status === 'absent') totalAbsent++;
                          }

                          return (
                            <td key={dateStr} className={`p-1 border-l border-slate-100 text-center ${isWeekend ? 'bg-slate-50/30' : ''}`}>
                              {isWeekend ? (
                                <div className="w-full h-full opacity-20 text-[8px] font-black text-slate-300">WE</div>
                              ) : (
                                <button 
                                  onClick={() => {
                                    const nextStatus = record?.status === 'present' ? 'absent' : 'present';
                                    updateStatus(student.id, nextStatus, dateStr);
                                  }}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition-all ${
                                    record?.status === 'present' ? 'bg-emerald-500 text-white' : 
                                    record?.status === 'absent' ? 'bg-rose-500 text-white' : 
                                    'bg-slate-50 text-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {record?.status === 'present' ? 'P' : record?.status === 'absent' ? 'A' : '.'}
                                </button>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-6 py-4 text-center border-l border-emerald-100 bg-emerald-50/20 font-black text-emerald-600 text-sm">
                          {totalPresent}
                        </td>
                        <td className="px-6 py-4 text-center border-l border-rose-100 bg-rose-50/20 font-black text-rose-600 text-sm">
                          {totalAbsent}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-emerald-500"></div>
                  <span>Presente (P)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-rose-500"></div>
                  <span>Assente (A)</span>
                </div>
              </div>
              <p>Clicca su una cella per modificare lo stato della presenza.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceSection;
