import React, { useState, useMemo } from 'react';
import { ViewType } from '../components/Sidebar';
import { useWealthStore, StockItem } from '../store/useWealthStore';
import { Package, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function BusinessStockView({ onNavigate }: { onNavigate: (v: ViewType) => void }) {
  const business = useWealthStore((state) => state.business);
  const updateBusiness = useWealthStore((state) => state.updateBusiness);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', qty: '', unitPrice: '' });

  // Calculate total stock value derived from items
  const totalStockValue = useMemo(() => {
    return business.stockItems.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);
  }, [business.stockItems]);

  const handleUpdateQty = (id: string, delta: number) => {
    const updatedItems = business.stockItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    });
    
    const newTotalValue = updatedItems.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);
    
    updateBusiness({ 
      stockItems: updatedItems,
      stock: newTotalValue 
    });
  };

  const handleDelete = (id: string) => {
    const updatedItems = business.stockItems.filter(item => item.id !== id);
    const newTotalValue = updatedItems.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);
    
    updateBusiness({ 
      stockItems: updatedItems,
      stock: newTotalValue 
    });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.qty || !formData.unitPrice) return;

    const newItem: StockItem = {
      id: Math.random().toString(),
      name: formData.name,
      qty: Number(formData.qty),
      unitPrice: Number(formData.unitPrice)
    };

    const updatedItems = [...business.stockItems, newItem];
    const newTotalValue = updatedItems.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);
    
    updateBusiness({ 
      stockItems: updatedItems,
      stock: newTotalValue 
    });

    setShowAddForm(false);
    setFormData({ name: '', qty: '', unitPrice: '' });
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
               Stock & Matériel
             </h2>
             <p className="text-space-gray tracking-wide">
               Inventaire physique et valorisation des immobilisations
             </p>
           </div>
           <div className="text-left md:text-right">
             <p className="text-[10px] uppercase tracking-widest text-space-gray mb-1">Valeur Totale Immobilisée</p>
             <p className="text-3xl md:text-4xl font-light text-white tracking-tight">{totalStockValue.toLocaleString('fr-FR')} <span className="text-lg text-space-gray">MAD</span></p>
           </div>
        </div>
      </div>

      <div className="glass-card rounded-[32px] overflow-hidden flex flex-col min-h-[400px]">
         {/* Toolbar */}
         <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-black/20">
            <div className="flex items-center gap-3">
               <Package className="text-space-gray" size={20} />
               <h3 className="text-white font-medium text-lg">Inventaire Actif</h3>
            </div>
            <button onClick={() => setShowAddForm(true)} className="w-full md:w-auto py-2.5 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all flex justify-center items-center gap-2 active:scale-95">
               <Plus size={16} /> Ajouter Article
            </button>
         </div>

         {/* Desktop Table Header */}
         <div className="hidden md:grid grid-cols-12 gap-4 px-10 py-4 border-b border-white/5 text-xs font-bold text-space-gray uppercase tracking-widest bg-black/10">
            <div className="col-span-4">Article / Description</div>
            <div className="col-span-2 text-center">Prix Unitaire</div>
            <div className="col-span-3 text-center">Quantité</div>
            <div className="col-span-2 text-right">Valeur Totale</div>
            <div className="col-span-1 text-center">Actions</div>
         </div>

         {/* Items List */}
         <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-2">
            <AnimatePresence>
               {business.stockItems.length === 0 ? (
                  <div className="py-20 text-center text-space-gray font-light">L'inventaire est vide.</div>
               ) : (
                  business.stockItems.map(item => (
                     <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={item.id}
                        className="grid grid-cols-1 md:grid-cols-12 gap-y-4 md:gap-y-0 gap-x-4 px-4 py-5 md:py-4 md:items-center bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-white/10 transition-all group relative"
                     >
                        <div className="md:col-span-4 flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-space-gray">
                              <Package size={16} />
                           </div>
                           <span className="text-white font-medium">{item.name}</span>
                        </div>
                        
                        <div className="md:col-span-2 flex justify-between md:justify-center items-center">
                           <span className="md:hidden text-xs text-space-gray uppercase tracking-widest">Prix U.</span>
                           <span className="text-space-gray">{item.unitPrice.toLocaleString('fr-FR')} MAD</span>
                        </div>
                        
                        <div className="md:col-span-3 flex justify-between md:justify-center items-center">
                           <span className="md:hidden text-xs text-space-gray uppercase tracking-widest">Quantité</span>
                           <div className="flex items-center gap-4 bg-black/40 rounded-full px-2 py-1 border border-white/5">
                              <button onClick={() => handleUpdateQty(item.id, -1)} disabled={item.qty === 0} className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white disabled:opacity-30 transition-colors">
                                 <Minus size={12} />
                              </button>
                              <span className="text-white font-bold w-6 text-center">{item.qty}</span>
                              <button onClick={() => handleUpdateQty(item.id, 1)} className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors">
                                 <Plus size={12} />
                              </button>
                           </div>
                        </div>

                        <div className="md:col-span-2 flex justify-between md:justify-end items-center">
                           <span className="md:hidden text-xs text-space-gray uppercase tracking-widest">Total</span>
                           <span className="text-white font-bold">{(item.qty * item.unitPrice).toLocaleString('fr-FR')} MAD</span>
                        </div>

                        <div className="md:col-span-1 flex justify-end md:justify-center items-center pt-2 md:pt-0 mt-2 md:mt-0 border-t border-white/5 md:border-transparent">
                           <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center text-space-gray transition-colors">
                              <Trash2 size={14} />
                           </button>
                        </div>
                     </motion.div>
                  ))
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
                 className="bg-[#0A0A0B] border border-white/10 p-8 rounded-[32px] w-full max-w-md relative z-10 shadow-2xl"
               >
                  <h3 className="text-2xl text-white font-light mb-6 text-center">Ajouter au Stock</h3>
                  <form onSubmit={handleAdd} className="space-y-4">
                     <div>
                        <label className="text-xs text-space-gray uppercase tracking-widest ml-2 mb-1 block">Nom de l'article</label>
                        <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} placeholder="ex: MacBook Pro M3" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-white/30 transition-colors" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs text-space-gray uppercase tracking-widest ml-2 mb-1 block">Quantité Initiale</label>
                           <input required type="number" step="1" min="0" value={formData.qty} onChange={e=>setFormData({...formData, qty: e.target.value})} placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-white/30 transition-colors" />
                        </div>
                        <div>
                           <label className="text-xs text-space-gray uppercase tracking-widest ml-2 mb-1 block">Prix Unitaire (MAD)</label>
                           <input required type="number" step="0.01" min="0" value={formData.unitPrice} onChange={e=>setFormData({...formData, unitPrice: e.target.value})} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-white/30 transition-colors" />
                        </div>
                     </div>
                     <div className="flex gap-4 mt-8 pt-4">
                        <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-all">Annuler</button>
                        <button type="submit" className="flex-1 bg-white text-midnight font-bold py-3 rounded-xl hover:bg-white/90 transition-all">Ajouter</button>
                     </div>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
}
