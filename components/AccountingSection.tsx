
import React, { useState } from 'react';
import { MOCK_FINANCE, MOCK_STUDENTS } from '../constants';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  BellRing, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  Receipt,
  AlertTriangle,
  Send,
  X
} from 'lucide-react';

const AccountingSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ledger' | 'tuition'>('tuition');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const totalIncome = MOCK_FINANCE.filter(f => f.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = MOCK_FINANCE.filter(f => f.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  // Calcoli per le Rette
  const tuitionAmount = 450; 
  const paidCount = MOCK_STUDENTS.filter(s => s.paymentStatus === 'paid').length;
  const pendingCount = MOCK_STUDENTS.filter(s => s.paymentStatus === 'pending').length;
  const overdueCount = MOCK_STUDENTS.filter(s => s.paymentStatus === 'overdue').length;

  // Filtriamo gli studenti morosi per gli avvisi (simulando che 'overdue' sia > 15 giorni)
  const criticalStudents = MOCK_STUDENTS.filter(s => 
    s.paymentStatus === 'overdue' && !dismissedAlerts.includes(s.id)
  );

  const filteredStudents = MOCK_STUDENTS.filter(s => statusFilter === 'all' || s.paymentStatus === statusFilter);

  const dismissAlert = (id: string) => {
    setDismissedAlerts(prev => [...prev, id]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Contabilità e Rette</h2>
          <p className="text-slate-500">Monitoraggio flussi di cassa e stato pagamenti famiglie.</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm self-start">
          <button 
            onClick={() => setActiveTab('tuition')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'tuition' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Receipt size={16} /> Gestione Rette
          </button>
          <button 
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'ledger' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Wallet size={16} /> Registro Generale
          </button>
        </div>
      </div>

      {activeTab === 'tuition' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Critical Alerts Panel */}
          {criticalStudents.length > 0 && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 shadow-sm animate-pulse-subtle">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-rose-700">
                  <AlertTriangle size={20} className="shrink-0" />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Avvisi Urgenti: Morosità &gt; 15 Giorni</h3>
                </div>
                <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Critico</span>
              </div>
              <div className="space-y-2">
                {criticalStudents.map(student => (
                  <div key={student.id} className="bg-white/80 backdrop-blur-sm border border-rose-100 p-3 rounded-xl flex items-center justify-between group transition-all hover:bg-white">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{student.name} ({student.parentName})</p>
                        <p className="text-xs text-rose-600 font-medium">Scadenza superata di 18 giorni • € {tuitionAmount},00</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm shadow-rose-200 transition-all"
                        onClick={() => alert(`Sollecito inviato a ${student.parentName}`)}
                      >
                        <Send size={14} /> Sollecita Ora
                      </button>
                      <button 
                        onClick={() => dismissAlert(student.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tuition KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2 text-emerald-600">
                <CheckCircle2 size={20} />
                <span className="text-sm font-bold uppercase tracking-tighter">Saldato</span>
              </div>
              <div className="text-3xl font-black text-slate-800">€ {(paidCount * tuitionAmount).toLocaleString('it-IT')}</div>
              <p className="text-xs text-slate-400 mt-1">{paidCount} famiglie in regola</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2 text-amber-500">
                <Clock size={20} />
                <span className="text-sm font-bold uppercase tracking-tighter">In Attesa</span>
              </div>
              <div className="text-3xl font-black text-slate-800">€ {(pendingCount * tuitionAmount).toLocaleString('it-IT')}</div>
              <p className="text-xs text-slate-400 mt-1">{pendingCount} pagamenti previsti</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2 text-rose-600">
                <AlertCircle size={20} />
                <span className="text-sm font-bold uppercase tracking-tighter">Morosità</span>
              </div>
              <div className="text-3xl font-black text-slate-800">€ {(overdueCount * tuitionAmount).toLocaleString('it-IT')}</div>
              <p className="text-xs text-slate-400 mt-1">{overdueCount} famiglie da sollecitare</p>
            </div>
          </div>

          {/* Table Control */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-2">
                {['all', 'paid', 'pending', 'overdue'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      statusFilter === status 
                        ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-slate-200' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {status === 'all' ? 'Tutti' : status === 'paid' ? 'Pagati' : status === 'pending' ? 'In Attesa' : 'In Ritardo'}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Cerca alunno..." className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 w-full md:w-64" />
              </div>
            </div>
            
            <table className="w-full text-left">
              <thead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Alunno / Genitore</th>
                  <th className="px-6 py-4">Importo Retta</th>
                  <th className="px-6 py-4">Stato Pagamento</th>
                  <th className="px-6 py-4">Ultimo Sollecito</th>
                  <th className="px-6 py-4 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{student.name}</div>
                      <div className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{student.parentName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700">€ {tuitionAmount},00</div>
                      <div className="text-[10px] text-slate-400">Ottobre 2023</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        student.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                        student.paymentStatus === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {student.paymentStatus === 'paid' ? 'Pagata' :
                         student.paymentStatus === 'pending' ? 'In Attesa' : 'In Ritardo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 italic">
                      {student.paymentStatus === 'overdue' ? 'Inviato 2gg fa' : 'Non necessario'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {student.paymentStatus !== 'paid' && (
                          <button 
                            className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-lg transition-all"
                            title="Invia Sollecito"
                            onClick={() => alert(`Inviando sollecito a ${student.parentName}...`)}
                          >
                            <BellRing size={16} />
                          </button>
                        )}
                        <button className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-200 transition-colors">
                          Dettagli
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BalanceCard title="Saldo Attuale" amount={totalIncome - totalExpense} icon={<Wallet size={24}/>} color="bg-indigo-600 text-white" />
            <BalanceCard title="Entrate Totali" amount={totalIncome} icon={<TrendingUp size={24}/>} color="bg-white text-emerald-600 border border-slate-100 shadow-sm" />
            <BalanceCard title="Uscite Totali" amount={totalExpense} icon={<TrendingDown size={24}/>} color="bg-white text-rose-600 border border-slate-100 shadow-sm" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Transazioni Recenti</h3>
              <button className="text-blue-600 font-semibold text-sm hover:underline">Esporta Report CSV</button>
            </div>
            <div className="divide-y divide-slate-100">
              {MOCK_FINANCE.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(record => (
                <div key={record.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${record.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {record.type === 'income' ? <ArrowUpRight size={20}/> : <ArrowDownRight size={20}/>}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{record.category}</div>
                      <div className="text-xs text-slate-500">{new Date(record.date).toLocaleDateString('it-IT')} • {record.description}</div>
                    </div>
                  </div>
                  <div className={`font-bold ${record.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {record.type === 'income' ? '+' : '-'} € {record.amount.toLocaleString('it-IT')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BalanceCard: React.FC<{ title: string; amount: number; icon: React.ReactNode; color: string }> = ({ title, amount, icon, color }) => (
  <div className={`p-6 rounded-2xl ${color}`}>
    <div className="flex justify-between items-center mb-4">
      <span className="text-sm font-medium opacity-80">{title}</span>
      {icon}
    </div>
    <div className="text-2xl font-bold">€ {amount.toLocaleString('it-IT')}</div>
  </div>
);

export default AccountingSection;
