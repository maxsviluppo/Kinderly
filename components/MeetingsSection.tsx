
import React from 'react';
import { MOCK_MEETINGS } from '../constants';
import { Calendar, Clock, Users, MoreHorizontal, Bell } from 'lucide-react';

const MeetingsSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Riunioni ed Eventi</h2>
          <p className="text-slate-500">Calendario istituzionale e incontri scuola-famiglia.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
          + Nuovo Evento
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          {MOCK_MEETINGS.map(meeting => (
            <div key={meeting.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow group">
              <div className="flex gap-5">
                <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-indigo-600 uppercase">
                    {new Date(meeting.date).toLocaleString('it-IT', { month: 'short' })}
                  </span>
                  <span className="text-xl font-bold text-slate-800">
                    {new Date(meeting.date).getDate()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      meeting.type === 'faculty' ? 'bg-blue-100 text-blue-700' :
                      meeting.type === 'parents' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {meeting.type === 'faculty' ? 'Collegio' : meeting.type === 'parents' ? 'Genitori' : 'CDA'}
                    </span>
                    <h3 className="font-bold text-slate-800">{meeting.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {meeting.time}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={14} />
                      {meeting.participants}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                  <Bell size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Promemoria Scadenze</h3>
          <div className="space-y-4">
            <ReminderItem 
              title="Invio Flussi Uniemens" 
              date="Tra 3 giorni" 
              color="border-red-500"
            />
            <ReminderItem 
              title="Aggiornamento DVR" 
              date="Tra 12 giorni" 
              color="border-amber-500"
            />
            <ReminderItem 
              title="Pagamento F24 Ritenute" 
              date="16 Ottobre" 
              color="border-indigo-500"
            />
          </div>
          <button className="w-full mt-6 py-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors border border-dashed border-slate-200">
            Vedi tutte le scadenze
          </button>
        </div>
      </div>
    </div>
  );
};

const ReminderItem: React.FC<{ title: string, date: string, color: string }> = ({ title, date, color }) => (
  <div className={`p-3 bg-slate-50 rounded-xl border-l-4 ${color}`}>
    <p className="text-sm font-bold text-slate-800 leading-tight">{title}</p>
    <p className="text-xs text-slate-500 mt-1">{date}</p>
  </div>
);

export default MeetingsSection;
