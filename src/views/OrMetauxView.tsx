import React, { useState } from 'react';
import { ArrowLeft, Gem, Plus, Pencil, Trash2 } from 'lucide-react';
import { ViewType } from '../components/Sidebar';
import { useWealthStore } from '../store/useWealthStore';

export default function OrMetauxView({ onNavigate }: { onNavigate: (v: ViewType) => void }) {
  const particulier = useWealthStore(state => state.particulier);
  const updateParticulier = useWealthStore(state => state.updateParticulier);
  
  const [showAdd, setShowAdd] = useState(false);

  // Add state
  const [newName, setNewName] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newQty, setNewQty] = useState(''); // e.g. weight in grams
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editQty, setEditQty] = useState('');

  const assets = particulier.listeActifs.filter(a => a.category === 'Or');
  const sortedAssets = [...assets].sort((a, b) => b.value - a.value);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newValue || !newQty) return;
    
    const valueNum = Number(newValue);
    const qtyNum = Number(newQty);
    
    const newAsset = {
      id: Math.random().toString(),
      category: 'Or',
      name: newName,
      status: newStatus,
      value: valueNum,
      qty: qtyNum,
    };
    
    const updatedActifs = [...particulier.listeActifs, newAsset];
    const newTotal = updatedActifs.filter(a => a.category === 'Or').reduce((acc, a) => acc + a.value, 0);

    updateParticulier({
      listeActifs: updatedActifs,
      or: newTotal
    });
    
    setShowAdd(false);
    setNewName('');
    setNewStatus('');
    setNewValue('');
    setNewQty('');
  };

  const startEditing = (asset: any) => {
    setEditingId(asset.id);
    setEditName(asset.name);
    setEditStatus(asset.status || '');
    setEditValue(asset.value.toString());
    setEditQty(asset.qty?.toString() || '');
  };

  const handleSaveEdit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    const valueNum = Number(editValue);
    const qtyNum = Number(editQty);
    
    const updatedActifs = particulier.listeActifs.map(a => 
      a.id === id ? { ...a, name: editName, status: editStatus, value: valueNum, qty: qtyNum } : a
    );
    const newTotal = updatedActifs.filter(a => a.category === 'Or').reduce((acc, a) => acc + a.value, 0);

    updateParticulier({
      listeActifs: updatedActifs,
      or: newTotal
    });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const updatedActifs = particulier.listeActifs.filter(a => a.id !== id);
    const newTotal = updatedActifs.filter(a => a.category === 'Or').reduce((acc, a) => acc + a.value, 0);
    
    updateParticulier({
      listeActifs: updatedActifs,
      or: newTotal
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 px-6 md:px-10 pt-8 pb-20 w-full max-w-4xl mx-auto">
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
               Or & Métaux Précieux
             </h2>
             <p className="text-space-gray tracking-wide flex items-center gap-2">
               <Gem className="text-[#34C759]" size={16} /> Portfolio de commodités physiques
             </p>
           </div>
           <div className="text-left md:text-right">
             <p className="text-[10px] uppercase tracking-widest text-space-gray mb-1">Valeur Totale Évaluée</p>
             <p className="text-3xl md:text-4xl font-light text-white tracking-tight">{particulier.or.toLocaleString('fr-FR')} <span className="text-lg text-space-gray">MAD</span></p>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        {showAdd && (
          <form onSubmit={handleAdd} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[24px] space-y-4 animate-in fade-in slide-in-from-top-4">
             <h3 className="text-white font-medium mb-4 tracking-wide">Ajouter un actif (Métal)</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <input required value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Nom (Ex: Lingot Or)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light transition-colors focus:border-[#34C759]/50" />
               <input required value={newStatus} onChange={e=>setNewStatus(e.target.value)} placeholder="Pureté (Ex: 24K)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light transition-colors focus:border-[#34C759]/50" />
               <input required type="number" step="any" value={newQty} onChange={e=>setNewQty(e.target.value)} placeholder="Poids (Grammes)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light transition-colors focus:border-[#34C759]/50" />
               <input required type="number" step="0.01" value={newValue} onChange={e=>setNewValue(e.target.value)} placeholder="Valeur Estimate (MAD)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light transition-colors focus:border-[#34C759]/50" />
             </div>
             <button type="submit" className="w-full mt-4 bg-[#34C759] text-midnight font-bold py-3 rounded-xl hover:bg-[#34C759]/90 active:scale-[0.98] transition-all">Enregistrer Actif</button>
          </form>
        )}

        <div className="flex flex-col gap-4">
          {sortedAssets.length === 0 && !showAdd && (
            <div className="text-center p-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px]">
               <p className="text-space-gray font-light">Aucun métal précieux enregistré (0 MAD).</p>
            </div>
          )}

          {sortedAssets.map((asset) => {
             if (editingId === asset.id) {
               return (
                 <form key={asset.id} onSubmit={(e) => handleSaveEdit(e, asset.id)} className="bg-white/5 backdrop-blur-xl border border-[#34C759] p-6 lg:p-8 rounded-[24px] space-y-4 animate-in fade-in transition-all duration-300 shadow-[0_0_20px_rgba(52,199,89,0.1)]">
                    <h3 className="text-[#34C759] font-medium tracking-wide">Modifier l'actif</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <input required value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Nom" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                      <input required value={editStatus} onChange={e=>setEditStatus(e.target.value)} placeholder="Pureté (Ex: 24K)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                      <input required type="number" step="any" value={editQty} onChange={e=>setEditQty(e.target.value)} placeholder="Poids (Grammes)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                      <input required type="number" step="0.01" value={editValue} onChange={e=>setEditValue(e.target.value)} placeholder="Valeur Estimate (MAD)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                    </div>
                    <div className="flex gap-4">
                      <button type="submit" className="flex-1 bg-[#34C759] text-midnight font-bold py-3 rounded-xl hover:bg-[#34C759]/90 transition-all active:scale-[0.98]">Enregistrer</button>
                      <button type="button" onClick={() => setEditingId(null)} className="flex-1 bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-all active:scale-[0.98]">Annuler</button>
                    </div>
                 </form>
               );
             }

             return (
               <div key={asset.id} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[24px] group hover:bg-white/10 hover:border-[#34C759]/50 transition-all cursor-default relative overflow-hidden flex flex-col justify-between active:scale-[0.98]">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-4 md:gap-0">
                   <div className="flex items-center gap-6">
                     <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <Gem size={20} className="text-[#34C759]" strokeWidth={1} />
                     </div>
                     <div>
                       <h4 className="text-white font-medium text-lg mb-1">{asset.name}</h4>
                       <div className="flex items-center gap-3 text-xs tracking-wide">
                          <span className="text-space-gray">{asset.status}</span>
                          <span className="w-1 h-1 rounded-full bg-white/20" />
                          <span className="text-white/60">{asset.qty} g</span>
                       </div>
                     </div>
                   </div>
                   <div className="text-left md:text-right pr-0 md:pr-16 w-full md:w-auto mt-4 md:mt-0">
                     <span className="text-2xl font-light text-white tracking-tight">{asset.value.toLocaleString('fr-FR')} MAD</span>
                   </div>
                 </div>
                 
                 {/* Hover Actions */}
                 <div className="absolute right-0 top-0 bottom-0 pr-4 md:pr-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 bg-gradient-to-l from-midnight via-midnight/80 to-transparent pl-12 rounded-r-[24px]">
                     <button onClick={() => startEditing(asset)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 hover:text-[#34C759] hover:bg-white/20 hover:border-[#34C759]/50 transition-all active:scale-[0.90]">
                       <Pencil size={16} strokeWidth={1.5} />
                     </button>
                     <button onClick={() => handleDelete(asset.id)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 hover:text-red-500 hover:bg-white/20 hover:border-red-500/50 transition-all active:scale-[0.90]">
                       <Trash2 size={16} strokeWidth={1.5} />
                     </button>
                 </div>
               </div>
             );
          })}
        </div>
      </div>

      {/* Action Button */}
      {!showAdd && (
        <div className="flex justify-center mt-12 pb-10">
          <button onClick={() => setShowAdd(true)} className="flex items-center justify-center gap-3 w-full max-w-md py-4 px-6 rounded-[20px] bg-white/5 backdrop-blur-xl border border-[#34C759]/30 hover:border-[#34C759] shadow-[inset_0_1px_4px_rgba(255,255,255,0.02),0_0_15px_rgba(52,199,89,0.1)] hover:shadow-[0_0_25px_rgba(52,199,89,0.25)] transition-all duration-500 group active:scale-[0.98]">
            <div className="text-[#34C759] drop-shadow-[0_0_8px_rgba(52,199,89,0.8)] group-hover:scale-110 transition-transform">
               <Plus size={20} className="stroke-[2.5px]" />
            </div>
            <span className="text-white font-bold tracking-wide uppercase text-sm">Ajouter un achat de métal</span>
          </button>
        </div>
      )}
    </div>
  );
}
