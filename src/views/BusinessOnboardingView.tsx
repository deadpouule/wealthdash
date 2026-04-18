import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BusinessOnboardingProps {
  onComplete: (data: any) => void;
}

const MinimalInput = ({ placeholder, value, onChange, label, suffix, type = "text", autoFocus = false }: any) => (
  <div className="text-left w-full flex-1">
    {label && <label className="text-space-gray text-[10px] uppercase tracking-widest mb-2 block font-bold">{label}</label>}
    <div className="border-b border-white/20 pb-2 focus-within:border-white transition-colors flex items-end">
       <input
         type={type}
         autoFocus={autoFocus}
         className="bg-transparent border-none text-white text-xl md:text-2xl font-light w-full focus:ring-0 px-0 placeholder:text-white/10 outline-none"
         placeholder={placeholder}
         value={value}
         onChange={onChange}
       />
       {suffix && <span className="text-space-gray text-xs ml-2 mb-1">{suffix}</span>}
    </div>
  </div>
);

export default function BusinessOnboardingView({ onComplete }: BusinessOnboardingProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const [data, setData] = useState({
    companyName: "",
    legalForm: "SARL",
    monthlyCA: "",
    cash: "",
    expenses: { payroll: "", rent: "", software: "", other: "" }
  });

  const nextStep = () => setStep(s => Math.min(totalSteps, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const updateData = (key: string, val: string) => setData(d => ({ ...d, [key]: val }));
  const updateExp = (k: string, v: string) => setData(d => ({ ...d, expenses: { ...d.expenses, [k]: v } }));

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-12 w-full max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
              Bienvenue Maître.<br/>Quelle est <span className="font-normal text-neon-mint">l'entité</span> à piloter ?
            </h1>
            <div className="mt-12 bg-white/[0.02] p-8 rounded-3xl border border-white/5 space-y-10">
              <MinimalInput 
                autoFocus 
                label="Nom de l'entreprise" 
                placeholder="Ex: Holding Beta" 
                value={data.companyName} 
                onChange={(e: any) => updateData('companyName', e.target.value)} 
              />
              <div className="text-left w-full border-b border-white/20 pb-2 focus-within:border-white transition-colors">
                 <label className="text-space-gray text-[10px] uppercase tracking-widest mb-2 block font-bold">Forme Juridique</label>
                 <select 
                   value={data.legalForm} 
                   onChange={(e) => updateData('legalForm', e.target.value)} 
                   className="bg-transparent border-none text-white text-xl md:text-2xl font-light w-full focus:ring-0 px-0 outline-none appearance-none cursor-pointer"
                 >
                   <option value="SARL" className="bg-midnight">SARL / SARL AU</option>
                   <option value="SA" className="bg-midnight">Société Anonyme (SA)</option>
                   <option value="SAS" className="bg-midnight">SAS / SASU</option>
                   <option value="Auto-entrepreneur" className="bg-midnight">Auto-entrepreneur</option>
                   <option value="EURL" className="bg-midnight">EURL</option>
                   <option value="SCI" className="bg-midnight">SCI (Immobilier)</option>
                 </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-12">
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
              Quel est votre <span className="font-normal text-neon-mint">Chiffre d'Affaires mensuel</span> anticipé ?
            </h1>
            <div className="relative inline-flex items-center group">
              <input
                autoFocus
                type="text"
                value={data.monthlyCA}
                onChange={(e) => updateData('monthlyCA', e.target.value.replace(/\D/g, ''))}
                placeholder="0"
                className="bg-transparent border-none text-7xl md:text-9xl font-extralight text-white placeholder:text-white/10 outline-none w-full text-center"
              />
              {data.monthlyCA && <span className="text-2xl md:text-4xl font-light text-space-gray ml-4 mt-8">MAD</span>}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-12">
             <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
              Quelle est la <span className="font-normal">Trésorerie d'ouverture</span> ?
            </h1>
            <p className="text-space-gray text-sm font-medium">Solde actuel en banque pour la société.</p>
            <div className="relative inline-flex items-center group mt-4">
              <input
                autoFocus
                type="text"
                value={data.cash}
                onChange={(e) => updateData('cash', e.target.value.replace(/\D/g, ''))}
                placeholder="0"
                className="bg-transparent border-none text-7xl md:text-9xl font-extralight text-white placeholder:text-white/10 outline-none w-full text-center"
              />
              {data.cash && <span className="text-2xl md:text-4xl font-light text-space-gray ml-4 mt-8">MAD</span>}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-12 w-full max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
              Aperçu de vos <span className="font-normal text-red-400">Charges fixes</span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mt-12 bg-white/[0.02] p-8 md:p-12 rounded-3xl border border-white/5">
              <MinimalInput label="Masse Salariale / RH" suffix="MAD" value={data.expenses.payroll} onChange={(e: any) => updateExp('payroll', e.target.value.replace(/\D/g, ''))} />
              <MinimalInput label="Loyers (Locaux/Bureaux)" suffix="MAD" value={data.expenses.rent} onChange={(e: any) => updateExp('rent', e.target.value.replace(/\D/g, ''))} />
              <MinimalInput label="SaaS & Logiciels" suffix="MAD" value={data.expenses.software} onChange={(e: any) => updateExp('software', e.target.value.replace(/\D/g, ''))} />
              <MinimalInput label="Autres (Comptable, etc)" suffix="MAD" value={data.expenses.other} onChange={(e: any) => updateExp('other', e.target.value.replace(/\D/g, ''))} />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-12">
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
              Profil Business acquis, Maître.
            </h1>
            <div className="glass-card max-w-md mx-auto p-10 rounded-3xl border border-white/10 text-left space-y-6 shadow-2xl bg-white/[0.03] backdrop-blur-[40px]">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-space-gray text-xs uppercase tracking-widest font-bold">Raison Sociale</span>
                <span className="text-white font-medium">{data.companyName || "Non renseigné"} <span className="text-space-gray text-[10px] ml-1">{data.legalForm}</span></span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-space-gray text-xs uppercase tracking-widest font-bold">CA Mensuel Estimé</span>
                <span className="text-neon-mint font-medium">{Number(data.monthlyCA || 0).toLocaleString('fr-FR')} MAD</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-space-gray text-xs uppercase tracking-widest font-bold">Trésorerie de Départ</span>
                <span className="text-white font-medium">{Number(data.cash || 0).toLocaleString('fr-FR')} MAD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-space-gray text-xs uppercase tracking-widest font-bold">Total Charges Fixes</span>
                <span className="text-red-400 font-medium">
                  {Number(Object.values(data.expenses).reduce((a:any, b:any) => parseInt(a||0) + parseInt(b||0), 0)).toLocaleString('fr-FR')} MAD
                </span>
              </div>
            </div>
            
            <p className="text-space-gray text-sm md:text-base max-w-lg mx-auto font-medium">
              Votre tableau de bord B2B va être initialisé pour la gestion de <span className="text-white">{data.companyName || "votre entreprise"}</span>.
            </p>
          </div>
        );
      case 6:
        return (
          <div className="space-y-12">
             <div className="w-16 h-16 mx-auto rounded-full border border-neon-mint/30 flex items-center justify-center bg-neon-mint/10 shadow-[0_0_30px_rgba(52,199,89,0.2)]">
               <svg className="w-6 h-6 text-neon-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
             </div>
             <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
               Espace Business prêt.
             </h1>
             <button 
                onClick={() => onComplete(data)}
                className="px-10 py-5 mt-8 bg-white text-midnight font-bold tracking-[0.2em] uppercase text-xs hover:bg-neon-mint transition-all rounded-full shadow-[0_0_20px_rgba(255,255,255,0.15)] group"
              >
                Accéder au Dashboard B2B
              </button>
          </div>
        )
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-midnight z-[100] flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto">
      {/* Subtle Background Watermark */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center z-0">
        <svg width="600" height="600" viewBox="0 0 100 100" fill="white">
          <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
        </svg>
      </div>

      {/* Progress Bar */}
      {step < totalSteps && (
        <div className="fixed top-0 left-0 w-full h-[2px] bg-white/5 z-50">
          <motion.div 
            className="h-full bg-neon-mint shadow-[0_0_10px_#34C759]"
            initial={{ width: 0 }}
            animate={{ width: `${(step / (totalSteps-1)) * 100}%` }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
          />
        </div>
      )}

      <div className="w-full relative z-10 py-24 flex-1 flex flex-col justify-center max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full text-center"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {step < totalSteps && (
        <div className="fixed bottom-0 md:bottom-12 w-full max-w-7xl px-8 md:px-12 py-6 bg-gradient-to-t from-midnight to-transparent flex justify-between items-center text-xs uppercase tracking-[0.2em] font-bold z-50">
          <button 
            onClick={prevStep}
            className="text-white opacity-40 hover:opacity-100 transition-opacity disabled:opacity-10"
            disabled={step === 1}
          >
            Précédent
          </button>
          
          <button 
            onClick={step === totalSteps - 1 ? nextStep : nextStep}
            className="px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white text-white hover:text-midnight transition-colors rounded-full border border-white/20"
          >
            {step === totalSteps - 1 ? 'Valider' : 'Continuer'}
          </button>
        </div>
      )}
    </div>
  );
}
