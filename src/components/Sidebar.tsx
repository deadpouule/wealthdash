import { LayoutDashboard, ArrowLeftRight, Receipt, BarChart2, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

export type ViewType = 'dashboard' | 'cashflow' | 'taxes' | 'community' | 'crypto-detail' | 'immobilier' | 'cash-epargne' | 'bourse';

const navItems = [
  { id: 'dashboard' as ViewType, icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'cashflow' as ViewType, icon: ArrowLeftRight, label: 'Cashflow' },
  { id: 'taxes' as ViewType, icon: Receipt, label: 'Taxes' },
  { id: 'community' as ViewType, icon: MessageSquare, label: 'Info & Communauté' },
];

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[72px] subtle-outline border-y-0 border-l-0 flex flex-col items-center py-8 z-50 bg-midnight">
      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-10 transition-transform active:scale-95 cursor-pointer">
        <div className="w-4 h-4 rounded-sm bg-midnight" />
      </div>
      
      <nav className="flex-1 flex flex-col gap-10">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-6 h-6 rounded-md border transition-all duration-300 group relative flex items-center justify-center",
                isActive 
                  ? "border-white bg-white/5 opacity-100" 
                  : "border-space-gray opacity-50 hover:opacity-100"
              )}
            >
              <item.icon size={14} strokeWidth={1.5} className={cn(isActive ? "text-white" : "text-space-gray")} />
              <span className="absolute left-16 bg-midnight subtle-outline px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto mb-10 p-2 text-space-gray hover:text-white transition-colors cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-white/5 subtle-outline flex items-center justify-center border-dashed">
           <span className="text-[10px] font-medium">MP</span>
        </div>
      </div>
    </aside>
  );
}
