import { ViewType } from '../components/Sidebar';
import { ArrowLeft } from 'lucide-react';

interface Props {
  title: string;
  onNavigate: (v: ViewType) => void;
  actionLabel?: string;
}

export default function GenericDetailView({ title, onNavigate, actionLabel = '+ Ajouter ou Modifier' }: Props) {
  return (
    <div className="space-y-12 animate-in fade-in duration-1000 px-10 pt-8 pb-20 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-space-gray hover:text-white transition-colors text-xs uppercase tracking-widest font-bold mb-8"
        >
          <ArrowLeft size={14} /> Retour
        </button>
        <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-white mb-2">
          {title}
        </h2>
      </div>

      <div className="py-20 flex items-center justify-center border border-[#1A1A1A] bg-white/[0.01] rounded-3xl backdrop-blur-md">
        <p className="text-space-gray text-sm tracking-widest uppercase">Données en cours de synchronisation...</p>
      </div>

      {/* Action Button */}
      <div className="flex justify-center mt-12">
        <button className="flex items-center justify-center gap-3 w-full max-w-md py-4 px-6 rounded-[20px] bg-white/[0.02] backdrop-blur-xl border border-neon-mint/30 hover:border-neon-mint shadow-[0_0_15px_rgba(52,199,89,0.1)] hover:shadow-[0_0_25px_rgba(52,199,89,0.25)] transition-all duration-500 group">
          <div className="text-neon-mint drop-shadow-[0_0_8px_rgba(52,199,89,0.8)] group-hover:scale-110 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <span className="text-white font-medium tracking-wide">{actionLabel}</span>
        </button>
      </div>
    </div>
  );
}
