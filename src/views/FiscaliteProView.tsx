import { useMemo } from 'react';
import { ArrowLeft, Car, Package, Users, TrendingUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { ViewType } from '../components/Sidebar';
import { useWealthStore } from '../store/useWealthStore';
import { WealthEngine } from '../lib/WealthEngine';

interface Props {
  onNavigate: (v: ViewType) => void;
}

export default function FiscaliteProView({ onNavigate }: Props) {
  const business = useWealthStore(state => state.business);
  
  // Real calculations based on Moroccan law script
  const IS = WealthEngine.calculateIS(business.resultatComptable);
  const isCMEngine = WealthEngine.calculateImpotDu(business.resultatComptable, business.chiffreAffairesHT) > IS;

  // Simulate provision IS over the year (amber sparkline data)
  const sparklineData = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => {
      const base = 40000;
      const progress = i / 39;
      // Exponential curve for tax provision building up, with organic variation
      const trend = base + (IS - base) * Math.pow(progress, 1.8);
      const noise = Math.sin(progress * Math.PI * 4) * 3000 * (progress < 0.8 ? 1 : 0.2);
      return { value: trend + noise };
    });
  }, [IS]);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 px-6 md:px-10 pt-8 pb-20 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-space-gray hover:text-white transition-colors text-xs uppercase tracking-widest font-bold mb-6"
          >
            <ArrowLeft size={14} /> Retour
          </button>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h2 className="text-3xl md:text-[40px] font-extralight tracking-tight text-white leading-none">
              Tableau de Bord Fiscal <span className="text-space-gray hidden md:inline">(Simulation)</span>
            </h2>
            <span className="px-3 py-1 bg-white/[0.05] border border-[#1A1A1A] rounded-full text-[10px] uppercase tracking-widest text-white/50 w-fit">
              Exercice : 2026 (Provisoire)
            </span>
          </div>
        </div>
      </div>

      {/* Hero Sparkline Section */}
      <section className="flex flex-col items-center justify-center py-6 w-full max-w-4xl mx-auto">
        <span className="text-[12px] text-space-gray uppercase tracking-[2px] mb-2 font-light">Provision {isCMEngine ? 'Cotisation Minimale' : 'IS'}</span>
        <h2 className="text-5xl md:text-[64px] font-extralight tracking-tighter text-white mb-3">
          {Number(Math.max(IS, WealthEngine.calculateCM(business.chiffreAffairesHT))).toLocaleString('fr-FR')} MAD
        </h2>
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="text-amber-500" size={14} />
          <span className="text-amber-500 font-medium text-[13px] tracking-wide">Estimé via Moteur TS</span>
        </div>

        {/* Amber Sparkline */}
        <div className="w-full h-24 md:h-32 relative pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData} margin={{ top: 15, bottom: 15, left: 10, right: 10 }}>
              <defs>
                <filter id="amber-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#F59E0B" floodOpacity="0.4" />
                  <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#F59E0B" floodOpacity="0.7" />
                </filter>
              </defs>
              <YAxis domain={['auto', 'auto']} hide />
              <Line 
                type="basis" 
                dataKey="value" 
                stroke="#F59E0B" 
                strokeWidth={2.5} 
                dot={false}
                activeDot={false}
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease-out"
                filter="url(#amber-glow)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        
        {/* Tax Breakdown (Left Card) */}
        <div className="bg-white/[0.02] backdrop-blur-[25px] border border-[#1A1A1A] rounded-[24px] p-8 md:p-10 flex flex-col">
          <h3 className="text-[13px] uppercase tracking-[2px] text-space-gray font-bold mb-8">
            Composantes de l'Impôt
          </h3>
          
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end border-b border-[#1A1A1A] pb-4">
              <span className="text-white/80 font-light text-[15px]">Résultat Comptable</span>
              <span className="text-white font-medium">{Number(business.resultatComptable).toLocaleString('fr-FR')} MAD</span>
            </div>
            
            <div className="flex justify-between items-end border-b border-[#1A1A1A] pb-4">
              <div className="flex flex-col">
                <span className="text-white/80 font-light text-[15px]">Cotisation Minimale (CM)</span>
                <span className="text-space-gray text-[11px] mt-1 max-w-[200px] hidden md:block">0.25% du CA HT ({Number(business.chiffreAffairesHT).toLocaleString()} MAD)</span>
              </div>
              <span className="text-white/50 font-medium">+{Number(WealthEngine.calculateCM(business.chiffreAffairesHT)).toLocaleString('fr-FR')} MAD</span>
            </div>

            <div className="flex justify-between items-end border-b border-[#1A1A1A] pb-4">
              <div className="flex flex-col">
                <span className="text-white/80 font-light text-[15px]">IS Théorique (Barème Progressif)</span>
                <span className="text-space-gray text-[11px] mt-1 max-w-[200px] hidden md:block">Abattements inclus</span>
              </div>
              <span className="text-neon-mint/80 font-medium">{Number(IS).toLocaleString('fr-FR')} MAD</span>
            </div>

            <div className="flex justify-between items-end pt-4 mt-2">
              <span className="text-white font-medium text-[16px]">Impôt Total Dû</span>
              <span className="text-white font-bold text-xl tracking-tight">{Number(Math.max(IS, WealthEngine.calculateCM(business.chiffreAffairesHT))).toLocaleString('fr-FR')} MAD</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-amber-500 tracking-wider uppercase">({isCMEngine ? 'Soumis à la CM' : 'Soumis à l\'IS'})</span>
            </div>
          </div>
        </div>

        {/* Optimization Center (Right Card) */}
        <div className="bg-white/[0.02] backdrop-blur-[25px] border border-[#1A1A1A] rounded-[24px] p-8 md:p-10 flex flex-col">
          <h3 className="text-[13px] uppercase tracking-[2px] text-space-gray font-bold mb-8 flex items-center gap-2">
            Opportunités d'Optimisation IS <span className="hidden md:inline">(Simulées)</span>
          </h3>

          <div className="flex flex-col gap-4">
            
            {/* Opti 1 */}
            <div className="flex items-start md:items-center justify-between gap-4 p-4 rounded-[16px] hover:bg-white/[0.02] border border-transparent hover:border-[#1A1A1A] transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-space-gray group-hover:text-neon-mint transition-colors shrink-0">
                  <Car size={16} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-neon-mint tracking-wider font-bold mb-1">LOA / Leasing</span>
                  <span className="text-white/80 font-light text-[14px]">Passer le véhicule de société en LOA</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase text-space-gray tracking-widest block mb-1">Gain IS</span>
                <span className="text-neon-mint font-medium whitespace-nowrap">-25.000 MAD</span>
              </div>
            </div>

            {/* Opti 2 */}
            <div className="flex items-start md:items-center justify-between gap-4 p-4 rounded-[16px] hover:bg-white/[0.02] border border-transparent hover:border-[#1A1A1A] transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-space-gray group-hover:text-neon-mint transition-colors shrink-0">
                  <Package size={16} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-neon-mint tracking-wider font-bold mb-1">Matériel Pro</span>
                  <span className="text-white/80 font-light text-[14px]">Investir dans de nouvelles machines</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase text-space-gray tracking-widest block mb-1">Gain IS</span>
                <span className="text-neon-mint font-medium whitespace-nowrap">-40.000 MAD</span>
              </div>
            </div>

            {/* Opti 3 */}
            <div className="flex items-start md:items-center justify-between gap-4 p-4 rounded-[16px] hover:bg-white/[0.02] border border-transparent hover:border-[#1A1A1A] transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-space-gray group-hover:text-neon-mint transition-colors shrink-0">
                  <Users size={16} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-neon-mint tracking-wider font-bold mb-1">Primes</span>
                  <span className="text-white/80 font-light text-[14px]">Verser une prime exceptionnelle</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase text-space-gray tracking-widest block mb-1">Gain IS</span>
                <span className="text-neon-mint font-medium whitespace-nowrap">-12.000 MAD</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
