import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useWealthStore } from '../store/useWealthStore';

export default function AssetAllocation() {
  const particuliers = useWealthStore((state) => state.particulier);

  const data = [
    { name: 'Immobilier', value: particuliers.immobilier, color: '#E27D60' }, // Deep Terracotta
    { name: 'Bourse', value: particuliers.bourse, color: '#41B3A3' },     // Finance Blue
    { name: 'Épargne', value: particuliers.epargne, color: '#9D1424' },    // Space Cherry
    { name: 'Crypto', value: particuliers.crypto, color: '#9B5DE5' },      // Amethyst Purple
    { name: 'Cash', value: particuliers.cash, color: '#34C759' },        // Emerald Green
    { name: 'Or', value: particuliers.or, color: '#D4AF37' }           // Champagne Gold
  ].filter(d => d.value > 0);
  
  const total = data.reduce((a, b) => a + b.value, 0);
  
  // Convert strictly to percentages relative to total
  const chartData = data.map(d => ({
    ...d,
    percentage: total > 0 ? Math.round((d.value / total) * 100) : 0
  }));

  return (
    <div className="px-4 md:px-10 mt-10 mb-6 flex w-full justify-center">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-10 md:p-16 flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32 w-full max-w-5xl shadow-[inset_0_1px_4px_rgba(255,255,255,0.02)]">
        
        {/* The Chart */}
        <div className="relative w-64 h-64 md:w-[320px] md:h-[320px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <filter id="subtle-shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.4"/>
                </filter>
              </defs>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="82%"
                outerRadius="100%"
                stroke="#0A0A0B"
                strokeWidth={2}
                paddingAngle={1}
                dataKey="value"
                animationDuration={2000}
                animationEasing="ease-out"
                filter="url(#subtle-shadow)"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    style={{ transition: 'all 0.3s ease' }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] md:text-xs text-space-gray uppercase tracking-[0.2em] font-bold mb-2">Net Worth</span>
            <span className="text-2xl md:text-3xl text-white font-bold tracking-tight whitespace-nowrap">{Number(total).toLocaleString('fr-FR')} MAD</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-5 w-full md:w-auto min-w-[220px]">
          {chartData.map((item, i) => (
            <div key={i} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-4">
                <span 
                  className="w-2 h-2 rounded-full shadow-sm" 
                  style={{ 
                    backgroundColor: item.color,
                    boxShadow: `0 0 6px ${item.color}60`
                  }} 
                />
                <span className="text-white/90 text-sm md:text-base tracking-wide font-light">
                  {item.name} <span className="text-space-gray mx-1">&bull;</span> {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
