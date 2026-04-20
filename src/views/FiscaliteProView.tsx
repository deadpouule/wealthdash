import { ArrowLeft, Info, Calculator, ShieldCheck, Sparkles, Lightbulb, Play, XCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { ViewType } from '../components/Sidebar';
import { useWealthStore } from '../store/useWealthStore';
import { WealthEngine } from '../lib/WealthEngine';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Props {
  onNavigate: (v: ViewType) => void;
}

export default function FiscaliteProView({ onNavigate }: Props) {
  const business = useWealthStore(state => state.business);
  
  // Real Data
  const rcOriginal = business.resultatComptable;
  const caOriginal = business.chiffreAffairesHT;
  
  // Simulation State
  const [simulateExpense, setSimulateExpense] = useState<number>(0);
  
  // Effective data used in UI
  const rc = Math.max(0, rcOriginal - simulateExpense);
  const ca = caOriginal; // CA does not generally decrease with expense, only RC

  // Calculations
  const IS = WealthEngine.calculateIS(rc);
  const CM = WealthEngine.calculateCM(ca);
  const impotFinal = Math.max(IS, CM);
  const isCMEngine = CM > IS;

  const tranches = [
    {
      id: 1,
      label: '0 - 300 000 MAD',
      taux: '10%',
      deduction: 0,
      active: rc >= 0 && rc <= 300000,
      beneficeTranche: Math.max(0, Math.min(rc, 300000)),
      progress: Math.min(100, Math.max(0, (rc / 300000) * 100))
    },
    {
      id: 2,
      label: '300 001 - 1 000 000 MAD',
      taux: '20%',
      deduction: 30000,
      active: rc > 300000 && rc <= 1000000,
      beneficeTranche: Math.max(0, Math.min(rc - 300000, 700000)),
      progress: rc > 300000 ? Math.min(100, ((rc - 300000) / 700000) * 100) : 0
    },
    {
      id: 3,
      label: '> 1 000 000 MAD',
      taux: '35%',
      deduction: 180000,
      active: rc > 1000000,
      beneficeTranche: Math.max(0, rc - 1000000),
      progress: rc > 1000000 ? 100 : 0
    }
  ];

  const formatNumber = (num: number) => Math.round(num).toLocaleString('fr-FR');

  // Predictive Insights Generator
  const insights = useMemo(() => {
    const list = [];
    const baseIS = WealthEngine.calculateIS(rcOriginal);
    const baseCM = WealthEngine.calculateCM(caOriginal);

    // 1. TVA Alert
    const factures = business.factures || [];
    const tvaCollectee = factures.filter(f => f.type === 'IN').reduce((acc, f) => acc + (f.tva || 0), 0);
    const tvaDeductible = factures.filter(f => f.type === 'OUT').reduce((acc, f) => acc + (f.tva || 0), 0);
    const tvaDue = tvaCollectee - tvaDeductible;

    if (tvaDue > 10000) {
      list.push({
         id: 'tva',
         title: 'Alerte Trésorerie : TVA due élevée',
         description: `Votre balance de TVA est créditrice (${formatNumber(tvaDue)} MAD à reverser). Anticipez des achats de matériel lourd pour compenser avant la déclaration mensuelle/trimestrielle.`,
         actionText: `Investir 50 000 MAD (Matériel)`,
         simulateValue: 50000,
         icon: Lightbulb
      });
    }

    // 2. Alert Tranche 300k
    if (rcOriginal > 200000 && rcOriginal <= 400000) {
       const over = Math.max(0, rcOriginal - 300000);
       list.push({
          id: 't-300',
          title: 'Alerte Seuil de Tranche (10% -> 20%)',
          description: rcOriginal > 300000 
             ? `Votre bénéfice dépasse de ${formatNumber(over)} MAD le palier des 300K. Cette portion subit un taux marginal de 20%. Exécutez des achats déductibles pour revenir complètement dans la tranche à 10%.`
             : `Vous êtes très proche du plafond de 300 000 MAD (Tranche à 10%). Ajustez vos futures facturations ou anticipez des dépenses pour bloquer l'effet de saut marginal (20%).`,
          actionText: `Simuler dépense : ${formatNumber(over || 30000)} MAD`,
          simulateValue: over || 30000,
          icon: Lightbulb
       });
    }

    // 3. Alert Tranche 1M
    if (rcOriginal > 850000 && rcOriginal <= 1200000) {
       const over = Math.max(0, rcOriginal - 1000000);
       list.push({
          id: 't-1m',
          title: 'Franchissement du Palier Maximal (35%)',
          description: rcOriginal > 1000000 
             ? `Votre excédent de ${formatNumber(over)} MAD est hautement taxé à 35%. Il est crucial de déduire vos investissements prévus directement sur cet exercice (primes exceptionnelles, amortissements accélérés).`
             : `Vous approchez la barre décisive d'1 million de DH. Au-delà, l'impôt est confiscatoire (35%). Stratégie fortement recommandée : décaissez dès maintenant vos investissements pour rester < 1M.`,
          actionText: `Inverser la tendance (-${formatNumber(over || 150000)} MAD)`,
          simulateValue: over || 150000,
          icon: Sparkles
       });
    }

    // 4. CM vs IS
    if (baseIS < baseCM) {
       list.push({
          id: 'cm-alert',
          title: 'Impact de la Cotisation Minimale',
          description: `Votre Impôt est capé par la Cotisation Minimale (${formatNumber(baseCM)} MAD). Toute dépense supplémentaire (jusqu'à un certain point) ne réduira PLUS votre imposition. Cherchez la rentabilité plutôt que l'évitement fiscal.`,
          actionText: `Voir l'impact nul d'un achat (20 000 MAD)`,
          simulateValue: 20000,
          icon: Info
       });
    }

    // 5. Generic Leasing
    if (rcOriginal > 400000 && rcOriginal <= 850000) {
      list.push({
         id: 'leasing',
         title: 'Optimisation par le Leasing Auto/Matériel',
         description: `Bénéfice stable. Acquérir des véhicules utilitaires de société via Crédit-Bail permet d'absorber des loyers 100% déductibles mensuellement, baissant passivement l'assiette fiscale et soulageant la trésorerie.`,
         actionText: `Loyer LLC (Ex: 7 000 MAD/mois x 12)`,
         simulateValue: 84000,
         icon: Sparkles
      });
    }

    return list;
  }, [rcOriginal, caOriginal, business.factures]);

  const savingsIS = useMemo(() => {
    if (simulateExpense === 0) return 0;
    const oldIS = WealthEngine.calculateIS(rcOriginal);
    const oldCM = WealthEngine.calculateCM(caOriginal);
    const oldTotal = Math.max(oldIS, oldCM); // Correct CM/IS threshold check on old logic
    return Math.max(0, oldTotal - impotFinal);
  }, [simulateExpense, rcOriginal, caOriginal, impotFinal]);

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
               Cockpit Fiscal
             </h2>
             <p className="text-space-gray tracking-wide">
               Simulateur hybride unifié Barème IS / Entreprise
             </p>
           </div>
        </div>
      </div>

      <div className="glass-card rounded-[32px] overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-10 flex flex-col relative">
         
         {/* Simulation Banner Active */}
         <AnimatePresence>
            {simulateExpense > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-0 left-0 right-0 bg-[#34C759] text-midnight py-2 px-6 flex flex-col md:flex-row justify-between items-center z-50 font-bold"
              >
                <span>🚀 Mode Simulation Actif : Dépense Supplémentaire de -{formatNumber(simulateExpense)} MAD déduite.</span>
                <div className="flex items-center gap-4 text-sm mt-2 md:mt-0">
                   <span>Économie d'Impôt : <span className="underline">{formatNumber(savingsIS)} MAD</span></span>
                   <button onClick={() => setSimulateExpense(0)} className="flex items-center gap-1.5 bg-black/10 hover:bg-black/20 px-3 py-1 rounded-full transition-colors">
                      <XCircle size={14} /> Réinitialiser
                   </button>
                </div>
              </motion.div>
            )}
         </AnimatePresence>

         <div className={cn("flex items-center gap-3 mb-8 transition-all", simulateExpense > 0 ? "mt-10" : "")}>
           <Calculator className="text-[#34C759]" size={24} />
           <h3 className="text-xl font-light text-white">Tableau d'Imposition (IS Maroc)</h3>
         </div>

         {/* Table Header */}
         <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 border-b border-white/10 text-[10px] font-bold text-space-gray uppercase tracking-widest bg-black/20 rounded-t-2xl">
            <div>Tranches de Bénéfice</div>
            <div className="text-center">Taux</div>
            <div className="text-center">Somme à Déduire</div>
            <div className="text-right">Situation Actuelle</div>
         </div>

         {/* Variables / Rows */}
         <div className="flex flex-col">
            {tranches.map(tr => (
               <div 
                 key={tr.id}
                 className={cn(
                   "relative grid grid-cols-1 md:grid-cols-4 gap-4 px-6 py-6 border-b border-white/5 transition-all overflow-hidden duration-500",
                   tr.active ? "bg-white/10 border-[#34C759] shadow-[inset_4px_0_0_#34C759]" : "bg-transparent"
                 )}
               >
                  {tr.active && (
                    <div className="absolute top-0 left-0 bottom-0 right-0 pointer-events-none overflow-hidden">
                       <motion.div 
                         className="absolute top-0 left-0 bottom-0 bg-[#34C759]/5" 
                         animate={{ width: `${tr.progress}%` }} 
                         transition={{ duration: 0.8, ease: "easeOut" }} 
                       />
                       <motion.div 
                         className="absolute bottom-0 left-0 h-[2px] bg-[#34C759]" 
                         animate={{ width: `${tr.progress}%` }} 
                         transition={{ duration: 0.8, ease: "easeOut" }} 
                       />
                    </div>
                  )}

                  <div className="flex flex-col justify-center relative z-10">
                     <span className="md:hidden text-[10px] uppercase tracking-widest text-space-gray mb-1">Tranche</span>
                     <span className="text-white font-medium">{tr.label}</span>
                  </div>
                  
                  <div className="flex flex-col justify-center md:items-center relative z-10">
                     <span className="md:hidden text-[10px] uppercase tracking-widest text-space-gray mb-1">Taux</span>
                     <span className={cn("text-lg font-bold", tr.active ? "text-[#34C759]" : "text-white/60")}>{tr.taux}</span>
                  </div>

                  <div className="flex flex-col justify-center md:items-center relative z-10">
                     <span className="md:hidden text-[10px] uppercase tracking-widest text-space-gray mb-1">À Déduire</span>
                     <span className="text-space-gray font-light">{formatNumber(tr.deduction)} MAD</span>
                  </div>

                  <div className="flex flex-col justify-center md:items-end relative z-10">
                     <span className="md:hidden text-[10px] uppercase tracking-widest text-space-gray mb-1">Bénéfice Assujetti</span>
                     <span className={cn("text-xl tracking-tight transition-colors duration-500 font-light", tr.active ? "text-white font-bold" : "text-white/80")}>
                       {formatNumber(tr.beneficeTranche)} <span className="text-sm text-space-gray font-light">MAD</span>
                     </span>
                  </div>
               </div>
            ))}
         </div>

         {/* Totals Zone */}
         <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative group">
               <div className="flex items-center gap-2 mb-2">
                 <span className="text-[10px] uppercase tracking-widest text-space-gray font-bold">Total IS Théorique</span>
                 <div className="relative group cursor-pointer lg:inline-block hidden">
                   <Info size={14} className="text-space-gray hover:text-white transition-colors" />
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black/90 backdrop-blur-md rounded border border-white/10 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                     Calculé selon le barème progressif sur base du Résultat Comptable: {formatNumber(rc)} MAD
                   </div>
                 </div>
               </div>
               <span className="text-3xl font-light text-white tracking-tight">{formatNumber(IS)} <span className="text-sm text-space-gray">MAD</span></span>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative group">
               <div className="flex items-center gap-2 mb-2">
                 <span className="text-[10px] uppercase tracking-widest text-space-gray font-bold">Cotisation Minimale (CM)</span>
                 <div className="relative group cursor-pointer lg:inline-block hidden">
                   <Info size={14} className="text-space-gray hover:text-white transition-colors" />
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black/90 backdrop-blur-md rounded border border-white/10 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                     Base de 0.25% appliquée au Chiffre d'Affaires HT ({formatNumber(ca)} MAD).
                   </div>
                 </div>
               </div>
               <span className="text-3xl font-light text-white tracking-tight">{formatNumber(CM)} <span className="text-sm text-space-gray">MAD</span></span>
            </div>

            <div className={cn("p-6 rounded-2xl border transition-colors duration-500", isCMEngine ? "bg-amber-500/10 border-amber-500/30" : "bg-[#34C759]/10 border-[#34C759]/30")}>
               <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck size={16} className={isCMEngine ? "text-amber-500" : "text-[#34C759]"} />
                 <span className={cn("text-[10px] uppercase tracking-widest font-bold", isCMEngine ? "text-amber-500" : "text-[#34C759]")}>
                   Impôt Final Retenu
                 </span>
               </div>
               <span className="text-4xl font-bold text-white tracking-tight">{formatNumber(impotFinal)} <span className="text-sm text-space-gray font-light">MAD</span></span>
               <div className="mt-2 text-xs text-white/50">
                 {isCMEngine ? "La Cotisation Minimale est d'application." : "L'IS calculé est d'application."}
               </div>
            </div>
         </div>

      </div>

      {/* NEW: Predictive Insights AI Section */}
      {insights.length > 0 && (
        <div className="bg-[#34C759]/5 backdrop-blur-xl border border-[#34C759]/20 rounded-[32px] p-8 md:p-10 flex flex-col relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#34C759]/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <Sparkles className="text-[#34C759]" size={24} />
            <h3 className="text-xl font-medium text-white">Noria IA — Insights & Optimisation</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {insights.map((insight) => (
               <div key={insight.id} className="bg-black/40 border border-white/5 rounded-[24px] p-6 hover:border-[#34C759]/30 transition-all group flex flex-col justify-between">
                 <div>
                   <div className="flex items-center gap-3 mb-4">
                     <insight.icon size={18} className="text-space-gray group-hover:text-amber-400 transition-colors" />
                     <h4 className="text-sm font-bold text-white tracking-wide">{insight.title}</h4>
                   </div>
                   <p className="text-white/70 font-light text-sm mb-6 leading-relaxed">
                     {insight.description}
                   </p>
                 </div>
                 
                 {insight.simulateValue > 0 ? (
                    <button 
                      onClick={() => setSimulateExpense(insight.simulateValue)}
                      className="w-full mt-auto bg-[#34C759]/10 hover:bg-[#34C759]/20 text-[#34C759] border border-[#34C759]/20 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <Play size={14} fill="currentColor" /> {insight.actionText}
                    </button>
                 ) : (
                    <div className="w-full mt-auto bg-black/30 border border-white/5 text-space-gray font-bold py-3 rounded-xl flex items-center justify-center text-sm cursor-not-allowed">
                       {insight.actionText}
                    </div>
                 )}
               </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
