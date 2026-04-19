import { Wallet, ArrowRightLeft, Package, Users, Landmark, Target } from 'lucide-react';
import { useWealthStore } from '../store/useWealthStore';

export default function BusinessCards({ onNavigate }: { onNavigate?: (v: any) => void }) {
  const business = useWealthStore((state) => state.business);

  const employerCost = business.employes?.reduce((sum, emp) => sum + Number(emp.costGlobal || 0), 0) || 85000;

  const businessAssets = [
    { title: 'Trésorerie', value: `${Number(business.tresorerie).toLocaleString('fr-FR')} MAD`, icon: Wallet, path: 'business-tresorerie' },
    { title: 'Flux (In/Out)', value: `+${(Number(business.fluxIn)/1000).toFixed(0)}k / -${(Number(business.fluxOut)/1000).toFixed(0)}k`, icon: ArrowRightLeft, path: 'business-flux' },
    { title: 'Stock & Matériel', value: `${Number(business.stock).toLocaleString('fr-FR')} MAD`, icon: Package, path: 'business-stock' },
    { title: 'Salaires & RH', value: `-${Number(employerCost).toLocaleString('fr-FR')} / m`, icon: Users, path: 'business-rh' },
    { title: 'Dettes & Crédits', value: `${Number(business.dettes).toLocaleString('fr-FR')} MAD`, icon: Landmark, path: 'business-dettes' },
    { title: 'Radar Fiscal', value: 'IS/TVA', icon: Target, hasWarning: true, path: 'business-fiscal' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 px-4 md:px-10 mt-8 mb-12 w-full max-w-7xl mx-auto">
      {businessAssets.map((asset) => (
        <div 
          key={asset.title} 
          onClick={() => onNavigate?.(asset.path)}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[12px] p-4 md:p-6 transition-all duration-300 flex flex-col justify-between gap-3 shadow-[inset_0_1px_4px_rgba(255,255,255,0.02)] cursor-pointer active:scale-[0.98] hover:bg-white/10 hover:border-[#34C759]/50 relative group"
        >
          {asset.hasWarning && (
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
          )}
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-space-gray transition-colors opacity-80 shrink-0 group-hover:text-[#34C759]">
            <asset.icon size={18} strokeWidth={1.5} />
          </div>
          
          <div className="mt-1">
            <p className="text-[11px] md:text-[13px] text-space-gray tracking-wide mb-1 font-light">
              {asset.title}
            </p>
            <h3 className="text-sm md:text-xl font-bold text-white tracking-tight">
              {asset.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
