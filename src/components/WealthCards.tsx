import { Building2, Landmark, Cpu, Gem, CircleDollarSign, PiggyBank } from 'lucide-react';
import { ViewType } from './Sidebar';
import { useWealthStore } from '../store/useWealthStore';

interface WealthCardsProps {
  onNavigate?: (view: ViewType) => void;
}

export default function WealthCards({ onNavigate }: WealthCardsProps) {
  const particuliers = useWealthStore((state) => state.particulier);

  const assets = [
    {
      title: 'Immobilier',
      value: particuliers.immobilier,
      change: 'Max 40%',
      icon: Building2,
      label: 'Emprunt'
    },
    {
      title: 'Bourse',
      value: particuliers.bourse,
      change: '+4.2%',
      icon: CircleDollarSign,
      label: 'OPCVM'
    },
    {
      title: 'Crypto',
      value: particuliers.crypto,
      change: '+12.1%',
      icon: Cpu,
      label: 'Digital Assets'
    },
    {
      title: 'Cash',
      value: particuliers.cash,
      change: '0.0%',
      icon: Landmark,
      label: 'Liquidités'
    },
    {
      title: 'Or & Métaux',
      value: particuliers.or,
      change: '0.0%',
      icon: Gem,
      label: 'Commodities'
    },
    {
      title: 'Épargne',
      value: particuliers.epargne,
      change: '+2.4%',
      icon: PiggyBank,
      label: 'Fonds de Réserve'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 px-4 md:px-10">
      {assets.map((asset) => {
        const isClickable = ['Crypto', 'Immobilier', 'Cash', 'Épargne', 'Bourse'].includes(asset.title);
        
        return (
          <div 
            key={asset.title} 
            onClick={() => {
              if (asset.title === 'Crypto' && onNavigate) onNavigate('crypto-detail');
              if (asset.title === 'Immobilier' && onNavigate) onNavigate('immobilier');
              if ((asset.title === 'Cash' || asset.title === 'Épargne') && onNavigate) onNavigate('cash-epargne');
              if (asset.title === 'Bourse' && onNavigate) onNavigate('bourse');
            }}
            className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-[12px] p-4 md:p-6 transition-all duration-300 flex flex-col justify-between gap-3 shadow-[inset_0_1px_4px_rgba(255,255,255,0.02)] ${isClickable ? 'cursor-pointer active:scale-[0.98] hover:bg-white/10 hover:border-[#34C759]/50' : 'cursor-default'}`}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-space-gray transition-colors opacity-80 shrink-0">
              <asset.icon size={18} strokeWidth={1.5} />
            </div>
            
            <div className="mt-1">
              <p className="text-[11px] md:text-[13px] text-space-gray tracking-wide mb-1 font-light">
                {asset.title}
              </p>
              <h3 className="text-sm md:text-xl font-bold text-white tracking-tight">
                {Number(asset.value).toLocaleString('fr-FR')} MAD
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
