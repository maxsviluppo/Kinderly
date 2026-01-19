
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ManagementSection from './components/ManagementSection';
import AccountingSection from './components/AccountingSection';
import MeetingsSection from './components/MeetingsSection';
import CanteenSection from './components/CanteenSection';
import AttendanceSection from './components/AttendanceSection';
import CommunicationsSection from './components/CommunicationsSection';
import AIAdvisor from './components/AIAdvisor';
import SettingsSection from './components/SettingsSection';
import DisciplinarySection from './components/DisciplinarySection';
import LogisticsSection from './components/LogisticsSection';
import { AppSection } from './types';
import { Menu, X, Bell, Search, HelpCircle, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.DASHBOARD);
  const [selectedClassId, setSelectedClassId] = useState<string | 'all'>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showQuickHelp, setShowQuickHelp] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case AppSection.DASHBOARD:
        return <Dashboard selectedClassId={selectedClassId} />;
      case AppSection.ATTENDANCE:
        return <AttendanceSection selectedClassId={selectedClassId} />;
      case AppSection.CLASSES:
        return <ManagementSection type="students" selectedClassId={selectedClassId} />;
      case AppSection.DISCIPLINARY:
        return <DisciplinarySection />;
      case AppSection.STAFF:
        return <ManagementSection type="staff" selectedClassId={selectedClassId} />;
      case AppSection.COMMUNICATIONS:
        return <CommunicationsSection selectedClassId={selectedClassId} />;
      case AppSection.ACCOUNTING:
        return <AccountingSection selectedClassId={selectedClassId} />;
      case AppSection.LOGISTICS:
        return <LogisticsSection />;
      case AppSection.CANTEEN:
        return <CanteenSection selectedClassId={selectedClassId} />;
      case AppSection.MEETINGS:
        return <MeetingsSection selectedClassId={selectedClassId} />;
      case AppSection.AI_ADVISOR:
        return <AIAdvisor />;
      case AppSection.SETTINGS:
        return <SettingsSection />;
      default:
        return <div className="p-10 text-center text-slate-500">Sezione in fase di sviluppo.</div>;
    }
  };

  const getSectionName = (section: AppSection) => {
    switch(section) {
      case AppSection.DASHBOARD: return 'Dashboard';
      case AppSection.ATTENDANCE: return 'Appello';
      case AppSection.CLASSES: return 'Classi';
      case AppSection.DISCIPLINARY: return 'Disciplina';
      case AppSection.STAFF: return 'Docenti';
      case AppSection.COMMUNICATIONS: return 'Comunicazioni';
      case AppSection.ACCOUNTING: return 'Contabilità';
      case AppSection.LOGISTICS: return 'Logistica';
      case AppSection.MEETINGS: return 'Agenda';
      case AppSection.CANTEEN: return 'Mensa';
      case AppSection.SETTINGS: return 'Impostazioni';
      default: return 'Kinderly';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar 
        activeSection={activeSection} 
        onNavigate={setActiveSection} 
        selectedClassId={selectedClassId}
        onSelectClass={setSelectedClassId}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-6 flex-1">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg md:hidden">
              <Menu size={20} />
            </button>
            <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-full max-w-md group focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition-all">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Cerca nel sistema..." className="bg-transparent border-none focus:outline-none ml-3 text-sm w-full text-slate-700" />
            </div>
            <h1 className="text-lg font-bold text-slate-800 lg:hidden">
              {getSectionName(activeSection)}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveSection(AppSection.AI_ADVISOR)}
              className="p-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all flex items-center gap-2"
            >
              <Sparkles size={18} />
              <span className="text-xs font-bold hidden xl:inline">AI Advisor</span>
            </button>
            <div className="h-8 w-px bg-slate-100 mx-1 hidden sm:block"></div>
            <button className="flex items-center gap-3 p-1.5 pl-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 transition-all group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-none mb-1">Dott.ssa Rossi</p>
                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-tighter">Direttrice</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow-sm">DR</div>
            </button>
          </div>
        </header>

        <div className="p-6 md:p-10 flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
