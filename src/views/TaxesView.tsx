import { Shield, Landmark } from 'lucide-react';

export default function TaxesView() {
  return (
    <div className="px-10 py-12 space-y-16 animate-in fade-in duration-1000 max-w-4xl mx-auto text-center">
      {/* Top Section */}
      <div className="space-y-12">
         <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-white mb-8">
           Estimation d'Impôt à Payer : <br/>
           <span className="font-medium text-white/90">45 000 MAD / an</span>
         </h2>
         
         <div className="mx-auto w-12 h-64 bg-white/5 rounded-full subtle-outline relative flex items-end overflow-hidden p-1 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
            <div className="w-full h-[60%] bg-white/20 rounded-full" />
            <div className="absolute top-[35%] w-[150%] -left-[25%] h-[1px] bg-red-500/50" />
            <span className="absolute top-[35%] -right-32 text-[10px] uppercase font-bold text-red-500/80 tracking-widest">Plafond</span>
         </div>
      </div>

      {/* Middle Section */}
      <div className="glass-card p-10 rounded-3xl text-left">
         <h3 className="text-xl font-light text-white mb-8">Opportunités d'Optimisation (Maroc)</h3>
         
         <div className="space-y-4">
            <div className="p-6 subtle-outline rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all cursor-pointer">
              <div className="flex items-center gap-6">
                <Landmark size={24} className="text-space-gray group-hover:text-neon-mint transition-colors" strokeWidth={1} />
                <div>
                   <p className="text-lg font-medium text-white">Ouvrir une Assurance Vie Fiscale</p>
                   <p className="text-xs text-space-gray">Déductibilité jusqu'à 10% du revenu global net imposable.</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded bg-neon-mint/10 text-neon-mint text-[10px] font-bold tracking-widest uppercase">
                 Économisez 12% IGR
              </div>
            </div>

            <div className="p-6 subtle-outline rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all cursor-pointer">
              <div className="flex items-center gap-6">
                <Shield size={24} className="text-space-gray group-hover:text-neon-mint transition-colors" strokeWidth={1} />
                <div>
                   <p className="text-lg font-medium text-white">Cotiser au Plan Épargne Retraite</p>
                   <p className="text-xs text-space-gray">Exonération totale de l'IGR prélevé à la source après 50 ans et 5 ans de cotisations.</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded bg-neon-mint/10 text-neon-mint text-[10px] font-bold tracking-widest uppercase">
                 Économisez 10% IGR
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}
