import { Building2, Landmark, Cpu, Gem, CircleDollarSign, PiggyBank } from 'lucide-react';
import { ViewType } from './Sidebar';

const assets = [
  {
    title: 'Immobilier',
    value: '750.000 MAD',
    change: 'Max 40%',
    icon: Building2,
    label: 'Emprunt'
  },
  {
    title: 'Bourse',
    value: '28.750 MAD',
    change: '+4.2%',
    icon: CircleDollarSign,
    label: 'OPCVM'
  },
  {
    title: 'Crypto',
    value: '12.000 MAD',
    change: '+12.1%',
    icon: Cpu,
    label: 'Digital Assets'
  },
  {
    title: 'Cash',
    value: '25.000 MAD',
    change: '0.0%',
    icon: Landmark,
    label: 'Liquidités'
  },
  {
    title: 'Or & Métaux',
    value: '0 MAD',
    change: '0.0%',
    icon: Gem,
    label: 'Commodities'
  },
  {
    title: 'Épargne',
    value: '110.000 MAD',
    change: '+2.4%',
    icon: PiggyBank,
    label: 'Fonds de Réserve'
  }
];

interface WealthCardsProps {
  onNavigate?: (view: ViewType) => void;
}

export default function WealthCards({ onNavigate }: WealthCardsProps) {
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
            className={`bg-white/[0.03] backdrop-blur-[25px] border border-[#1A1A1A] rounded-[12px] p-4 md:p-6 transition-all duration-500 flex flex-col justify-between gap-3 ${isClickable ? 'cursor-pointer active:scale-[0.98] md:hover:border-white/20' : 'cursor-default'}`}
          >
            <div className="w-4 h-4 md:w-5 md:h-5 text-space-gray transition-colors opacity-80">
              <asset.icon size={18} strokeWidth={1} />
            </div>
            
            <div className="mt-1">
              <p className="text-[11px] md:text-[13px] text-space-gray tracking-wide mb-1 font-medium">
                {asset.title}
              </p>
              <h3 className="text-sm md:text-xl font-normal text-white tracking-tight">
                {asset.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
