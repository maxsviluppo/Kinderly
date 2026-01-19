
import React, { useState, useMemo } from 'react';
import { MOCK_STUDENTS, MOCK_DISCIPLINARY } from '../constants';
import { suggestPedagogicalAction, generateDisciplinaryLetter } from '../services/geminiService';
import {
  ShieldAlert,
  Plus,
  Sparkles,
  Search,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  History,
  Send,
  Loader2,
  X,
  Scale,
  FileText,
  Gavel,
  ShieldEllipsis,
  // Added missing Download icon import
  Download
} from 'lucide-react';
import { DisciplinaryAction, DisciplinaryType } from '../types';

const DisciplinarySection: React.FC = () => {
  const [actions, setActions] = useState<DisciplinaryAction[]>(MOCK_DISCIPLINARY);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLetterModal, setShowLetterModal] = useState<string | null>(null);
  const [letterContent, setLetterContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [actionType, setActionType] = useState<DisciplinaryType>('ammonimento');
  const [description, setDescription] = useState('');
  const [consequence, setConsequence] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isLetterLoading, setIsLetterLoading] = useState(false);

  const stats = useMemo(() => ({
    ammonimenti: actions.filter(a => a.type === 'ammonimento').length,
    educativi: actions.filter(a => a.type === 'educativo').length,
    sospensioni: actions.filter(a => a.type === 'sospensione').length,
  }), [actions]);

  const handleAiSuggest = async () => {
    if (!description) return;
    setIsAiLoading(true);
    const suggestion = await suggestPedagogicalAction(description, "4-5");
    setConsequence(suggestion || '');
    setIsAiLoading(false);
  };

  const handleGenerateLetter = async (action: DisciplinaryAction) => {
    setIsLetterLoading(true);
    setShowLetterModal(action.id);
    const student = MOCK_STUDENTS.find(s => s.id === action.studentId);
    const content = await generateDisciplinaryLetter(student?.name || 'Alunno', action.description, action.consequence);
    setLetterContent(content || 'Impossibile generare la lettera.');
    setIsLetterLoading(false);
  };

  const handleAddAction = () => {
    const newAction: DisciplinaryAction = {
      id: `d-${Date.now()}`,
      studentId: selectedStudentId,
      type: actionType,
      description,
      date: new Date().toISOString().split('T')[0],
      consequence,
      status: 'active',
      notifiedParent: false
    };
    setActions([newAction, ...actions]);
    setShowAddModal(false);
    // Reset form
    setSelectedStudentId('');
    setDescription('');
    setConsequence('');
    setActionType('ammonimento');
  };

  const getStudentName = (id: string) => MOCK_STUDENTS.find(s => s.id === id)?.name || 'N/A';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Disciplina & Comportamento</h2>
          <p className="text-slate-500 italic font-medium">Gestione pedagogica degli episodi critici e provvedimenti educativi.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-rose-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-700 transition-all flex items-center gap-3 shadow-lg shadow-rose-100"
        >
          <Plus size={20} /> Nuovo Provvedimento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Cerca alunno o tipo provvedimento..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-rose-500/5 focus:border-rose-400 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {actions
                .filter(a => getStudentName(a.studentId).toLowerCase().includes(searchTerm.toLowerCase()))
                .map(action => {
                  const isSuspension = action.type === 'sospensione';
                  return (
                    <div key={action.id} className={`p-5 border rounded-3xl transition-all group ${isSuspension
                        ? 'border-rose-200 bg-rose-50/20 shadow-sm hover:shadow-md'
                        : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-200'
                      }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${action.type === 'ammonimento' ? 'bg-amber-100 text-amber-600' :
                              action.type === 'educativo' ? 'bg-indigo-100 text-indigo-600' : 'bg-rose-100 text-rose-600'
                            }`}>
                            {isSuspension ? <Gavel size={18} /> : <ShieldAlert size={18} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-800">{getStudentName(action.studentId)}</h4>
                              {isSuspension && <span className="text-[8px] font-black bg-rose-600 text-white px-1.5 py-0.5 rounded uppercase tracking-widest animate-pulse">Grave</span>}
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{action.date} • {action.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleGenerateLetter(action)}
                            className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"
                            title="Genera Lettera Genitori"
                          >
                            <FileText size={18} />
                          </button>
                          <button className="p-2 text-slate-300 hover:text-slate-600"><MoreVertical size={18} /></button>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 mb-3 shadow-sm">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 leading-none">Episodio</p>
                        <p className="text-sm text-slate-700 italic">{action.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-2 ${isSuspension ? 'text-rose-600' : 'text-indigo-600'}`}>
                          <Scale size={14} />
                          <span className="text-xs font-bold">Misura: {action.consequence}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${action.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                            {action.status === 'resolved' ? 'Risolto' : 'Attivo'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
            <ShieldEllipsis size={32} className="mb-6 opacity-40 text-rose-500" />
            <h3 className="text-lg font-bold mb-4 tracking-tight">Riepilogo Disciplinare</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center group cursor-help">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest group-hover:text-amber-400 transition-colors">Ammonimenti</span>
                <span className="text-xl font-black text-amber-400">{stats.ammonimenti}</span>
              </div>
              <div className="flex justify-between items-center group cursor-help">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Misure Educative</span>
                <span className="text-xl font-black text-indigo-400">{stats.educativi}</span>
              </div>
              <div className="flex justify-between items-center group cursor-help p-3 bg-white/5 rounded-2xl border border-white/10 mt-2">
                <span className="text-xs font-black uppercase tracking-widest text-rose-400">Sospensioni</span>
                <span className="text-xl font-black text-rose-500">{stats.sospensioni}</span>
              </div>
            </div>
            <button className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20">Genera Report MIUR</button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest">Protocolli Suggeriti</h4>
            <div className="space-y-2">
              <div className="p-3 bg-amber-50 rounded-xl text-[10px] font-bold text-amber-700 border border-amber-100">
                Patto Corresponsabilità: Verificare firma genitori.
              </div>
              <div className="p-3 bg-rose-50 rounded-xl text-[10px] font-bold text-rose-700 border border-rose-100">
                Sospensione: Richiede parere USR se &gt; 3 giorni.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Aggiunta */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
            <div className={`p-8 flex justify-between items-center text-white transition-colors ${actionType === 'sospensione' ? 'bg-rose-600' : 'bg-slate-900'}`}>
              <div>
                <h3 className="text-xl font-black tracking-tight">Nuovo Registro Comportamento</h3>
                <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Azione: {actionType}</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="bg-white/20 p-2 rounded-full hover:rotate-90 transition-all"><X size={20} /></button>
            </div>

            <div className="flex-1 p-8 overflow-y-auto space-y-6">
              {actionType === 'sospensione' && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 animate-in slide-in-from-top-2">
                  <AlertTriangle className="text-rose-600 shrink-0" size={20} />
                  <p className="text-[11px] text-rose-700 font-bold leading-relaxed">
                    ATTENZIONE: La sospensione è un atto formale grave. Assicurarsi di aver consultato la direzione e di aver documentato ogni passaggio nel fascicolo dell'alunno.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Alunno coinvolto</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                  >
                    <option value="">Seleziona...</option>
                    {MOCK_STUDENTS.map(s => <option key={s.id} value={s.id}>{s.name} ({s.classId})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Tipo Provvedimento</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value as any)}
                  >
                    <option value="ammonimento">Nota / Ammonimento</option>
                    <option value="educativo">Misura Riparatoria</option>
                    <option value="sospensione">Sospensione</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Dinamica dell'episodio</label>
                <textarea
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all"
                  placeholder="Descrivi cosa è accaduto in modo oggettivo..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-indigo-800 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={16} /> {actionType === 'sospensione' ? 'AI Legal & Pedagogy' : 'Supporto Pedagogico AI'}
                  </h4>
                  <button
                    onClick={handleAiSuggest}
                    disabled={isAiLoading || !description}
                    className="text-[10px] font-black bg-white text-indigo-600 px-3 py-1.5 rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                  >
                    {isAiLoading ? 'Elaborazione...' : 'Ottieni Suggerimento'}
                  </button>
                </div>
                <textarea
                  rows={4}
                  className="w-full bg-white/80 border border-indigo-100 rounded-2xl px-4 py-3 text-sm italic font-medium text-indigo-800 outline-none focus:bg-white transition-all"
                  placeholder="Il suggerimento AI apparirà qui..."
                  value={consequence}
                  onChange={(e) => setConsequence(e.target.value)}
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleAddAction}
                disabled={!selectedStudentId || !description || !consequence}
                className={`flex-[2] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all disabled:opacity-50 ${actionType === 'sospensione' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' : 'bg-slate-900 hover:bg-indigo-600 shadow-slate-200'
                  }`}
              >
                Registra {actionType}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lettera AI */}
      {showLetterModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowLetterModal(null)} />
          <div className="bg-white rounded-[40px] w-full max-w-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
            <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black">Bozza Comunicazione Famiglia</h3>
                <p className="text-indigo-100 text-xs font-medium">Documento generato via AI Advisor per {getStudentName(actions.find(a => a.id === showLetterModal)!.studentId)}</p>
              </div>
              <button onClick={() => setShowLetterModal(null)} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
            </div>

            <div className="flex-1 p-10 overflow-y-auto">
              {isLetterLoading ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <Loader2 className="animate-spin text-indigo-600" size={48} />
                  <p className="text-slate-400 font-bold italic">Redazione lettera in corso...</p>
                </div>
              ) : (
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 font-serif text-slate-800 whitespace-pre-wrap leading-relaxed shadow-inner">
                  {letterContent}
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button className="flex-1 bg-white border border-slate-200 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                <Download size={16} /> Copia Testo
              </button>
              <button className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
                <Send size={16} /> Invia via App Famiglia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisciplinarySection;
