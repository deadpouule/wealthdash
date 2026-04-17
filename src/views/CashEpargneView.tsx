import { ArrowLeft, Landmark, Wallet } from 'lucide-react';
import { ViewType } from '../components/Sidebar';
import { motion } from 'motion/react';

export default function CashEpargneView({ onNavigate }: { onNavigate: (v: ViewType) => void }) {
  return (
    <div className="space-y-12 animate-in fade-in duration-1000 px-10 pt-8 pb-20">
      {/* Header */}
      <div>
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-space-gray hover:text-white transition-colors text-xs uppercase tracking-widest font-bold mb-8"
        >
          <ArrowLeft size={14} /> Retour au Cockpit
        </button>
        <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-white mb-2">
          Liquidités & Épargne
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        {/* Section Cash */}
        <div className="space-y-6">
          <h3 className="text-xl font-light text-white flex items-center gap-3">
            <Wallet className="text-space-gray" size={20} strokeWidth={1.5} />
            Trésorerie (Cash)
          </h3>
          <div className="flex flex-col gap-4">
            <div className="glass-card p-8 rounded-3xl group hover:border-white/20 transition-all cursor-default">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-white font-medium text-lg mb-1">Attijariwafa Bank</h4>
                  <p className="text-xs text-space-gray">Compte Courant</p>
                </div>
                <span className="text-2xl font-light text-white tracking-tight">20.000 MAD</span>
              </div>
            </div>
            
            <div className="glass-card p-8 rounded-3xl group hover:border-white/20 transition-all cursor-default">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-white font-medium text-lg mb-1">BMCE Bank</h4>
                  <p className="text-xs text-space-gray">Compte Devises (€)</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-light text-white tracking-tight">5.000 MAD</span>
                  <p className="text-[10px] text-space-gray mt-2 uppercase tracking-widest">~ 460 EUR</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Epargne */}
        <div className="space-y-6">
          <h3 className="text-xl font-light text-white flex items-center gap-3">
            <Landmark className="text-space-gray" size={20} strokeWidth={1.5} />
            Épargne Sécurisée
          </h3>
          <div className="flex flex-col gap-4">
            <div className="glass-card p-8 rounded-3xl group hover:border-white/20 transition-all cursor-default">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-white font-medium text-lg mb-1">Compte sur Carnet</h4>
                  <p className="text-xs text-space-gray">Rendement: 2.5% net</p>
                </div>
                <span className="text-2xl font-light text-white tracking-tight">10.000 MAD</span>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl group hover:border-white/20 transition-all cursor-default relative overflow-hidden flex flex-col justify-between">
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-neon-mint/[0.03] to-transparent pointer-events-none" />
              
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div>
                  <h4 className="text-white font-medium text-lg mb-1">Fonds d'Urgence</h4>
                  <p className="text-xs text-space-gray">OPCVM Monétaire</p>
                </div>
                <span className="text-2xl font-light text-white tracking-tight">100.000 MAD</span>
              </div>
              
              {/* Goal Progress Bar */}
              <div className="relative z-10 w-full">
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-space-gray mb-3">
                  <span>Objectif: 1 an de charges</span>
                  <span className="text-white">150.000 MAD</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                  <motion.div 
                    className="h-full bg-neon-mint shadow-[0_0_12px_rgba(52,199,89,0.8)]"
                    initial={{ width: 0 }}
                    animate={{ width: '66%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
                <p className="text-right text-[10px] text-neon-mint font-bold tracking-widest uppercase mt-3">66% atteint</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
