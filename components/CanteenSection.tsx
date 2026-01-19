
import React, { useState } from 'react';
import { WEEKLY_MENU, CANTEEN_EXPENSES } from '../constants';
import { Utensils, Receipt, ShoppingCart, Plus, Calendar, AlertTriangle } from 'lucide-react';

const CanteenSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'menu' | 'expenses'>('menu');

  const totalMonthlyExpense = CANTEEN_EXPENSES.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestione Mensa</h2>
          <p className="text-slate-500">Pianificazione menù settimanale e registro acquisti derrate.</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
          <button 
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'menu' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Menù Settimanale
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {WEEKLY_MENU.map((day) => (
            <div key={day.day} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:border-indigo-200 transition-colors">
              <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-2">
                <span className="font-bold text-indigo-600">{day.day}</span>
                <Calendar size={16} className="text-slate-300" />
              </div>
              <div className="space-y-3">
                <MenuCourse label="Primo" value={day.firstCourse} />
                <MenuCourse label="Secondo" value={day.secondCourse} />
                <MenuCourse label="Contorno" value={day.side} />
                <MenuCourse label="Frutta" value={day.fruit} />
              </div>
              <button className="w-full mt-4 py-2 text-[10px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest border border-dashed border-slate-100 rounded-lg">
                Modifica
              </button>
            </div>
          ))}
          <div className="md:col-span-5 bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
            <AlertTriangle className="text-amber-500 shrink-0" size={20} />
            <p className="text-sm text-amber-700">
              <strong>Nota Dietetica:</strong> Verificare sempre gli alunni con allergie segnalate prima della distribuzione del pasto.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Receipt size={20}/></div>
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
                  <th className="px-6 py-4">Fornitore</th>
                  <th className="px-6 py-4 text-right">Importo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {CANTEEN_EXPENSES.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(exp.date).toLocaleDateString('it-IT')}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{exp.item}</td>
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

const MenuCourse: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
    <p className="text-sm font-medium text-slate-700">{value}</p>
  </div>
);

export default CanteenSection;
