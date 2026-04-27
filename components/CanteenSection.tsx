
import React, { useState, useMemo } from 'react';
import { WEEKLY_MENU, CANTEEN_EXPENSES, MOCK_STUDENTS, MOCK_SCHOOL_CONFIG } from '../constants';
import { Utensils, Receipt, ShoppingCart, Plus, Calendar, AlertTriangle, Leaf, Wheat, Milk, ShieldCheck, Info } from 'lucide-react';
import { DailyMenu, Dish } from '../types';

import { SchoolConfig } from '../types';

interface CanteenProps {
  selectedClassId?: string;
  schoolConfig: SchoolConfig;
}

const CanteenSection: React.FC<CanteenProps> = ({ selectedClassId, schoolConfig }) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'expenses' | 'provisions'>('menu');
  const [selectedDay, setSelectedDay] = useState<string>('Lunedì');

  const totalMonthlyExpense = CANTEEN_EXPENSES.reduce((acc, curr) => acc + curr.amount, 0);

  // Filter Menu Days based on School Config
  const visibleMenu = useMemo(() => {
    let days = WEEKLY_MENU;
    if (schoolConfig.isSaturdayOpen) {
      // Check if Saturday exists, if not add a placeholder or ensure it's in constants
      const hasSat = days.find(d => d.day === 'Sabato');
      if (!hasSat) {
        // Placeholder for Saturday if not in constants
        days = [...days, {
          day: 'Sabato',
          firstCourse: { name: 'Riso in bianco', ingredients: ['Riso', 'Olio'], allergens: [], foodCost: 0.5 },
          secondCourse: { name: 'Prosciutto cotto', ingredients: ['Prosciutto'], allergens: [], foodCost: 1.5 },
          side: { name: 'Carotine baby', ingredients: ['Carote'], allergens: [], foodCost: 0.8 },
          fruit: { name: 'Banana', ingredients: ['Banana'], allergens: [], foodCost: 0.4 }
        }];
      }
    }
    return days;
  }, []);

  // Security Radar: Analyze Diet Issues for specific day
  const getDietaryIssues = (dayMenu: DailyMenu) => {
    const issues: string[] = [];
    const dishes = [dayMenu.firstCourse, dayMenu.secondCourse, dayMenu.side, dayMenu.fruit];
    const allAllergensInMenu = new Set(dishes.flatMap(d => d.allergens));

    // Check Students
    MOCK_STUDENTS.forEach(student => {
      // 1. Check Allergies
      if (student.allergies) {
        const conflict = student.allergies.find(a => allAllergensInMenu.has(a));
        if (conflict) {
          issues.push(`${student.name} (Allergia: ${conflict})`);
        }
      }
      // 2. Check Dietary Profile
      // Simplistic check: if vegan/vegetarian, check for meat/fish/eggs ingredients or allergens
      // This refers to a more complex backend logic usually, but we simulate simple alerts
      if (student.dietaryProfile === 'vegetarian' || student.dietaryProfile === 'vegan') {
        // Mock check: assume 'Manzo', 'Polpette', 'Tacchino', 'Pesce' are non-veg
        const nonVegIngredients = ['Manzo', 'Tacchino', 'Pesce', 'Prosciutto', 'Merluzzo', 'Platessa'];
        const hasMeat = dishes.some(d => d.ingredients.some(i => nonVegIngredients.includes(i)));
        if (hasMeat) {
          issues.push(`${student.name} (${student.dietaryProfile}) - Richiede alternativa Veg`);
        }
      }
      if (student.dietaryProfile === 'gluten_free') {
        if (allAllergensInMenu.has('Glutine')) {
          issues.push(`${student.name} (Celiachia) - Menu contiene Glutine`);
        }
      }
    });
    return issues;
  };

  const currentDayMenu = visibleMenu.find(d => d.day === selectedDay) || visibleMenu[0];
  const currentIssues = getDietaryIssues(currentDayMenu);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Gestione Mensa & Food Cost</h2>
          <p className="text-slate-500">Pianificazione menù, controllo allergeni e registro acquisti.</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'menu' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Menù & Diete
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'expenses' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Spese Alimentari
          </button>
        </div>
      </div>

      {activeTab === 'menu' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Selector & Detail */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
              {visibleMenu.map(day => (
                <button
                  key={day.day}
                  onClick={() => setSelectedDay(day.day)}
                  className={`px-6 py-3 rounded-2xl border whitespace-nowrap transition-all ${selectedDay === day.day ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'}`}
                >
                  <span className="text-xs font-black uppercase tracking-widest">{day.day}</span>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-black text-slate-800">{selectedDay}</h3>
                  <p className="text-slate-500 text-sm">Configurazione pasti ordinaria.</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black uppercase flex items-center gap-2">
                  <Leaf size={14} /> Food Cost: € {
                    (currentDayMenu.firstCourse.foodCost + currentDayMenu.secondCourse.foodCost + currentDayMenu.side.foodCost + currentDayMenu.fruit.foodCost).toFixed(2)
                  } / bambino
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DishCard type="Primo" dish={currentDayMenu.firstCourse} />
                <DishCard type="Secondo" dish={currentDayMenu.secondCourse} />
                <DishCard type="Contorno" dish={currentDayMenu.side} />
                <DishCard type="Frutta" dish={currentDayMenu.fruit} />
              </div>
            </div>
          </div>

          {/* Security Radar */}
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-[32px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10"><ShieldCheck size={100} /></div>
              <h3 className="font-black text-lg mb-1 flex items-center gap-2"><AlertTriangle className="text-amber-400" /> Security Radar</h3>
              <p className="text-slate-400 text-xs font-medium mb-6">Cross-check automatico Allergeni/Diete</p>

              {currentIssues.length > 0 ? (
                <div className="space-y-3 relative z-10">
                  {currentIssues.map((issue, idx) => (
                    <div key={idx} className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs font-bold flex items-start gap-2">
                      <AlertTriangle size={14} className="text-rose-400 shrink-0 mt-0.5" />
                      <span>{issue}</span>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <button className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-lg shadow-amber-900/20">
                      Genera Varianti Dietetiche
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-emerald-400">
                  <ShieldCheck size={48} className="mb-2" />
                  <span className="font-bold text-sm">Nessuna criticità rilevata</span>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
              <h4 className="font-black text-slate-800 text-sm mb-4">Analisi Nutrizionale (Stimata)</h4>
              <div className="space-y-4">
                <NutriBar label="Carboidrati" percent={60} color="bg-amber-400" />
                <NutriBar label="Proteine" percent={25} color="bg-rose-400" />
                <NutriBar label="Grassi" percent={15} color="bg-yellow-400" />
                <NutriBar label="Fibre" percent={40} color="bg-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Receipt size={20} /></div>
                <span className="text-sm text-slate-500 font-medium">Spesa Mensile Totale</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">€ {totalMonthlyExpense.toFixed(2)}</div>
            </div>
            <button className="md:col-span-2 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 hover:bg-slate-50 hover:border-indigo-300 group transition-all">
              <Plus size={32} className="text-slate-300 group-hover:text-indigo-500 mb-2" />
              <span className="font-bold text-slate-500 group-hover:text-indigo-600">Registra Nuova Spesa Alimenti</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Articolo/i</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Fornitore</th>
                  <th className="px-6 py-4 text-right">Importo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {CANTEEN_EXPENSES.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(exp.date).toLocaleDateString('it-IT')}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{exp.item}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase"><span className="bg-slate-100 px-2 py-1 rounded">{exp.category || 'Generico'}</span></td>
                    <td className="px-6 py-4 text-sm text-slate-500">{exp.vendor}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">€ {exp.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const DishCard: React.FC<{ type: string; dish: Dish }> = ({ type, dish }) => {
  if (!dish) return null;
  return (
    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{type}</p>
      <p className="font-bold text-slate-800 text-lg mb-2 group-hover:text-indigo-600 transition-colors">{dish.name}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {dish.ingredients && dish.ingredients.map((ing, idx) => (
          <span key={idx} className="text-[10px] font-medium px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-500">
            {typeof ing === 'string' ? ing : 'Ingrediente'}
          </span>
        ))}
      </div>
      {dish.allergens && dish.allergens.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-bold bg-rose-50 px-3 py-1.5 rounded-lg">
          <AlertTriangle size={12} /> {dish.allergens.join(', ')}
        </div>
      )}
    </div>
  );
};

const NutriBar: React.FC<{ label: string; percent: number; color: string }> = ({ label, percent, color }) => (
  <div>
    <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-1">
      <span>{label}</span>
      <span>{percent}%</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

export default CanteenSection;
