import { User, Briefcase } from 'lucide-react';
import { cn } from '../lib/utils';
import { useWealthStore } from '../store/useWealthStore';
import Logo from './Logo';

export default function Header() {
  const mode = useWealthStore(state => state.mode);
  const setMode = useWealthStore(state => state.setMode);

  return (
    <header className="flex items-center justify-between py-6 px-6 md:px-10 bg-transparent z-40 w-full max-w-7xl mx-auto">
      
      {/* Left side: Miniature Logo (Visible on mobile or as requested) */}
      <div className="flex items-center gap-3">
        <Logo size={28} />
        <span className="text-white font-bold text-[10px] tracking-[0.2em] uppercase hidden sm:block">
          noria
        </span>
      </div>

      {/* Dual-Mode Toggle */}
      <div className="flex bg-white/[0.02] border border-[#1A1A1A] rounded-full p-1 shadow-sm">
        <button
          onClick={() => setMode('Particulier')}
          className={cn(
            "flex items-center gap-2 px-5 py-2 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all duration-300",
            mode === 'Particulier' 
              ? "bg-white/[0.03] text-[#34C759] shadow-[0_0_15px_rgba(52,199,89,0.1)] border border-[#34C759]/20" 
              : "text-space-gray hover:text-white border border-transparent"
          )}
        >
          <User size={14} /> <span className="hidden md:inline">Particulier</span>
        </button>
        <button
          onClick={() => setMode('Business')}
          className={cn(
            "flex items-center gap-2 px-5 py-2 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all duration-300",
            mode === 'Business' 
              ? "bg-white/[0.03] text-[#34C759] shadow-[0_0_15px_rgba(52,199,89,0.1)] border border-[#34C759]/20" 
              : "text-space-gray hover:text-white border border-transparent"
          )}
        >
          <Briefcase size={14} /> <span className="hidden md:inline">Business</span>
        </button>
      </div>
    </header>
  );
}
