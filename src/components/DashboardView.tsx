import Header from './Header';
import Hero from './Hero';
import WealthCards from './WealthCards';
import ProjectionChart from './ProjectionChart';
import { ViewType } from './Sidebar';

export default function DashboardView({ onNavigate }: { onNavigate: (v: ViewType) => void }) {
  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <Hero />
      <WealthCards onNavigate={onNavigate} />
      
      <div className="px-10 flex items-center justify-between">
        <h4 className="text-sm font-medium tracking-wide uppercase text-space-gray">Intelligence d'Investissement</h4>
        <div className="h-[1px] flex-1 mx-8 bg-border-subtle" />
        <div className="flex gap-4">
          <button className="text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-white transition-colors cursor-pointer">Exporter Rapport</button>
          <button className="text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-white transition-colors cursor-pointer">Analyses Avancées</button>
        </div>
      </div>

      <ProjectionChart />
    </div>
  );
}
