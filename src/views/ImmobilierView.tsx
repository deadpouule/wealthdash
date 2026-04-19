import { useState } from 'react';
import { useWealthStore } from '../store/useWealthStore';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import { ViewType } from '../components/Sidebar';

export default function ImmobilierView({ onNavigate }: { onNavigate: (v: ViewType) => void }) {
  const particulier = useWealthStore(state => state.particulier);
  const updateParticulier = useWealthStore(state => state.updateParticulier);
  const [showAdd, setShowAdd] = useState(false);

  // Add state
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('Loué');

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editStatus, setEditStatus] = useState('Loué');

  const immoAssets = particulier.listeActifs.filter(a => a.category === 'Immobilier');

  const handleAdd = (e: any) => {
    e.preventDefault();
    if (!name || !value) return;
    
    const valObj = Number(value);
    const newAsset = { id: Math.random().toString(), category: 'Immobilier', name, value: valObj, status };
    
    updateParticulier({
      listeActifs: [...particulier.listeActifs, newAsset],
      immobilier: particulier.immobilier + valObj
    });
    
    setShowAdd(false);
    setName('');
    setValue('');
  };

  const startEditing = (asset: any) => {
    setEditingId(asset.id);
    setEditName(asset.name);
    setEditValue(asset.value.toString());
    setEditStatus(asset.status || 'Loué');
  };

  const handleSaveEdit = (e: any, id: string) => {
    e.preventDefault();
    const valObj = Number(editValue);
    const updatedActifs = particulier.listeActifs.map(a => 
      a.id === id ? { ...a, name: editName, value: valObj, status: editStatus } : a
    );
    const newImmoTotal = updatedActifs.filter(a => a.category === 'Immobilier').reduce((acc, a) => acc + a.value, 0);

    updateParticulier({
      listeActifs: updatedActifs,
      immobilier: newImmoTotal
    });
    setEditingId(null);
  };

  const deleteAsset = (id: string) => {
    const updatedActifs = particulier.listeActifs.filter(a => a.id !== id);
    const newImmoTotal = updatedActifs.filter(a => a.category === 'Immobilier').reduce((acc, a) => acc + a.value, 0);
    
    updateParticulier({
      listeActifs: updatedActifs,
      immobilier: newImmoTotal
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
        <div className="flex justify-between items-end">
           <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-white mb-2">
             Portefeuille Immobilier
           </h2>
           <div className="text-right">
             <span className="text-[10px] text-space-gray tracking-[0.2em] font-bold uppercase mb-1 block">Valeur Globale</span>
             <span className="text-2xl text-[#34C759] font-bold">{Number(particulier.immobilier).toLocaleString('fr-FR')} MAD</span>
           </div>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[24px] space-y-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4">
           <h3 className="text-white font-medium mb-4 tracking-wide">Ajouter un nouveau bien</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Nom du bien (Ex: Appartement Rabat)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light transition-colors focus:border-[#34C759]/50" />
             <input required type="number" value={value} onChange={e=>setValue(e.target.value)} placeholder="Valeur (MAD)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light transition-colors focus:border-[#34C759]/50" />
           </div>
           <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none appearance-none font-light transition-colors focus:border-[#34C759]/50">
              <option value="Loué" className="bg-midnight text-white">Loué</option>
              <option value="Résidence Principale" className="bg-midnight text-white">Résidence Principale</option>
              <option value="Nu / Terrain" className="bg-midnight text-white">Nu / Terrain</option>
           </select>
           <button type="submit" className="w-full bg-white text-midnight font-bold py-3 rounded-xl hover:bg-neutral-200 active:scale-[0.98] transition-all">Ajouter le bien</button>
        </form>
      )}

      {/* Assets List */}
      <div className="max-w-4xl mx-auto space-y-8 mt-12 grid grid-cols-1 gap-6">
         {immoAssets.length === 0 && !showAdd && (
           <div className="text-center p-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px]">
              <p className="text-space-gray font-light">Vous n'avez aucun bien immobilier configuré.</p>
           </div>
         )}
         
         {immoAssets.map((asset: any) => {
           if (editingId === asset.id) {
             return (
               <form key={asset.id} onSubmit={(e) => handleSaveEdit(e, asset.id)} className="bg-white/5 backdrop-blur-xl border border-[#34C759] p-6 md:p-8 rounded-[24px] space-y-5 animate-in fade-in transition-all duration-300 shadow-[0_0_20px_rgba(52,199,89,0.1)]">
                  <h3 className="text-[#34C759] font-medium tracking-wide">Modifier le bien</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Nom du bien" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                    <input required type="number" value={editValue} onChange={e=>setEditValue(e.target.value)} placeholder="Valeur (MAD)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                  </div>
                  <select value={editStatus} onChange={e=>setEditStatus(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none appearance-none font-light focus:border-[#34C759]/50 transition-colors">
                     <option value="Loué" className="bg-midnight">Loué</option>
                     <option value="Résidence Principale" className="bg-midnight">Résidence Principale</option>
                     <option value="Nu / Terrain" className="bg-midnight">Nu / Terrain</option>
                  </select>
                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-[#34C759] text-midnight font-bold py-3 rounded-xl hover:bg-[#34C759]/90 transition-all active:scale-[0.98]">Save</button>
                    <button type="button" onClick={() => setEditingId(null)} className="flex-1 bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-all active:scale-[0.98]">Cancel</button>
                  </div>
               </form>
             );
           }

           return (
             <div key={asset.id} className="relative overflow-hidden rounded-[24px] h-[300px] border border-white/10 group bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-[#34C759]/50">
                <img 
                   src={`https://picsum.photos/seed/${asset.name.replace(/\s/g, '')}/1200/800`}
                   alt={asset.name} 
                   className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-[0.5] opacity-50"
                   referrerPolicy="no-referrer"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/50 to-transparent pointer-events-none" />
                
                {/* Actions (Pencil / Trash) */}
                <div className="absolute top-6 right-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 translate-y-[-10px] group-hover:translate-y-0">
                  <button onClick={() => startEditing(asset)} className="w-10 h-10 rounded-full bg-midnight/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-[#34C759] hover:border-[#34C759]/50 transition-all active:scale-[0.90]">
                    <Pencil size={18} strokeWidth={1.5} />
                  </button>
                  <button onClick={() => deleteAsset(asset.id)} className="w-10 h-10 rounded-full bg-midnight/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-red-500 hover:border-red-500/50 transition-all active:scale-[0.90]">
                    <Trash2 size={18} strokeWidth={1.5} />
                  </button>
                </div>

                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_4px_rgba(255,255,255,0.05)]">
                   <div>
                      <h3 className="text-xl md:text-2xl font-light tracking-wide text-white mb-2">{asset.name}</h3>
                      <div className="flex items-center gap-3">
                         <span className={`px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase ${
                           asset.status === 'Loué' ? 'bg-[#34C759]/10 text-[#34C759]' : 
                           asset.status === 'Résidence Principale' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-500'
                         }`}>
                            {asset.status || 'Immobilier'}
                         </span>
                      </div>
                   </div>
                   
                   <div className="text-left md:text-right">
                      <p className="text-[10px] uppercase tracking-widest text-space-gray mb-1 font-bold">Valeur Estimée</p>
                      <p className="text-3xl font-bold text-white tracking-tight">{Number(asset.value).toLocaleString('fr-FR')} <span className="text-lg font-light">MAD</span></p>
                   </div>
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
            <span className="text-white font-bold tracking-wide uppercase text-sm">Ajouter un Bien</span>
          </button>
        </div>
      )}
    </div>
  );
}
