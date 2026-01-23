
import React, { useState } from 'react';
import { MOCK_SCHOOL_CONFIG, MOCK_STAFF } from '../constants';
import { 
  Building2, Clock, Phone, Smartphone, MapPin, Globe, Mail, 
  ShieldCheck, Facebook, Instagram, HardHat, FileText, Save, Plus,
  Hash, CalendarDays, ArrowRight, Sun, Moon, AlertTriangle
} from 'lucide-react';
import { SchoolConfig } from '../types';

const SettingsSection: React.FC = () => {
  const [config, setConfig] = useState<SchoolConfig>(MOCK_SCHOOL_CONFIG);

  const ataStaff = MOCK_STAFF.filter(s => s.role === 'ata');
  const adminStaff = MOCK_STAFF.filter(s => s.role === 'admin');

  const handleToggleSaturday = () => {
    setConfig(prev => ({ ...prev, isSaturdayOpen: !prev.isSaturdayOpen }));
  };

  const updateSchedule = (key: 'weekdays' | 'saturday', field: 'open' | 'close', value: string) => {
    setConfig(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [key]: {
          ...prev.schedule[key],
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Impostazioni Istituto</h2>
          <p className="text-slate-500 font-medium italic">Configurazione orari, servizi e organico amministrativo.</p>
        </div>
        <button className="bg-indigo-600 text-white px-8 py-4 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-3 active:scale-95">
          <Save size={20} /> Salva Configurazione
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Orari Operativi - MODIFICATO */}
          <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm space-y-10">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-4 border-b border-slate-50 pb-6">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Clock size={24}/></div>
              Gestione Orari di Apertura
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Feriali */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 bg-indigo-50 p-3 rounded-2xl border border-indigo-100">
                    <Sun size={18} className="text-indigo-600" />
                    <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">Giorni Feriali (Lun-Ven)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Entrata</label>
                        <input 
                          type="time" 
                          value={config.schedule.weekdays.open}
                          onChange={(e) => updateSchedule('weekdays', 'open', e.target.value)}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Uscita</label>
                        <input 
                          type="time" 
                          value={config.schedule.weekdays.close}
                          onChange={(e) => updateSchedule('weekdays', 'close', e.target.value)}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
                        />
                     </div>
                  </div>
               </div>

               {/* Sabato */}
               <div className="space-y-6">
                  <div className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${config.isSaturdayOpen ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    <div className="flex items-center gap-3">
                      <Moon size={18} />
                      <span className="text-xs font-black uppercase tracking-widest">Apertura Sabato</span>
                    </div>
                    <button 
                      onClick={handleToggleSaturday}
                      className={`w-12 h-6 rounded-full transition-all relative ${config.isSaturdayOpen ? 'bg-emerald-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${config.isSaturdayOpen ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>
                  
                  {config.isSaturdayOpen ? (
                    <div className="grid grid-cols-2 gap-4 animate-in zoom-in-95 duration-300">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Entrata</label>
                          <input 
                            type="time" 
                            value={config.schedule.saturday.open}
                            onChange={(e) => updateSchedule('saturday', 'open', e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Uscita</label>
                          <input 
                            type="time" 
                            value={config.schedule.saturday.close}
                            onChange={(e) => updateSchedule('saturday', 'close', e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
                          />
                       </div>
                    </div>
                  ) : (
                    <div className="h-[74px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl">
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Istituto Chiuso</span>
                    </div>
                  )}
               </div>
            </div>
            
            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
               <AlertTriangle className="text-amber-600 shrink-0" size={24} />
               <p className="text-xs text-amber-800 font-bold leading-relaxed">
                  Le modifiche agli orari impattano automaticamente la generazione dei turni del personale e le proiezioni dei costi mensa. Assicurarsi di aver comunicato eventuali variazioni alle famiglie.
               </p>
            </div>
          </div>

          {/* Dati Istituzionali */}
          <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm space-y-8">
             <h3 className="text-xl font-black text-slate-800 flex items-center gap-4 border-b border-slate-50 pb-6">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Building2 size={24}/></div>
              Anagrafica & Recapiti
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <SettingInput label="Denominazione Sede" value={config.name} icon={<Building2 size={16}/>} />
               <SettingInput label="PEC Istituzionale" value={config.pec} icon={<Mail size={16}/>} />
               <div className="md:col-span-2">
                 <SettingInput label="Indirizzo Legale" value={config.address} icon={<MapPin size={16}/>} />
               </div>
               <SettingInput label="Telefono Fisso" value={config.phone} icon={<Phone size={16}/>} />
               <SettingInput label="Cellulare Direzione" value={config.mobilePhone || ''} icon={<Smartphone size={16}/>} />
            </div>
          </div>
        </div>

        {/* Sidebar Impostazioni */}
        <div className="space-y-8">
           <div className="bg-slate-900 p-8 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={100}/></div>
              <h4 className="text-lg font-black mb-6 flex items-center gap-3">
                 <ShieldCheck className="text-emerald-400" /> Sicurezza Dati
              </h4>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed italic font-medium">Il sistema Kinderly è conforme ai protocolli GDPR per il trattamento dei dati sensibili degli alunni.</p>
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Backup Cloud</span>
                    <span className="text-emerald-400 font-black uppercase">Attivo</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Crittografia P2P</span>
                    <span className="text-emerald-400 font-black uppercase">Attivo</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const SettingInput: React.FC<{
  label: string; 
  value: string; 
  type?: string; 
  icon?: React.ReactNode; 
  onChange?: (val: string) => void;
}> = ({label, value, type="text", icon, onChange}) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-indigo-600 transition-colors">{label}</label>
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">{icon}</div>
      <input 
        type={type} 
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 outline-none transition-all"
      />
    </div>
  </div>
);

export default SettingsSection;
