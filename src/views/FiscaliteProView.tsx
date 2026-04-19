import { useMemo, useState } from 'react';
import { ArrowLeft, Car, Package, Users, TrendingUp, TrendingDown, Pencil, Trash2, ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { ViewType } from '../components/Sidebar';
import { useWealthStore } from '../store/useWealthStore';
import { WealthEngine } from '../lib/WealthEngine';

interface Props {
  onNavigate: (v: ViewType) => void;
}

const initialOptimisations = [
  { id: '1', title: 'LOA / Leasing', desc: 'Passer le véhicule de société en LOA', gain: 25000, icon: Car },
  { id: '2', title: 'Matériel Pro', desc: 'Investir dans de nouvelles machines', gain: 40000, icon: Package },
  { id: '3', title: 'Primes', desc: 'Verser une prime exceptionnelle', gain: 12000, icon: Users },
];

export default function FiscaliteProView({ onNavigate }: Props) {
  const business = useWealthStore(state => state.business);
  const calendarEvents = useWealthStore(state => state.calendarEvents);
  const addCalendarEvent = useWealthStore(state => state.addCalendarEvent);
  const deleteCalendarEvent = useWealthStore(state => state.deleteCalendarEvent);

  const [optimisations, setOptimisations] = useState(initialOptimisations);

  const handleEdit = (id: string) => {
    console.log("Trigger edit optimisation:", id);
  };

  const handleDelete = (id: string) => {
    setOptimisations(opts => opts.filter(o => o.id !== id));
  };
  
  // Real calculations based on Moroccan law script
  const IS = WealthEngine.calculateIS(business.resultatComptable);
  const isCMEngine = WealthEngine.calculateImpotDu(business.resultatComptable, business.chiffreAffairesHT) > IS;

  // Simulate provision IS over the year (amber sparkline data)
  const sparklineData = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => {
      const base = 40000;
      const progress = i / 39;
      const trend = base + (IS - base) * Math.pow(progress, 1.8);
      const noise = Math.sin(progress * Math.PI * 4) * 3000 * (progress < 0.8 ? 1 : 0.2);
      return { value: trend + noise };
    });
  }, [IS]);

  // Calendrier Fiscal State & Logic
  const [currentCalDate, setCurrentCalDate] = useState(new Date(2026, 3, 1)); // Avril 2026
  
  // Define type for a selected day info
  type ProcessedDay = {
    day: number;
    events: string[];
    isOverdue: boolean;
    dateStr: string;
    isoDate: string;
    userEvents: any[];
    hasRentree: boolean;
    hasSortie: boolean;
    soldeNet: number;
    hasAnyEvent: boolean;
  };
  const [selectedDateInfo, setSelectedDateInfo] = useState<ProcessedDay | null>(null);
  
  const [addType, setAddType] = useState<'RENTREÉ' | 'SORTIE'>('RENTREÉ');
  const [addAmount, setAddAmount] = useState('');
  const [addLabel, setAddLabel] = useState('');

  const mockToday = new Date(2026, 3, 19);

  const handlePrevMonth = () => {
    setCurrentCalDate(new Date(currentCalDate.getFullYear(), currentCalDate.getMonth() - 1, 1));
    setSelectedDateInfo(null);
  };
  const handleNextMonth = () => {
    setCurrentCalDate(new Date(currentCalDate.getFullYear(), currentCalDate.getMonth() + 1, 1));
    setSelectedDateInfo(null);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addAmount || !addLabel || !selectedDateInfo) return;
    addCalendarEvent({
      id: Math.random().toString(),
      type: addType,
      amount: Number(addAmount),
      label: addLabel,
      dateStr: selectedDateInfo.isoDate
    });
    setAddAmount('');
    setAddLabel('');
  };

  const getCalendarDays = () => {
    const year = currentCalDate.getFullYear();
    const month = currentCalDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const startIndex = firstDay === 0 ? 6 : firstDay - 1; // Mon = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: (ProcessedDay | null)[] = [];
    for (let i = 0; i < startIndex; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const events: string[] = [];
      if (i === 20) events.push("Déclaration et Paiement de la TVA Mensuelle");
      if (month === 2 && i === 31) events.push("Dépôt du Bilan Fiscal", "1er Acompte IS");
      if (month === 5 && i === 30) events.push("2ème Acompte IS");
      if (month === 8 && i === 30) events.push("3ème Acompte IS");
      if (month === 11 && i === 31) events.push("4ème Acompte IS");
      
      const dateObj = new Date(year, month, i);
      const isOverdue = dateObj < mockToday && events.length > 0;
      
      const isoDate = `${year}-${String(month+1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      
      const userEventsOnDay = calendarEvents.filter(e => e.dateStr === isoDate);
      const hasRentree = userEventsOnDay.some(e => e.type === 'RENTREÉ');
      const hasSortie = userEventsOnDay.some(e => e.type === 'SORTIE');
      
      const totalRentree = userEventsOnDay.filter(e => e.type === 'RENTREÉ').reduce((acc, e) => acc + e.amount, 0);
      const totalSortie = userEventsOnDay.filter(e => e.type === 'SORTIE').reduce((acc, e) => acc + e.amount, 0);
      const soldeNet = totalRentree - totalSortie;

      const hasAnyEvent = events.length > 0 || userEventsOnDay.length > 0;

      days.push({
        day: i,
        events,
        isOverdue,
        dateStr: dateObj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        isoDate,
        userEvents: userEventsOnDay,
        hasRentree,
        hasSortie,
        soldeNet,
        hasAnyEvent
      });
    }
    return days;
  };
  
  const calDays = getCalendarDays();
  const monthName = currentCalDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  // Update selected day info automatically if an event is added/removed on that day
  const activeSelectedInfo = selectedDateInfo 
    ? calDays.find(d => d?.isoDate === selectedDateInfo.isoDate) 
    : null;

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
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 md:p-10 flex flex-col">
          <h3 className="text-[13px] uppercase tracking-[2px] text-space-gray font-bold mb-8">
            Composantes de l'Impôt
          </h3>
          
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <span className="text-white/80 font-light text-[15px]">Résultat Comptable</span>
              <span className="text-white font-bold">{Number(business.resultatComptable).toLocaleString('fr-FR')} MAD</span>
            </div>
            
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <div className="flex flex-col">
                <span className="text-white/80 font-light text-[15px]">Cotisation Minimale (CM)</span>
                <span className="text-space-gray text-[11px] mt-1 max-w-[200px] hidden md:block">0.25% du CA HT ({Number(business.chiffreAffairesHT).toLocaleString()} MAD)</span>
              </div>
              <span className="text-white/50 font-bold">+{Number(WealthEngine.calculateCM(business.chiffreAffairesHT)).toLocaleString('fr-FR')} MAD</span>
            </div>

            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <div className="flex flex-col">
                <span className="text-white/80 font-light text-[15px]">IS Théorique (Barème Progressif)</span>
                <span className="text-space-gray text-[11px] mt-1 max-w-[200px] hidden md:block">Abattements inclus</span>
              </div>
              <span className="text-[#34C759]/80 font-bold">{Number(IS).toLocaleString('fr-FR')} MAD</span>
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
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 md:p-10 flex flex-col">
          <h3 className="text-[13px] uppercase tracking-[2px] text-space-gray font-bold mb-8 flex items-center gap-2">
            Opportunités d'Optimisation IS <span className="hidden md:inline">(Simulées)</span>
          </h3>

          <div className="flex flex-col gap-4">
            
            {optimisations.map((opt) => {
              const IconComp = opt.icon;
              return (
                <div key={opt.id} className="flex items-start md:items-center gap-4 p-4 rounded-[16px] bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-[#34C759]/50 active:scale-[0.98] group">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-space-gray group-hover:text-[#34C759] transition-colors shrink-0">
                      <IconComp size={16} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-[#34C759] tracking-wider font-bold mb-1">{opt.title}</span>
                      <span className="text-white/80 font-light text-[14px]">{opt.desc}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase text-space-gray tracking-widest block mb-1">Gain IS</span>
                    <span className="text-[#34C759] font-bold whitespace-nowrap">-{opt.gain.toLocaleString('fr-FR')} MAD</span>
                  </div>
                  <div className="flex items-center gap-3 ml-2 shrink-0">
                    <button onClick={() => handleEdit(opt.id)} className="text-gray-500 hover:text-[#34C759] transition-all duration-300 active:scale-[0.98]">
                      <Pencil size={18} strokeWidth={1.5} />
                    </button>
                    <button onClick={() => handleDelete(opt.id)} className="text-gray-500 hover:text-red-500 transition-all duration-300 active:scale-[0.98]">
                      <Trash2 size={18} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Calendrier Fiscal Focus */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 md:p-10 flex flex-col lg:col-span-2 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h3 className="text-[13px] uppercase tracking-[2px] text-space-gray font-bold flex items-center gap-2">
              <Calendar size={18} className="text-[#34C759]" /> Calendrier & Flux Financiers
            </h3>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <button onClick={handlePrevMonth} className="text-space-gray hover:text-[#34C759] transition-colors active:scale-[0.90]">
                <ChevronLeft size={18} />
              </button>
              <span className="text-white font-medium capitalize min-w-[120px] text-center tracking-wide">{monthName}</span>
              <button onClick={handleNextMonth} className="text-space-gray hover:text-[#34C759] transition-colors active:scale-[0.90]">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 md:gap-4 mb-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
              <div key={d} className="text-center text-[10px] uppercase tracking-widest text-[#34C759] font-bold pb-4 border-b border-white/5 mb-2">
                {d}
              </div>
            ))}
            {calDays.map((calDay, i) => {
              if (!calDay) return <div key={`empty-${i}`} className="h-12 md:h-16 rounded-xl bg-white/[0.01]" />;
              
              const isSelected = activeSelectedInfo?.isoDate === calDay.isoDate;

              return (
                <div 
                  key={calDay.day}
                  onClick={() => {
                    setSelectedDateInfo(calDay);
                    setAddType('RENTREÉ');
                    setAddLabel('');
                    setAddAmount('');
                  }}
                  className={`
                    relative flex flex-col items-center justify-center h-12 md:h-16 rounded-xl transition-all duration-300 group cursor-pointer border
                    hover:bg-white/10 hover:border-[#34C759]/50
                    ${isSelected ? 'bg-white/10 border-[#34C759]/80 shadow-[inset_0_0_15px_rgba(52,199,89,0.1)]' : 'bg-transparent border-white/5'}
                  `}
                >
                  <span className={`font-medium ${calDay.hasAnyEvent ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>
                    {calDay.day}
                  </span>
                  
                  {/* Subtle hover icon for empty days or quick add indication */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    <Plus size={36} strokeWidth={1} className="text-[#34C759]/10" />
                  </div>

                  <div className="flex items-center gap-1 mt-1 z-10 pointer-events-none">
                    {calDay.events.length > 0 && (
                      <div className={`w-1.5 h-1.5 rounded-full transition-all ${calDay.isOverdue ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-[#34C759] shadow-[0_0_8px_rgba(52,199,89,0.8)]'}`} />
                    )}
                    {calDay.hasRentree && <span className="text-[7px] text-[#34C759]">▲</span>}
                    {calDay.hasSortie && <span className="text-[7px] text-red-500">▼</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Inline Edit & Day Details overlay section */}
          {activeSelectedInfo && (
            <div className="mt-6 p-6 bg-black border border-white/20 rounded-xl flex flex-col gap-6 animate-in zoom-in-95 fade-in duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-start border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#34C759] font-bold mb-1">{activeSelectedInfo.dateStr}</p>
                  <p className="text-white/50 font-light text-sm">Synthèse et déclaration de flux journaliers</p>
                </div>
                {(activeSelectedInfo.hasAnyEvent) && (
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-space-gray font-bold mb-1">Solde Prévu</p>
                    <p className={`text-xl font-bold ${activeSelectedInfo.soldeNet >= 0 ? 'text-[#34C759]' : 'text-red-500'}`}>
                      {activeSelectedInfo.soldeNet > 0 ? '+' : ''}{activeSelectedInfo.soldeNet.toLocaleString('fr-FR')} MAD
                    </p>
                  </div>
                )}
              </div>

              {/* System Fiscal Events */}
              {activeSelectedInfo.events.length > 0 && (
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <ul className="space-y-2">
                    {activeSelectedInfo.events.map((ev: string, i: number) => (
                      <li key={i} className="text-white font-light text-sm flex items-center gap-3">
                        <span className={`w-1.5 h-1.5 rounded-full ${activeSelectedInfo.isOverdue ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-[#34C759] shadow-[0_0_8px_rgba(52,199,89,0.5)]'}`} /> 
                        {ev}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* User Custom Flow Events */}
              {activeSelectedInfo.userEvents.length > 0 && (
                <div className="space-y-2">
                   {activeSelectedInfo.userEvents.map((ev: any) => (
                      <div key={ev.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg group hover:border-white/20 transition-colors">
                         <div className="flex items-center gap-3">
                           {ev.type === 'RENTREÉ' 
                             ? <TrendingUp size={16} className="text-[#34C759]" /> 
                             : <TrendingDown size={16} className="text-red-500" />
                           }
                           <span className="text-white/90 font-light text-sm">{ev.label}</span>
                         </div>
                         <div className="flex items-center gap-4">
                           <span className={`font-bold text-sm tracking-wide ${ev.type === 'RENTREÉ' ? 'text-[#34C759]' : 'text-red-500'}`}>
                             {ev.type === 'RENTREÉ' ? '+' : '-'}{ev.amount.toLocaleString('fr-FR')} MAD
                           </span>
                           <button onClick={() => deleteCalendarEvent(ev.id)} className="text-white/20 hover:text-red-500 transition-colors active:scale-95">
                             <Trash2 size={16} />
                           </button>
                         </div>
                      </div>
                   ))}
                </div>
              )}

              {/* Ultra Minimal Inline Add Form */}
              <div className="pt-2">
                <form onSubmit={handleAddEvent} className="flex flex-col md:flex-row gap-3">
                   <select 
                     value={addType} 
                     onChange={(e) => setAddType(e.target.value as 'RENTREÉ' | 'SORTIE')}
                     className={`bg-black border border-white/20 rounded-lg px-4 py-3 text-sm outline-none transition-colors appearance-none font-bold tracking-widest ${addType === 'RENTREÉ' ? 'text-[#34C759] focus:border-[#34C759]/50' : 'text-red-500 focus:border-red-500/50'}`}
                   >
                     <option value="RENTREÉ" className="bg-black text-[#34C759]">RENTREÉ</option>
                     <option value="SORTIE" className="bg-black text-red-500">SORTIE</option>
                   </select>
                   <input 
                     required 
                     placeholder="Libellé du flux (ex: Paiement Client X)" 
                     value={addLabel}
                     onChange={(e) => setAddLabel(e.target.value)}
                     className="flex-1 bg-black border border-white/20 rounded-lg px-4 py-3 text-sm text-white outline-none font-light placeholder:text-white/30 focus:border-white/50 transition-colors"
                   />
                   <input 
                     required 
                     type="number"
                     placeholder="Montant MAD" 
                     value={addAmount}
                     onChange={(e) => setAddAmount(e.target.value)}
                     className="w-full md:w-36 bg-black border border-white/20 rounded-lg px-4 py-3 text-sm text-white outline-none font-light placeholder:text-white/30 focus:border-white/50 transition-colors"
                   />
                   <button type="submit" className="flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/20 text-white p-3 rounded-lg transition-all active:scale-95 group">
                     <Plus size={18} className="group-hover:text-white text-white/70" />
                   </button>
                </form>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
