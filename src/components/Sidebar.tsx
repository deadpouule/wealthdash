import { LayoutDashboard, ArrowLeftRight, Receipt, MessageSquare, FileScan, Users, Percent, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

export type ViewType = 'dashboard' | 'cashflow' | 'taxes' | 'community' | 'crypto-detail' | 'immobilier' | 'cash-epargne' | 'bourse' | 'factures' | 'rh' | 'fiscalite' | 'business-tresorerie' | 'business-flux' | 'business-stock' | 'business-rh' | 'business-dettes' | 'business-fiscal';

const particulierItems = [
  { id: 'dashboard' as ViewType, icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'cashflow' as ViewType, icon: ArrowLeftRight, label: 'Cashflow' },
  { id: 'taxes' as ViewType, icon: Receipt, label: 'Taxes' },
  { id: 'community' as ViewType, icon: MessageSquare, label: 'Info & Communauté' },
];

const businessItems = [
  { id: 'dashboard' as ViewType, icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'factures' as ViewType, icon: FileScan, label: 'Saisie & Factures' },
  { id: 'rh' as ViewType, icon: Users, label: 'Gestion RH' },
  { id: 'fiscalite' as ViewType, icon: Percent, label: 'Fiscalité Pro' },
  { id: 'community' as ViewType, icon: Globe, label: 'Communauté B2B' },
];

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  mode?: 'Particulier' | 'Business';
}

export default function Sidebar({ currentView, onNavigate, mode = 'Particulier' }: SidebarProps) {
  const navItems = mode === 'Business' ? businessItems : particulierItems;

  return (
    <aside className="fixed bottom-0 md:top-0 left-0 w-full h-[80px] md:h-screen md:w-[72px] subtle-outline border-t border-x-0 md:border-y-0 md:border-l-0 flex flex-row md:flex-col items-center justify-between md:justify-start py-0 md:py-8 z-50 bg-[#0A0A0B]/90 backdrop-blur-3xl pb-safe">
      <div className="hidden md:flex w-8 h-8 rounded-full bg-white items-center justify-center mb-10 md:mt-0 transition-transform active:scale-95 cursor-pointer">
        <div className="w-4 h-4 rounded-sm bg-midnight" />
      </div>
      
      <nav className="flex-1 flex md:flex-col items-center justify-center gap-8 md:gap-10 w-full h-[72px] md:h-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-8 h-8 md:w-6 md:h-6 rounded-md border transition-all duration-300 group relative flex items-center justify-center",
                isActive 
                  ? "border-white bg-white/5 opacity-100" 
                  : "border-space-gray opacity-50 hover:opacity-100"
              )}
            >
              <item.icon size={16} strokeWidth={1.5} className={cn(isActive ? "text-white" : "text-space-gray", "md:w-[14px] md:h-[14px]")} />
              <span className="hidden md:block absolute left-16 bg-midnight subtle-outline px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div 
        onClick={() => { localStorage.clear(); window.location.reload(); }}
        className="hidden md:block mt-auto mb-10 p-2 text-space-gray hover:text-white transition-colors cursor-pointer"
        title="Reset Application & Onboarding"
      >
        <div className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 subtle-outline flex items-center justify-center border-dashed">
           <span className="text-[10px] font-bold">RST</span>
        </div>
      </div>
    </aside>
  );
}
