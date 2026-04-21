import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, Home, Plane, Gem, Calculator, TrendingUp, 
  AlertTriangle, CheckCircle2, Save, Trash2, Clock, Info, ShieldCheck,
  ArrowRight, Landmark
} from 'lucide-react';
import { useWealthStore, SimulatedProject } from '../store/useWealthStore';
import { cn } from '../lib/utils';
import { ViewType } from '../components/Sidebar';

interface SimulationViewProps {
  onNavigate: (view: ViewType) => void;
}

const CircularGauge = ({ percentage, color, label, subLabel }: { percentage: number, color: string, label: string, subLabel?: string }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const clampedPerc = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (clampedPerc / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
          <motion.circle 
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            cx="48" cy="48" r={radius} 
            stroke={color} 
            strokeWidth="8" 
            fill="transparent" 
            strokeDasharray={circumference} 
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-white">{percentage.toFixed(1)}%</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-white/80">{label}</span>
      {subLabel && <span className="text-xs text-white/40">{subLabel}</span>}
    </div>
  );
};

export default function SimulationView({ onNavigate }: SimulationViewProps) {
  const { mode, particulier, business, simulations, addSimulation, removeSimulation } = useWealthStore();

  const [projectType, setProjectType] = useState<'Voiture' | 'Immobilier' | 'Voyage' | 'Luxe'>('Immobilier');
  const [amount, setAmount] = useState<number>(1000000);
  const [apport, setApport] = useState<number>(200000);
  const [monthlySavings, setMonthlySavings] = useState<number>(5000);
  const [financing, setFinancing] = useState<'Cash' | 'Credit'>('Credit');
  const [creditDuration, setCreditDuration] = useState<number>(240);
  const [creditRate, setCreditRate] = useState<number>(4.5);

  const monthlyRevenue = mode === 'Particulier' ? particulier.revenuMensuel : business.chiffreAffairesHT / 12;

  // Calculs
  const loanAmount = Math.max(0, amount - apport);
  const monthlyRate = (creditRate / 100) / 12;
  const creditMonthlyPayment = useMemo(() => {
    if (financing !== 'Credit' || loanAmount <= 0) return 0;
    if (monthlyRate === 0) return loanAmount / creditDuration; // Rate 0%
    return (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -creditDuration));
  }, [financing, loanAmount, monthlyRate, creditDuration]);

  const monthsToSave = useMemo(() => {
    if (financing === 'Cash') {
      const needed = amount - apport;
      return needed > 0 && monthlySavings > 0 ? Math.ceil(needed / monthlySavings) : 0;
    }
    return 0; // Credit implies immediate purchase after apport is met (assuming apport is ready)
  }, [financing, amount, apport, monthlySavings]);

  const newMonthlyCharge = financing === 'Credit' ? creditMonthlyPayment : monthlySavings;
  const debtRatio = monthlyRevenue > 0 ? (newMonthlyCharge / monthlyRevenue) * 100 : 0;

  // AI Verdict (Adapté si cash ou crédit)
  let verdict: 'Sain' | 'Risqué' | 'Critique' = 'Sain';
  if (financing === 'Credit') {
    if (debtRatio > 45) verdict = 'Critique';
    else if (debtRatio > 33) verdict = 'Risqué';
  } else {
    // Effort d'épargne agressif ?
    if (debtRatio > 60) verdict = 'Critique';
    else if (debtRatio > 40) verdict = 'Risqué';
  }

  const getVerdictStyles = () => {
    switch (verdict) {
      case 'Sain': return 'text-[#34C759] bg-[#34C759]/10 border-[#34C759]/30';
      case 'Risqué': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'Critique': return 'text-red-500 bg-red-500/10 border-red-500/30';
      default: return '';
    }
  };

  const getVerdictMessage = () => {
    if (financing === 'Credit') {
      if (verdict === 'Sain') return "Capacité d'emprunt respectée. Le projet est viable.";
      if (verdict === 'Risqué') return "Attention : Vous dépassez les 33% d'endettement recommandés.";
      return "Danger : Risque de surendettement. Diminuez le montant ou augmentez la durée.";
    } else {
      if (verdict === 'Sain') return "Effort d'épargne réaliste et soutenable.";
      if (verdict === 'Risqué') return "Effort d'épargne important. Restreindra votre reste à vivre.";
      return "Effort d'épargne irréaliste. Diminuez l'objectif mensuel.";
    }
  };

  const saveSimulation = () => {
    const newSim: SimulatedProject = {
      id: Math.random().toString(36).substring(2, 9),
      type: projectType,
      amount,
      apport,
      monthlySavings,
      financing,
      creditDuration: financing === 'Credit' ? creditDuration : undefined,
      creditRate: financing === 'Credit' ? creditRate : undefined,
      createdAt: new Date().toISOString()
    };
    addSimulation(newSim);
  };

  return (
    <div className="flex-1 min-h-screen overflow-y-auto bg-midnight text-space-gray p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[#34C759]/20 flex items-center justify-center border border-[#34C759]/30">
          <TrendingUp className="text-[#34C759]" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-light text-white tracking-wide">Horizon</h1>
          <p className="text-white/50 text-sm">Simulateur d'investissement & Impact financier</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Colonne de Gauche : Formulaire */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl">
            <h2 className="text-lg font-medium text-white mb-6">Paramètres du Projet</h2>

            {/* Type Selector */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { id: 'Immobilier', icon: Home, label: 'Immo' },
                { id: 'Voiture', icon: Car, label: 'Auto' },
                { id: 'Voyage', icon: Plane, label: 'Voyage' },
                { id: 'Luxe', icon: Gem, label: 'Luxe' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setProjectType(t.id as any)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all",
                    projectType === t.id 
                      ? "bg-[#34C759]/10 border-[#34C759]/50 text-[#34C759]" 
                      : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                  )}
                >
                  <t.icon size={20} />
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Common Inputs */}
            <div className="space-y-4 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Montant Total du Projet (MAD)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={e => setAmount(Number(e.target.value) || 0)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:border-[#34C759]/50 transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">MAD</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Apport / Disponible (MAD)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={apport} 
                    onChange={e => setApport(Number(e.target.value) || 0)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:border-[#34C759]/50 transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">MAD</span>
                </div>
              </div>
            </div>

            {/* Financing Toggle */}
            <div className="mb-6 p-1 bg-black/40 rounded-xl border border-white/10 flex">
              <button 
                onClick={() => setFinancing('Cash')} 
                className={cn(
                  "flex-1 py-3 rounded-lg text-sm font-medium transition-all", 
                  financing === 'Cash' ? "bg-[#34C759] text-black shadow-[0_0_15px_rgba(52,199,89,0.3)]" : "text-white/50 hover:text-white"
                )}
              >
                Achat Comptant
              </button>
              <button 
                onClick={() => setFinancing('Credit')} 
                className={cn(
                  "flex-1 py-3 rounded-lg text-sm font-medium transition-all", 
                  financing === 'Credit' ? "bg-[#34C759] text-black shadow-[0_0_15px_rgba(52,199,89,0.3)]" : "text-white/50 hover:text-white"
                )}
              >
                Crédit Stratégique
              </button>
            </div>

            {/* Conditional Inputs */}
            <AnimatePresence mode='wait'>
              {financing === 'Credit' ? (
                <motion.div 
                  key="credit"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Durée (Mois)</label>
                      <input 
                        type="number" 
                        value={creditDuration} 
                        onChange={e => setCreditDuration(Number(e.target.value) || 1)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#34C759]/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Taux Estimé (%)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          step="0.1"
                          value={creditRate} 
                          onChange={e => setCreditRate(Number(e.target.value) || 0)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-white focus:outline-none focus:border-[#34C759]/50 transition-colors"
                        />
                         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="cash"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Capacité d'Épargne Mensuelle (MAD)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={monthlySavings} 
                        onChange={e => setMonthlySavings(Number(e.target.value) || 0)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:border-[#34C759]/50 transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">MAD</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Colonne de Droite : Résultats */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#34C759]/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-light text-white">Impact & Synthèse</h2>
              <div className={cn("px-4 py-1.5 rounded-full border text-sm font-medium flex items-center gap-2", getVerdictStyles())}>
                {verdict === 'Sain' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                Verdict : {verdict}
              </div>
            </div>

            <p className="text-white/70 mb-8 max-w-lg">
              {getVerdictMessage()}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <CircularGauge 
                percentage={debtRatio} 
                color={verdict === 'Sain' ? '#34C759' : verdict === 'Risqué' ? '#eab308' : '#ef4444'} 
                label={financing === 'Credit' ? "Taux d'endettement" : "Effort d'épargne"} 
                subLabel={`sur vos revenus ${mode === 'Business' ? 'estimés' : ''}`}
              />
              
              <div className="flex flex-col justify-center space-y-2">
                <span className="text-sm text-white/50 uppercase tracking-widest">Charge Mensuelle</span>
                <span className="text-2xl font-light text-white">
                  {newMonthlyCharge.toLocaleString()} <span className="text-sm text-white/30">MAD</span>
                </span>
              </div>

              {financing === 'Credit' ? (
                <div className="flex flex-col justify-center space-y-2">
                  <span className="text-sm text-white/50 uppercase tracking-widest">Coût du crédit</span>
                  <span className="text-2xl font-light text-white">
                    {Math.round((creditMonthlyPayment * creditDuration) - loanAmount).toLocaleString()} <span className="text-sm text-white/30">MAD</span>
                  </span>
                </div>
              ) : (
                <div className="flex flex-col justify-center space-y-2">
                  <span className="text-sm text-white/50 uppercase tracking-widest">Temps d'épargne</span>
                  <span className="text-2xl font-light text-white">
                    {Math.floor(monthsToSave / 12) > 0 && `${Math.floor(monthsToSave / 12)}a `}
                    {monthsToSave % 12 > 0 && `${monthsToSave % 12}m`}
                    {monthsToSave === 0 && 'Immédiat'}
                  </span>
                </div>
              )}
            </div>

            {/* Timeline simple */}
            <div className="mt-8 p-4 bg-black/20 rounded-xl border border-white/5 flex items-center gap-4">
               <Clock className="text-[#34C759]" size={24} />
               <div>
                  <h4 className="text-sm font-medium text-white mb-1">Horizon de réalisation estimé</h4>
                  <p className="text-xs text-white/50">
                    {financing === 'Credit' 
                      ? "Acquisition immédiate possible sous réserve d'accord bancaire." 
                      : monthsToSave === 0 
                        ? "Objectif déjà atteint ! Vous disposez de l'apport nécessaire."
                        : `Le projet sera réalisable dans ${monthsToSave} mois au rythme d'épargne actuel.`}
                  </p>
               </div>
            </div>

            {/* Smart Fiscal Analysis */}
            {mode === 'Particulier' && projectType === 'Immobilier' && financing === 'Credit' && (
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-start gap-4">
                <Info size={24} className="shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium mb-1">Avantage Fiscal (IR)</h4>
                  <p className="text-xs opacity-80 leading-relaxed">
                    Les intérêts d'emprunt pour une habitation principale sont déductibles de votre revenu global imposable (dans la limite de 10% de votre revenu global). Cela réduira votre impôt de manière significative les premières années.
                  </p>
                </div>
              </div>
            )}

            {mode === 'Business' && (
              <div className="mt-4 p-4 bg-[#34C759]/10 border border-[#34C759]/20 text-[#34C759] rounded-xl flex items-start gap-4">
                <ShieldCheck size={24} className="shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium mb-1">Optimisation Société</h4>
                  <p className="text-xs opacity-80 leading-relaxed">
                    {projectType === 'Voiture' 
                      ? "Amortissement possible sur 5 ans (20%/an). Attention au plafonnement de la déduction fiscale à 300 000 MAD TTC pour les véhicules de tourisme." 
                      : projectType === 'Immobilier' 
                        ? "Les locaux professionnels sont amortissables (souvent à 5% par an). Récupération intégrale de la TVA possible selon l'activité de l'entreprise."
                        : "Cet investissement devra être évalué par un comptable pour valider sa déductibilité totale ou son intégration aux immobilisations matérielles."}
                  </p>
                </div>
              </div>
            )}

            <button 
              onClick={saveSimulation}
              className="mt-8 w-full py-4 bg-[#34C759] text-black font-semibold rounded-xl hover:bg-[#34C759]/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(52,199,89,0.2)]"
            >
              <Save size={18} /> Sauvegarder la Simulation
            </button>
          </div>
        </div>
      </div>

      {/* Simulations Précédentes */}
      {simulations.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-light text-white mb-6 flex items-center gap-2">
            <Landmark className="text-[#34C759]" size={20} /> Vos Horizons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {simulations.map((sim) => (
              <div key={sim.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors relative group">
                 <button 
                   onClick={() => removeSimulation(sim.id)}
                   className="absolute top-4 right-4 text-white/30 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                 >
                   <Trash2 size={16} />
                 </button>
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      {sim.type === 'Voiture' && <Car size={18} />}
                      {sim.type === 'Immobilier' && <Home size={18} />}
                      {sim.type === 'Voyage' && <Plane size={18} />}
                      {sim.type === 'Luxe' && <Gem size={18} />}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{sim.type}</h4>
                      <p className="text-xs text-white/50">{new Date(sim.createdAt).toLocaleDateString()}</p>
                    </div>
                 </div>
                 
                 <div className="flex justify-between items-end">
                   <div>
                     <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Montant</p>
                     <p className="text-lg text-white font-light">{sim.amount.toLocaleString()} <span className="text-xs text-white/40">MAD</span></p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{sim.financing === 'Credit' ? 'Mensualité' : 'Épargne'}</p>
                     <p className="text-sm font-medium text-[#34C759]">
                        {sim.financing === 'Credit' 
                          ? `${Math.round((Math.max(0, sim.amount - sim.apport) * ((sim.creditRate || 4.5)/100)/12) / (1 - Math.pow(1 + ((sim.creditRate||4.5)/100)/12, -(sim.creditDuration||240)))).toLocaleString()} MAD /m` 
                          : `${sim.monthlySavings.toLocaleString()} MAD /m`}
                     </p>
                   </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
