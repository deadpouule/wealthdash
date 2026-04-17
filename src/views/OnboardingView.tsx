import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2 } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: any) => void;
}

const MinimalInput = ({ placeholder, value, onChange, label, suffix, type = "text" }: any) => (
  <div className="text-left w-full flex-1">
    {label && <label className="text-space-gray text-[10px] uppercase tracking-widest mb-2 block font-bold">{label}</label>}
    <div className="border-b border-white/20 pb-2 focus-within:border-white transition-colors flex items-end">
       <input
         type={type}
         className="bg-transparent border-none text-white text-xl md:text-2xl font-light w-full focus:ring-0 px-0 placeholder:text-white/10 outline-none"
         placeholder={placeholder}
         value={value}
         onChange={onChange}
       />
       {suffix && <span className="text-space-gray text-xs ml-2 mb-1">{suffix}</span>}
    </div>
  </div>
);

export default function OnboardingView({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 9;

  const [data, setData] = useState({
    income: "",
    expenses: { rent: "", school: "", bills: "", family: "" },
    cash: "",
    savings: "",
    bourse: [{ label: "", qty: "", price: "" }],
    immobilier: [{ name: "", value: "", status: "Loué" }],
    crypto: [{ label: "", value: "" }],
    gold: { weight: "", type: "18k" }
  });

  const nextStep = () => setStep(s => Math.min(totalSteps, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  // Updaters
  const updateData = (key: string, val: string) => setData(d => ({ ...d, [key]: val }));
  const updateExp = (k: string, v: string) => setData(d => ({ ...d, expenses: { ...d.expenses, [k]: v } }));

  const updateArr = (arrKey: 'bourse'|'immobilier'|'crypto', idx: number, k: string, v: string) => {
    const arr = [...data[arrKey]] as any[];
    arr[idx][k] = v;
    setData(d => ({ ...d, [arrKey]: arr }));
  };

  const addArr = (arrKey: 'bourse'|'immobilier'|'crypto', template: any) => {
    setData(d => ({ ...d, [arrKey]: [...d[arrKey], template] }));
  };
  
  const rmArr = (arrKey: 'bourse'|'immobilier'|'crypto', idx: number) => {
    const arr = [...data[arrKey]] as any[];
    arr.splice(idx, 1);
    setData(d => ({ ...d, [arrKey]: arr }));
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-12">
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
              Bonjour Maître.<br/>Quel est votre <span className="font-normal text-neon-mint">revenu net mensuel</span> ?
            </h1>
            <div className="relative inline-flex items-center group">
              <input
                autoFocus
                type="text"
                value={data.income}
                onChange={(e) => updateData('income', e.target.value.replace(/\D/g, ''))}
                placeholder="0"
                className="bg-transparent border-none text-7xl md:text-9xl font-extralight text-white placeholder:text-white/10 outline-none w-full text-center"
              />
              {data.income && <span className="text-2xl md:text-4xl font-light text-space-gray ml-4 mt-8">MAD</span>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-12 w-full max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
              Quelles sont vos <span className="font-normal">dépenses fixes</span> ?
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mt-12 bg-white/[0.02] p-8 rounded-3xl border border-white/5">
              <MinimalInput label="Loyer / Crédit" suffix="MAD" value={data.expenses.rent} onChange={(e: any) => updateExp('rent', e.target.value.replace(/\D/g, ''))} />
              <MinimalInput label="École / Éducation" suffix="MAD" value={data.expenses.school} onChange={(e: any) => updateExp('school', e.target.value.replace(/\D/g, ''))} />
              <MinimalInput label="Charges & Factures" suffix="MAD" value={data.expenses.bills} onChange={(e: any) => updateExp('bills', e.target.value.replace(/\D/g, ''))} />
              <MinimalInput label="Aide Familiale" suffix="MAD" value={data.expenses.family} onChange={(e: any) => updateExp('family', e.target.value.replace(/\D/g, ''))} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-12">
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
              Quelle est votre <span className="font-normal text-neon-mint">trésorerie immédiate</span> ?
            </h1>
            <p className="text-space-gray text-sm font-medium">Soldes cumulés de vos comptes courants.</p>
            <div className="relative inline-flex items-center group">
              <input
                type="text"
                value={data.cash}
                onChange={(e) => updateData('cash', e.target.value.replace(/\D/g, ''))}
                placeholder="0"
                className="bg-transparent border-none text-7xl md:text-8xl font-extralight text-white placeholder:text-white/10 outline-none w-full text-center"
              />
              {data.cash && <span className="text-2xl md:text-3xl font-light text-space-gray ml-4 mt-8">MAD</span>}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-12">
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
              Quel est le montant de votre <span className="font-normal">épargne bloquée</span> ?
            </h1>
            <p className="text-space-gray text-sm font-medium">Comptes sur carnet, livrets bancaires, fonds euros.</p>
            <div className="relative inline-flex items-center group">
              <input
                type="text"
                value={data.savings}
                onChange={(e) => updateData('savings', e.target.value.replace(/\D/g, ''))}
                placeholder="0"
                className="bg-transparent border-none text-7xl md:text-8xl font-extralight text-white placeholder:text-white/10 outline-none w-full text-center"
              />
              {data.savings && <span className="text-2xl md:text-3xl font-light text-space-gray ml-4 mt-8">MAD</span>}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-10 w-full max-w-3xl mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
              Avez-vous des <span className="font-normal">Actions en Bourse</span> ?
            </h1>
            <div className="space-y-4">
              {data.bourse.map((item, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-6 items-end bg-white/5 p-6 rounded-2xl border border-white/5 relative group">
                  <MinimalInput label="Valeur (ex: IAM)" value={item.label} onChange={(e: any) => updateArr('bourse', idx, 'label', e.target.value)} />
                  <MinimalInput label="Quantité" type="number" value={item.qty} onChange={(e: any) => updateArr('bourse', idx, 'qty', e.target.value)} />
                  <MinimalInput label="Cours Actuel" type="number" suffix="MAD" value={item.price} onChange={(e: any) => updateArr('bourse', idx, 'price', e.target.value)} />
                  <button onClick={() => rmArr('bourse', idx)} className="text-red-400 opacity-50 hover:opacity-100 p-2 shrink-0 mb-1"><Trash2 size={16}/></button>
                </div>
              ))}
              <div className="flex justify-center">
                <button onClick={() => addArr('bourse', {label:'', qty:'', price:''})} className="flex items-center gap-2 text-neon-mint text-xs uppercase tracking-widest font-bold mt-6 hover:brightness-125 transition">
                  <Plus size={14}/> Ajouter une action
                </button>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-10 w-full max-w-4xl mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
              Possédez-vous de <span className="font-normal text-neon-mint">l'Immobilier</span> ?
            </h1>
            <div className="space-y-4">
              {data.immobilier.map((item, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-6 items-end bg-white/5 p-6 rounded-2xl border border-white/5">
                  <div className="flex-1 min-w-[200px]">
                     <MinimalInput label="Nom du bien" value={item.name} onChange={(e: any) => updateArr('immobilier', idx, 'name', e.target.value)} />
                  </div>
                  <div className="flex-1">
                     <MinimalInput label="Valeur Estimée" type="number" suffix="MAD" value={item.value} onChange={(e: any) => updateArr('immobilier', idx, 'value', e.target.value)} />
                  </div>
                  <div className="text-left flex-1">
                     <label className="text-space-gray text-[10px] uppercase tracking-widest mb-2 block font-bold">Statut</label>
                     <select value={item.status} onChange={(e) => updateArr('immobilier', idx, 'status', e.target.value)} className="bg-transparent border-b border-white/20 text-white text-xl font-light w-full focus:ring-0 pb-2 outline-none appearance-none cursor-pointer">
                       <option value="Résidence Principale" className="bg-midnight">Résidence Principale</option>
                       <option value="Loué" className="bg-midnight">Loué</option>
                       <option value="Nu" className="bg-midnight">Nu / Terrain</option>
                     </select>
                  </div>
                  <button onClick={() => rmArr('immobilier', idx)} className="text-red-400 opacity-50 hover:opacity-100 p-2 shrink-0 mb-1"><Trash2 size={16}/></button>
                </div>
              ))}
              <div className="flex justify-center">
                <button onClick={() => addArr('immobilier', {name:'', value:'', status:'Loué'})} className="flex items-center gap-2 text-neon-mint text-xs uppercase tracking-widest font-bold mt-6 hover:brightness-125 transition">
                  <Plus size={14}/> Ajouter un bien
                </button>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-10 w-full max-w-2xl mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
              Détaillez vos <span className="font-normal text-blue-400">Cryptomonnaies</span>.
            </h1>
            <div className="space-y-4">
              {data.crypto.map((item, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-6 items-end bg-white/5 p-6 rounded-2xl border border-white/5">
                  <MinimalInput label="Actif (ex: BTC, ETH)" value={item.label} onChange={(e: any) => updateArr('crypto', idx, 'label', e.target.value)} />
                  <MinimalInput label="Valeur Totale" type="number" suffix="MAD" value={item.value} onChange={(e: any) => updateArr('crypto', idx, 'value', e.target.value)} />
                  <button onClick={() => rmArr('crypto', idx)} className="text-red-400 opacity-50 hover:opacity-100 p-2 shrink-0 mb-1"><Trash2 size={16}/></button>
                </div>
              ))}
              <div className="flex justify-center">
                <button onClick={() => addArr('crypto', {label:'', value:''})} className="flex items-center gap-2 text-blue-400 text-xs uppercase tracking-widest font-bold mt-6 hover:brightness-125 transition">
                  <Plus size={14}/> Ajouter une crypto
                </button>
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-10 w-full max-w-xl mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
              Détenteur <span className="font-normal text-yellow-500">d'Or physique</span> ?
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 items-end bg-white/[0.02] p-8 rounded-3xl border border-white/5">
               <MinimalInput label="Poids total" type="number" suffix="Grammes" value={data.gold.weight} onChange={(e: any) => setData(d => ({ ...d, gold: { ...d.gold, weight: e.target.value } }))} />
               <div className="text-left w-full">
                 <label className="text-space-gray text-[10px] uppercase tracking-widest mb-2 block font-bold">Type Carat</label>
                 <select value={data.gold.type} onChange={(e) => setData(d => ({ ...d, gold: { ...d.gold, type: e.target.value } }))} className="bg-transparent border-b border-white/20 text-white text-xl font-light w-full focus:ring-0 pb-2 outline-none appearance-none cursor-pointer">
                   <option value="18k" className="bg-midnight text-white">Or 18k (Bijoux)</option>
                   <option value="24k" className="bg-midnight text-white">Or 24k (Lingots, Pièces)</option>
                 </select>
               </div>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="space-y-12">
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
              Profil acquis, Maître.
            </h1>
            <div className="glass-card max-w-md mx-auto p-8 rounded-3xl border border-white/10 text-left space-y-5 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-space-gray text-xs uppercase tracking-widest font-bold">Revenus Declarés</span>
                <span className="text-white font-medium">{Number(data.income || 0).toLocaleString('fr-FR')} MAD</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-space-gray text-xs uppercase tracking-widest font-bold">Trésorerie</span>
                <span className="text-white font-medium">{Number(data.cash || 0).toLocaleString('fr-FR')} MAD</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-space-gray text-xs uppercase tracking-widest font-bold">Épargne Sécurisée</span>
                <span className="text-white font-medium">{Number(data.savings || 0).toLocaleString('fr-FR')} MAD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-space-gray text-xs uppercase tracking-widest font-bold">Total Lignes Actifs</span>
                <span className="text-neon-mint font-medium">{data.bourse.filter(i=>i.label).length + data.immobilier.filter(i=>i.name).length + data.crypto.filter(i=>i.label).length}</span>
              </div>
            </div>
            
            <p className="text-space-gray text-sm max-w-lg mx-auto font-medium">
              Votre tableau de bord sera calibré sur ces métriques pour vous offrir un suivi net et intraitable de votre patrimoine.
            </p>
            <button 
              onClick={() => onComplete(data)}
              className="px-10 py-5 bg-white text-midnight font-bold tracking-[0.2em] uppercase text-xs hover:bg-neon-mint transition-all rounded-full shadow-[0_0_20px_rgba(255,255,255,0.15)] group"
            >
              Générer le Dashboard Final
            </button>
          </div>
        );
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
      <div className="fixed top-0 left-0 w-full h-[2px] bg-white/5 z-50">
        <motion.div 
          className="h-full bg-neon-mint shadow-[0_0_10px_#34C759]"
          initial={{ width: 0 }}
          animate={{ width: `${(step / totalSteps) * 100}%` }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
        />
      </div>

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
      {step < 9 && (
        <div className="fixed bottom-0 md:bottom-12 w-full max-w-7xl px-8 md:px-12 py-6 bg-gradient-to-t from-midnight to-transparent flex justify-between items-center text-xs uppercase tracking-[0.2em] font-bold z-50">
          <button 
            onClick={prevStep}
            className="text-white opacity-40 hover:opacity-100 transition-opacity disabled:opacity-10"
            disabled={step === 1}
          >
            Précédent
          </button>
          
          <button 
            onClick={nextStep}
            className="px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white text-white hover:text-midnight transition-colors rounded-full border border-white/20"
          >
            Continuer
          </button>
        </div>
      )}
    </div>
  );
}
