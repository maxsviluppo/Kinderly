
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { MOCK_STUDENTS, MOCK_TEACHERS, MOCK_FINANCE, MOCK_CLASSES } from '../constants';

interface DashboardProps {
  selectedClassId?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ selectedClassId = 'all' }) => {
  const filteredStudents = MOCK_STUDENTS.filter(s => selectedClassId === 'all' || s.classId === selectedClassId);
  const presentStudents = filteredStudents.filter(s => s.isPresent).length;
  const attendanceRate = filteredStudents.length > 0 ? Math.round((presentStudents / filteredStudents.length) * 100) : 0;
  
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  const attendanceData = [
    { name: 'Presenti', value: presentStudents },
    { name: 'Assenti', value: filteredStudents.length - presentStudents },
  ];

  const financialData = MOCK_FINANCE.map(f => ({
    name: f.category,
    amount: f.amount,
    type: f.type
  }));

  const activeClassName = selectedClassId === 'all' ? 'Intera Scuola' : MOCK_CLASSES.find(c => c.id === selectedClassId)?.name;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <h2 className="text-3xl font-black text-slate-800 tracking-tight">Panoramica {activeClassName}</h2>
             <span className="animate-pulse bg-emerald-500 w-2 h-2 rounded-full"></span>
          </div>
          <p className="text-slate-500 font-medium italic">Statistiche aggregate e monitoraggio tempo reale.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm">
          <Calendar size={16} className="text-indigo-600" />
          <span className="text-xs font-bold text-slate-600">Ottobre 2023 • Settimana 4</span>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Tasso Presenze" 
          value={`${attendanceRate}%`} 
          subtitle={`${presentStudents} presenti su ${filteredStudents.length}`}
          icon={<Users className="text-indigo-600" />}
          color="bg-indigo-50"
          trend="+2% vs ieri"
        />
        <KpiCard 
          title="Staff in Sezione" 
          value={MOCK_TEACHERS.filter(t => (selectedClassId === 'all' || t.assignedClass === selectedClassId) && t.status === 'active').length.toString()} 
          subtitle="Personale attualmente attivo"
          icon={<GraduationCap className="text-emerald-600" />}
          color="bg-emerald-50"
          trend="Al completo"
        />
        <KpiCard 
          title="Rette Ottobre" 
          value="€ 16.500" 
          subtitle="Totale riscosso proiettato"
          icon={<CreditCard className="text-amber-600" />}
          color="bg-amber-50"
          trend="In linea"
        />
        <KpiCard 
          title="Logistica" 
          value="2 Aperte" 
          subtitle="Interventi manutenzione"
          icon={<AlertCircle className="text-rose-600" />}
          color="bg-rose-50"
          trend="1 Urgente"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Attendance Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-black text-slate-800 mb-2">Monitoraggio Presenze</h3>
          <p className="text-xs text-slate-400 mb-8 font-medium italic">Distribuzione alunni presenti oggi ({activeClassName})</p>
          <div className="h-64 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-indigo-50/50 p-3 rounded-2xl border border-indigo-50">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Presenti</p>
              <p className="text-xl font-black text-indigo-700">{presentStudents}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assenti</p>
              <p className="text-xl font-black text-slate-600">{filteredStudents.length - presentStudents}</p>
            </div>
          </div>
        </div>

        {/* Financial Flow */}
        <div className="lg:col-span-3 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
           <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-800">Andamento Finanziario</h3>
              <p className="text-xs text-slate-400 font-medium italic">Riepilogo entrate/uscite gestione complessiva</p>
            </div>
            <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100 px-3 py-1 rounded-lg hover:bg-indigo-50 transition-colors">Dettagli</button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={40}>
                  {financialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.type === 'income' ? '#6366f1' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="text-xs font-bold text-slate-500">Saldo stimato fine mese:</div>
             <div className="text-lg font-black text-slate-800">€ 14.230,00</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend: string;
}> = ({ title, value, subtitle, icon, color, trend }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-50 hover:-translate-y-1 group">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color} shadow-sm group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{trend}</span>
    </div>
    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{title}</p>
    <h4 className="text-3xl font-black text-slate-800 mt-2 tracking-tight">{value}</h4>
    <p className="text-[11px] text-slate-400 font-medium italic mt-2">{subtitle}</p>
  </div>
);

export default Dashboard;
