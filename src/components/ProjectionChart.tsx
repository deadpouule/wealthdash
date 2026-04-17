import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { year: '2026', wealth: 0.047 },
  { year: '2030', wealth: 0.18 },
  { year: '2035', wealth: 0.45 },
  { year: '2040', wealth: 0.85 },
  { year: '2045', wealth: 1.4 },
  { year: '2050', wealth: 2.2 },
  { year: '2056', wealth: 3.5 },
];

export default function ProjectionChart() {
  return (
    <div className="px-4 md:px-10 mt-10 mb-6 flex-1 min-h-[300px] md:min-h-[400px]">
      <div className="bg-white/[0.03] backdrop-blur-[25px] border border-[#1A1A1A] p-5 md:p-8 rounded-[12px] relative h-full flex flex-col justify-end">
        <div className="absolute top-5 left-5 md:top-8 md:left-8">
          <h3 className="text-[11px] md:text-sm text-space-gray uppercase tracking-widest font-medium mb-1">Projection à 20 ans</h3>
          <p className="text-xl md:text-2xl font-light text-white tracking-tight">3.5M € est.</p>
        </div>
        
        <div className="h-[140px] md:h-[160px] w-full mt-10 ml-[-20px] md:ml-[0px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34C759" stopOpacity={0.25}/>
                  <stop offset="100%" stopColor="#34C759" stopOpacity={0}/>
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <XAxis 
                dataKey="year" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#4A4A4C', fontSize: 10, fontWeight: 500 }}
                dy={10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0A0A0B', 
                  borderColor: '#1A1A1A',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#34C759' }}
              />
              <Area 
                type="basis" 
                dataKey="wealth" 
                stroke="#34C759" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorWealth)" 
                animationDuration={2500}
                filter="url(#glow)"
                activeDot={{ r: 4, fill: "#34C759", stroke: "#0A0A0B", strokeWidth: 2 }}
                dot={{ r: 2, fill: "#4A4A4C", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
