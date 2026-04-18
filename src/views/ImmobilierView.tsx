import { useState } from 'react';
import { useWealthStore } from '../store/useWealthStore';
import { ArrowLeft, Plus } from 'lucide-react';
import { ViewType } from '../components/Sidebar';

export default function ImmobilierView({ onNavigate }: { onNavigate: (v: ViewType) => void }) {
  const particulier = useWealthStore(state => state.particulier);
  const updateParticulier = useWealthStore(state => state.updateParticulier);
  const [showAdd, setShowAdd] = useState(false);

  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('Loué');

  const immoAssets = particulier.listeActifs.filter(a => a.category === 'Immobilier');

  const handleAdd = (e: any) => {
    e.preventDefault();
    if (!name || !value) return;
    
    const valObj = Number(value);
    
    // Add logic
    const newAsset = { id: Math.random().toString(), category: 'Immobilier', name, value: valObj, status };
    updateParticulier({
      listeActifs: [...particulier.listeActifs, newAsset],
      immobilier: particulier.immobilier + valObj
    });
    
    setShowAdd(false);
    setName('');
    setValue('');
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 px-6 md:px-10 pt-8 pb-20 max-w-6xl mx-auto">
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
             <span className="text-2xl text-neon-mint font-medium">{Number(particulier.immobilier).toLocaleString('fr-FR')} MAD</span>
           </div>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white/[0.02] border border-[#1A1A1A] p-6 rounded-[24px] space-y-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4">
           <h3 className="text-white font-medium mb-4">Ajouter un nouveau bien</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Nom du bien (Ex: Appartement Rabat)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" />
             <input required type="number" value={value} onChange={e=>setValue(e.target.value)} placeholder="Valeur (MAD)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" />
           </div>
           <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none appearance-none">
              <option value="Loué" className="bg-midnight text-white">Loué</option>
              <option value="Résidence Principale" className="bg-midnight text-white">Résidence Principale</option>
              <option value="Nu / Terrain" className="bg-midnight text-white">Nu / Terrain</option>
           </select>
           <button type="submit" className="w-full bg-white text-midnight font-bold py-3 rounded-xl hover:bg-neutral-200">Ajouter le bien</button>
        </form>
      )}

      {/* Assets List */}
      <div className="max-w-4xl mx-auto space-y-8 mt-12 grid grid-cols-1 gap-6">
         {immoAssets.length === 0 && !showAdd && (
           <div className="text-center p-12 bg-white/[0.02] border border-[#1A1A1A] rounded-[24px]">
              <p className="text-space-gray">Vous n'avez aucun bien immobilier configuré.</p>
           </div>
         )}
         
         {immoAssets.map((asset: any) => (
           <div key={asset.id} className="relative overflow-hidden rounded-3xl h-[300px] border border-white/5 group bg-white/[0.02]">
              <img 
                 src={`https://picsum.photos/seed/${asset.name.replace(/\s/g, '')}/1200/800`}
                 alt={asset.name} 
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-[0.7] opacity-60"
                 referrerPolicy="no-referrer"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/40 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 p-6 glass-card rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 backdrop-blur-xl border border-white/10">
                 <div>
                    <h3 className="text-xl md:text-2xl font-light text-white mb-2">{asset.name}</h3>
                    <div className="flex items-center gap-3">
                       <span className={`px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase ${
                         asset.status === 'Loué' ? 'bg-neon-mint/10 text-neon-mint' : 
                         asset.status === 'Résidence Principale' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-500'
                       }`}>
                          {asset.status || 'Immobilier'}
                       </span>
                    </div>
                 </div>
                 
                 <div className="text-left md:text-right">
                    <p className="text-[10px] uppercase tracking-widest text-space-gray mb-1 font-bold">Valeur Estimée</p>
                    <p className="text-3xl font-medium text-white tracking-tight">{Number(asset.value).toLocaleString('fr-FR')} <span className="text-lg">MAD</span></p>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* Action Button */}
      {!showAdd && (
        <div className="flex justify-center mt-12">
          <button onClick={() => setShowAdd(true)} className="flex items-center justify-center gap-3 w-full max-w-md py-4 px-6 rounded-[20px] bg-white/[0.02] backdrop-blur-xl border border-neon-mint/30 hover:border-neon-mint shadow-[0_0_15px_rgba(52,199,89,0.1)] hover:shadow-[0_0_25px_rgba(52,199,89,0.25)] transition-all duration-500 group">
            <div className="text-neon-mint drop-shadow-[0_0_8px_rgba(52,199,89,0.8)] group-hover:scale-110 transition-transform">
               <Plus size={20} />
            </div>
            <span className="text-white font-medium tracking-wide">+ Ajouter ou Modifier un Bien</span>
          </button>
        </div>
      )}
    </div>
  );
}
