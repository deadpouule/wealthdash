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
    <div className="px-10 mb-20 flex-1 min-h-[400px]">
      <div className="glass-card p-8 rounded-[20px] relative h-full flex flex-col justify-end">
        <div className="absolute top-8 left-8">
          <h3 className="text-sm text-space-gray mb-2">Projection de Patrimoine — 30 ans</h3>
          <p className="text-2xl font-light text-white">3.5M MAD est.</p>
        </div>
        
        <div className="h-[120px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34C759" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#34C759" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
              <XAxis 
                dataKey="year" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8E8E93', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8E8E93', fontSize: 12 }}
                tickFormatter={(value) => `€${value}M`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0A0A0B', 
                  borderColor: '#2A2A2A',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#34C759' }}
              />
              <Area 
                type="monotone" 
                dataKey="wealth" 
                stroke="#34C759" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorWealth)" 
                animationDuration={2500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
