
import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_STUDENTS, MOCK_ATTENDANCE as INITIAL_ATTENDANCE, MOCK_CLASSES } from '../constants';
import { 
  Check, X, Clock, History, Save, Search, ArrowRight, Calendar, AlertCircle,
  Users, LayoutGrid, Filter, ChevronLeft, ChevronRight, FileText, Download,
  CalendarDays, Edit2, LogOut, UserCheck, BarChart3, TrendingUp
} from 'lucide-react';
import { AttendanceRecord, Student } from '../types';

interface AttendanceProps {
  selectedClassId?: string;
}

const AttendanceSection: React.FC<AttendanceProps> = ({ selectedClassId = 'all' }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'archive'>('daily');
  const [localClassFilter, setLocalClassFilter] = useState<string>(selectedClassId);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (selectedClassId !== 'all') {
      setLocalClassFilter(selectedClassId);
    }
  }, [selectedClassId]);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleEarlyDeparture = (studentId: string) => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const today = now.toISOString().split('T')[0];
    
    setAttendanceRecords(prev => {
      const existingIdx = prev.findIndex(r => r.studentId === studentId && r.date === today);
      const updatedRecords = [...prev];
      
      if (existingIdx > -1) {
        updatedRecords[existingIdx] = {
          ...updatedRecords[existingIdx],
          isEarlyDeparture: !updatedRecords[existingIdx].isEarlyDeparture,
          departureTime: !updatedRecords[existingIdx].isEarlyDeparture ? currentTime : undefined,
          pickupPerson: !updatedRecords[existingIdx].isEarlyDeparture ? 'Genitore' : undefined
        };
      } else {
        updatedRecords.push({
          id: `new-${Date.now()}`,
          studentId,
          date: today,
          status: 'present',
          departureTime: currentTime,
          isEarlyDeparture: true,
          pickupPerson: 'Genitore'
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
        updatedRecords[existingIdx] = { 
          ...updatedRecords[existingIdx], 
          status,
          isEarlyDeparture: status === 'absent' ? false : updatedRecords[existingIdx].isEarlyDeparture
        };
      } else {
        updatedRecords.push({ id: `new-${Date.now()}`, studentId, date: targetDate, status });
      }
      return updatedRecords;
    });
  };

  const filteredStudentsList = MOCK_STUDENTS
    .filter(s => localClassFilter === 'all' || s.classId === localClassFilter)
    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // ARCHIVE LOGIC
  const monthName = currentMonth.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
  
  const changeMonth = (offset: number) => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + offset);
    setCurrentMonth(next);
  };

  const getStudentArchiveStats = (studentId: string) => {
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    
    const monthRecords = attendanceRecords.filter(r => {
      const d = new Date(r.date);
      // FIX: Accesso corretto a studentId dall'oggetto record 'r', non dalla data 'd'
      return r.studentId === studentId && d.getMonth() === month && d.getFullYear() === year;
    });

    const present = monthRecords.filter(r => r.status === 'present').length;
    const absent = monthRecords.filter(r => r.status === 'absent').length;
    const early = monthRecords.filter(r => r.isEarlyDeparture).length;
    const earlyDates = monthRecords.filter(r => r.isEarlyDeparture).map(r => new Date(r.date).getDate());

    return { present, absent, early, earlyDates };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Registro Presenze & Uscite</h2>
          <p className="text-slate-500 italic font-medium">Monitoraggio quotidiano e storico archivio digitale.</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm self-start">
          <button onClick={() => setActiveTab('daily')} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 uppercase tracking-widest ${activeTab === 'daily' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Clock size={14} /> Appello Oggi
          </button>
          <button onClick={() => setActiveTab('archive')} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 uppercase tracking-widest ${activeTab === 'archive' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}>
            <History size={14} /> Archivio Storico
          </button>
        </div>
      </div>

      {activeTab === 'daily' ? (
        <div className="space-y-8">
          {/* Selettore Classi Rapido */}
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setLocalClassFilter('all')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${localClassFilter === 'all' ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300'}`}>Tutte</button>
            {MOCK_CLASSES.map(cls => (
              <button key={cls.id} onClick={() => setLocalClassFilter(cls.id)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${localClassFilter === cls.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300'}`}>{cls.name}</button>
            ))}
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <div className="flex items-center gap-3">
                 <Calendar className="text-indigo-600" size={20} />
                 <span className="text-sm font-black text-slate-700 uppercase tracking-tight">Registro del {new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}</span>
               </div>
               <div className="relative">
                 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                 <input 
                  type="text" 
                  placeholder="Cerca alunno..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all w-48 md:w-64" 
                 />
               </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-8 py-5">Alunno / Sezione</th>
                  <th className="px-8 py-5">Presenza</th>
                  <th className="px-8 py-5">Uscita Anticipata</th>
                  <th className="px-8 py-5">Orario & Delega</th>
                  <th className="px-8 py-5 text-right">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudentsList.map(student => {
                  const record = attendanceRecords.find(r => r.studentId === student.id && r.date === todayStr);
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-400 shadow-sm border border-indigo-100/50">{student.name.charAt(0)}</div>
                           <div>
                             <p className="font-black text-slate-800 leading-none mb-1">{student.name}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{student.classId}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(student.id, 'present')} className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all ${record?.status === 'present' ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-100' : 'bg-white text-slate-200 border-slate-100 hover:border-emerald-200 hover:text-emerald-400'}`}><Check size={18}/></button>
                          <button onClick={() => updateStatus(student.id, 'absent')} className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all ${record?.status === 'absent' ? 'bg-rose-500 text-white border-rose-600 shadow-lg shadow-rose-100' : 'bg-white text-slate-200 border-slate-100 hover:border-rose-200 hover:text-rose-400'}`}><X size={18}/></button>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <button 
                          onClick={() => handleEarlyDeparture(student.id)}
                          disabled={record?.status === 'absent'}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all font-black text-[10px] uppercase tracking-wider disabled:opacity-30 ${record?.isEarlyDeparture ? 'bg-amber-500 text-white border-amber-600 shadow-lg shadow-amber-100' : 'bg-white text-slate-400 border-slate-200 hover:border-amber-300 hover:text-amber-500'}`}
                         >
                          <LogOut size={14}/> {record?.isEarlyDeparture ? 'Registrata' : 'Registra'}
                         </button>
                      </td>
                      <td className="px-8 py-5">
                         {record?.isEarlyDeparture ? (
                           <div className="flex items-center gap-4 animate-in slide-in-from-left-2">
                             <input 
                              type="time" 
                              className="bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5 text-xs font-black text-amber-700 outline-none"
                              value={record.departureTime || '12:30'}
                             />
                             <div className="flex items-center gap-2 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200">
                               <UserCheck size={14} className="text-indigo-500" />
                               <input 
                                type="text" 
                                className="bg-transparent text-[10px] font-bold text-slate-600 outline-none w-24"
                                value={record.pickupPerson || 'Genitore'}
                                placeholder="Delegato..."
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setAttendanceRecords(prev => prev.map(r => r.studentId === student.id && r.date === todayStr ? {...r, pickupPerson: val} : r));
                                }}
                               />
                             </div>
                           </div>
                         ) : <span className="text-[10px] text-slate-300 italic font-medium">Orario regolare</span>}
                      </td>
                      <td className="px-8 py-5 text-right">
                         <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><FileText size={18}/></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ARCHIVE TAB */
        <div className="space-y-6 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Archivio Stats */}
              <div className="space-y-6">
                 <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><BarChart3 size={80}/></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Frequenza Media</p>
                    <h3 className="text-4xl font-black mb-1">94.2%</h3>
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                       <TrendingUp size={14}/> +1.2% vs mese scorso
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Tot. Uscite Anticipate</span>
                          <span className="font-bold">14</span>
                       </div>
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Assenze Prolungate</span>
                          <span className="font-bold">2</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="bg-white p-6 rounded-[32px] border border-slate-200 space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Azioni Archivio</h4>
                    <button className="w-full bg-slate-50 py-3 rounded-2xl text-[10px] font-black uppercase text-slate-600 flex items-center justify-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100">
                       <Download size={14}/> Export Registro PDF
                    </button>
                    <button className="w-full bg-slate-50 py-3 rounded-2xl text-[10px] font-black uppercase text-slate-600 flex items-center justify-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100">
                       <Download size={14}/> Export Excel Mensile
                    </button>
                 </div>
              </div>

              {/* Tabella Archivio Principale */}
              <div className="lg:col-span-3 space-y-6">
                 <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                       <div className="flex items-center gap-6">
                          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white rounded-xl border border-slate-200 text-slate-400"><ChevronLeft size={20}/></button>
                          <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight min-w-[140px] text-center">{monthName}</h3>
                          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white rounded-xl border border-slate-200 text-slate-400"><ChevronRight size={20}/></button>
                       </div>
                       <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
                          {localClassFilter === 'all' ? 'TUTTE LE SEZIONI' : localClassFilter.toUpperCase()}
                       </div>
                    </div>

                    <div className="overflow-x-auto">
                       <table className="w-full text-left">
                          <thead className="bg-slate-50/50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                             <tr>
                                <th className="px-8 py-5">Alunno</th>
                                <th className="px-8 py-5 text-center">Presenze</th>
                                <th className="px-8 py-5 text-center">Assenze</th>
                                <th className="px-8 py-5 text-center">Uscite Ant.</th>
                                <th className="px-8 py-5">Giorni Uscita Ant.</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {filteredStudentsList.map(student => {
                                const stats = getStudentArchiveStats(student.id);
                                return (
                                   <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                      <td className="px-8 py-5">
                                         <span className="font-bold text-slate-800 text-sm">{student.name}</span>
                                      </td>
                                      <td className="px-8 py-5 text-center">
                                         <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">{stats.present}</span>
                                      </td>
                                      <td className="px-8 py-5 text-center">
                                         <span className="text-xs font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-lg">{stats.absent}</span>
                                      </td>
                                      <td className="px-8 py-5 text-center">
                                         <span className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">{stats.early}</span>
                                      </td>
                                      <td className="px-8 py-5">
                                         <div className="flex flex-wrap gap-1">
                                            {stats.earlyDates.length > 0 ? stats.earlyDates.map(d => (
                                               <span key={d} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold">Giorno {d}</span>
                                            )) : <span className="text-[10px] text-slate-300 italic">Nessuna uscita</span>}
                                         </div>
                                      </td>
                                   </tr>
                                );
                             })}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceSection;
