import { useState, useMemo } from 'react';
import { Shield, Landmark, Home, Calculator, ChevronRight } from 'lucide-react';
import { useWealthStore } from '../store/useWealthStore';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

function calculateIR(mensuel: number) {
  let rate = 0;
  let deduction = 0;

  if (mensuel <= 2500) {
    rate = 0; deduction = 0;
  } else if (mensuel <= 4166) {
    rate = 0.10; deduction = 250;
  } else if (mensuel <= 5000) {
    rate = 0.20; deduction = 666.67;
  } else if (mensuel <= 6666) {
    rate = 0.30; deduction = 1166.67;
  } else if (mensuel <= 15000) {
    rate = 0.34; deduction = 1433.33;
  } else {
    rate = 0.38; deduction = 2033.33;
  }

  const irMensuel = (mensuel * rate) - deduction;
  return { rate, irMensuel: irMensuel > 0 ? irMensuel : 0 };
}

export default function TaxesView() {
  const revenuMensuel = useWealthStore(state => state.particulier.revenuMensuel) || 0;

  const [per, setPer] = useState<number>(0);
  const [assuranceVie, setAssuranceVie] = useState<number>(0);
  const [interetsImmo, setInteretsImmo] = useState<number>(0);

  const { rate: baseRate, irMensuel: baseIrMensuel } = useMemo(() => calculateIR(revenuMensuel), [revenuMensuel]);
  const baseIrAnnuel = baseIrMensuel * 12;

  const { rate: newRate, irMensuel: newIrMensuel } = useMemo(() => {
    const totalDeductions = per + assuranceVie + interetsImmo;
    const newNet = Math.max(0, revenuMensuel - totalDeductions);
    return calculateIR(newNet);
  }, [revenuMensuel, per, assuranceVie, interetsImmo]);

  const newIrAnnuel = newIrMensuel * 12;
  const gainAnnuel = baseIrAnnuel - newIrAnnuel;

  // Calculs isolés pour affichage des gains max potentiels
  const isolatedGain = (deduction: number) => {
     if (deduction === 0) return 0;
     const currentIr = calculateIR(revenuMensuel).irMensuel;
     const newIr = calculateIR(Math.max(0, revenuMensuel - deduction)).irMensuel;
     return (currentIr - newIr) * 12;
  };

  return (
    <div className="px-6 md:px-10 py-12 space-y-12 animate-in fade-in duration-1000 max-w-5xl mx-auto w-full">
      {/* Entête & Tranche Marginale */}
      <div className="flex flex-col md:flex-row gap-8 items-stretch">
         <div className="glass-card p-10 rounded-[32px] flex-1 relative overflow-hidden flex flex-col justify-center">
            <h2 className="text-xl font-light text-white mb-2">
               Impôt sur le Revenu (Annuel)
            </h2>
            <p className="text-sm text-space-gray tracking-wide mb-8">
               Basé sur un revenu mensuel de {revenuMensuel.toLocaleString('fr-FR')} MAD
            </p>
            <div className="flex items-end gap-4 mb-2">
               <span className="text-5xl md:text-6xl font-light text-white tracking-tight">
                  {Math.round(baseIrAnnuel).toLocaleString('fr-FR')}
               </span>
               <span className="text-xl text-space-gray mb-1">MAD</span>
            </div>
            
            <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex flex-col items-center justify-center">
               <span className="text-2xl font-bold text-red-400">{(baseRate * 100).toFixed(0)}%</span>
               <span className="text-[9px] uppercase tracking-widest text-red-400/80 mt-1">Tranche</span>
            </div>
         </div>

         {/* Simulateur Global */}
         <div className="glass-card p-10 rounded-[32px] md:w-1/3 bg-[#34C759]/5 border-[#34C759]/20 flex flex-col justify-center relative shadow-[inset_0_0_80px_rgba(52,199,89,0.05)]">
            <Calculator className="absolute top-6 right-6 text-[#34C759]/40" size={32} />
            <h3 className="text-sm uppercase tracking-widest text-[#34C759] font-bold mb-4">Nouvel Impôt Simulé</h3>
            <div className="text-4xl font-bold text-white mb-2">
               {Math.round(newIrAnnuel).toLocaleString('fr-FR')} MAD
            </div>
            {(per > 0 || assuranceVie > 0 || interetsImmo > 0) ? (
              <div className="flex items-center gap-2 text-sm">
                 <span className="text-space-gray">Gain annuel généré:</span>
                 <span className="text-[#34C759] font-bold">+{Math.round(gainAnnuel).toLocaleString('fr-FR')} MAD</span>
              </div>
            ) : (
              <p className="text-xs text-space-gray">Ajustez les curseurs ci-dessous pour lancer l'optimisation.</p>
            )}
         </div>
      </div>

      {/* Stratégies d'Optimisation */}
      <div className="glass-card p-8 md:p-10 rounded-[32px]">
         <h3 className="text-2xl font-light text-white mb-8">Stratégies de Défiscalisation</h3>
         
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* PER */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-[24px] hover:border-[#34C759]/40 transition-colors group">
               <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                     <Shield className="text-[#34C759]" size={20} />
                  </div>
                  {per > 0 && (
                    <div className="px-3 py-1 rounded-full bg-[#34C759]/10 text-[#34C759] text-[10px] font-bold tracking-widest uppercase animate-in zoom-in">
                       Gain: {Math.round(isolatedGain(per)).toLocaleString('fr-FR')} MAD
                    </div>
                  )}
               </div>
               <h4 className="text-lg font-medium text-white mb-2">Plan Épargne Retraite (PER)</h4>
               <p className="text-xs text-space-gray mb-6 leading-relaxed min-h-[48px]">
                  Déduisez vos cotisations de votre net imposable (limite de 10% du revenu global).
               </p>
               
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-space-gray">Cotisation (Mensuelle)</span>
                     <span className="text-white font-medium">{per.toLocaleString()} MAD</span>
                  </div>
                  <input 
                     type="range" 
                     min="0" 
                     max={revenuMensuel * 0.1} // Limite légale approx 10%
                     step="100"
                     value={per}
                     onChange={(e) => setPer(Number(e.target.value))}
                     className="w-full accent-[#34C759] cursor-pointer"
                  />
               </div>
            </div>

            {/* Assurance Vie */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-[24px] hover:border-[#34C759]/40 transition-colors group">
               <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                     <Landmark className="text-[#34C759]" size={20} />
                  </div>
                  {assuranceVie > 0 && (
                    <div className="px-3 py-1 rounded-full bg-[#34C759]/10 text-[#34C759] text-[10px] font-bold tracking-widest uppercase animate-in zoom-in">
                       Gain: {Math.round(isolatedGain(assuranceVie)).toLocaleString('fr-FR')} MAD
                    </div>
                  )}
               </div>
               <h4 className="text-lg font-medium text-white mb-2">Assurance Vie Fiscale</h4>
               <p className="text-xs text-space-gray mb-6 leading-relaxed min-h-[48px]">
                  Souscrivez à un contrat de plus de 8 ans. Déductible jusqu'à 10% de vos revenus.
               </p>
               
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-space-gray">Prime (Mensuelle)</span>
                     <span className="text-white font-medium">{assuranceVie.toLocaleString()} MAD</span>
                  </div>
                  <input 
                     type="range" 
                     min="0" 
                     max={revenuMensuel * 0.1}
                     step="100"
                     value={assuranceVie}
                     onChange={(e) => setAssuranceVie(Number(e.target.value))}
                     className="w-full accent-[#34C759] cursor-pointer"
                  />
               </div>
            </div>

            {/* Intérêts Immobiliers */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-[24px] hover:border-[#34C759]/40 transition-colors group">
               <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                     <Home className="text-[#34C759]" size={20} />
                  </div>
                  {interetsImmo > 0 && (
                    <div className="px-3 py-1 rounded-full bg-[#34C759]/10 text-[#34C759] text-[10px] font-bold tracking-widest uppercase animate-in zoom-in">
                       Gain: {Math.round(isolatedGain(interetsImmo)).toLocaleString('fr-FR')} MAD
                    </div>
                  )}
               </div>
               <h4 className="text-lg font-medium text-white mb-2">Intérêts Immobiliers</h4>
               <p className="text-xs text-space-gray mb-6 leading-relaxed min-h-[48px]">
                  Déduction des intérêts liés à l'acquisition de votr habitation principale (jusqu'à 10%).
               </p>
               
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-space-gray">Intérêts (Mensuels)</span>
                     <span className="text-white font-medium">{interetsImmo.toLocaleString()} MAD</span>
                  </div>
                  <input 
                     type="range" 
                     min="0" 
                     max={revenuMensuel * 0.1}
                     step="100"
                     value={interetsImmo}
                     onChange={(e) => setInteretsImmo(Number(e.target.value))}
                     className="w-full accent-[#34C759] cursor-pointer"
                  />
               </div>
            </div>

         </div>
      </div>

    </div>
  );
}
