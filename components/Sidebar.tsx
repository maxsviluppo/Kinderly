
import React from 'react';
import { NAVIGATION_ITEMS, MOCK_CLASSES } from '../constants';
import { AppSection } from '../types';
import { GraduationCap, ChevronDown, LayoutGrid } from 'lucide-react';

interface SidebarProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
  selectedClassId: string;
  onSelectClass: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onNavigate, selectedClassId, onSelectClass }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col hidden md:flex shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
          <GraduationCap className="text-white" size={24} />
        </div>
        <div>
          <h1 className="font-black text-xl text-slate-800 tracking-tight leading-none">Kinderly</h1>
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Management</p>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">Seleziona Classe</label>
          <div className="relative">
            <select 
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer pr-10"
              value={selectedClassId}
              onChange={(e) => onSelectClass(e.target.value)}
            >
              <option value="all">Tutte le sezioni</option>
              {MOCK_CLASSES.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAVIGATION_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
              activeSection === item.id
                ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-100'
                : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
          >
            <span className={activeSection === item.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}>
              {item.icon}
            </span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-100">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-2xl text-white relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 bg-white/10 w-20 h-20 rounded-full blur-2xl transition-transform group-hover:scale-150"></div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Anno Scolastico</p>
          <p className="text-sm font-bold">2023 / 2024</p>
          <button className="mt-3 w-full py-2 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors">
            Report Finale
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
