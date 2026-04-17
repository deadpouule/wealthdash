import { useState } from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '../lib/utils';

export default function RetirementView() {
  const [age, setAge] = useState(60);
  const [rent, setRent] = useState(12500);

  const pillarsData = [
    { name: 'CNSS (Base)', value: 4200, color: '#FFFFFF10' },
    { name: 'Assurance Vie', value: 8300, color: '#34C759' },
  ];

  // Logic: Rent increases slightly as age increases
  const calculateRent = (newAge: number) => {
    const base = 12500;
    const bonus = (newAge - 60) * 800;
    setAge(newAge);
    setRent(base + bonus);
  };

  return (
    <div className="px-10 space-y-12 animate-in fade-in duration-1000 pb-20 mt-8">
      {/* Rent Gauge Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-10 rounded-3xl flex flex-col items-center justify-center space-y-12 relative overflow-hidden">
           <div className="absolute top-8 left-8">
             <h3 className="text-xl font-light text-white">Rente Estimée</h3>
             <p className="text-xs text-space-gray uppercase tracking-widest">Projection mensuelle à la retraite</p>
           </div>
           
           <div className="relative flex flex-col items-center">
              <div className="text-8xl font-black text-white tracking-tighter mb-2">
                {rent.toLocaleString()}
              </div>
              <div className="text-2xl font-light text-space-gray leading-none">MAD / mois</div>
              
              <div className="mt-16 w-full max-w-md space-y-6">
                 <div className="flex justify-between items-center text-xs uppercase tracking-widest text-space-gray font-bold">
                    <span>Âge de Départ</span>
                    <span className="text-white text-base">{age} ans</span>
                 </div>
                 <input 
                   type="range" 
                   min="55" 
                   max="75" 
                   value={age}
                   onChange={(e) => calculateRent(parseInt(e.target.value))}
                   className="w-full h-[3px] bg-white/10 appearance-none rounded-full accent-neon-mint cursor-pointer"
                 />
                 <div className="flex justify-between text-[10px] text-white/20 font-bold uppercase tracking-widest">
                    <span>55 Ans</span>
                    <span>75 Ans</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Pillars Summary */}
        <div className="glass-card p-10 rounded-3xl flex flex-col justify-between">
            <h3 className="text-xl font-light text-white mb-8">Les Piliers de Prévoyance</h3>
            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={pillarsData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pillarsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0A0A0B', border: '1px solid #2A2A2A', borderRadius: '12px', fontSize: '10px' }}
                    />
                 </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="space-y-4">
               {pillarsData.map((p) => (
                 <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                       <span className="text-xs text-space-gray">{p.name}</span>
                    </div>
                    <span className="text-xs font-medium text-white">{p.value.toLocaleString()} MAD</span>
                 </div>
               ))}
            </div>
        </div>
      </div>

      {/* Fiscal Optimization Card */}
      <div className="glass-card p-10 rounded-3xl group overflow-hidden relative">
         <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-neon-mint/5 rounded-full blur-3xl pointer-events-none group-hover:bg-neon-mint/10 transition-all" />
         
         <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start md:items-center">
            <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-mint/10 border border-neon-mint/20 text-neon-mint text-[10px] font-bold uppercase tracking-widest">
                   Fiscalité Marocaine Optimisée
                </div>
                <h3 className="text-4xl font-light text-white leading-tight">
                  Économisez jusqu'à <span className="font-bold text-neon-mint">42.500 MAD</span> directs sur votre IGR annuel.
                </h3>
                <p className="text-space-gray max-w-xl text-sm leading-relaxed">
                   En utilisant les déductions IGR pour l'épargne retraite (Retraite Complémentaire), vous baissez votre base imposable. Chaque dirham versé vous coûte réellement 0.62 MAD après avantage fiscal.
                </p>
                <div className="flex gap-4 pt-4">
                   <button className="px-6 py-3 bg-neon-mint text-midnight rounded-full text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all">
                      Optimiser mes versements
                   </button>
                   <button className="px-6 py-3 subtle-outline border-white/10 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all">
                      Télécharger Guide IGR
                   </button>
                </div>
            </div>

            <div className="w-full md:w-80 space-y-4">
                <div className="p-6 bg-white/5 rounded-2xl subtle-outline flex flex-col gap-2">
                   <span className="text-[10px] text-space-gray uppercase tracking-widest font-bold">Impôt Actuel</span>
                   <span className="text-2xl font-light text-white">84.200 MAD</span>
                </div>
                <div className="p-6 bg-neon-mint/5 border border-neon-mint/20 rounded-2xl flex flex-col gap-2 relative">
                   <span className="text-[10px] text-neon-mint uppercase tracking-widest font-bold">Impôt Optimisé</span>
                   <span className="text-2xl font-bold text-neon-mint">41.700 MAD</span>
                   <div className="absolute top-6 right-6 text-neon-mint">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                         <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                   </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
