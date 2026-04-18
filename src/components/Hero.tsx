import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { cn } from '../lib/utils';

export default function Hero({ title = "Valeur Nette Totale", initialValue = 2842150 }: { title?: string, initialValue?: number }) {
  const [period, setPeriod] = useState<'3m'|'6m'|'1an'|'Tout'>('1an');
  const [netWorth, setNetWorth] = useState(initialValue);

  // Read individual user data if available from onboarding
  useEffect(() => {
    setNetWorth(initialValue); // Sync prop to state if it changes
    const income = localStorage.getItem('userIncome');
    if (income) {
      // Simulate an individual net worth based on their income profile if they just onboarded
      // (For realism, we assume a multiplier if they have no other data, or keep standard)
      // Here we just keep 2.842.150 flat for the V2 design, but the curve is geometrically tied to it.
    }
  }, []);

  // Generate a totally continuous, mathematically smooth curve tailored to the user's exact net worth
  const performanceData = useMemo(() => {
    const generatePoints = (points: number, volatility: number, overallReturn: number) => {
      const startValue = netWorth / (1 + overallReturn);
      const data = [];
      for (let i = 0; i < points; i++) {
        if (i === points - 1) {
          data.push({ value: netWorth });
        } else {
          // Smooth geometric curve with sine-wave organic variations
          const progress = i / (points - 1);
          const trend = startValue + (netWorth - startValue) * Math.pow(progress, 1.2);
          const noise = Math.sin(progress * Math.PI * (points/4)) * volatility * startValue * (progress < 0.8 ? 1 : 0.5);
          data.push({ value: trend + noise });
        }
      }
      return data;
    };

    return {
      '3m': { data: generatePoints(30, 0.01, 0.037), change: '+3.7%' },
      '6m': { data: generatePoints(50, 0.02, 0.136), change: '+13.6%' },
      '1an': { data: generatePoints(80, 0.04, 0.353), change: '+35.3%' },
      'Tout': { data: generatePoints(120, 0.08, 1.842), change: '+184.2%' }
    };
  }, [netWorth]);

  const activeData = performanceData[period];

  return (
    <section className="flex flex-col items-center justify-center py-6 px-6 w-full max-w-4xl mx-auto">
      <span className="text-[12px] text-space-gray uppercase tracking-[2px] mb-2 font-light">{title}</span>
      <h2 className="text-5xl md:text-[64px] font-extralight tracking-tighter text-white mb-3">
        {netWorth.toLocaleString('fr-FR').replace(/\s/g, '.')} MAD
      </h2>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-neon-mint" size={14} />
        <span className="text-neon-mint font-medium text-[13px] tracking-wide">{activeData.change}</span>
      </div>

      {/* Sparkline (Rabby-style, completely continuous & floating) */}
      <div className="w-full h-24 md:h-32 mb-8 relative pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={activeData.data} margin={{ top: 15, bottom: 15, left: 10, right: 10 }}>
            <defs>
              <filter id="neon-glow-line" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#34C759" floodOpacity="0.5" />
                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#34C759" floodOpacity="0.8" />
              </filter>
            </defs>
            <YAxis domain={['auto', 'auto']} hide />
            <Line 
              type="basis" 
              dataKey="value" 
              stroke="#34C759" 
              strokeWidth={2.5} 
              dot={false}
              activeDot={false}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
              filter="url(#neon-glow-line)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-1 bg-white/[0.02] backdrop-blur-md p-1 rounded-full border border-[#1A1A1A]">
        {['3m', '6m', '1an', 'Tout'].map((p) => {
          const isActive = period === p;
          return (
            <button
              key={p}
              onClick={() => setPeriod(p as any)}
              className={cn(
                "px-5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300",
                isActive 
                  ? "bg-white/10 text-neon-mint shadow-[0_0_12px_rgba(52,199,89,0.2)]" 
                  : "text-space-gray hover:text-white"
              )}
            >
              {p}
            </button>
          );
        })}
      </div>
    </section>
  );
}
