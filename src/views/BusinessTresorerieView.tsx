import React, { useState } from 'react';
import { Building2, Banknote, ArrowLeft, Pencil } from 'lucide-react';
import { ViewType } from '../components/Sidebar';
import { useWealthStore } from '../store/useWealthStore';
import { motion, AnimatePresence } from 'motion/react';

export default function BusinessTresorerieView({ onNavigate }: { onNavigate: (v: ViewType) => void }) {
  const business = useWealthStore(state => state.business);
  const updateBusiness = useWealthStore(state => state.updateBusiness);

  const [editMode, setEditMode] = useState<null | 'comptes' | 'caisse'>(null);
  const [val, setVal] = useState('');

  const handleEdit = (mode: 'comptes' | 'caisse') => {
    setEditMode(mode);
    setVal(mode === 'comptes' ? business.comptesBancaires.toString() : business.caisse.toString());
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericVal = Number(val) || 0;
    
    if (editMode === 'comptes') {
      const newTotal = numericVal + business.caisse;
      updateBusiness({ comptesBancaires: numericVal, tresorerie: newTotal });
    } else if (editMode === 'caisse') {
      const newTotal = business.comptesBancaires + numericVal;
      updateBusiness({ caisse: numericVal, tresorerie: newTotal });
    }
    
    setEditMode(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 px-6 md:px-10 pt-8 pb-20 w-full max-w-6xl mx-auto">
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
               Détails Trésorerie
             </h2>
             <p className="text-space-gray tracking-wide">
               Structure des liquidités de l'entreprise
             </p>
           </div>
           <div className="text-left md:text-right">
             <p className="text-[10px] uppercase tracking-widest text-space-gray mb-1">Trésorerie Globale</p>
             <p className="text-3xl md:text-4xl font-light text-white tracking-tight">{business.tresorerie.toLocaleString('fr-FR')} <span className="text-lg text-space-gray">MAD</span></p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Comptes Bancaires Card */}
         <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[32px] group hover:border-[#34C759]/50 transition-colors relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div className="absolute right-0 top-0 w-32 h-32 bg-[#34C759]/5 rounded-bl-full blur-2xl pointer-events-none" />
            
            <div className="flex justify-between items-start z-10 relative">
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:text-[#34C759] transition-colors border border-white/10">
                  <Building2 size={32} strokeWidth={1} />
               </div>
               <button onClick={() => handleEdit('comptes')} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-space-gray hover:text-white transition-colors">
                  <Pencil size={16} />
               </button>
            </div>

            <div className="z-10 relative mt-8">
               <h3 className="text-xl font-light text-space-gray mb-2">Comptes Bancaires</h3>
               <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  {business.comptesBancaires.toLocaleString('fr-FR')} <span className="text-xl font-light text-space-gray">MAD</span>
               </p>
            </div>
         </div>

         {/* Caisse Card */}
         <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[32px] group hover:border-[#34C759]/50 transition-colors relative overflow-hidden flex flex-col justify-between min-h-[300px]">
             <div className="absolute left-0 bottom-0 w-32 h-32 bg-[#34C759]/5 rounded-tr-full blur-2xl pointer-events-none" />
             
             <div className="flex justify-between items-start z-10 relative">
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:text-[#34C759] transition-colors border border-white/10">
                  <Banknote size={32} strokeWidth={1} />
               </div>
               <button onClick={() => handleEdit('caisse')} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-space-gray hover:text-white transition-colors">
                  <Pencil size={16} />
               </button>
            </div>

            <div className="z-10 relative mt-8">
               <h3 className="text-xl font-light text-space-gray mb-2">Caisse / Cash liquide</h3>
               <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  {business.caisse.toLocaleString('fr-FR')} <span className="text-xl font-light text-space-gray">MAD</span>
               </p>
            </div>
         </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
         {editMode && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                 onClick={() => setEditMode(null)}
               />
               <motion.div 
                 initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                 className="bg-[#0A0A0B] border border-white/10 p-8 rounded-[32px] w-full max-w-md relative z-10 shadow-2xl"
               >
                  <h3 className="text-2xl text-white font-light text-center mb-2">Modifier le solde</h3>
                  <p className="text-center text-space-gray mb-8">
                     {editMode === 'comptes' ? 'Comptes Bancaires' : 'Caisse / Cash liquide'}
                  </p>
                  
                  <form onSubmit={saveEdit} className="space-y-6">
                     <div>
                        <label className="text-xs text-space-gray uppercase tracking-widest ml-2 mb-1 block">Nouveau Montant (MAD)</label>
                        <input 
                          required 
                          type="number" 
                          step="0.01" 
                          value={val} 
                          onChange={e=>setVal(e.target.value)} 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-xl outline-none font-light focus:border-[#34C759]/50 transition-colors text-center" 
                          autoFocus
                        />
                     </div>
                     <div className="flex gap-4">
                        <button type="button" onClick={() => setEditMode(null)} className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/10 transition-all">Annuler</button>
                        <button type="submit" className="flex-1 bg-[#34C759] text-midnight font-bold py-4 rounded-xl hover:bg-[#34C759]/90 transition-all shadow-[0_0_15px_rgba(52,199,89,0.3)]">Sauvegarder</button>
                     </div>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
}
