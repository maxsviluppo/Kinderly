
import React, { useState } from 'react';
import { MOCK_SCHOOL_CONFIG, MOCK_STAFF } from '../constants';
import { 
  Building2, 
  Clock, 
  Phone, 
  Smartphone,
  MapPin, 
  Globe, 
  Mail, 
  ShieldCheck, 
  Facebook, 
  Instagram, 
  HardHat, 
  FileText, 
  Save, 
  Plus,
  Hash
} from 'lucide-react';
import { SchoolConfig } from '../types';

const SettingsSection: React.FC = () => {
  const [config, setConfig] = useState<SchoolConfig>(MOCK_SCHOOL_CONFIG);

  const ataStaff = MOCK_STAFF.filter(s => s.role === 'ata');
  const adminStaff = MOCK_STAFF.filter(s => s.role === 'admin');

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Configurazione Istituto</h2>
          <p className="text-slate-500 font-medium italic">Personalizzazione dei dati istituzionali, contatti digitali e organico.</p>
        </div>
        <button className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-3 active:scale-95">
          <Save size={18} /> Salva Configurazione
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonna Sinistra: Anagrafica e Contatti */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Anagrafica Base */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Building2 size={120} />
            </div>
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-3 border-b border-slate-50 pb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Building2 size={20}/></div>
              Anagrafica Scuola
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <SettingInput label="Denominazione Ufficiale" value={config.name} icon={<Building2 size={16}/>} />
              </div>
              <div className="md:col-span-2">
                <SettingInput label="Indirizzo Sede Operativa" value={config.address} icon={<MapPin size={16}/>} />
              </div>
              <SettingInput label="Telefono Fisso" value={config.phone} icon={<Phone size={16}/>} />
              <SettingInput label="Cellulare Emergenze" value={config.mobilePhone || ''} icon={<Smartphone size={16}/>} />
              <div className="grid grid-cols-2 gap-4">
                <SettingInput label="Apertura" value={config.openingTime} type="time" icon={<Clock size={16}/>} />
                <SettingInput label="Chiusura" value={config.closingTime} type="time" icon={<Clock size={16}/>} />
              </div>
              <SettingInput label="Capienza Massima (Totale)" value={config.maxStudentsPerClass.toString()} icon={<Hash size={16}/>} />
            </div>
          </div>

          {/* Contatti Digitali & Social */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Globe size={20}/></div>
              Presenza Digitale & Social
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <SettingInput label="Sito Web Ufficiale" value={config.website || ''} icon={<Globe size={16}/>} placeholder="www.esempio.it" />
              </div>
              <SettingInput label="Email Primaria (Info)" value={config.emailPrimary} icon={<Mail size={16}/>} />
              <SettingInput label="Email Secondaria (Didattica)" value={config.emailSecondary || ''} icon={<Mail size={16}/>} />
              <div className="md:col-span-2">
                <SettingInput label="Posta Elettronica Certificata (PEC)" value={config.pec} icon={<ShieldCheck size={16}/>} colorClass="text-indigo-600" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pagina Facebook</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-600"><Facebook size={16}/></div>
                  <input 
                    type="text" 
                    defaultValue={config.socialFacebook}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Profilo Instagram</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500"><Instagram size={16}/></div>
                  <input 
                    type="text" 
                    defaultValue={config.socialInstagram}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colonna Destra: Staff e Manutenzione */}
        <div className="space-y-8">
           
           <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-slate-100 text-slate-600 rounded-xl"><FileText size={20}/></div>
                  Segreteria
                </h3>
                <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all"><Plus size={18}/></button>
             </div>
             <div className="space-y-3">
                {adminStaff.map(member => (
                  <div key={member.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group">
                    <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{member.name}</p>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">{member.specificRole}</p>
                  </div>
                ))}
             </div>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
             <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><HardHat size={20}/></div>
                  Ausiliari ATA
                </h3>
                <button className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-all"><Plus size={18}/></button>
             </div>
             <div className="space-y-3">
                {ataStaff.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-amber-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center font-bold text-slate-400">{member.name.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm leading-tight">{member.name}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{member.specificRole}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-500">{member.hoursPerWeek}h</span>
                  </div>
                ))}
             </div>
          </div>

           <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[40px] text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 bg-white/5 w-40 h-40 rounded-full blur-3xl group-hover:bg-white/10 transition-all"></div>
              <h4 className="font-black text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" /> Sistema Kinderly
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-6 font-medium">
                Stato: Attivo • Versione 2.4.0 (Paritaria Edition)<br/>
                Backup Database: Eseguito 4 ore fa.
              </p>
              <button className="w-full py-4 bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all border border-white/20">Verifica Aggiornamenti</button>
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
  placeholder?: string;
  colorClass?: string;
}> = ({label, value, type="text", icon, placeholder, colorClass}) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">{label}</label>
    <div className="relative">
      <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${colorClass || 'text-slate-400'}`}>{icon}</div>
      <input 
        type={type} 
        defaultValue={value}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 outline-none transition-all placeholder:text-slate-300"
      />
    </div>
  </div>
);

export default SettingsSection;
