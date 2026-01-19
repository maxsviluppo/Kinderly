
import React, { useState } from 'react';
import { MOCK_MAINTENANCE, MOCK_MEDICAL_CHECKS, MOCK_STUDENTS, MOCK_STAFF } from '../constants';
import { 
  Wrench, 
  Stethoscope, 
  Search, 
  Plus, 
  Calendar, 
  User, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  XCircle,
  MoreVertical,
  Filter,
  Users,
  ChevronRight
} from 'lucide-react';
import { MaintenanceTask, MedicalCheck, MedicalCheckStatus } from '../types';

const LogisticsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'maintenance' | 'medical'>('medical');
  const [medicalFilter, setMedicalFilter] = useState<'all' | 'student' | 'staff'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMedical = MOCK_MEDICAL_CHECKS.filter(check => {
    const matchesType = medicalFilter === 'all' || check.targetType === medicalFilter;
    const matchesSearch = check.targetName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          check.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getStatusIcon = (status: MedicalCheckStatus) => {
    switch (status) {
      case 'planned': return <Clock className="text-amber-500" size={16} />;
      case 'completed': return <CheckCircle2 className="text-emerald-500" size={16} />;
      case 'failed': return <XCircle className="text-rose-500" size={16} />;
    }
  };

  const getStatusLabel = (status: MedicalCheckStatus) => {
    switch (status) {
      case 'planned': return 'Pianificata';
      case 'completed': return 'Completata';
      case 'failed': return 'Non effettuata';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Logistica & Manutenzione</h2>
          <p className="text-slate-500 italic font-medium">Gestione strutture, sicurezza e salute della comunità.</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm self-start">
          <button 
            onClick={() => setActiveTab('medical')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 uppercase tracking-widest ${activeTab === 'medical' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Stethoscope size={14} /> Visite Mediche
          </button>
          <button 
            onClick={() => setActiveTab('maintenance')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 uppercase tracking-widest ${activeTab === 'maintenance' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Wrench size={14} /> Manutenzione
          </button>
        </div>
      </div>

      {activeTab === 'medical' ? (
        <div className="space-y-6">
          {/* Dashboard Visite */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl"><Calendar size={24}/></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prossime Visite</p>
                <p className="text-2xl font-black text-slate-800">4 pianificate</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><ShieldCheck size={24}/></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Regola</p>
                <p className="text-2xl font-black text-slate-800">92% comunità</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl"><AlertTriangle size={24}/></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scadenze Superate</p>
                <p className="text-2xl font-black text-slate-800">2 segnalazioni</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">
              <div className="relative flex-1 w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Cerca per nome o tipo visita..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full lg:w-auto overflow-x-auto">
                <button onClick={() => setMedicalFilter('all')} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${medicalFilter === 'all' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Tutti</button>
                <button onClick={() => setMedicalFilter('student')} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${medicalFilter === 'student' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Alunni</button>
                <button onClick={() => setMedicalFilter('staff')} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${medicalFilter === 'staff' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Personale</button>
              </div>
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 w-full lg:w-auto justify-center">
                <Plus size={18} /> Nuova Registrazione
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Soggetto</th>
                    <th className="px-6 py-4">Tipo Visita</th>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Professionista</th>
                    <th className="px-6 py-4">Stato</th>
                    <th className="px-6 py-4 text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMedical.map(check => (
                    <tr key={check.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${check.targetType === 'student' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {check.targetType === 'student' ? <Users size={16}/> : <User size={16}/>}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{check.targetName}</p>
                            <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">
                              {check.targetType === 'student' ? 'Studente' : 'Personale'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-700">{check.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-500">{new Date(check.date).toLocaleDateString('it-IT')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-500">{check.professional}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(check.status)}
                          <span className="text-xs font-bold text-slate-700">{getStatusLabel(check.status)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={18}/></button>
                      </td>
                    </tr>
                  ))}
                  {filteredMedical.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <Stethoscope size={48} className="opacity-20" />
                          <p className="text-sm font-medium">Nessuna visita trovata per i criteri selezionati.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Sezione Manutenzione (Esempio base) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_MAINTENANCE.map(task => (
            <div key={task.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-500 transition-all hover:shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                  task.priority === 'high' ? 'bg-rose-100 text-rose-700' :
                  task.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  Priorità {task.priority}
                </span>
                <span className="text-[10px] font-bold text-slate-400">{task.date}</span>
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-1">{task.area}</h3>
              <p className="text-sm text-slate-500 mb-6 italic leading-relaxed">{task.description}</p>
              <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  task.status === 'completed' ? 'text-emerald-500' :
                  task.status === 'in_progress' ? 'text-indigo-500' : 'text-amber-500'
                }`}>
                  {task.status === 'completed' ? 'Completato' : task.status === 'in_progress' ? 'In corso' : 'In attesa'}
                </span>
                <button className="text-indigo-600 font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">Dettagli <ChevronRight size={14}/></button>
              </div>
            </div>
          ))}
          <button className="border-4 border-dashed border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 text-slate-300 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all">
            <Plus size={32} />
            <span className="font-bold text-xs uppercase tracking-widest">Registra Intervento</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LogisticsSection;
