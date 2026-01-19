
import React, { useState } from 'react';
import { MOCK_STUDENTS, MOCK_CONVERSATIONS, MOCK_MESSAGES } from '../constants';
import { 
  Search, 
  Send, 
  Phone, 
  Video, 
  Info, 
  MoreVertical, 
  CheckCheck,
  Megaphone,
  User,
  Paperclip,
  Image as ImageIcon,
  ChevronLeft,
  MessageSquare
} from 'lucide-react';

const CommunicationsSection: React.FC = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(MOCK_CONVERSATIONS[0].studentId);
  const [messageText, setMessageText] = useState('');
  const [view, setView] = useState<'chat' | 'circulars'>('chat');

  const selectedStudent = MOCK_STUDENTS.find(s => s.id === selectedStudentId);
  const messages = selectedStudentId ? MOCK_MESSAGES[selectedStudentId] || [] : [];

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Comunicazioni</h2>
          <p className="text-slate-500">Messaggistica diretta con le famiglie e circolari di sezione.</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
          <button 
            onClick={() => setView('chat')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${view === 'chat' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Messaggi
          </button>
          <button 
            onClick={() => setView('circulars')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${view === 'circulars' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Circolari
          </button>
        </div>
      </div>

      {view === 'chat' ? (
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex">
          {/* List of Conversations */}
          <div className={`w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col ${selectedStudentId && 'hidden md:flex'}`}>
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cerca genitore o alunno..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {MOCK_CONVERSATIONS.map(conv => {
                const student = MOCK_STUDENTS.find(s => s.id === conv.studentId);
                return (
                  <button 
                    key={conv.studentId}
                    onClick={() => setSelectedStudentId(conv.studentId)}
                    className={`w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors border-l-4 ${selectedStudentId === conv.studentId ? 'bg-indigo-50/50 border-indigo-600' : 'border-transparent'}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                      {student?.name.charAt(0)}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-800 truncate">{student?.parentName}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{conv.timestamp}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-slate-500 truncate pr-4">{conv.lastMessage}</p>
                        {conv.unreadCount > 0 && (
                          <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{conv.unreadCount}</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Window */}
          {selectedStudentId ? (
            <div className="flex-1 flex flex-col bg-slate-50/30">
              {/* Chat Header */}
              <div className="h-16 px-6 bg-white border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedStudentId(null)} className="p-2 md:hidden text-slate-400 hover:text-indigo-600">
                    <ChevronLeft />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {selectedStudent?.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 leading-none">{selectedStudent?.parentName}</h3>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1">Online ora</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                    <Phone size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                    <Video size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                    <Info size={18} />
                  </button>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.senderId === 'school' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-4 rounded-2xl text-sm shadow-sm ${msg.senderId === 'school' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                      <p>{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${msg.senderId === 'school' ? 'text-indigo-200' : 'text-slate-400'} text-[10px]`}>
                        <span>{msg.timestamp}</span>
                        {msg.senderId === 'school' && <CheckCheck size={12} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <Paperclip size={20} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <ImageIcon size={20} />
                  </button>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      placeholder="Scrivi un messaggio..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    <button 
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors"
                      disabled={!messageText.trim()}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 text-slate-400 bg-slate-50/30">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <MessageSquare size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-600 mb-2">Seleziona una conversazione</h3>
              <p className="max-w-xs text-sm">Visualizza i messaggi dei genitori o avvia una nuova comunicazione individuale.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
             <CircularCard 
                title="Laboratorio di Pittura Creativa" 
                category="Didattica" 
                date="22 Ott 2023" 
                target="Sezione A, Sezione B"
                description="Cari genitori, vi informiamo che Mercoledì inizieremo il nuovo laboratorio di pittura con materiali naturali..."
             />
             <CircularCard 
                title="Chiusura festività Ognissanti" 
                category="Istituzionale" 
                date="20 Ott 2023" 
                target="Tutta la scuola"
                description="Si ricorda che la scuola rimarrà chiusa nei giorni 1 e 2 Novembre. Le lezioni riprenderanno regolarmente il 3."
             />
          </div>
          <div className="space-y-4">
            <button className="w-full bg-indigo-600 text-white p-6 rounded-3xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all text-left">
              <Megaphone className="mb-4" />
              <h3 className="font-bold text-lg">Invia Circolare</h3>
              <p className="text-indigo-100 text-sm mt-1">Invia un avviso a tutti i genitori di una o più sezioni.</p>
            </button>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-4">Statistiche Invio</h3>
               <div className="space-y-4">
                 <StatRow label="Messaggi Letti" value="94%" color="bg-emerald-500" />
                 <StatRow label="Circolari Firmate" value="78%" color="bg-blue-500" />
                 <StatRow label="Email Consegnate" value="99%" color="bg-indigo-500" />
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CircularCard: React.FC<{title: string, category: string, date: string, target: string, description: string}> = ({title, category, date, target, description}) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
    <div className="flex justify-between items-start mb-4">
      <div>
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
          {category}
        </span>
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{title}</h3>
        <p className="text-xs text-slate-400 mt-1">{date} • Per: {target}</p>
      </div>
      <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={20}/></button>
    </div>
    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
      {description}
    </p>
    <div className="flex gap-2">
      <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-indigo-50 hover:text-indigo-700 transition-all">Vedi Dettagli</button>
      <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all">Richiedi Firma</button>
    </div>
  </div>
);

const StatRow: React.FC<{label: string, value: string, color: string}> = ({label, value, color}) => (
  <div>
    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-tighter">
      <span>{label}</span>
      <span className="text-slate-800">{value}</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{width: value}}></div>
    </div>
  </div>
);

export default CommunicationsSection;
