import { ArrowLeft } from 'lucide-react';
import { ViewType } from '../components/Sidebar';

export default function CryptoDetailView({ onNavigate }: { onNavigate: (v: ViewType) => void }) {
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
          Détails Crypto
        </h2>
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-2xl mx-auto py-10">
        <h2 className="text-5xl font-extralight tracking-tighter text-white">Actif total : 12 000 MAD</h2>
        
        {/* Simple segmented horizontal bar */}
        <div className="h-2 w-full rounded-full overflow-hidden flex shadow-[0_0_20px_rgba(52,199,89,0.1)]">
          <div className="h-full bg-neon-mint" style={{ width: '75%' }} title="Bitcoin: 75%" />
          <div className="h-full bg-white/60" style={{ width: '10%' }} title="Ethereum: 10%" />
          <div className="h-full bg-white/20" style={{ width: '15%' }} title="HYPE: 15%" />
        </div>
        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-space-gray pt-2">
           <span>Bitcoin (75%)</span>
           <span>Ethereum (10%)</span>
           <span>HYPE (15%)</span>
        </div>
      </div>

      {/* List View */}
      <div className="max-w-4xl mx-auto space-y-4">
         <div className="glass-card p-6 flex justify-between items-center rounded-2xl group hover:border-white/20 transition-all cursor-default">
            <div className="flex items-center gap-6">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 group-hover:text-neon-mint transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M9 10h6"/><path d="M9 14h6"/></svg>
              </div>
              <div>
                <p className="text-lg text-white font-medium">Bitcoin (BTC)</p>
                <p className="text-xs text-space-gray">0.012 BTC</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg text-white font-medium">9.000 MAD</p>
              <p className="text-xs text-neon-mint font-bold tracking-widest">+4.2%</p>
            </div>
         </div>

         <div className="glass-card p-6 flex justify-between items-center rounded-2xl group hover:border-white/20 transition-all cursor-default">
            <div className="flex items-center gap-6">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/></svg>
              </div>
              <div>
                <p className="text-lg text-white font-medium">Ethereum (ETH)</p>
                <p className="text-xs text-space-gray">0.038 ETH</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg text-white font-medium">1.200 MAD</p>
              <p className="text-xs text-neon-mint font-bold tracking-widest">+1.5%</p>
            </div>
         </div>

         <div className="glass-card p-6 flex justify-between items-center rounded-2xl group hover:border-white/20 transition-all cursor-default">
            <div className="flex items-center gap-6">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <div>
                <p className="text-lg text-white font-medium">HYPE (HYPE)</p>
                <p className="text-xs text-space-gray">500.00 HYPE</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg text-white font-medium">1.800 MAD</p>
              <p className="text-xs text-neon-mint font-bold tracking-widest">+12.4%</p>
            </div>
         </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center mt-12">
        <button className="flex items-center justify-center gap-3 w-full max-w-md py-4 px-6 rounded-[20px] bg-white/[0.02] backdrop-blur-xl border border-neon-mint/30 hover:border-neon-mint shadow-[0_0_15px_rgba(52,199,89,0.1)] hover:shadow-[0_0_25px_rgba(52,199,89,0.25)] transition-all duration-500 group">
          <div className="text-neon-mint drop-shadow-[0_0_8px_rgba(52,199,89,0.8)] group-hover:scale-110 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <span className="text-white font-medium tracking-wide">+ Ajouter ou Modifier un Actif</span>
        </button>
      </div>
    </div>
  );
}
