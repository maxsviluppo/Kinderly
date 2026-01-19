
import React, { useState, useMemo } from 'react';
import { WEEKLY_MENU as INITIAL_MENU, CANTEEN_EXPENSES as INITIAL_EXPENSES, MOCK_SCHOOL_CONFIG, MOCK_INGREDIENTS, MOCK_STUDENTS } from '../constants';
import { 
  Utensils, Receipt, ShoppingCart, Plus, Calendar, AlertTriangle, 
  ChevronRight, Save, Trash2, Edit3, DollarSign, Package, TrendingUp,
  BarChart3, Scale, Info, CheckCircle2, X, Soup
} from 'lucide-react';
import { MenuItem, Ingredient } from '../types';

const CanteenSection: React.FC<{ selectedClassId?: string }> = ({ selectedClassId = 'all' }) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'costs' | 'procurement'>('menu');
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [editingDay, setEditingDay] = useState<MenuItem | null>(null);

  const studentCount = MOCK_STUDENTS.length; // Per calcolo food cost totale

  // Filtra i giorni del menù in base alla configurazione del Sabato
  const visibleMenu = useMemo(() => {
    return MOCK_SCHOOL_CONFIG.isSaturdayOpen 
      ? menu 
      : menu.filter(m => m.day !== 'Sabato');
  }, [menu]);

  // Calcolo Food Cost Stimato per un piatto (logica semplificata basata su keyword)
  const calculateDishCost = (dishName: string): number => {
    const dishLower = dishName.toLowerCase();
    let cost = 0.5; // Costo base fisso (olio, sale, pane, ecc)
    
    if (dishLower.includes('pasta')) cost += 0.4;
    if (dishLower.includes('pomodoro')) cost += 0.2;
    if (dishLower.includes('carne') || dishLower.includes('polpette')) cost += 1.8;
    if (dishLower.includes('platessa') || dishLower.includes('pesce')) cost += 2.2;
    if (dishLower.includes('patate') || dishLower.includes('zucchine')) cost += 0.3;
    if (dishLower.includes('mela') || dishLower.includes('pera') || dishLower.includes('kiwi')) cost += 0.25;
    
    return cost;
  };

  const getDayTotalCost = (day: MenuItem) => {
    return (
      calculateDishCost(day.firstCourse) +
      calculateDishCost(day.secondCourse) +
      calculateDishCost(day.side) +
      calculateDishCost(day.fruit)
    );
  };

  const totalWeeklyBudget = useMemo(() => {
    return visibleMenu.reduce((acc, day) => acc + getDayTotalCost(day), 0) * studentCount;
  }, [visibleMenu, studentCount]);

  const handleSaveDay = (updatedDay: MenuItem) => {
    setMenu(prev => prev.map(m => m.day === updatedDay.day ? updatedDay : m));
    setEditingDay(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Strategico */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Soup className="text-indigo-600" /> Controllo Gestione Mensa
          </h2>
          <p className="text-slate-500 italic font-medium">Pianificazione menù, analisi food-cost e approvvigionamenti.</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm self-start">
          <button 
            onClick={() => setActiveTab('menu')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 uppercase tracking-widest ${activeTab === 'menu' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Calendar size={14} /> Menù Settimanale
          </button>
          <button 
            onClick={() => setActiveTab('costs')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 uppercase tracking-widest ${activeTab === 'costs' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <BarChart3 size={14} /> Analisi Food Cost
          </button>
          <button 
            onClick={() => setActiveTab('procurement')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 uppercase tracking-widest ${activeTab === 'procurement' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <ShoppingCart size={14} /> Acquisti
          </button>
        </div>
      </div>

      {activeTab === 'menu' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {visibleMenu.map((day) => {
              const dayCost = getDayTotalCost(day);
              return (
                <div key={day.day} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:border-indigo-500 transition-all flex flex-col group relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{day.day}</span>
                    <button 
                      onClick={() => setEditingDay(day)}
                      className="p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                  </div>
                  <div className="space-y-4 mb-6 flex-1">
                    <MenuCourse label="Primo" value={day.firstCourse} />
                    <MenuCourse label="Secondo" value={day.secondCourse} />
                    <MenuCourse label="Contorno" value={day.side} />
                    <MenuCourse label="Frutta" value={day.fruit} />
                  </div>
                  <div className="pt-4 border-t border-slate-50 mt-auto">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-slate-400 uppercase">Cost/Pasto</span>
                       <span className="text-xs font-black text-emerald-600">€ {dayCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-6 bg-indigo-600 rounded-[40px] text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <TrendingUp size={120} />
            </div>
            <div className="flex items-center gap-6">
               <div className="p-5 bg-white/20 rounded-3xl backdrop-blur-md">
                 <Scale size={32} />
               </div>
               <div>
                 <h4 className="text-xl font-bold">Proiezione Fabbisogno Settimanale</h4>
                 <p className="text-indigo-100 text-sm mt-1">Stima basata su {studentCount} pasti giornalieri per {visibleMenu.length} giorni.</p>
               </div>
            </div>
            <div className="bg-white/10 px-8 py-4 rounded-[30px] backdrop-blur-md border border-white/20 text-center">
               <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-indigo-200">Budget Stimato Materie Prime</p>
               <p className="text-3xl font-black">€ {totalWeeklyBudget.toLocaleString('it-IT')}</p>
            </div>
          </div>
        </div>
      ) : activeTab === 'costs' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                <BarChart3 className="text-indigo-600" /> Incidenza Food Cost per Ingredienti
              </h3>
              <div className="space-y-6">
                {MOCK_INGREDIENTS.map(ing => (
                  <div key={ing.id} className="group">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{ing.name}</span>
                        <span className="text-[10px] text-slate-400 ml-2">Prezzo medio: € {ing.averagePrice.toFixed(2)} / {ing.unit}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-500">Volumi: Elevati</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${ing.averagePrice > 5 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${(ing.averagePrice / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
               <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-6">Ottimizzazione Mensa</h4>
               <div className="space-y-4">
                  <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100 flex gap-4">
                    <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800">Costo Pasto Sotto Target</p>
                      <p className="text-[10px] text-emerald-600 mt-1 italic">La media settimanale (€ 2.80) è inferiore al budget previsto di € 3.20.</p>
                    </div>
                  </div>
                  <div className="p-5 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
                    <Info size={24} className="text-amber-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-amber-800">Prezzo Carne in Aumento</p>
                      <p className="text-[10px] text-amber-600 mt-1 italic">Il fornitore Gino segnala +10% sul bovino da Novembre.</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      ) : (
        /* Sezione Acquisti & Approvvigionamento */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Spesa Mensile</p>
              <p className="text-2xl font-black text-slate-800">€ 657,50</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Fornitori Attivi</p>
              <p className="text-2xl font-black text-slate-800">4 Partner</p>
            </div>
            <button className="lg:col-span-2 bg-indigo-600 text-white rounded-3xl p-6 flex items-center justify-between hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
               <div>
                 <p className="font-bold text-lg">Registra Fattura Carico</p>
                 <p className="text-xs opacity-80 italic">Aggiorna giacenze e costi unitari.</p>
               </div>
               <Plus size={32} />
            </button>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Data Operazione</th>
                    <th className="px-8 py-5">Categoria Merci</th>
                    <th className="px-8 py-5">Fornitore Accred.</th>
                    <th className="px-8 py-5 text-right">Importo Lordo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5 text-sm font-medium text-slate-600">{new Date(exp.date).toLocaleDateString('it-IT')}</td>
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-3">
                           <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Package size={16}/></div>
                           <span className="font-bold text-slate-800">{exp.item}</span>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-xs text-slate-500 font-bold italic">{exp.vendor}</td>
                      <td className="px-8 py-5 text-right font-black text-slate-900">€ {exp.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {/* Modal Editing Menù */}
      {editingDay && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingDay(null)} />
          <div className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl relative overflow-hidden flex flex-col animate-in zoom-in duration-300">
             <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl"><Utensils size={24}/></div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight">Composizione Menù</h3>
                    <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest mt-1">Giorno: {editingDay.day}</p>
                  </div>
                </div>
                <button onClick={() => setEditingDay(null)} className="p-2 hover:bg-white/10 rounded-full"><X size={20}/></button>
             </div>
             
             <div className="p-8 space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Primo Piatto</label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 transition-all"
                    value={editingDay.firstCourse}
                    onChange={(e) => setEditingDay({...editingDay, firstCourse: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Secondo Piatto</label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 transition-all"
                    value={editingDay.secondCourse}
                    onChange={(e) => setEditingDay({...editingDay, secondCourse: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Contorno</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 transition-all"
                      value={editingDay.side}
                      onChange={(e) => setEditingDay({...editingDay, side: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Frutta / Dessert</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 transition-all"
                      value={editingDay.fruit}
                      onChange={(e) => setEditingDay({...editingDay, fruit: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <DollarSign size={16} className="text-emerald-600" />
                     <span className="text-xs font-bold text-emerald-800">Costo Stimato Materia Prima:</span>
                   </div>
                   <span className="text-lg font-black text-emerald-600">€ {getDayTotalCost(editingDay).toFixed(2)}</span>
                </div>
             </div>

             <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button onClick={() => setEditingDay(null)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Annulla</button>
                <button 
                  onClick={() => handleSaveDay(editingDay)}
                  className="flex-[2] bg-indigo-600 text-white py-4 rounded-[24px] text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                >
                  <Save size={18}/> Conferma Menù
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MenuCourse: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="group cursor-default">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">{label}</p>
    <p className="text-xs font-bold text-slate-700 leading-tight truncate">{value}</p>
  </div>
);

export default CanteenSection;
