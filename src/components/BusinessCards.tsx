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
          className="bg-white/[0.03] backdrop-blur-[25px] border border-[#1A1A1A] rounded-[16px] p-5 md:p-6 transition-all duration-500 flex flex-col justify-between gap-4 cursor-pointer active:scale-[0.98] hover:border-white/20 relative group"
        >
          {asset.hasWarning && (
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
          )}
          <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-space-gray transition-colors group-hover:bg-white/10 group-hover:text-white">
            <asset.icon size={14} strokeWidth={1.5} />
          </div>
          
          <div className="mt-2 text-left">
            <p className="text-[11px] md:text-[13px] text-space-gray tracking-widest uppercase mb-1.5 font-bold">
              {asset.title}
            </p>
            <h3 className="text-xl md:text-2xl font-light text-white tracking-tight">
              {asset.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
