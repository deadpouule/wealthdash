import { LayoutDashboard, ArrowLeftRight, Receipt, MessageSquare, FileScan, Users, Percent, Globe, Settings2, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useState } from 'react';
import Logo from './Logo';

export type ViewType = 'dashboard' | 'cashflow' | 'taxes' | 'community' | 'crypto-detail' | 'immobilier' | 'cash' | 'epargne' | 'bourse' | 'or' | 'factures' | 'rh' | 'fiscalite' | 'business-tresorerie' | 'business-flux' | 'business-stock' | 'business-rh' | 'business-dettes' | 'business-fiscal';

const particulierItems = [
  { id: 'dashboard' as ViewType, icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'cashflow' as ViewType, icon: ArrowLeftRight, label: 'Cashflow' },
  { id: 'taxes' as ViewType, icon: Receipt, label: 'Taxes' },
  { id: 'community' as ViewType, icon: MessageSquare, label: 'Communauté' },
];

const businessItems = [
  { id: 'dashboard' as ViewType, icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'factures' as ViewType, icon: FileScan, label: 'Factures' },
  { id: 'rh' as ViewType, icon: Users, label: 'G. RH' },
  { id: 'fiscalite' as ViewType, icon: Percent, label: 'Fisc. Pro' },
  { id: 'community' as ViewType, icon: Globe, label: 'B2B' },
];

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  mode?: 'Particulier' | 'Business';
}

export default function Sidebar({ currentView, onNavigate, mode = 'Particulier' }: SidebarProps) {
  const navItems = mode === 'Business' ? businessItems : particulierItems;
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <aside className="fixed bottom-0 md:top-0 left-0 w-full h-[80px] md:h-screen md:w-[72px] subtle-outline border-t border-x-0 md:border-y-0 md:border-l-0 flex flex-row md:flex-col items-center justify-between md:justify-start z-50 bg-[#0A0A0B]/90 backdrop-blur-3xl pb-safe">
      
      {/* Desktop Logo */}
      <div 
        onClick={() => onNavigate('dashboard')}
        className="hidden md:flex flex-col items-center justify-center mt-8 mb-10 transition-transform active:scale-95 cursor-pointer group"
      >
        <Logo size={40} className="mb-2 group-hover:scale-105 transition-transform duration-500" />
        <span className="text-white font-bold text-[11px] tracking-[0.3em] uppercase">
          noria
        </span>
      </div>
      
      <nav className="flex-1 flex flex-row md:flex-col items-center justify-around md:justify-center px-2 md:px-0 gap-0 md:gap-10 w-full h-[80px] md:h-auto mx-auto max-w-sm md:max-w-none relative">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-14 h-14 md:w-10 md:h-10 rounded-xl md:rounded-md transition-all duration-300 group relative flex flex-col md:flex-row items-center justify-center active:scale-[0.98]",
                isActive ? "opacity-100 text-[#34C759]" : "opacity-40 text-white hover:opacity-100 hover:bg-white/10"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId={`active-pill-${mode}`}
                  className="absolute inset-0 bg-white/5 md:bg-white/10 rounded-xl md:rounded-md border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center justify-center">
                <item.icon size={22} strokeWidth={isActive ? 2 : 1.5} className="md:w-[16px] md:h-[16px]" />
                {/* Mobile Text Label */}
                <span className={cn(
                  "block md:hidden text-[9px] mt-1 tracking-wider uppercase font-medium transition-opacity", 
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                   {item.label}
                </span>
              </div>
              
              {/* Desktop Tooltip */}
              <span className="hidden md:block absolute left-14 bg-midnight border border-[#1A1A1A] px-3 py-1.5 rounded-md text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                {item.label}
              </span>
            </button>
          );
        })}
        
        {/* Mobile-only Settings Menu Trigger */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="flex md:hidden w-14 h-14 rounded-xl flex-col items-center justify-center relative text-space-gray transition-colors hover:text-white z-10"
        >
          <Settings2 size={22} strokeWidth={1.5} />
          <span className="text-[9px] mt-1 tracking-wider uppercase font-medium">Menu</span>
        </button>
      </nav>

      {/* Desktop Footer Actions */}
      <div 
        onClick={() => { localStorage.clear(); window.location.reload(); }}
        className="hidden md:block mt-auto mb-10 p-2 text-space-gray hover:text-red-500 transition-colors cursor-pointer group relative"
      >
        <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-red-500/10 subtle-outline flex items-center justify-center border-dashed">
           <LogOut size={12} />
        </div>
        <span className="absolute left-12 top-1 bg-midnight border border-red-500/20 text-red-500 px-3 py-1.5 rounded-md text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          Reset Data
        </span>
      </div>

      {/* Mobile Settings Modal Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-midnight/80 backdrop-blur-md z-40 md:hidden flex flex-col justify-end">
           <motion.div 
             initial={{ y: "100%" }}
             animate={{ y: 0 }}
             exit={{ y: "100%" }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
             className="bg-[#0A0A0B] border-t border-[#1A1A1A] rounded-t-3xl p-6 pb-32 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]"
           >
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-8" />
              <h3 className="text-white text-lg font-light tracking-tight mb-6">Paramètres Systèmes</h3>
              <div className="space-y-4">
                 <button 
                  onClick={() => { localStorage.clear(); window.location.reload(); }}
                  className="flex items-center gap-4 w-full p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-500 font-medium active:scale-95 transition-transform"
                 >
                   <LogOut size={20} /> Réinitialiser les données (Logout)
                 </button>
              </div>
           </motion.div>
           <button 
             onClick={() => setShowMobileMenu(false)}
             className="absolute inset-0 z-[-1] cursor-default"
           />
        </div>
      )}
    </aside>
  );
}
