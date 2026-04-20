import { useState, useMemo } from 'react';
import { ViewType } from '../components/Sidebar';
import { useWealthStore, BusinessLoan } from '../store/useWealthStore';
import { Landmark, Plus, Trash2, ArrowLeft, Percent, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function BusinessDettesView({ onNavigate }: { onNavigate: (v: ViewType) => void }) {
  const business = useWealthStore((state) => state.business);
  const updateBusiness = useWealthStore((state) => state.updateBusiness);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ bankName: '', initialCapital: '', remainingCapital: '', monthlyPayment: '', interestRate: '' });

  // Dynamically calculate totals
  const totalDettes = useMemo(() => {
    return business.loans.reduce((acc, loan) => acc + loan.remainingCapital, 0);
  }, [business.loans]);

  const totalMensualites = useMemo(() => {
    return business.loans.reduce((acc, loan) => acc + loan.monthlyPayment, 0);
  }, [business.loans]);

  const handleDelete = (id: string) => {
    const updatedLoans = business.loans.filter(loan => loan.id !== id);
    const newTotalDettes = updatedLoans.reduce((acc, loan) => acc + loan.remainingCapital, 0);
    
    updateBusiness({ 
      loans: updatedLoans,
      dettes: newTotalDettes 
    });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bankName || !formData.initialCapital || !formData.remainingCapital || !formData.monthlyPayment) return;

    const newLoan: BusinessLoan = {
      id: Math.random().toString(),
      bankName: formData.bankName,
      initialCapital: Number(formData.initialCapital),
      remainingCapital: Number(formData.remainingCapital),
      monthlyPayment: Number(formData.monthlyPayment),
      interestRate: Number(formData.interestRate || 0)
    };

    const updatedLoans = [...business.loans, newLoan];
    const newTotalDettes = updatedLoans.reduce((acc, loan) => acc + loan.remainingCapital, 0);
    
    updateBusiness({ 
      loans: updatedLoans,
      dettes: newTotalDettes 
    });

    setShowAddForm(false);
    setFormData({ bankName: '', initialCapital: '', remainingCapital: '', monthlyPayment: '', interestRate: '' });
  };

  return (
    <div className="px-6 md:px-10 space-y-12 animate-in fade-in duration-1000 pb-20 w-full max-w-6xl mx-auto pt-8">
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
               Dettes & Crédits
             </h2>
             <p className="text-space-gray tracking-wide">
               Passifs, amortissements et charges financières
             </p>
           </div>
           <div className="text-left md:text-right">
             <p className="text-[10px] uppercase tracking-widest text-[#34C759] mb-1">Capital Restant Total (Dettes)</p>
             <p className="text-3xl md:text-4xl font-light text-white tracking-tight">{totalDettes.toLocaleString('fr-FR')} <span className="text-lg text-space-gray">MAD</span></p>
           </div>
        </div>
      </div>

      {/* Charge Mensuelle Banner */}
      <div className="glass-card p-6 md:p-8 rounded-[32px] flex flex-col md:flex-row items-start md:items-center justify-between border-l-4 border-l-[#34C759]">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="w-12 h-12 rounded-full bg-[#34C759]/10 flex items-center justify-center text-[#34C759]">
            <Calculator size={24} />
          </div>
          <div>
            <h3 className="text-base text-white font-medium">Charge Mensuelle Globale</h3>
            <p className="text-sm font-light text-space-gray">Total des mensualités à décaisser (Cashflow sortant)</p>
          </div>
        </div>
        <div className="text-left md:text-right">
          <p className="text-3xl font-bold text-white tracking-tight">{totalMensualites.toLocaleString('fr-FR')} <span className="text-sm font-light text-space-gray">MAD / mois</span></p>
        </div>
      </div>

      <div className="glass-card rounded-[32px] overflow-hidden flex flex-col min-h-[400px]">
         {/* Toolbar */}
         <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-black/20">
            <div className="flex items-center gap-3">
               <Landmark className="text-space-gray" size={20} />
               <h3 className="text-white font-medium text-lg">Liste des Emprunts</h3>
            </div>
            <button onClick={() => setShowAddForm(true)} className="w-full md:w-auto py-2.5 px-6 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 hover:border-white/20 transition-all flex justify-center items-center gap-2 active:scale-95">
               <Plus size={16} /> Ajouter Emprunt
            </button>
         </div>

         {/* Items List */}
         <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
            <AnimatePresence>
               {business.loans.length === 0 ? (
                  <div className="py-20 text-center text-space-gray font-light">Aucune dette ou crédit enregistré.</div>
               ) : (
                  business.loans.map(loan => {
                    const repaid = loan.initialCapital - loan.remainingCapital;
                    const progress = Math.max(0, Math.min(100, (repaid / loan.initialCapital) * 100));
                    
                    return (
                     <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={loan.id}
                        className="p-5 md:p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-colors relative group overflow-hidden"
                     >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                           
                           <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                 <h4 className="text-lg font-medium text-white">{loan.bankName}</h4>
                                 <span className="flex items-center gap-1 text-[10px] font-bold text-[#34C759] uppercase tracking-widest bg-[#34C759]/10 px-2 py-0.5 rounded-full border border-[#34C759]/20">
                                   <Percent size={10} /> {loan.interestRate}%
                                 </span>
                              </div>
                              <p className="text-sm font-light text-space-gray mb-4">Capital Initial: {loan.initialCapital.toLocaleString('fr-FR')} MAD</p>
                              
                              {/* Progress bar */}
                              <div className="space-y-2 max-w-md">
                                <div className="flex justify-between text-xs">
                                  <span className="text-[#34C759] font-medium">{progress.toFixed(1)}% remboursé</span>
                                  <span className="text-space-gray">Reste: {loan.remainingCapital.toLocaleString('fr-FR')}</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                  <motion.div 
                                    className="h-full bg-[#34C759] rounded-full" 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                  />
                                </div>
                              </div>
                           </div>

                           <div className="flex items-center justify-between md:justify-end gap-6 md:min-w-[250px]">
                              <div className="text-left md:text-right">
                                <p className="text-[10px] uppercase tracking-widest text-space-gray mb-1">Échéance Mensuelle</p>
                                <p className="text-2xl font-bold text-white">{loan.monthlyPayment.toLocaleString('fr-FR')} <span className="text-sm text-space-gray font-light">MAD</span></p>
                              </div>
                              <button onClick={() => handleDelete(loan.id)} className="w-10 h-10 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors shrink-0">
                                 <Trash2 size={16} />
                              </button>
                           </div>

                        </div>
                     </motion.div>
                    );
                  })
               )}
            </AnimatePresence>
         </div>
      </div>

      {/* Add Form Modal */}
      <AnimatePresence>
         {showAddForm && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                 onClick={() => setShowAddForm(false)}
               />
               <motion.div 
                 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                 className="bg-[#0A0A0B] border border-white/10 p-8 rounded-[32px] w-full max-w-lg relative z-10 shadow-2xl"
               >
                  <h3 className="text-2xl text-white font-light mb-6 text-center">Ajouter un Emprunt</h3>
                  <form onSubmit={handleAdd} className="space-y-4">
                     <div>
                        <label className="text-xs text-space-gray uppercase tracking-widest ml-2 mb-1 block">Organisme & Nom</label>
                        <input required value={formData.bankName} onChange={e=>setFormData({...formData, bankName: e.target.value})} placeholder="ex: Crédit du Maroc - Leasing Auto" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs text-space-gray uppercase tracking-widest ml-2 mb-1 block">Capital Initial</label>
                           <input required type="number" step="0.01" min="0" value={formData.initialCapital} onChange={e=>setFormData({...formData, initialCapital: e.target.value})} placeholder="MAD" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                        </div>
                        <div>
                           <label className="text-xs text-space-gray uppercase tracking-widest ml-2 mb-1 block">Capital Restant</label>
                           <input required type="number" step="0.01" min="0" value={formData.remainingCapital} onChange={e=>setFormData({...formData, remainingCapital: e.target.value})} placeholder="MAD" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs text-space-gray uppercase tracking-widest ml-2 mb-1 block">Mensualité</label>
                           <input required type="number" step="0.01" min="0" value={formData.monthlyPayment} onChange={e=>setFormData({...formData, monthlyPayment: e.target.value})} placeholder="MAD/mois" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                        </div>
                        <div>
                           <label className="text-xs text-space-gray uppercase tracking-widest ml-2 mb-1 block">Taux d'Intérêt (%)</label>
                           <input required type="number" step="0.01" min="0" value={formData.interestRate} onChange={e=>setFormData({...formData, interestRate: e.target.value})} placeholder="4.5" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                        </div>
                     </div>
                     <div className="flex gap-4 mt-8 pt-4">
                        <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-all">Annuler</button>
                        <button type="submit" className="flex-1 bg-[#34C759] text-midnight font-bold py-3 rounded-xl hover:bg-[#34C759]/90 transition-all shadow-[0_0_15px_rgba(52,199,89,0.3)]">Ajouter</button>
                     </div>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
}
