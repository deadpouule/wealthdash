import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { ViewType } from '../components/Sidebar';

const holdings = [
  {
    label: "Maroc Telecom (IAM)",
    qty: 100,
    price: 95.50,
    change: "+1.2%",
    isPositive: true,
    points: "M0,25 C20,20 40,30 60,15 S80,20 100,5"
  },
  {
    label: "Attijariwafa Bank",
    qty: 40,
    price: 480.00,
    change: "+2.5%",
    isPositive: true,
    points: "M0,20 C15,25 30,10 50,20 S70,10 100,2"
  }
];

export default function BourseView({ onNavigate }: { onNavigate: (v: ViewType) => void }) {
  const totalValue = holdings.reduce((acc, curr) => acc + (curr.qty * curr.price), 0);

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
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
          <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-white">
            Détails Bourse
          </h2>
          <div className="text-left md:text-right">
            <p className="text-[10px] uppercase tracking-widest text-space-gray mb-1">Valorisation Totale</p>
            <p className="text-2xl font-light text-white tracking-tight">{totalValue.toLocaleString('fr-FR')} MAD</p>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="mt-16 w-full max-w-5xl">
        <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 px-8 py-5 border-b border-white/5 bg-white/[0.01]">
            <div className="col-span-2 text-[10px] uppercase tracking-widest text-space-gray font-bold">Valeur (Action)</div>
            <div className="text-[10px] uppercase tracking-widest text-space-gray font-bold text-right">Quantité</div>
            <div className="text-[10px] uppercase tracking-widest text-space-gray font-bold text-right">Cours (MAD)</div>
            <div className="text-[10px] uppercase tracking-widest text-space-gray font-bold text-right">Variation (%)</div>
          </div>

          {/* Table Body */}
          <div className="flex flex-col">
            {holdings.map((holding, idx) => (
              <div 
                key={idx} 
                className="grid grid-cols-5 gap-4 px-8 py-6 items-center border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
              >
                <div className="col-span-2 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-white/80">
                    <span className="text-xs font-medium">{holding.label.substring(0, 3).toUpperCase()}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-base mb-1">{holding.label}</h4>
                    <p className="text-xs text-space-gray">Bourse de Casablanca</p>
                  </div>
                </div>

                <div className="text-right text-white font-light text-lg">
                  {holding.qty}
                </div>

                <div className="text-right text-white font-light text-lg">
                  {holding.price.toFixed(2)}
                </div>

                <div className="text-right flex items-center justify-end gap-6">
                  {/* Sparkline */}
                  <div className="hidden lg:block w-16">
                    <svg viewBox="0 0 100 30" className={`w-full h-8 fill-none ${holding.isPositive ? 'stroke-neon-mint drop-shadow-[0_0_8px_rgba(52,199,89,0.4)]' : 'stroke-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`}>
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d={holding.points} />
                    </svg>
                  </div>
                  
                  <div className={`flex items-center gap-1 font-medium ${holding.isPositive ? 'text-neon-mint' : 'text-red-500'}`}>
                    {holding.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span className="text-sm tracking-wide">{holding.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center mt-12">
        <button className="flex items-center justify-center gap-3 w-full max-w-md py-4 px-6 rounded-[20px] bg-white/[0.02] backdrop-blur-xl border border-neon-mint/30 hover:border-neon-mint shadow-[0_0_15px_rgba(52,199,89,0.1)] hover:shadow-[0_0_25px_rgba(52,199,89,0.25)] transition-all duration-500 group">
          <div className="text-neon-mint drop-shadow-[0_0_8px_rgba(52,199,89,0.8)] group-hover:scale-110 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <span className="text-white font-medium tracking-wide">+ Ajouter ou Modifier une Action</span>
        </button>
      </div>
    </div>
  );
}
