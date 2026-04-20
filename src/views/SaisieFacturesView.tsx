import { useState, useMemo } from 'react';
import { ViewType } from '../components/Sidebar';
import { useWealthStore } from '../store/useWealthStore';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, TrendingUp, TrendingDown, Plus, Filter, Search, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';

export default function BusinessFluxView({ onNavigate }: { onNavigate: (v: ViewType) => void }) {
  const business = useWealthStore((state) => state.business);
  const updateBusiness = useWealthStore((state) => state.updateBusiness);

  const CATEGORIES = ['Prestations', 'Ventes', 'Salaires', 'Achat Stock', 'Rénovation / Travaux', 'Loyer', 'Logiciels', 'Divers'];

  // Filters
  const [filterType, setFilterType] = useState<'ALL' | 'IN' | 'OUT'>('ALL');
  const [filterMonth, setFilterMonth] = useState<string>('ALL');

  // Multi-selection (for potential mass actions in the future, currently visual)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'OUT' as 'IN' | 'OUT',
    category: 'Achat Stock',
    amountHT: '',
    tva: '',
    date: new Date().toISOString().split('T')[0],
    client: ''
  });

  // Extract unique months for filter
  const availableMonths = useMemo(() => {
    const months = new Set(business.factures.map(f => f.date.substring(0, 7))); // YYYY-MM
    return Array.from(months).sort().reverse();
  }, [business.factures]);

  // Filtered transactions
  const filteredFactures = useMemo(() => {
    return business.factures.filter(f => {
      if (filterType !== 'ALL' && f.type !== filterType) return false;
      if (filterMonth !== 'ALL' && !f.date.startsWith(filterMonth)) return false;
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [business.factures, filterType, filterMonth]);

  const stats = useMemo(() => {
    const inTotal = filteredFactures.filter(f => f.type === 'IN').reduce((acc, curr) => acc + curr.amountHT, 0);
    const outTotal = filteredFactures.filter(f => f.type === 'OUT').reduce((acc, curr) => acc + curr.amountHT, 0);
    return { inTotal, outTotal, balance: inTotal - outTotal };
  }, [filteredFactures]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client || !formData.amountHT) return;

    const newFacture = {
      id: Math.random().toString(),
      type: formData.type,
      category: formData.category,
      amountHT: Number(formData.amountHT),
      tva: Number(formData.tva) || 0,
      date: formData.date,
      client: formData.client
    };

    updateBusiness({
       factures: [...business.factures, newFacture]
    });
    
    // Auto-update global fluxes
    if (formData.type === 'IN') {
       updateBusiness({ fluxIn: business.fluxIn + Number(formData.amountHT) });
    } else {
       updateBusiness({ fluxOut: business.fluxOut + Number(formData.amountHT) });
    }

    setShowForm(false);
    setFormData({ type: 'OUT', category: 'Achat Stock', amountHT: '', tva: '', date: new Date().toISOString().split('T')[0], client: '' });
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="px-6 md:px-10 space-y-12 animate-in fade-in duration-1000 pb-20 w-full max-w-7xl mx-auto pt-8">
      
      {/* Header */}
      <div>
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-space-gray hover:text-white transition-colors text-xs uppercase tracking-widest font-bold mb-8"
        >
          <ArrowLeft size={14} /> Retour
        </button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
           <div>
             <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-white mb-2">
               Flux Financiers In/Out
             </h2>
             <p className="text-space-gray tracking-wide">
               Historique et pointage comptable détaillé
             </p>
           </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="glass-card p-6 rounded-3xl flex flex-col justify-center border-l-4 border-l-[#34C759]/50">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 rounded-full bg-[#34C759]/10 flex items-center justify-center text-[#34C759]">
                  <TrendingUp size={16} />
               </div>
               <span className="text-sm font-medium text-space-gray">Total Entrant (Période)</span>
            </div>
            <p className="text-3xl font-light text-white">{stats.inTotal.toLocaleString('fr-FR')} <span className="text-sm text-space-gray">HT</span></p>
         </div>
         <div className="glass-card p-6 rounded-3xl flex flex-col justify-center border-l-4 border-l-red-500/50">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                  <TrendingDown size={16} />
               </div>
               <span className="text-sm font-medium text-space-gray">Total Sortant (Période)</span>
            </div>
            <p className="text-3xl font-light text-white">{stats.outTotal.toLocaleString('fr-FR')} <span className="text-sm text-space-gray">HT</span></p>
         </div>
         <div className="glass-card p-6 rounded-3xl flex flex-col justify-center bg-white/[0.02]">
             <div className="flex items-center gap-3 mb-2">
               <span className="text-sm font-medium text-space-gray">Balance Nette</span>
            </div>
            <p className={cn("text-4xl font-bold", stats.balance >= 0 ? "text-[#34C759]" : "text-red-500")}>
               {stats.balance > 0 ? '+' : ''}{stats.balance.toLocaleString('fr-FR')} <span className="text-sm font-light uppercase tracking-widest opacity-60">HT</span>
            </p>
         </div>
      </div>

      {/* Main List Area */}
      <div className="glass-card rounded-[32px] overflow-hidden flex flex-col min-h-[500px]">
         
         {/* Toolbar */}
         <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-black/20">
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
               <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl">
                  <button onClick={() => setFilterType('ALL')} className={cn("px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all", filterType === 'ALL' ? 'bg-white/10 text-white' : 'text-space-gray hover:text-white')}>Tout</button>
                  <button onClick={() => setFilterType('IN')} className={cn("px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all", filterType === 'IN' ? 'bg-[#34C759]/20 text-[#34C759]' : 'text-space-gray hover:text-white')}>Entrées</button>
                  <button onClick={() => setFilterType('OUT')} className={cn("px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all", filterType === 'OUT' ? 'bg-red-500/20 text-red-500' : 'text-space-gray hover:text-white')}>Sorties</button>
               </div>
               
               <select 
                  value={filterMonth} 
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none cursor-pointer"
               >
                  <option value="ALL">Tous les mois</option>
                  {availableMonths.map(m => (
                     <option key={m} value={m}>{m}</option>
                  ))}
               </select>
            </div>

            <button onClick={() => setShowForm(true)} className="w-full md:w-auto py-2.5 px-6 bg-[#34C759] text-midnight font-bold rounded-xl hover:bg-[#34C759]/90 transition-all flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(52,199,89,0.2)]">
               <Plus size={16} /> Nouveau Flux
            </button>
         </div>

         {/* Desktop Table Header */}
         <div className="hidden md:grid grid-cols-12 gap-4 px-10 py-4 border-b border-white/5 text-xs font-bold text-space-gray uppercase tracking-widest bg-black/10">
            <div className="col-span-1"></div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Catégorie</div>
            <div className="col-span-3">Libellé / Client</div>
            <div className="col-span-2 text-right">Montant HT</div>
            <div className="col-span-2 text-right">Montant TTC</div>
         </div>

         {/* Transactions List */}
         <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-2">
            <AnimatePresence>
               {filteredFactures.length === 0 ? (
                  <div className="py-20 text-center text-space-gray font-light">Aucune transaction trouvée.</div>
               ) : (
                  filteredFactures.map(tx => (
                     <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={tx.id}
                        className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-y-0 gap-x-4 px-4 py-4 md:items-center bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-white/10 transition-all group cursor-pointer"
                        onClick={() => toggleSelection(tx.id)}
                     >
                        <div className="md:col-span-1 flex items-center mb-2 md:mb-0">
                           {selectedIds.includes(tx.id) 
                             ? <CheckCircle2 size={20} className={tx.type === 'IN' ? 'text-[#34C759]' : 'text-red-500'} /> 
                             : <Circle size={20} className="text-space-gray opacity-30 group-hover:opacity-100 transition-opacity" />
                           }
                        </div>
                        <div className="md:col-span-2 flex justify-between md:block">
                           <span className="md:hidden text-xs text-space-gray uppercase">Date</span>
                           <span className="text-sm font-medium text-white/80">{tx.date}</span>
                        </div>
                        <div className="md:col-span-2 flex justify-between md:block">
                           <span className="md:hidden text-xs text-space-gray uppercase">Catégorie</span>
                           <span className={cn(
                              "text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold inline-block",
                              tx.type === 'IN' ? 'bg-[#34C759]/10 text-[#34C759] border border-[#34C759]/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                           )}>
                              {tx.category}
                           </span>
                        </div>
                        <div className="md:col-span-3 flex justify-between md:block">
                           <span className="md:hidden text-xs text-space-gray uppercase">Libellé</span>
                           <span className="text-base md:text-sm text-white font-medium">{tx.client}</span>
                        </div>
                        <div className="md:col-span-2 flex justify-between md:block md:text-right">
                           <span className="md:hidden text-xs text-space-gray uppercase">HT</span>
                           <span className="text-sm text-white/90 font-medium">{tx.amountHT.toLocaleString('fr-FR')}</span>
                        </div>
                        <div className="md:col-span-2 flex justify-between md:block md:text-right">
                           <span className="md:hidden text-xs text-space-gray uppercase">TTC</span>
                           <span className="text-sm text-white font-bold">{(tx.amountHT + tx.tva).toLocaleString('fr-FR')} <span className="text-[10px] text-space-gray font-light ml-1 line-clamp-1 truncate">MAD ({tx.tva > 0 ? '+TVA' : '0 TVA'})</span></span>
                        </div>
                     </motion.div>
                  ))
               )}
            </AnimatePresence>
         </div>
      </div>

      {/* Add Form Modal */}
      <AnimatePresence>
         {showForm && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                 onClick={() => setShowForm(false)}
               />
               <motion.div 
                 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                 className="bg-[#0A0A0B] border border-white/10 p-8 rounded-[32px] w-full max-w-lg relative z-10 shadow-2xl"
               >
                  <h3 className="text-2xl text-white font-light mb-6 text-center">Nouveau Flux</h3>
                  <form onSubmit={handleSave} className="space-y-4">
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs text-space-gray uppercase tracking-widest ml-2 mb-1 block">Type</label>
                           <select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value as 'IN'|'OUT'})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none cursor-pointer">
                              <option value="IN">Entrée (Recette)</option>
                              <option value="OUT">Sortie (Dépense)</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-xs text-space-gray uppercase tracking-widest ml-2 mb-1 block">Date</label>
                           <input required type="date" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#34C759]/50 transition-colors" style={{colorScheme: 'dark'}} />
                        </div>
                     </div>

                     <div>
                        <label className="text-xs text-space-gray uppercase tracking-widest ml-2 mb-1 block">Catégorie</label>
                        <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none cursor-pointer">
                           {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>

                     <div>
                        <label className="text-xs text-space-gray uppercase tracking-widest ml-2 mb-1 block">Libellé / Client</label>
                        <input required value={formData.client} onChange={e=>setFormData({...formData, client: e.target.value})} placeholder="ex: Client A, Amazon AWS..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs text-space-gray uppercase tracking-widest ml-2 mb-1 block">Montant HT</label>
                           <input required type="number" step="0.01" value={formData.amountHT} onChange={e=>setFormData({...formData, amountHT: e.target.value})} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                        </div>
                        <div>
                           <label className="text-xs text-space-gray uppercase tracking-widest ml-2 mb-1 block">TVA (MAD)</label>
                           <input type="number" step="0.01" value={formData.tva} onChange={e=>setFormData({...formData, tva: e.target.value})} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                        </div>
                     </div>

                     <div className="pt-4 border-t border-white/5 mt-4 flex justify-between items-center text-sm">
                        <span className="text-space-gray">Total TTC Estimé:</span>
                        <span className="text-white font-bold text-lg">
                           {((Number(formData.amountHT)||0) + (Number(formData.tva)||0)).toLocaleString('fr-FR')} MAD
                        </span>
                     </div>

                     <div className="flex gap-4 mt-8 pt-4">
                        <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-all">Annuler</button>
                        <button type="submit" className="flex-1 bg-[#34C759] text-midnight font-bold py-3 rounded-xl hover:bg-[#34C759]/90 transition-all shadow-[0_0_15px_rgba(52,199,89,0.3)]">Enregistrer Flux</button>
                     </div>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
}
