import Header from './Header';
import Hero from './Hero';
import WealthCards from './WealthCards';
import AssetAllocation from './AssetAllocation';
import ProjectionChart from './ProjectionChart';
import { ViewType } from './Sidebar';

export default function DashboardView({ onNavigate }: { onNavigate: (v: ViewType) => void }) {
  return (
    <div className="space-y-4 animate-in fade-in duration-1000">
      <Hero />
      <WealthCards onNavigate={onNavigate} />
      
      <AssetAllocation />

      <div className="px-4 md:px-10 flex items-center justify-between mt-12 mb-4">
        <h4 className="text-[11px] md:text-sm font-medium tracking-widest uppercase text-space-gray">Intelligence d'Investissement</h4>
        <div className="h-[1px] flex-1 mx-4 md:mx-8 bg-[#1A1A1A]" />
        <div className="hidden md:flex gap-4">
          <button className="text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-white transition-colors cursor-pointer">Exporter Rapport</button>
        </div>
      </div>

      <ProjectionChart />
    </div>
  );
}
