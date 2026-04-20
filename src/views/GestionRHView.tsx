import { useState, useMemo } from 'react';
import { useWealthStore } from '../store/useWealthStore';
import { ArrowLeft, Users, Plus, Calculator, Check, Pencil, Trash2 } from 'lucide-react';
import { ViewType } from '../components/Sidebar';
import { WealthEngine } from '../lib/WealthEngine';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onNavigate: (v: ViewType) => void;
}

export default function GestionRHView({ onNavigate }: Props) {
  const business = useWealthStore(state => state.business);
  const updateBusiness = useWealthStore(state => state.updateBusiness);
  const employes = business.employes || [];

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [salaireNetTarget, setSalaireNetTarget] = useState('');

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editNet, setEditNet] = useState('');

  const brutFromNet = (net: number) => net * 1.25; // Simplification as requested
  
  const handleSimulateAndAdd = (e: any) => {
    e.preventDefault();
    if (!role || !salaireNetTarget || !name) return;

    // Simulation inversée simplifiée (Brut ≈ Net * 1.25 au Maroc en moy)
    const net = Number(salaireNetTarget);
    const brutSimule = brutFromNet(net); 
    const coutGlobal = WealthEngine.calculateCoutGlobalSalarie(brutSimule); // Inclut les 21.09% patronales

    const newEmp = {
      id: Math.random().toString(),
      name,
      role,
      salaryNet: net,
      costGlobal: coutGlobal
    };

    updateBusiness({
      employes: [...employes, newEmp],
      fluxOut: business.fluxOut + coutGlobal, // Add direct monthly impact
      resultatComptable: business.resultatComptable - (coutGlobal * 12) // Impact estimated yearly
    });

    setName('');
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

  const startEdit = (emp: any) => {
    setEditId(emp.id);
    setEditName(emp.name);
    setEditRole(emp.role);
    setEditNet(emp.salaryNet.toString());
  };

  const saveEdit = (id: string) => {
    const original = employes.find(e => e.id === id);
    if (!original) return;

    const net = Number(editNet);
    const brutSimule = brutFromNet(net);
    const newGlobal = WealthEngine.calculateCoutGlobalSalarie(brutSimule);
    
    const costDiff = newGlobal - original.costGlobal;

    const updated = employes.map(e => e.id === id ? { ...e, name: editName, role: editRole, salaryNet: net, costGlobal: newGlobal } : e);

    updateBusiness({
      employes: updated,
      fluxOut: business.fluxOut + costDiff,
      resultatComptable: business.resultatComptable - (costDiff * 12)
    });
    setEditId(null);
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
           
           <form onSubmit={handleSimulateAndAdd} className="space-y-4">
             <div>
                <label className="text-space-gray text-[10px] uppercase tracking-widest mb-1 ml-1 block font-bold">Nom Complet</label>
                <input required value={name} onChange={e=>setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#34C759]/50 transition-colors" placeholder="Ex: Karim Tazi" />
             </div>
             <div>
                <label className="text-space-gray text-[10px] uppercase tracking-widest mb-1 ml-1 block font-bold">Poste / Rôle</label>
                <input required value={role} onChange={e=>setRole(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#34C759]/50 transition-colors" placeholder="Ex: Développeur Senior" />
             </div>
             <div>
                <label className="text-space-gray text-[10px] uppercase tracking-widest mb-1 ml-1 block font-bold">Salaire Net Perçu (Mensuel MAD)</label>
                <input required type="number" step="100" value={salaireNetTarget} onChange={e=>setSalaireNetTarget(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#34C759]/50 transition-colors" placeholder="15000" />
             </div>
             
             <div className="bg-[#34C759]/5 border border-[#34C759]/20 rounded-xl p-4 mt-2">
                 <p className="text-space-gray text-[10px] uppercase tracking-widest font-bold mb-1">Moteur RH actif</p>
                 <p className="text-[#34C759]/80 text-xs font-light">Calcul auto du brut (Net × 1.25 env.) + Charges sociales CNSS/AMO (21.09%).</p>
             </div>

             <button type="submit" className="w-full py-3.5 bg-[#34C759] text-midnight font-bold flex items-center justify-center gap-2 rounded-xl mt-4 hover:bg-[#34C759]/90 transition-colors shadow-[0_0_15px_rgba(52,199,89,0.2)]">
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
               <AnimatePresence>
                 {employes.map((emp) => (
                   <motion.div 
                     layout 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     key={emp.id} 
                     className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/10 group"
                   >
                     {editId === emp.id ? (
                       <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                         <div className="md:col-span-4">
                           <input value={editName} onChange={e=>setEditName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="Nom" />
                         </div>
                         <div className="md:col-span-4">
                           <input value={editRole} onChange={e=>setEditRole(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="Poste" />
                         </div>
                         <div className="md:col-span-3">
                           <input type="number" value={editNet} onChange={e=>setEditNet(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="Salaire Net" />
                         </div>
                         <div className="md:col-span-1 flex justify-end gap-2">
                           <button onClick={() => saveEdit(emp.id)} className="w-8 h-8 rounded-full bg-[#34C759]/20 text-[#34C759] flex justify-center items-center">
                              <Check size={14} />
                           </button>
                         </div>
                       </div>
                     ) : (
                       <>
                         <div className="flex items-center gap-4 flex-1">
                           <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-space-gray shrink-0 group-hover:text-[#34C759] transition-colors">
                              <Users size={16} />
                           </div>
                           <div className="flex-1">
                             <div className="flex items-center gap-2 mb-1">
                               <p className="text-white font-medium">{emp.name}</p>
                               <span className="text-[10px] bg-white/5 text-space-gray px-2 py-0.5 rounded-full uppercase tracking-widest">{emp.role}</span>
                             </div>
                             <div className="flex flex-wrap items-center gap-4 text-sm mt-2">
                               <div>
                                 <span className="text-space-gray text-[10px] uppercase tracking-widest block mb-0.5">Salaire Net (Perçu)</span>
                                 <span className="text-white font-light">{emp.salaryNet.toLocaleString('fr-FR')} MAD</span>
                               </div>
                               <div>
                                 <span className="text-space-gray text-[10px] uppercase tracking-widest block mb-0.5">Salaire Brut Estimé</span>
                                 <span className="text-white font-light">{brutFromNet(emp.salaryNet).toLocaleString('fr-FR')} MAD</span>
                               </div>
                             </div>
                           </div>
                         </div>
                         <div className="flex items-end flex-col shrink-0">
                           <p className="text-[10px] text-[#34C759] uppercase tracking-widest mb-1 font-bold">Coût Entreprise (Global)</p>
                           <p className="font-bold text-xl text-white">
                             {Number(emp.costGlobal.toFixed(0)).toLocaleString('fr-FR')} <span className="text-sm text-space-gray font-light">MAD</span>
                           </p>
                           <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => startEdit(emp)} className="text-space-gray hover:text-white transition-colors p-1">
                               <Pencil size={14} />
                             </button>
                             <button onClick={() => handleDelete(emp.id)} className="text-space-gray hover:text-red-500 transition-colors p-1">
                               <Trash2 size={14} />
                             </button>
                           </div>
                         </div>
                       </>
                     )}
                   </motion.div>
                 ))}
               </AnimatePresence>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
