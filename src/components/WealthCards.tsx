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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-10">
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
            className={`glass-card p-6 rounded-2xl transition-all duration-500 flex flex-col gap-4 ${isClickable ? 'cursor-pointer group hover:border-white/20' : 'cursor-default group'}`}
          >
            <div className="w-5 h-5 text-space-gray group-hover:text-white transition-colors opacity-80">
              <asset.icon size={20} strokeWidth={1.2} />
            </div>
            
            <div>
              <p className="text-[13px] text-space-gray tracking-wide mb-1">
                {asset.title}
              </p>
              <h3 className="text-xl font-normal text-white">
                {asset.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
