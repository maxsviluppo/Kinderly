
import React, { useState } from 'react';
import { getManagementAdvice } from '../services/geminiService';
import { Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';

const AIAdvisor: React.FC = () => {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    setChat(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    const response = await getManagementAdvice(userMessage);
    setChat(prev => [...prev, { role: 'bot', text: response || "Nessuna risposta disponibile." }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-t-2xl text-white">
        <div className="flex items-center gap-3">
          <Sparkles className="text-amber-400 fill-amber-400" size={24} />
          <div>
            <h2 className="text-xl font-bold">Consulente AI Scolastico</h2>
            <p className="text-blue-100 text-sm">Chiedi consigli su normative, pedagogia o gestione aziendale.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white border-x border-slate-100 overflow-y-auto p-6 space-y-4">
        {chat.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-blue-600">
              <Bot size={32} />
            </div>
            <div className="max-w-xs mx-auto text-slate-500">
              "Posso aiutarti a redigere un PTOF, gestire conflitti con i genitori o interpretare i decreti MIUR."
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['Come gestire l\'HACCP?', 'Bozza progetto educativo 3-6 anni', 'Normativa scuole paritarie 2024'].map(q => (
                <button 
                  key={q} 
                  onClick={() => setInput(q)}
                  className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {chat.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                <Bot size={18} />
              </div>
            )}
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
                <User size={18} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Loader2 className="animate-spin" size={18} />
            </div>
            <div className="bg-slate-100 p-4 rounded-2xl text-sm text-slate-500 rounded-tl-none">
              Sto elaborando la consulenza più adatta al tuo caso...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-b-2xl">
        <div className="relative">
          <textarea
            rows={2}
            className="w-full pr-12 pl-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
            placeholder="Scrivi qui la tua domanda..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
