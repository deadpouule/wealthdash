import { useState } from 'react';
import { useWealthStore } from '../store/useWealthStore';
import { ArrowLeft, Users, Plus, Calculator, FileCheck, Pencil, Trash2 } from 'lucide-react';
import { ViewType } from '../components/Sidebar';
import { WealthEngine } from '../lib/WealthEngine';

interface Props {
  onNavigate: (v: ViewType) => void;
}

export default function GestionRHView({ onNavigate }: Props) {
  const business = useWealthStore(state => state.business);
  const updateBusiness = useWealthStore(state => state.updateBusiness);
  const employes = business.employes || [];

  const [role, setRole] = useState('');
  const [salaireNetTarget, setSalaireNetTarget] = useState('');

  const handleSimulateAndAdd = (e: any) => {
    e.preventDefault();
    if (!role || !salaireNetTarget) return;

    // Simulation inversée simplifiée (Brut ≈ Net * 1.25 au Maroc en moy)
    const net = Number(salaireNetTarget);
    const brutSimule = net * 1.25; 
    const coutGlobal = WealthEngine.calculateCoutGlobalSalarie(brutSimule); // Inclut les 21.09% patronales

    const newEmp = {
      id: Math.random().toString(),
      role,
      salaryNet: net,
      costGlobal: coutGlobal
    };

    updateBusiness({
      employes: [...employes, newEmp],
      fluxOut: business.fluxOut + coutGlobal, // Add direct monthly impact
      resultatComptable: business.resultatComptable - (coutGlobal * 12) // Impact estimated yearly
    });

    setRole('');
    setSalaireNetTarget('');
  };

  const totalCost = employes.reduce((acc, current) => acc + current.costGlobal, 0);

  const handleDelete = (id: string) => {
    const emp = employes.find(e => e.id === id);
    if (!emp) return;
    updateBusiness({
      employes: employes.filter(e => e.id !== id),
      fluxOut: business.fluxOut - emp.costGlobal,
      resultatComptable: business.resultatComptable + (emp.costGlobal * 12)
    });
  };

  const handleEdit = (id: string) => {
    console.log("Trigger edit employe for id:", id);
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
            Gestion RH & Simulateur
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Simulateur */}
        <div className="lg:col-span-1 bg-white/[0.02] border border-[#1A1A1A] rounded-[24px] p-6 h-fit">
           <div className="flex items-center gap-3 mb-6">
             <Calculator className="text-neon-mint" size={20} />
             <h3 className="text-white font-medium">Nouveau Recrutement</h3>
           </div>
           
           <form onSubmit={handleSimulateAndAdd} className="space-y-5">
             <div>
                <label className="text-space-gray text-[10px] uppercase tracking-widest mb-2 block font-bold">Poste / Rôle</label>
                <input required value={role} onChange={e=>setRole(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-mint/50" placeholder="Ex: Développeur Senior" />
             </div>
             <div>
                <label className="text-space-gray text-[10px] uppercase tracking-widest mb-2 block font-bold">Salaire Net Souhaité (Mensuel MAD)</label>
                <input required type="number" value={salaireNetTarget} onChange={e=>setSalaireNetTarget(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-mint/50" placeholder="15000" />
             </div>
             
             <div className="bg-neon-mint/5 border border-neon-mint/20 rounded-xl p-4 mt-2">
                 <p className="text-space-gray text-[10px] uppercase tracking-widest font-bold mb-1">Moteur RH actif</p>
                 <p className="text-neon-mint/80 text-xs">Le calcul projettera le Brut + l'AMO & CNSS (21.09%).</p>
             </div>

             <button type="submit" className="w-full py-4 bg-white text-midnight font-bold flex items-center justify-center gap-2 rounded-xl mt-4 hover:bg-neutral-200">
               <Plus size={16} /> Ajouter & Simuler
             </button>
           </form>
        </div>

        {/* Masse Salariale */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
             <h3 className="text-white font-medium">Masse Salariale (Estimation)</h3>
             <span className="text-white/80 font-bold bg-white/10 px-4 py-1.5 rounded-full text-sm">
               Coût Total : {Number(totalCost).toLocaleString('fr-FR')} MAD / mois
             </span>
           </div>
           
           <div className="space-y-3">
              {employes.length === 0 ? (
               <div className="bg-white/[0.01] border border-white/10 backdrop-blur-xl rounded-[20px] p-10 flex flex-col items-center justify-center text-center">
                 <Users className="text-space-gray mb-4" size={40} strokeWidth={1} />
                 <p className="text-space-gray font-light">Aucun salarié dans la base de données.</p>
               </div>
             ) : (
               employes.map((emp) => (
                 <div key={emp.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[16px] p-5 flex flex-col md:flex-row md:items-center gap-4 transition-all duration-300 hover:bg-white/10 hover:border-[#34C759]/50 active:scale-[0.98]">
                   <div className="flex items-center gap-4 flex-1">
                     <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 shrink-0">
                        <Users size={16} />
                     </div>
                     <div>
                       <p className="text-white font-light text-sm md:text-base tracking-wide">{emp.role}</p>
                       <p className="text-space-gray text-[10px] uppercase font-bold tracking-widest mt-0.5">Base cible : {Number(emp.salaryNet).toLocaleString()} MAD NET</p>
                     </div>
                   </div>
                   <div className="bg-transparent px-4 text-right shrink-0">
                     <p className="text-[10px] text-space-gray uppercase tracking-widest mb-1">Coût Réel Employeur</p>
                     <p className="font-semibold md:text-lg text-white">
                       {Number(emp.costGlobal.toFixed(0)).toLocaleString('fr-FR')} MAD
                     </p>
                   </div>
                   <div className="flex items-center justify-end gap-3 shrink-0 ml-2">
                     <button onClick={() => handleEdit(emp.id)} className="text-gray-500 hover:text-[#34C759] transition-all duration-300 active:scale-[0.98]">
                       <Pencil size={18} strokeWidth={1.5} />
                     </button>
                     <button onClick={() => handleDelete(emp.id)} className="text-gray-500 hover:text-red-500 transition-all duration-300 active:scale-[0.98]">
                       <Trash2 size={18} strokeWidth={1.5} />
                     </button>
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
