import { useState } from 'react';
import { useWealthStore } from '../store/useWealthStore';
import { ArrowLeft, Plus, ScanLine, FileText, CheckCircle2 } from 'lucide-react';
import { ViewType } from '../components/Sidebar';
import { WealthEngine } from '../lib/WealthEngine';

interface Props {
  onNavigate: (v: ViewType) => void;
}

export default function SaisieFacturesView({ onNavigate }: Props) {
  const business = useWealthStore(state => state.business);
  const updateBusiness = useWealthStore(state => state.updateBusiness);
  const facts = business.factures || [];

  const [client, setClient] = useState('');
  const [amountHT, setAmountHT] = useState('');
  const [type, setType] = useState<'IN'|'OUT'>('IN');
  const [isScanning, setIsScanning] = useState(false);

  const handleAdd = (e: any) => {
    e.preventDefault();
    if (!client || !amountHT) return;

    const valHT = Number(amountHT);
    const newFacture = {
      id: Math.random().toString(),
      type,
      amountHT: valHT,
      tva: valHT * 0.20,
      client,
      date: new Date().toLocaleDateString('fr-FR')
    };

    const updatedFactures = [...facts, newFacture];
    
    // Simulate real-time impact on Business metrics
    const impact = type === 'IN' ? valHT * 1.20 : -(valHT * 1.20); // TTC impacts Tresorerie
    const newCA = type === 'IN' ? business.chiffreAffairesHT + valHT : business.chiffreAffairesHT;
    const newRes = type === 'IN' ? business.resultatComptable + valHT : business.resultatComptable - valHT;

    updateBusiness({
      factures: updatedFactures,
      tresorerie: business.tresorerie + impact,
      chiffreAffairesHT: newCA,
      resultatComptable: newRes,
      fluxIn: type === 'IN' ? business.fluxIn + impact : business.fluxIn,
      fluxOut: type === 'OUT' ? business.fluxOut + Math.abs(impact) : business.fluxOut
    });

    setClient('');
    setAmountHT('');
  };

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setClient('APPLE STORE MAROC');
      setAmountHT('45000');
      setType('OUT');
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 px-6 md:px-10 pt-8 pb-20 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-space-gray hover:text-white transition-colors text-xs uppercase tracking-widest font-bold mb-6"
          >
            <ArrowLeft size={14} /> Retour
          </button>
          <h2 className="text-3xl md:text-[40px] font-extralight tracking-tight text-white leading-none">
            Saisie & Factures
          </h2>
        </div>
        <button 
          onClick={simulateScan}
          className="flex items-center gap-2 px-6 py-3 bg-neon-mint text-midnight rounded-full text-xs font-bold uppercase tracking-widest hover:brightness-110 shadow-[0_0_15px_rgba(52,199,89,0.3)] transition-all"
        >
           {isScanning ? <span className="animate-pulse">Analyse OCR...</span> : <><ScanLine size={16} /> Scanner Action</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1 bg-white/[0.02] border border-[#1A1A1A] rounded-[24px] p-6 h-fit">
           <h3 className="text-white font-medium mb-6">Ajouter manuellement</h3>
           <form onSubmit={handleAdd} className="space-y-5">
             <div>
                <label className="text-space-gray text-[10px] uppercase tracking-widest mb-2 block font-bold">Client / Fournisseur</label>
                <input required value={client} onChange={e=>setClient(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-mint/50" placeholder="Nom de l'entité" />
             </div>
             <div>
                <label className="text-space-gray text-[10px] uppercase tracking-widest mb-2 block font-bold">Montant HT (MAD)</label>
                <input required type="number" value={amountHT} onChange={e=>setAmountHT(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-mint/50" placeholder="0" />
             </div>
             <div>
                <label className="text-space-gray text-[10px] uppercase tracking-widest mb-2 block font-bold">Type de Flux</label>
                <div className="flex bg-white/5 p-1 rounded-xl">
                  <button type="button" onClick={()=>setType('IN')} className={`flex-1 py-2 text-xs font-bold rounded-lg ${type==='IN'?'bg-neon-mint text-midnight':'text-space-gray'}`}>ENCAISSEMENT</button>
                  <button type="button" onClick={()=>setType('OUT')} className={`flex-1 py-2 text-xs font-bold rounded-lg ${type==='OUT'?'bg-white/10 text-white':'text-space-gray'}`}>DÉCAISSEMENT</button>
                </div>
             </div>
             <button type="submit" className="w-full py-4 bg-white text-midnight font-bold flex items-center justify-center gap-2 rounded-xl mt-4 hover:bg-neutral-200">
               <Plus size={16} /> Enregistrer
             </button>
           </form>
        </div>

        {/* History */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
             <h3 className="text-white font-medium">Historique Récent</h3>
             <span className="text-space-gray text-sm">{facts.length} documents</span>
           </div>
           
           <div className="space-y-3">
             {facts.length === 0 ? (
               <div className="bg-white/[0.01] border border-[#1A1A1A] rounded-[20px] p-10 flex flex-col items-center justify-center text-center">
                 <FileText className="text-space-gray mb-4" size={40} strokeWidth={1} />
                 <p className="text-space-gray font-light">Aucune facture enregistrée pour le moment.</p>
               </div>
             ) : (
               [...facts].reverse().map((f) => (
                 <div key={f.id} className="bg-white/[0.02] border border-[#1A1A1A] rounded-[16px] p-5 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center ${f.type === 'IN' ? 'bg-neon-mint/10 text-neon-mint' : 'bg-red-500/10 text-red-500'}`}>
                        {f.type === 'IN' ? <Plus size={16} /> : <span className="text-lg leading-none mb-1">-</span>}
                     </div>
                     <div>
                       <p className="text-white font-medium text-sm md:text-base">{f.client}</p>
                       <p className="text-space-gray text-xs mt-0.5">{f.date} &bull; TVA : {f.tva.toLocaleString()} MAD</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className={`font-semibold md:text-lg ${f.type === 'IN' ? 'text-neon-mint' : 'text-white'}`}>
                       {f.type === 'IN' ? '+' : '-'}{(f.amountHT + f.tva).toLocaleString('fr-FR')} MAD
                     </p>
                     <p className="text-space-gray text-xs mt-0.5">TTC</p>
                   </div>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
