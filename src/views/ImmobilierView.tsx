import { ArrowLeft } from 'lucide-react';
import { ViewType } from '../components/Sidebar';

export default function ImmobilierView({ onNavigate }: { onNavigate: (v: ViewType) => void }) {
  return (
    <div className="space-y-12 animate-in fade-in duration-1000 px-10 pt-8 pb-20">
      {/* Header */}
      <div>
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-space-gray hover:text-white transition-colors text-xs uppercase tracking-widest font-bold mb-8"
        >
          <ArrowLeft size={14} /> Retour
        </button>
        <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-white mb-2">
          Détails Immobilier
        </h2>
      </div>

      {/* Assets List */}
      <div className="max-w-4xl mx-auto space-y-8 mt-12">
         
         {/* Property 1 */}
         <div className="relative overflow-hidden rounded-3xl h-[400px] border border-white/5 group">
            <img 
               src="https://picsum.photos/seed/apartment/1200/800" 
               alt="Appartement Casablanca - Racine" 
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-[0.6]"
               referrerPolicy="no-referrer"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/20 to-transparent pointer-events-none" />
            
            <div className="absolute bottom-6 left-6 right-6 p-6 glass-card rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 backdrop-blur-xl border border-white/10">
               <div>
                  <h3 className="text-2xl font-light text-white mb-2">Appartement Casablanca - Racine</h3>
                  <div className="flex items-center gap-3">
                     <span className="px-3 py-1 rounded bg-neon-mint/10 text-neon-mint text-[10px] font-bold tracking-widest uppercase">
                        Loué
                     </span>
                     <span className="text-xs text-space-gray font-medium">8 500 MAD / mois</span>
                  </div>
               </div>
               
               <div className="text-left md:text-right">
                  <p className="text-[10px] uppercase tracking-widest text-space-gray mb-1 font-bold">Valeur Estimée</p>
                  <p className="text-3xl font-medium text-white tracking-tight">2.4 MDH</p>
               </div>
            </div>
         </div>

         {/* Property 2 */}
         <div className="relative overflow-hidden rounded-3xl h-[400px] border border-white/5 group">
            <img 
               src="https://picsum.photos/seed/landscape/1200/800" 
               alt="Terrain Bouskoura" 
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-[0.5]"
               referrerPolicy="no-referrer"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/20 to-transparent pointer-events-none" />
            
            <div className="absolute bottom-6 left-6 right-6 p-6 glass-card rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 backdrop-blur-xl border border-white/10">
               <div>
                  <h3 className="text-2xl font-light text-white mb-2">Terrain Bouskoura</h3>
                  <div className="flex items-center gap-3">
                     <span className="px-3 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-widest uppercase">
                        Titré
                     </span>
                     <span className="text-xs text-space-gray font-medium">Constructible</span>
                  </div>
               </div>
               
               <div className="text-left md:text-right">
                  <p className="text-[10px] uppercase tracking-widest text-space-gray mb-1 font-bold">Valeur Estimée</p>
                  <p className="text-3xl font-medium text-white tracking-tight">1.1 MDH</p>
               </div>
            </div>
         </div>
         
      </div>

      {/* Action Button */}
      <div className="flex justify-center mt-12">
        <button className="flex items-center justify-center gap-3 w-full max-w-md py-4 px-6 rounded-[20px] bg-white/[0.02] backdrop-blur-xl border border-neon-mint/30 hover:border-neon-mint shadow-[0_0_15px_rgba(52,199,89,0.1)] hover:shadow-[0_0_25px_rgba(52,199,89,0.25)] transition-all duration-500 group">
          <div className="text-neon-mint drop-shadow-[0_0_8px_rgba(52,199,89,0.8)] group-hover:scale-110 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <span className="text-white font-medium tracking-wide">+ Ajouter ou Modifier un Bien</span>
        </button>
      </div>
    </div>
  );
}
