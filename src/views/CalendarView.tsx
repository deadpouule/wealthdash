import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List as ListIcon, Plus, Repeat, Trash2 } from 'lucide-react';
import { useWealthStore, CalendarEvent, ScheduledEvent } from '../store/useWealthStore';
import { cn } from '../lib/utils';
import { ViewType } from '../components/Sidebar';
import AddEventModal from '../components/AddEventModal';

interface CalendarViewProps {
  onNavigate: (view: ViewType) => void;
}

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function CalendarView({ onNavigate }: CalendarViewProps) {
  const { mode, particulier, business, calendarEvents, scheduledEvents, removeScheduledEvent } = useWealthStore();

  const [date, setDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'Month' | 'List'>('Month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  // 1. Dynamic Events Generation
  const allEvents = useMemo(() => {
    const events: CalendarEvent[] = [...calendarEvents];

    // Scheduled Events Mapping to Virtual Events
    scheduledEvents.forEach(sched => {
       const [sy, sm, sd] = sched.startDate.split('-').map(Number);
       
       if (sched.recurrence === 'UNIQUE') {
         if (sy === currentYear && sm - 1 === currentMonth) {
           events.push({
             ...sched,
             id: `virt-${sched.id}-${currentYear}-${currentMonth}`,
             dateStr: sched.startDate,
             isVirtual: true,
             originalId: sched.id
           });
         }
       } else if (sched.recurrence === 'MONTHLY') {
         const startMonthAbs = sy * 12 + sm - 1;
         const viewMonthAbs = currentYear * 12 + currentMonth;
         if (viewMonthAbs >= startMonthAbs) {
           const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
           const targetDay = Math.min(sd, daysInMonth);
           const dateStr = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(targetDay).padStart(2,'0')}`;
           events.push({
             ...sched,
             id: `virt-${sched.id}-${currentYear}-${currentMonth}`,
             dateStr,
             isVirtual: true,
             originalId: sched.id
           });
         }
       } else if (sched.recurrence === 'YEARLY') {
         if (currentYear >= sy && sm - 1 === currentMonth) {
           const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
           const targetDay = Math.min(sd, daysInMonth);
           const dateStr = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(targetDay).padStart(2,'0')}`;
           events.push({
             ...sched,
             id: `virt-${sched.id}-${currentYear}-${currentMonth}`,
             dateStr,
             isVirtual: true,
             originalId: sched.id
           });
         }
       } else if (sched.recurrence === 'BI-WEEKLY') {
         let current = new Date(sy, sm - 1, sd);
         const endOfView = new Date(currentYear, currentMonth + 1, 0);
         const startOfView = new Date(currentYear, currentMonth, 1);
         
         while (current <= endOfView) {
            if (current >= startOfView) {
               events.push({
                 ...sched,
                 id: `virt-${sched.id}-${current.getTime()}`,
                 dateStr: current.toISOString().split('T')[0],
                 isVirtual: true,
                 originalId: sched.id
               });
            }
            current.setDate(current.getDate() + 15);
         }
       }
    });

    if (mode === 'Particulier') {
      // Revenu Mensuel (e.g. 28th of every month)
      if (particulier.revenuMensuel > 0) {
        // Create an event for the currently viewed month
        const salaryDate = new Date(currentYear, currentMonth, 28).toISOString().split('T')[0];
        events.push({
          id: `salary-${currentYear}-${currentMonth}`,
          label: 'Salaire / Revenus',
          type: 'RENTREÉ',
          amount: particulier.revenuMensuel,
          dateStr: salaryDate
        });
      }
      
      // Plans (Expenses) (e.g. 5th of every month)
      particulier.plans.forEach((plan, i) => {
        if (plan.planned > 0) {
           const planDate = new Date(currentYear, currentMonth, 5).toISOString().split('T')[0];
           events.push({
             id: `plan-${i}-${currentYear}-${currentMonth}`,
             label: plan.category,
             type: 'SORTIE',
             amount: plan.planned,
             dateStr: planDate
           });
        }
      });
      
    } else if (mode === 'Business') {
      // Factures (use their actual dates)
      business.factures.forEach(facture => {
        events.push({
          id: facture.id,
          label: `Facture ${facture.client || 'Client'}`,
          type: facture.type === 'IN' ? 'RENTREÉ' : 'SORTIE',
          amount: facture.amountHT + facture.tva,
          dateStr: facture.date
        });
      });

      // Salaires (e.g. 28th of every month)
      let totalSalaries = 0;
      business.employes.forEach(emp => { totalSalaries += emp.salaryNet; });
      if (totalSalaries > 0) {
        const salariesDate = new Date(currentYear, currentMonth, 28).toISOString().split('T')[0];
        events.push({
          id: `salaries-${currentYear}-${currentMonth}`,
          label: 'Salaires (Net)',
          type: 'SORTIE',
          amount: totalSalaries,
          dateStr: salariesDate
        });
      }

      // Emprunts (e.g. 5th of every month)
      business.loans.forEach((loan, i) => {
        const loanDate = new Date(currentYear, currentMonth, 5).toISOString().split('T')[0];
        events.push({
          id: `loan-${loan.id}-${currentYear}-${currentMonth}`,
          label: `Mensualité ${loan.bankName}`,
          type: 'SORTIE',
          amount: loan.monthlyPayment,
          dateStr: loanDate
        });
      });
      
      // TVA fictive (e.g. 20th of every month) - Estimation simple basée sur factures du mois
      // Normally computed over previous month, we just mock a standard event if there's business action
      const tvaDate = new Date(currentYear, currentMonth, 20).toISOString().split('T')[0];
      let tvaDue = 0;
      business.factures.forEach(f => {
         if (f.type === 'IN') tvaDue += f.tva;
         else tvaDue -= f.tva;
      });
      if (tvaDue > 0) {
        events.push({
          id: `tva-${currentYear}-${currentMonth}`,
          label: 'TVA à Payer',
          type: 'SORTIE',
          amount: tvaDue,
          dateStr: tvaDate
        });
      } else if (tvaDue < 0) {
        events.push({
          id: `tva-${currentYear}-${currentMonth}`,
          label: 'Crédit TVA',
          type: 'RENTREÉ',
          amount: Math.abs(tvaDue),
          dateStr: tvaDate
        });
      }
    }

    // Sort all events by date
    return events.sort((a, b) => new Date(a.dateStr).getTime() - new Date(b.dateStr).getTime());
  }, [mode, particulier, business, calendarEvents, scheduledEvents, currentYear, currentMonth]);

  // 2. Calendar Logic
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  // Transform to Monday=0, Sunday=6
  const startDay = firstDay === 0 ? 6 : firstDay - 1;

  const prevMonth = () => setDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setDate(new Date(currentYear, currentMonth + 1, 1));
  
  const getEventsForDate = (dateStr: string) => allEvents.filter(e => e.dateStr === dateStr);

  // 3. Current Selection Data
  const selectedEvents = getEventsForDate(selectedDate);
  const selectedDateObj = new Date(selectedDate);
  const selectedDateLabel = `${selectedDateObj.getDate()} ${MONTH_NAMES[selectedDateObj.getMonth()]} ${selectedDateObj.getFullYear()}`;

  // Summary per day for the grid
  const renderCalendarDays = () => {
    const blanks = Array.from({ length: startDay }, (_, i) => (
      <div key={`blank-${i}`} className="p-2 min-h-[60px] opacity-20" />
    ));

    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1;
      const dayDateStr = new Date(currentYear, currentMonth, dayNum).toISOString().split('T')[0];
      const dayEvents = getEventsForDate(dayDateStr);
      const isSelected = selectedDate === dayDateStr;
      
      const hasRentree = dayEvents.some(e => e.type === 'RENTREÉ');
      const hasSortie = dayEvents.some(e => e.type === 'SORTIE');

      return (
        <button
          key={`day-${dayNum}`}
          onClick={() => setSelectedDate(dayDateStr)}
          className={cn(
            "p-2 min-h-[70px] rounded-xl flex flex-col items-center justify-start border transition-all relative overflow-hidden group",
            isSelected ? "border-[#34C759]/50 bg-[#34C759]/10" : "border-white/5 bg-white/5 hover:bg-white/10"
          )}
        >
          <span className={cn(
            "text-sm font-medium mb-2", 
            isSelected ? "text-[#34C759]" : "text-white/70"
          )}>
            {dayNum}
          </span>
          
          <div className="flex gap-1">
            {hasRentree && <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] shadow-[0_0_5px_rgba(52,199,89,0.5)]" />}
            {hasSortie && <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] shadow-[0_0_5px_rgba(255,59,48,0.5)]" />}
          </div>
          
          {dayEvents.length > 0 && (
             <div className="mt-auto text-[10px] text-white/40 hidden md:block group-hover:text-white/70 transition-colors">
               {dayEvents.length} évnt(s)
             </div>
          )}
        </button>
      );
    });

    return [...blanks, ...days];
  };

  return (
    <div className="flex-1 min-h-screen overflow-hidden flex flex-col bg-midnight text-space-gray">
      
      {/* Header */}
      <div className="p-4 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#34C759]/20 flex items-center justify-center border border-[#34C759]/30">
            <CalendarIcon className="text-[#34C759]" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-light text-white tracking-wide">Échéancier</h1>
            <p className="text-white/50 text-sm">Vue {mode === 'Particulier' ? 'Personnelle' : 'Professionnelle'}</p>
          </div>
        </div>
        
        {/* View Toggles & Fast Actions */}
        <div className="flex items-center gap-2 p-1 bg-black/40 rounded-xl border border-white/10">
           <button 
             onClick={() => setIsModalOpen(true)}
             className="px-4 py-2 rounded-lg bg-white text-black font-medium text-sm flex items-center gap-2 hover:bg-white/90 transition-colors mr-2"
           >
             <Plus size={16} /> <span className="hidden md:inline">Ajouter flux</span>
           </button>
           <button 
             onClick={() => setViewMode('Month')}
             className={cn("p-2 rounded-lg flex items-center gap-2 text-sm transition-colors", viewMode === 'Month' ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70")}
           >
             <CalendarIcon size={16} /> <span className="hidden md:inline">Mois</span>
           </button>
           <button 
             onClick={() => setViewMode('List')}
             className={cn("p-2 rounded-lg flex items-center gap-2 text-sm transition-colors", viewMode === 'List' ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70")}
           >
             <ListIcon size={16} /> <span className="hidden md:inline">Agenda</span>
           </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden pb-4 md:pb-8 px-4 md:px-8 gap-6">
        
        {/* Main Area: Calendar or List */}
        <div className="flex-1 glass-panel rounded-3xl flex flex-col overflow-hidden relative">
           
           {/* Date Navigator */}
           <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
             <h2 className="text-xl font-light text-white">
               {MONTH_NAMES[currentMonth]} {currentYear}
             </h2>
             <div className="flex items-center gap-2">
               <button onClick={prevMonth} className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 transition-colors">
                 <ChevronLeft size={18} />
               </button>
               <button onClick={nextMonth} className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 transition-colors">
                 <ChevronRight size={18} />
               </button>
             </div>
           </div>

           {/* Content */}
           <div className="flex-1 overflow-y-auto p-6 relative">
             {viewMode === 'Month' ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="h-full flex flex-col"
                >
                  <div className="grid grid-cols-7 gap-2 mb-2 shrink-0">
                    {DAY_NAMES.map(day => (
                      <div key={day} className="text-center text-xs font-medium text-white/40 mb-2 uppercase tracking-widest">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2 auto-rows-fr flex-1">
                    {renderCalendarDays()}
                  </div>
                </motion.div>
             ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {allEvents.filter(e => e.dateStr.startsWith(`${currentYear}-${String(currentMonth+1).padStart(2, '0')}`)).length === 0 ? (
                    <div className="text-center text-white/40 py-12">Aucun événement prévu ce mois-ci.</div>
                  ) : (
                    allEvents.filter(e => e.dateStr.startsWith(`${currentYear}-${String(currentMonth+1).padStart(2, '0')}`)).map((e, idx) => (
                      <div key={e.id + idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-4 mb-2 md:mb-0">
                           <div className="w-12 h-12 rounded-xl bg-black/40 flex flex-col items-center justify-center shrink-0 border border-white/5 relative">
                              <span className="text-xs text-white/40 leading-none mb-1">{MONTH_NAMES[currentMonth].substring(0,3)}</span>
                              <span className="font-medium text-white leading-none">{new Date(e.dateStr).getDate()}</span>
                              {e.recurrence && e.recurrence !== 'UNIQUE' && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#34C759]/20 rounded-full flex items-center justify-center border border-[#34C759]/50">
                                   <Repeat size={8} className="text-[#34C759]" />
                                </div>
                              )}
                           </div>
                           <div>
                             <p className="font-medium text-white flex items-center gap-2">
                               {e.label}
                               {e.recurrence && e.recurrence !== 'UNIQUE' && <Repeat size={12} className="text-white/30" />}
                             </p>
                             <p className="text-xs text-white/50">{e.type === 'RENTREÉ' ? 'Crédit/Entrée' : 'Débit/Sortie'}</p>
                           </div>
                        </div>
                        <div className={cn("text-lg font-light text-right md:text-left", e.type === 'RENTREÉ' ? "text-[#34C759]" : "text-[#FF3B30]")}>
                          {e.type === 'RENTREÉ' ? '+' : '-'}{e.amount.toLocaleString()} <span className="text-sm opacity-50">MAD</span>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
             )}
           </div>

        </div>

        {/* Details Side Panel */}
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full lg:w-80 shrink-0 glass-panel rounded-3xl p-6 flex flex-col overflow-y-auto"
          >
            <h3 className="text-lg font-medium text-white mb-1">Détails du Jour</h3>
            <p className="text-sm text-[#34C759] mb-8">{selectedDateLabel}</p>

            {selectedEvents.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-white/30 text-center">
                 <CalendarIcon size={32} className="mb-4 opacity-50" />
                 <p className="text-sm">Aucune opération<br/>prévue ce jour</p>
               </div>
            ) : (
               <div className="space-y-4">
                 {selectedEvents.map((evt, idx) => (
                     <div key={evt.id + idx} className="p-4 rounded-2xl bg-black/40 border border-white/5 relative overflow-hidden group">
                      <div className={cn("absolute left-0 top-0 bottom-0 w-1", evt.type === 'RENTREÉ' ? "bg-[#34C759]" : "bg-[#FF3B30]")} />
                      <div className="pl-2">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-white/50 flex items-center gap-1">
                            {evt.type === 'RENTREÉ' ? 'Encaissement' : 'Décaissement'}
                            {evt.recurrence && evt.recurrence !== 'UNIQUE' && <Repeat size={10} className="text-white/30" />}
                          </p>
                          {evt.isVirtual && evt.originalId && (
                            <button
                              onClick={() => removeScheduledEvent(evt.originalId!)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-white/30 hover:text-red-500 transition-all rounded hover:bg-red-500/10"
                              title="Supprimer la récurrence"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                        <p className="font-medium text-white mb-2 leading-tight">{evt.label}</p>
                        <p className={cn("text-lg font-light", evt.type === 'RENTREÉ' ? "text-[#34C759]" : "text-[#FF3B30]")}>
                          {evt.type === 'RENTREÉ' ? '+' : '-'}{evt.amount.toLocaleString()} <span className="text-xs opacity-50">MAD</span>
                        </p>
                      </div>
                   </div>
                 ))}
               </div>
            )}
            
            {/* Daily Summary */}
            {selectedEvents.length > 0 && (
               <div className="mt-auto pt-6 border-t border-white/10 space-y-3">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-white/50">Total Rentrées</span>
                   <span className="text-[#34C759]">+{selectedEvents.filter(e => e.type === 'RENTREÉ').reduce((a,b) => a+b.amount, 0).toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-white/50">Total Sorties</span>
                   <span className="text-[#FF3B30]">-{selectedEvents.filter(e => e.type === 'SORTIE').reduce((a,b) => a+b.amount, 0).toLocaleString()}</span>
                 </div>
               </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
      
      <AddEventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultDate={selectedDate} 
      />
    </div>
  );
}
