import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ItemType, LegalItem, Hearing, Reminder } from './types.ts';
import { LegalItemCard } from './components/LegalItemCard.tsx';
import { Button, Input } from './components/UiComponents.tsx';
import { 
  Plus, Search, Scale, X, LayoutDashboard, Menu, LogOut, Gavel, 
  ListTodo, Loader2, BrainCircuit
} from 'lucide-react';

const simpleId = () => Math.random().toString(36).substring(2, 11);

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => localStorage.getItem('legalCurrentUser'));
  const [items, setItems] = useState<LegalItem[]>(() => {
    try {
      const saved = localStorage.getItem('legalItems');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ItemType>('hearing');
  const [editingItem, setEditingItem] = useState<LegalItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState('');

  useEffect(() => {
    localStorage.setItem('legalItems', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    setDescriptionValue(editingItem ? editingItem.description : '');
  }, [editingItem, isModalOpen]);

  const handleAiRefinement = async () => {
    if (!descriptionValue) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Refine este resumo jurídico para termos técnicos formais de um gabinete: "${descriptionValue}"`,
        config: { systemInstruction: "Consultor Jurídico Sênior focado em precisão técnica." }
      });
      if (response.text) setDescriptionValue(response.text.trim());
    } catch (e) {
      console.error("AI Error:", e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const base = {
      id: editingItem ? editingItem.id : simpleId(),
      author: currentUser || 'Advogado',
      status: editingItem ? editingItem.status : 'pending',
      clientName: fd.get('clientName') as string,
      clientWhatsapp: fd.get('clientWhatsapp') as string,
      date: fd.get('date') as string,
      time: fd.get('time') as string,
      deadline: fd.get('deadline') as string,
      caseNumber: fd.get('caseNumber') as string,
      description: descriptionValue,
      clientEmail: '',
    };
    
    const newItem: LegalItem = modalType === 'hearing' 
      ? { ...base, type: 'hearing', court: fd.get('court') as string } as Hearing
      : { ...base, type: 'reminder', title: fd.get('title') as string } as Reminder;

    setItems(prev => editingItem ? prev.map(i => i.id === newItem.id ? newItem : i) : [...prev, newItem]);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const filteredItems = useMemo(() => {
    let f = items;
    if (activeView === 'hearings') f = f.filter(i => i.type === 'hearing');
    if (activeView === 'reminders') f = f.filter(i => i.type === 'reminder');
    
    const term = searchTerm.toLowerCase();
    return f.filter(i => 
      i.clientName.toLowerCase().includes(term) || 
      i.description.toLowerCase().includes(term) ||
      (i.caseNumber && i.caseNumber.includes(term))
    ).sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
  }, [items, activeView, searchTerm]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
        <div className="bg-slate-900 border border-white/5 p-10 rounded-[2.5rem] w-full max-w-sm text-center shadow-2xl">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20">
            <Scale size={32} className="text-slate-950" />
          </div>
          <h1 className="text-3xl font-serif text-white tracking-widest mb-1 uppercase">JurisExito</h1>
          <p className="text-slate-500 font-bold mb-8 text-[8px] uppercase tracking-[0.3em]">Ambiente de Elite</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            const n = new FormData(e.currentTarget).get('name') as string;
            setCurrentUser(n);
            localStorage.setItem('legalCurrentUser', n);
          }} className="space-y-4">
            <input name="name" type="text" placeholder="Seu Nome ou Credencial" required className="w-full px-5 py-4 rounded-xl bg-slate-800 border border-white/10 outline-none focus:border-amber-500 text-white font-bold transition-all"/>
            <button type="submit" className="w-full py-4 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest active:scale-95 transition-all">Acessar Gabinete</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100 overflow-hidden font-sans">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/90 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}
      
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-white/5 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-8 flex items-center gap-3">
           <Scale size={20} className="text-amber-500" />
           <span className="font-serif tracking-widest text-sm uppercase">Juris<span className="text-amber-500">Exito</span></span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <SidebarBtn active={activeView === 'dashboard'} onClick={() => {setActiveView('dashboard'); setIsSidebarOpen(false);}} icon={LayoutDashboard} label="Visão Geral" />
          <SidebarBtn active={activeView === 'hearings'} onClick={() => {setActiveView('hearings'); setIsSidebarOpen(false);}} icon={Gavel} label="Audiências" />
          <SidebarBtn active={activeView === 'reminders'} onClick={() => {setActiveView('reminders'); setIsSidebarOpen(false);}} icon={ListTodo} label="Prazos" />
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={() => {setCurrentUser(null); localStorage.removeItem('legalCurrentUser');}} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 text-[10px] font-black uppercase hover:text-white transition-colors">
            <LogOut size={14}/> Sair do Gabinete
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-6 py-6 flex justify-between items-center border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
          <button className="md:hidden p-2 -ml-2 text-slate-400" onClick={() => setIsSidebarOpen(true)}><Menu size={24}/></button>
          <h2 className="text-[10px] font-black text-white uppercase tracking-[0.2em] hidden sm:block">
            SISTEMA INTEGRADO <span className="text-slate-500 mx-2">/</span> <span className="text-amber-500">{currentUser}</span>
          </h2>
          <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="px-5 py-3 bg-amber-500 text-slate-950 rounded-xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2">
            <Plus size={16}/> Lançar Ato
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatSmall label="Pendentes" value={items.filter(i => i.status !== 'completed').length} color="amber" />
            <StatSmall label="Críticos" value={items.filter(i => i.status !== 'completed' && Math.ceil((new Date(i.deadline).getTime() - new Date().getTime())/86400000) <= 2).length} color="red" />
            <StatSmall label="Concluídos" value={items.filter(i => i.status === 'completed').length} color="green" />
            <StatSmall label="Total Geral" value={items.length} color="gold" />
          </div>

          <div className="relative group">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors" size={20}/>
             <input className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-900 border border-white/5 text-sm font-bold outline-none focus:border-amber-500/50 transition-all text-white placeholder:text-slate-600" placeholder="Pesquisar pauta..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 pb-20">
            {filteredItems.map(item => (
              <LegalItemCard key={item.id} item={item} onDelete={(id) => setItems(prev => prev.filter(i => i.id !== id))} onEdit={(i) => { setEditingItem(i); setIsModalOpen(true); }} onToggleStatus={(id) => setItems(prev => prev.map(i => i.id === id ? {...i, status: i.status === 'completed' ? 'pending' : 'completed'} : i))} />
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full py-32 text-center">
                <div className="text-slate-800 font-black text-[10px] uppercase tracking-[0.5em] mb-4">Sem registros nesta vista</div>
              </div>
            )}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/95 backdrop-blur-md transition-all duration-300">
           <div className="bg-slate-900 w-full max-w-2xl h-[95vh] sm:h-auto sm:max-h-[90vh] rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col border-t sm:border border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-950/50">
               <h2 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <Scale size={16} className="text-amber-500"/>
                  {editingItem ? 'Revisar Lançamento' : 'Novo Ato Jurídico'}
               </h2>
               <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-full"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSaveItem} className="p-6 space-y-4 overflow-y-auto flex-1 no-scrollbar bg-slate-900">
               <div className="flex bg-slate-950/50 border border-white/5 rounded-2xl p-1.5 mb-6">
                  <button type="button" onClick={() => setModalType('hearing')} className={`flex-1 py-3.5 text-[10px] font-black rounded-xl transition-all ${modalType === 'hearing' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>AUDIÊNCIA</button>
                  <button type="button" onClick={() => setModalType('reminder')} className={`flex-1 py-3.5 text-[10px] font-black rounded-xl transition-all ${modalType === 'reminder' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>PRAZO / TAREFA</button>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                  {modalType === 'hearing' ? <Input label="Vara / Tribunal" name="court" required defaultValue={(editingItem as Hearing)?.court} /> : <Input label="Título do Prazo" name="title" required defaultValue={(editingItem as Reminder)?.title} />}
                  <Input label="Número do Processo (CNJ)" name="caseNumber" placeholder="Ex: 0000000-00..." defaultValue={editingItem?.caseNumber} />
                  <Input label="Cliente / Autor" name="clientName" required defaultValue={editingItem?.clientName} />
                  <Input label="WhatsApp para Alertas" name="clientWhatsapp" placeholder="Ex: 11988887777" required defaultValue={editingItem?.clientWhatsapp} />
                  <Input label="Data do Evento" name="date" type="date" required defaultValue={editingItem?.date} />
                  <Input label="Prazo Fatal" name="deadline" type="date" required defaultValue={editingItem?.deadline} />
                  <Input label="Horário Marcado" name="time" type="time" required defaultValue={editingItem?.time} />
               </div>
               
               <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        Resumo Técnico e Estratégia
                     </label>
                     <button type="button" onClick={handleAiRefinement} className="text-[10px] font-black uppercase text-amber-500 hover:text-amber-400 flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-lg active:scale-90 transition-all">
                        {isAiLoading ? <Loader2 size={12} className="animate-spin"/> : <BrainCircuit size={14}/>} Refinar com IA
                     </button>
                  </div>
                  <textarea value={descriptionValue} onChange={(e) => setDescriptionValue(e.target.value)} required className="w-full min-h-[150px] rounded-2xl bg-slate-800 border border-slate-700 p-5 outline-none focus:border-amber-500 text-sm text-white transition-all placeholder:text-slate-600 shadow-inner" placeholder="Descreva os detalhes importantes, provas e o que deve ser feito..."/>
               </div>

               <div className="pt-8 pb-12 sm:pb-6">
                  <button type="submit" className="w-full py-6 bg-amber-500 text-slate-950 rounded-2xl font-black uppercase text-xs tracking-widest active:scale-[0.98] transition-all shadow-2xl shadow-amber-500/20">
                    Finalizar e Salvar Lançamento
                  </button>
               </div>
            </form>
           </div>
        </div>
      )}
    </div>
  );
}

function SidebarBtn({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
   return (
      <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-5 rounded-2xl transition-all ${active ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/10' : 'text-slate-400 hover:bg-white/5 font-bold'}`}>
         <Icon size={18}/> <span className="text-[11px] uppercase tracking-widest">{label}</span>
      </button>
   );
}

function StatSmall({ label, value, color }: { label: string, value: number, color: string }) {
  const colors:any = { gold: "text-amber-500", amber: "text-amber-400", red: "text-red-500", green: "text-emerald-500" };
  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 shadow-sm">
      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}

type ViewState = 'dashboard' | 'hearings' | 'reminders';
