import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center py-10 px-10">
      <span className="text-[12px] text-space-gray uppercase tracking-[2px] mb-2 font-light">Valeur Nette Totale</span>
      <h2 className="text-6xl md:text-[64px] font-extralight tracking-tighter text-white mb-4">
        175.750 MAD
      </h2>
      
      <div className="flex items-end gap-[2px] h-5 h-5">
        {[40, 55, 45, 70, 60, 85, 100].map((height, i) => (
          <div 
            key={i} 
            className={cn(
              "w-[3px] bg-neon-mint transition-all duration-700",
              height === 100 ? "opacity-100" : "opacity-30"
            )}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </section>
  );
}
