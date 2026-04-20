import { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Pencil, Trash2, Plus } from 'lucide-react';
import { ViewType } from '../components/Sidebar';
import { useWealthStore } from '../store/useWealthStore';

export default function BourseView({ onNavigate }: { onNavigate: (v: ViewType) => void }) {
  const particulier = useWealthStore(state => state.particulier);
  const updateParticulier = useWealthStore(state => state.updateParticulier);
  
  const [showAdd, setShowAdd] = useState(false);

  // Add state
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editQty, setEditQty] = useState('');
  const [editPrice, setEditPrice] = useState('');

  const bourseAssets = particulier.listeActifs
    .filter(a => a.category === 'Bourse')
    .sort((a, b) => b.value - a.value); // Sort descending by value

  const calculateTotal = (assets: any[]) => {
    return assets.reduce((acc, curr) => acc + curr.value, 0);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newQty || !newPrice) return;
    
    const qtyNum = Number(newQty);
    const priceNum = Number(newPrice);
    const value = qtyNum * priceNum;
    
    const newAsset = {
      id: Math.random().toString(),
      category: 'Bourse',
      name: newName,
      qty: qtyNum,
      price: priceNum,
      value: value,
      points: "M0,25 C20,20 40,30 60,15 S80,20 100,5" // default sparkline
    };
    
    const updatedActifs = [...particulier.listeActifs, newAsset];
    const newBourseTotal = updatedActifs.filter(a => a.category === 'Bourse').reduce((acc, a) => acc + a.value, 0);

    updateParticulier({
      listeActifs: updatedActifs,
      bourse: newBourseTotal
    });
    
    setShowAdd(false);
    setNewName('');
    setNewQty('');
    setNewPrice('');
  };

  const startEditing = (asset: any) => {
    setEditingId(asset.id);
    setEditName(asset.name);
    setEditQty(asset.qty?.toString() || '0');
    setEditPrice(asset.price?.toString() || '0');
  };

  const handleSaveEdit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    const qtyNum = Number(editQty);
    const priceNum = Number(editPrice);
    const valueNum = qtyNum * priceNum;

    const updatedActifs = particulier.listeActifs.map(a => 
      a.id === id ? { ...a, name: editName, qty: qtyNum, price: priceNum, value: valueNum } : a
    );
    const newBourseTotal = updatedActifs.filter(a => a.category === 'Bourse').reduce((acc, a) => acc + a.value, 0);

    updateParticulier({
      listeActifs: updatedActifs,
      bourse: newBourseTotal
    });
    setEditingId(null);
  };

  const deleteAsset = (id: string) => {
    const updatedActifs = particulier.listeActifs.filter(a => a.id !== id);
    const newBourseTotal = updatedActifs.filter(a => a.category === 'Bourse').reduce((acc, a) => acc + a.value, 0);
    
    updateParticulier({
      listeActifs: updatedActifs,
      bourse: newBourseTotal
    });
  };

  const totalValue = calculateTotal(bourseAssets);

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
          <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-white">
            Détails Bourse
          </h2>
          <div className="text-left md:text-right">
            <p className="text-[10px] uppercase tracking-widest text-space-gray mb-1">Valorisation Totale</p>
            <p className="text-2xl font-light text-white tracking-tight">{totalValue.toLocaleString('fr-FR')} MAD</p>
          </div>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[24px] space-y-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 mt-8">
           <h3 className="text-white font-medium mb-4 tracking-wide">Ajouter une nouvelle Action</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <input required value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Nom (Ex: Maroc Telecom)" className="col-span-1 md:col-span-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light transition-colors focus:border-[#34C759]/50" />
             <input required type="number" value={newQty} onChange={e=>setNewQty(e.target.value)} placeholder="Quantité" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light transition-colors focus:border-[#34C759]/50" />
             <input required type="number" step="0.01" value={newPrice} onChange={e=>setNewPrice(e.target.value)} placeholder="Cours Unitaire (MAD)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light transition-colors focus:border-[#34C759]/50" />
             <button type="submit" className="w-full bg-white text-midnight font-bold py-3 rounded-xl hover:bg-neutral-200 active:scale-[0.98] transition-all">Ajouter l'action</button>
           </div>
        </form>
      )}

      {/* Holdings Table */}
      <div className="mt-8 w-full space-y-4">
        {/* Table Header */}
        <div className="grid grid-cols-5 md:grid-cols-6 gap-4 px-8 py-2">
          <div className="col-span-2 text-[10px] uppercase tracking-widest text-space-gray font-bold">Valeur (Action)</div>
          <div className="text-[10px] uppercase tracking-widest text-space-gray font-bold text-right hidden md:block">Quantité</div>
          <div className="text-[10px] uppercase tracking-widest text-space-gray font-bold text-right hidden md:block">Cours (MAD)</div>
          <div className="col-span-2 text-[10px] uppercase tracking-widest text-space-gray font-bold text-right md:pr-10">Total (MAD)</div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col gap-3">
          {bourseAssets.length === 0 && !showAdd && (
            <div className="text-center p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[16px]">
              <p className="text-space-gray font-light">Aucune action dans votre portefeuille.</p>
            </div>
          )}

          {bourseAssets.map((asset) => {
            if (editingId === asset.id) {
              return (
                <form key={asset.id} onSubmit={(e) => handleSaveEdit(e, asset.id)} className="bg-white/5 backdrop-blur-xl border border-[#34C759] p-6 rounded-[16px] space-y-4 animate-in fade-in transition-all duration-300 shadow-[0_0_20px_rgba(52,199,89,0.1)]">
                   <h3 className="text-[#34C759] font-medium tracking-wide">Modifier {asset.name}</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <input required value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Nom" className="col-span-1 md:col-span-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                     <input required type="number" value={editQty} onChange={e=>setEditQty(e.target.value)} placeholder="Quantité" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                     <input required type="number" step="0.01" value={editPrice} onChange={e=>setEditPrice(e.target.value)} placeholder="Cours (MAD)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                   </div>
                   <div className="flex gap-4">
                     <button type="submit" className="flex-1 bg-[#34C759] text-midnight font-bold py-3 rounded-xl hover:bg-[#34C759]/90 transition-all active:scale-[0.98]">Enregistrer</button>
                     <button type="button" onClick={() => setEditingId(null)} className="flex-1 bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-all active:scale-[0.98]">Annuler</button>
                   </div>
                </form>
              );
            }

            const isPositive = true; // default positive for visually pleasing, could be dynamic
            const change = "+2.1%";

            return (
              <div 
                key={asset.id} 
                className="grid grid-cols-5 md:grid-cols-6 gap-4 px-4 py-4 md:px-8 md:py-6 items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-[16px] transition-all duration-300 hover:bg-white/10 hover:border-[#34C759]/50 group relative"
              >
                <div className="col-span-2 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/80 shrink-0">
                    <span className="text-xs font-light">{asset.name.substring(0, 3).toUpperCase()}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium md:font-light text-sm md:text-base tracking-wide mb-1 leading-tight">{asset.name}</h4>
                    <p className="text-[9px] md:text-[10px] tracking-widest uppercase font-bold text-space-gray">Bourse de Casablanca</p>
                  </div>
                </div>

                <div className="text-right text-white font-bold text-base md:text-lg hidden md:block">
                  {asset.qty}
                </div>

                <div className="text-right text-white font-bold text-base md:text-lg hidden md:block">
                  {asset.price?.toFixed(2)}
                </div>

                <div className="col-span-3 md:col-span-2 text-right flex items-center justify-end gap-2 md:gap-6 flex-1 md:pr-10">
                  <div className="flex flex-col items-end mr-4 md:mr-0">
                     <span className="text-white font-bold text-base md:text-lg">{(asset.value).toLocaleString('fr-FR')} MAD</span>
                     <div className={`flex items-center gap-1 font-medium text-[10px] md:text-sm mt-0.5 ${isPositive ? 'text-[#34C759]' : 'text-red-500'}`}>
                       {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                       <span className="tracking-wide hidden md:inline">{asset.qty}x {asset.price} MAD</span>
                     </div>
                  </div>

                  {/* Sparkline (Desktop Only for space) */}
                  <div className="hidden lg:block w-16 opacity-50 group-hover:opacity-100 transition-opacity">
                    <svg viewBox="0 0 100 30" className={`w-full h-8 fill-none ${isPositive ? 'stroke-[#34C759] drop-shadow-[0_0_8px_rgba(52,199,89,0.4)]' : 'stroke-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`}>
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d={asset.points || "M0,25 C20,20 40,30 60,15 S80,20 100,5"} />
                    </svg>
                  </div>
                  
                </div>
                
                {/* Overlay Actions */}
                <div className="absolute right-0 top-0 bottom-0 pr-4 md:pr-8 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 bg-gradient-to-l from-midnight via-midnight/80 to-transparent pl-12 rounded-r-[16px]">
                    <button onClick={() => startEditing(asset)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 hover:text-[#34C759] hover:bg-white/20 hover:border-[#34C759]/50 transition-all active:scale-[0.90]">
                      <Pencil size={16} strokeWidth={1.5} />
                    </button>
                    <button onClick={() => deleteAsset(asset.id)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 hover:text-red-500 hover:bg-white/20 hover:border-red-500/50 transition-all active:scale-[0.90]">
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
        <div className="flex justify-center mt-12">
          <button onClick={() => setShowAdd(true)} className="flex items-center justify-center gap-3 w-full max-w-md py-4 px-6 rounded-[20px] bg-white/5 backdrop-blur-xl border border-[#34C759]/30 hover:border-[#34C759] shadow-[inset_0_1px_4px_rgba(255,255,255,0.02),0_0_15px_rgba(52,199,89,0.1)] hover:shadow-[0_0_25px_rgba(52,199,89,0.25)] transition-all duration-500 group active:scale-[0.98]">
            <div className="text-[#34C759] drop-shadow-[0_0_8px_rgba(52,199,89,0.8)] group-hover:scale-110 transition-transform">
               <Plus size={20} className="stroke-[2.5px]" />
            </div>
            <span className="text-white font-bold tracking-wide uppercase text-sm">Ajouter une Action</span>
          </button>
        </div>
      )}
    </div>
  );
}
