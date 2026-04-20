import { useState } from 'react';
import { ArrowLeft, Pencil, Trash2, Plus } from 'lucide-react';
import { ViewType } from '../components/Sidebar';
import { useWealthStore } from '../store/useWealthStore';

export default function CryptoDetailView({ onNavigate }: { onNavigate: (v: ViewType) => void }) {
  const particulier = useWealthStore(state => state.particulier);
  const updateParticulier = useWealthStore(state => state.updateParticulier);
  
  const [showAdd, setShowAdd] = useState(false);

  // Add state
  const [newName, setNewName] = useState('');
  const [newSymbol, setNewSymbol] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newValueMAD, setNewValueMAD] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSymbol, setEditSymbol] = useState('');
  const [editQty, setEditQty] = useState('');
  const [editValueMAD, setEditValueMAD] = useState('');

  // Extract crypto assets and ensure we sort them by value descending
  const rawCryptoAssets = particulier.listeActifs.filter(a => a.category === 'Crypto');
  
  // Sort descending
  const cryptos = [...rawCryptoAssets].sort((a, b) => b.value - a.value);

  const totalValue = cryptos.reduce((acc, curr) => acc + curr.value, 0);

  const calculatePercentages = () => {
    if (totalValue === 0) return [];
    return cryptos.map(c => ({
      ...c,
      percentage: (c.value / totalValue) * 100
    }));
  };

  const cryptosWithPercentages = calculatePercentages();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newSymbol || !newQty || !newValueMAD) return;
    
    const value = Number(newValueMAD);
    const newAsset = {
      id: Math.random().toString(),
      category: 'Crypto',
      name: newName,
      status: newSymbol.toUpperCase(), // Using status for symbol
      qty: Number(newQty),
      value: value,
      price: value / Number(newQty), // derived price
      points: "+0.0%" // mockup change
    };
    
    const updatedActifs = [...particulier.listeActifs, newAsset];
    const newCryptoTotal = updatedActifs.filter(a => a.category === 'Crypto').reduce((acc, a) => acc + a.value, 0);

    updateParticulier({
      listeActifs: updatedActifs,
      crypto: newCryptoTotal
    });
    
    setShowAdd(false);
    setNewName('');
    setNewSymbol('');
    setNewQty('');
    setNewValueMAD('');
  };

  const startEditing = (asset: any) => {
    setEditingId(asset.id);
    setEditName(asset.name);
    setEditSymbol(asset.status || '');
    setEditQty(asset.qty?.toString() || '0');
    setEditValueMAD(asset.value.toString());
  };

  const handleSaveEdit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    const valueNum = Number(editValueMAD);
    const qtyNum = Number(editQty);
    
    const updatedActifs = particulier.listeActifs.map(a => 
      a.id === id ? { ...a, name: editName, status: editSymbol.toUpperCase(), qty: qtyNum, value: valueNum, price: valueNum / qtyNum } : a
    );
    const newCryptoTotal = updatedActifs.filter(a => a.category === 'Crypto').reduce((acc, a) => acc + a.value, 0);

    updateParticulier({
      listeActifs: updatedActifs,
      crypto: newCryptoTotal
    });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const updatedActifs = particulier.listeActifs.filter(a => a.id !== id);
    const newCryptoTotal = updatedActifs.filter(a => a.category === 'Crypto').reduce((acc, a) => acc + a.value, 0);
    
    updateParticulier({
      listeActifs: updatedActifs,
      crypto: newCryptoTotal
    });
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
        <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-white mb-2">
          Détails Crypto
        </h2>
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-2xl mx-auto py-6">
        <h2 className="text-4xl md:text-5xl font-extralight tracking-tighter text-white">Actif total : {totalValue.toLocaleString('fr-FR')} MAD</h2>
        
        {/* Simple segmented horizontal bar */}
        {cryptosWithPercentages.length > 0 ? (
          <>
            <div className="h-2 w-full rounded-full overflow-hidden flex shadow-[0_0_20px_rgba(52,199,89,0.1)]">
              {cryptosWithPercentages.map((crypto, index) => {
                // Generate a mix of greens and white opacities for the bar based on index
                const colorClasses = [
                  "bg-[#34C759]",
                  "bg-white/60",
                  "bg-[#34C759]/40",
                  "bg-white/30",
                  "bg-[#34C759]/20",
                  "bg-white/10"
                ];
                const bgClass = colorClasses[index % colorClasses.length];
                return (
                  <div key={crypto.id} className={`h-full ${bgClass}`} style={{ width: `${crypto.percentage}%` }} title={`${crypto.name}: ${crypto.percentage.toFixed(1)}%`} />
                );
              })}
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 items-center text-[10px] uppercase font-bold tracking-widest text-space-gray pt-2">
               {cryptosWithPercentages.slice(0, 4).map((crypto) => (
                 <span key={crypto.id}>{crypto.name} ({crypto.percentage.toFixed(0)}%)</span>
               ))}
               {cryptosWithPercentages.length > 4 && <span>...</span>}
            </div>
          </>
        ) : (
           <div className="h-2 w-full rounded-full bg-white/5" />
        )}
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[24px] space-y-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-top-4 mt-8">
           <h3 className="text-white font-medium mb-4 tracking-wide">Ajouter une Crypto</h3>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <input required value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Nom (Ex: Bitcoin)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light transition-colors focus:border-[#34C759]/50" />
             <input required value={newSymbol} onChange={e=>setNewSymbol(e.target.value)} placeholder="Symbole (Ex: BTC)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light transition-colors focus:border-[#34C759]/50 uppercase" />
             <input required type="number" step="0.000000001" value={newQty} onChange={e=>setNewQty(e.target.value)} placeholder="Quantité" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light transition-colors focus:border-[#34C759]/50" />
             <input required type="number" step="0.01" value={newValueMAD} onChange={e=>setNewValueMAD(e.target.value)} placeholder="Valeur MAD" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light transition-colors focus:border-[#34C759]/50" />
           </div>
           <button type="submit" className="w-full mt-4 bg-white text-midnight font-bold py-3 rounded-xl hover:bg-neutral-200 active:scale-[0.98] transition-all">Ajouter l'actif</button>
        </form>
      )}

      {/* List View */}
      <div className="max-w-4xl mx-auto space-y-4 shadow-[0_0_15px_rgba(0,0,0,0.5)] rounded-[16px]">
        {cryptos.length === 0 && !showAdd && (
          <div className="text-center p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[16px]">
            <p className="text-space-gray font-light">Aucune cryptomonnaie dans votre portefeuille.</p>
          </div>
        )}

        {cryptos.map(crypto => {
          if (editingId === crypto.id) {
            return (
              <form key={crypto.id} onSubmit={(e) => handleSaveEdit(e, crypto.id)} className="bg-white/5 backdrop-blur-xl border border-[#34C759] p-6 rounded-[16px] space-y-4 animate-in fade-in transition-all duration-300 shadow-[0_0_20px_rgba(52,199,89,0.1)]">
                 <h3 className="text-[#34C759] font-medium tracking-wide">Modifier {crypto.name}</h3>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                   <input required value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Nom" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                   <input required value={editSymbol} onChange={e=>setEditSymbol(e.target.value)} placeholder="Symbole" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors uppercase" />
                   <input required type="number" step="0.000000001" value={editQty} onChange={e=>setEditQty(e.target.value)} placeholder="Quantité" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                   <input required type="number" step="0.01" value={editValueMAD} onChange={e=>setEditValueMAD(e.target.value)} placeholder="Valeur (MAD)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                 </div>
                 <div className="flex gap-4">
                   <button type="submit" className="flex-1 bg-[#34C759] text-midnight font-bold py-3 rounded-xl hover:bg-[#34C759]/90 transition-all active:scale-[0.98]">Enregistrer</button>
                   <button type="button" onClick={() => setEditingId(null)} className="flex-1 bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-all active:scale-[0.98]">Annuler</button>
                 </div>
              </form>
            );
          }

          return (
            <div key={crypto.id} className="relative overflow-hidden bg-white/5 backdrop-blur-xl p-4 md:p-6 flex justify-between items-center rounded-[16px] group transition-all duration-300 border border-white/10 hover:bg-white/10 hover:border-[#34C759]/50 active:scale-[0.98]">
               <div className="flex items-center gap-4 flex-1">
                 <div className="w-10 h-10 shrink-0 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white font-bold group-hover:text-[#34C759] transition-colors group-hover:border-[#34C759]/50">
                   {/* Fallback to initials if symbol not present */}
                   {crypto.status ? crypto.status.substring(0, 1).toUpperCase() : crypto.name.substring(0, 1).toUpperCase()}
                 </div>
                 <div>
                   <p className="text-base md:text-lg text-white font-light tracking-wide">{crypto.name} <span className="text-white/50 text-sm ml-1">({crypto.status || ''})</span></p>
                   <p className="text-[10px] tracking-widest uppercase font-bold text-space-gray">{crypto.qty} {crypto.status || ''}</p>
                 </div>
               </div>

               <div className="text-right shrink-0 pr-6 mr-6">
                 <p className="text-lg md:text-xl text-white font-bold">{crypto.value.toLocaleString('fr-FR')} MAD</p>
                 <p className="text-[10px] tracking-widest uppercase text-[#34C759] font-bold">{crypto.points || '+0.0%'}</p>
               </div>
               
               {/* Hover Actions (Overlay on Right) */}
               <div className="absolute right-0 top-0 bottom-0 pr-4 md:pr-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 bg-gradient-to-l from-midnight via-midnight/80 to-transparent pl-12 rounded-r-[16px]">
                   <button onClick={() => startEditing(crypto)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 hover:text-[#34C759] hover:bg-white/20 hover:border-[#34C759]/50 transition-all active:scale-[0.90]">
                     <Pencil size={16} strokeWidth={1.5} />
                   </button>
                   <button onClick={() => handleDelete(crypto.id)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 hover:text-red-500 hover:bg-white/20 hover:border-red-500/50 transition-all active:scale-[0.90]">
                     <Trash2 size={16} strokeWidth={1.5} />
                   </button>
               </div>
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      {!showAdd && (
        <div className="flex justify-center mt-12">
          <button onClick={() => setShowAdd(true)} className="flex items-center justify-center gap-3 w-full max-w-md py-4 px-6 rounded-[20px] bg-white/5 backdrop-blur-xl border border-[#34C759]/30 hover:border-[#34C759] shadow-[inset_0_1px_4px_rgba(255,255,255,0.02),0_0_15px_rgba(52,199,89,0.1)] hover:shadow-[0_0_25px_rgba(52,199,89,0.25)] transition-all duration-500 group active:scale-[0.98]">
            <div className="text-[#34C759] drop-shadow-[0_0_8px_rgba(52,199,89,0.8)] group-hover:scale-110 transition-transform">
               <Plus size={20} className="stroke-[2.5px]" />
            </div>
            <span className="text-white font-bold tracking-wide uppercase text-sm">Ajouter une Crypto</span>
          </button>
        </div>
      )}
    </div>
  );
}
