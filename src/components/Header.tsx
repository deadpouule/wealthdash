import { User } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between py-6 px-10 sticky top-0 bg-midnight/80 backdrop-blur-sm z-40 h-20">
      <h1 className="text-lg font-light tracking-wide text-space-gray">
        Bonjour, <span className="text-white font-normal">Maître</span>
      </h1>
      
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end mr-2">
          <span className="text-[10px] text-space-gray uppercase tracking-widest font-semibold">Premium Member</span>
          <span className="text-xs text-white/80">Marc-Antoine P.</span>
        </div>
        <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
          <User size={18} strokeWidth={1.5} />
        </div>
      </div>
    </header>
  );
}
