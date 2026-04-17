import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Immobilier', value: 45, color: '#E27D60' }, // Deep Terracotta
  { name: 'Bourse', value: 25, color: '#41B3A3' },     // Finance Blue
  { name: 'Épargne', value: 15, color: '#9D1424' },    // Space Cherry
  { name: 'Crypto', value: 8, color: '#9B5DE5' },      // Amethyst Purple
  { name: 'Cash', value: 5, color: '#34C759' },        // Emerald Green
  { name: 'Or', value: 2, color: '#D4AF37' }           // Champagne Gold
];

export default function AssetAllocation() {
  return (
    <div className="px-4 md:px-10 mt-10 mb-6 flex w-full justify-center">
      <div className="bg-white/[0.03] backdrop-blur-[20px] border border-[#1A1A1A] rounded-[24px] p-10 md:p-16 flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32 w-full max-w-5xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.8)]">
        
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
                data={data}
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
                {data.map((entry, index) => (
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
            <span className="text-2xl md:text-3xl text-white font-medium tracking-tight">12 400 000 MAD</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-5 w-full md:w-auto min-w-[220px]">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between border-b border-[#1A1A1A] pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-4">
                <span 
                  className="w-2 h-2 rounded-full shadow-sm" 
                  style={{ 
                    backgroundColor: item.color,
                    boxShadow: `0 0 6px ${item.color}60`
                  }} 
                />
                <span className="text-white/90 text-sm md:text-base tracking-wide font-light">
                  {item.name} <span className="text-space-gray mx-1">&bull;</span> {item.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
