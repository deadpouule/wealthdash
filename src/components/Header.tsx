import { User } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between py-6 px-6 md:px-10 bg-transparent z-40 w-full">
      <h1 className="text-xl font-light tracking-tight text-white">
        Bonjour, <span className="font-normal text-white">Maître</span>
      </h1>
      
      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
        <User size={16} strokeWidth={1.5} className="text-white/80" />
      </div>
    </header>
  );
}
