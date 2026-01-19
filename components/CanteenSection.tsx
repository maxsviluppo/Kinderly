
import React, { useState, useMemo } from 'react';
import { WEEKLY_MENU as INITIAL_MENU, CANTEEN_EXPENSES as INITIAL_EXPENSES, MOCK_SCHOOL_CONFIG, MOCK_INGREDIENTS, MOCK_STUDENTS } from '../constants';
// Added missing Sparkles icon to the import list
import { 
  Utensils, Receipt, ShoppingCart, Plus, Calendar, AlertTriangle, 
  ChevronRight, Save, Trash2, Edit3, DollarSign, Package, TrendingUp,
  BarChart3, Scale, Info, CheckCircle2, X, Soup, ShieldAlert, Leaf, HeartPulse,
  Sparkles
} from 'lucide-react';
import { MenuItem, Ingredient, Student } from '../types';

const CanteenSection: React.FC<{ selectedClassId?: string }> = ({ selectedClassId = 'all' }) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'costs' | 'procurement'>('menu');
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [editingDay, setEditingDay] = useState<MenuItem | null>(null);

  const students = MOCK_STUDENTS.filter(s => selectedClassId === 'all' || s.classId === selectedClassId);
  const studentCount = students.length;

  // Analisi Dietetica della Sezione
  const dietaryStats = useMemo(() => {
    return {
      celiacs: students.filter(s => s.dietaryPreference === 'celiaco').length,
      veg: students.filter(s => s.dietaryPreference === 'vegetariano' || s.dietaryPreference === 'vegano').length,
      lactose: students.filter(s => s.dietaryPreference === 'senza_lattosio').length,
      allergic: students.filter(s => (s.allergies?.length || 0) > 0).length,
    };
  }, [students]);

  // Filtra i giorni del menù in base alla configurazione del Sabato
  const visibleMenu = useMemo(() => {
    return MOCK_SCHOOL_CONFIG.isSaturdayOpen 
      ? menu 
      : menu.filter(m => m.day !== 'Sabato');
  }, [menu]);

  const calculateDishCost = (dishName: string): number => {
    const dishLower = dishName.toLowerCase();
    let cost = 0.5;
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Soup className="text-indigo-600" /> Controllo Gestione Mensa
          </h2>
          <p className="text-slate-500 italic font-medium">Sicurezza alimentare e ottimizzazione food-cost.</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm self-start">
          {['menu', 'costs', 'procurement'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 uppercase tracking-widest ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {tab === 'menu' ? <Calendar size={14} /> : tab === 'costs' ? <BarChart3 size={14} /> : <ShoppingCart size={14} />}
              {tab === 'menu' ? 'Menù' : tab === 'costs' ? 'Food Cost' : 'Acquisti'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'menu' ? (
        <div className="space-y-8">
          {/* Dietetics Dashboard Card */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
             {[
               { label: 'Pasti Celiaci', count: dietaryStats.celiacs, icon: <ShieldAlert className="text-rose-600"/>, bg: 'bg-rose-50' },
               { label: 'Pasti Veg/Vegano', count: dietaryStats.veg, icon: <Leaf className="text-emerald-600"/>, bg: 'bg-emerald-50' },
               { label: 'Senza Lattosio', count: dietaryStats.lactose, icon: <Info className="text-blue-600"/>, bg: 'bg-blue-50' },
               { label: 'Allergie Varie', count: dietaryStats.allergic, icon: <HeartPulse className="text-amber-600"/>, bg: 'bg-amber-50' },
             ].map((stat, i) => (
               <div key={i} className={`${stat.bg} p-5 rounded-3xl border border-white shadow-sm flex items-center justify-between group hover:scale-[1.02] transition-transform`}>
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">{stat.icon}</div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                      <p className="text-xl font-black text-slate-800">{stat.count} <span className="text-[10px] text-slate-400">Varianti</span></p>
                    </div>
                 </div>
                 <ChevronRight className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" size={20}/>
               </div>
             ))}
          </div>

          {/* Menù Cards con Warning */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {visibleMenu.map((day) => {
              const dayCost = getDayTotalCost(day);
              return (
                <div key={day.day} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:border-indigo-500 transition-all flex flex-col group relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{day.day}</span>
                    <button onClick={() => setEditingDay(day)} className="p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:bg-indigo-50 hover:text-indigo-600"><Edit3 size={14} /></button>
                  </div>
                  
                  <div className="space-y-4 mb-6 flex-1">
                    <MenuCourse label="Primo" value={day.firstCourse} hasWarning={day.allergens?.includes('glutine')} />
                    <MenuCourse label="Secondo" value={day.secondCourse} hasWarning={day.allergens?.includes('uova') || day.allergens?.includes('lattosio')} />
                    <MenuCourse label="Contorno" value={day.side} />
                    <MenuCourse label="Frutta" value={day.fruit} />
                  </div>

                  {/* Warning Strip */}
                  {(day.allergens?.length || 0) > 0 && (
                    <div className="flex gap-1 mb-4 flex-wrap">
                      {day.allergens?.map(a => (
                        <span key={a} className="px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded text-[8px] font-black uppercase border border-rose-100">{a}</span>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-50 mt-auto flex justify-between items-center">
                     <span className="text-[10px] font-black text-slate-400 uppercase">Tot. Giorno</span>
                     <span className="text-xs font-black text-emerald-600">€ {(dayCost * studentCount).toFixed(0)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI compatible meal suggestion - Banner */}
          <div className="p-6 bg-slate-900 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={100}/></div>
             <div className="flex items-center gap-6">
                <div className="p-5 bg-indigo-600 rounded-3xl"><HeartPulse size={32}/></div>
                <div>
                  <h4 className="text-xl font-bold italic tracking-tight">AI Nutritionist Advisor</h4>
                  <p className="text-slate-400 text-sm mt-1">Sulla base delle presenze odierne, sono state generate <span className="text-indigo-400 font-black">4 varianti dietetiche</span> sicure.</p>
                </div>
             </div>
             <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">Vedi Schede Cucina</button>
          </div>
        </div>
      ) : activeTab === 'costs' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 mb-6">Incidenza Food Cost per Ingredienti</h3>
              <div className="space-y-6">
                {MOCK_INGREDIENTS.map(ing => (
                  <div key={ing.id} className="group">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{ing.name}</span>
                        <span className="text-[10px] text-slate-400 ml-2">€ {ing.averagePrice.toFixed(2)} / {ing.unit}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">Incidenza: {ing.category}</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${(ing.averagePrice / 10) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
             <Scale size={48} className="text-indigo-600 mb-4" />
             <h4 className="text-xl font-black text-slate-800">Bilancio Nutrizionale</h4>
             <p className="text-sm text-slate-400 italic">Il menù corrente rispetta i LARN per la fascia 3-6 anni con un margine di errore del &lt;2%.</p>
             <button className="w-full bg-slate-50 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600">Scarica Report ASL</button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 text-center py-20">
           <ShoppingCart size={48} className="mx-auto text-slate-200 mb-4" />
           <p className="text-slate-400 font-medium italic">Modulo ordini ai fornitori sincronizzato con i dati dietetici.</p>
        </div>
      )}

      {/* Modal Editing Menù */}
      {editingDay && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingDay(null)} />
          <div className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
             <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
                <h3 className="text-xl font-black">Composizione Menù: {editingDay.day}</h3>
                <button onClick={() => setEditingDay(null)} className="p-2 hover:bg-white/10 rounded-full"><X size={20}/></button>
             </div>
             <div className="p-8 space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Primo Piatto</label>
                  <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none" value={editingDay.firstCourse} onChange={(e) => setEditingDay({...editingDay, firstCourse: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Secondo Piatto</label>
                  <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none" value={editingDay.secondCourse} onChange={(e) => setEditingDay({...editingDay, secondCourse: e.target.value})} />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase">Contorno</label>
                   <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none" value={editingDay.side} onChange={(e) => setEditingDay({...editingDay, side: e.target.value})} />
                </div>
                
                <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 space-y-3">
                   <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2"><AlertTriangle size={14}/> Allergeni Presenti</p>
                   <div className="flex flex-wrap gap-2">
                      {['glutine', 'lattosio', 'uova', 'soia', 'pesce', 'frutta_guscio'].map(a => (
                        <button 
                          key={a}
                          onClick={() => {
                            const current = editingDay.allergens || [];
                            const next = current.includes(a) ? current.filter(x => x !== a) : [...current, a];
                            setEditingDay({...editingDay, allergens: next});
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${editingDay.allergens?.includes(a) ? 'bg-rose-600 text-white' : 'bg-white text-rose-400 border border-rose-100'}`}
                        >
                          {a.replace('_', ' ')}
                        </button>
                      ))}
                   </div>
                </div>
             </div>
             <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button onClick={() => setEditingDay(null)} className="flex-1 py-4 text-xs font-black uppercase text-slate-400">Annulla</button>
                <button onClick={() => handleSaveDay(editingDay)} className="flex-[2] bg-indigo-600 text-white py-4 rounded-[24px] text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100">Conferma & Analizza</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MenuCourse: React.FC<{ label: string; value: string; hasWarning?: boolean }> = ({ label, value, hasWarning }) => (
  <div className="group cursor-default">
    <div className="flex items-center gap-1 mb-1">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">{label}</p>
      {hasWarning && <ShieldAlert size={10} className="text-rose-500 animate-pulse" />}
    </div>
    <p className={`text-xs font-bold leading-tight truncate ${hasWarning ? 'text-rose-700' : 'text-slate-700'}`}>{value}</p>
  </div>
);

export default CanteenSection;
