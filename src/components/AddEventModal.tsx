import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, CalendarPlus, Repeat, Zap } from 'lucide-react';
import { useWealthStore, ScheduledEvent, RecurrenceType } from '../store/useWealthStore';
import { cn } from '../lib/utils';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
}

export default function AddEventModal({ isOpen, onClose, defaultDate }: AddEventModalProps) {
  const { addScheduledEvent, mode } = useWealthStore();
  
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'RENTREÉ' | 'SORTIE'>('SORTIE');
  const [startDate, setStartDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [recurrence, setRecurrence] = useState<RecurrenceType>('MONTHLY');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!label || !amount || parseFloat(amount) <= 0) return;
    
    addScheduledEvent({
      id: `sched-${Date.now()}`,
      label,
      amount: parseFloat(amount),
      type,
      startDate,
      recurrence
    });
    
    // Reset
    setLabel('');
    setAmount('');
    setType('SORTIE');
    setRecurrence('MONTHLY');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#1C1C1E] border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col z-10"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <CalendarPlus className="text-white/70" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-medium text-white shadow-sm leading-tight">Nouvel Événement</h2>
              <p className="text-xs text-white/40">{mode === 'Particulier' ? 'Particulier' : 'Business'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          <div className="p-1 glass-panel rounded-xl flex items-center gap-1">
             <button
               onClick={() => setType('SORTIE')}
               className={cn(
                 "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                 type === 'SORTIE' ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white/70"
               )}
             >
               Sortie (Débit)
             </button>
             <button
               onClick={() => setType('RENTREÉ')}
               className={cn(
                 "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                 type === 'RENTREÉ' ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white/70"
               )}
             >
               Entrée (Crédit)
             </button>
          </div>

          <div className="space-y-4">
             {/* List Group Style */}
             <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                   <span className="text-sm font-medium text-white/70 w-24">Titre</span>
                   <input 
                     type="text"
                     value={label}
                     onChange={e => setLabel(e.target.value)}
                     placeholder={type === 'SORTIE' ? "ex: Loyer Bureau" : "ex: Facture Client X"}
                     className="flex-1 bg-transparent text-right text-white font-medium outline-none placeholder:text-white/20"
                   />
                </div>
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                   <span className="text-sm font-medium text-white/70 w-24">Montant</span>
                   <div className="flex items-center gap-2 flex-1 justify-end">
                     <input 
                       type="number"
                       value={amount}
                       onChange={e => setAmount(e.target.value)}
                       placeholder="0.00"
                       className="w-full bg-transparent text-right text-lg text-white font-medium outline-none placeholder:text-white/20"
                     />
                     <span className="text-xs text-white/40">MAD</span>
                   </div>
                </div>
                <div className="flex items-center justify-between p-4 border-b border-white/5 relative">
                   <span className="text-sm font-medium text-white/70 w-24 flex items-center gap-2">Date</span>
                   <input 
                     type="date"
                     value={startDate}
                     onChange={e => setStartDate(e.target.value)}
                     className="bg-transparent text-right text-white font-medium outline-none"
                     style={{ colorScheme: 'dark' }} // Fixes date picker color in dark mode
                   />
                </div>
                <div className="flex items-center justify-between p-4 relative group">
                   <span className="text-sm font-medium text-white/70 w-24 flex items-center gap-2">
                     <Repeat size={14} />
                     Récurrence
                   </span>
                   <select
                     value={recurrence}
                     onChange={e => setRecurrence(e.target.value as RecurrenceType)}
                     className="bg-transparent text-right text-white font-medium outline-none appearance-none cursor-pointer"
                   >
                     <option value="UNIQUE" className="bg-[#1C1C1E] text-white">Unique (1x)</option>
                     <option value="BI-WEEKLY" className="bg-[#1C1C1E] text-white">Toutes les 2 sem.</option>
                     <option value="MONTHLY" className="bg-[#1C1C1E] text-white">Mensuelle</option>
                     <option value="YEARLY" className="bg-[#1C1C1E] text-white">Annuelle</option>
                   </select>
                </div>
             </div>
          </div>
          
        </div>

        <div className="p-6 pt-0 mt-auto">
          <button
            onClick={handleSave}
            disabled={!label || !amount || parseFloat(amount) <= 0}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <Zap size={18} />
            Enregistrer l'événement
          </button>
        </div>
      </motion.div>
    </div>
  );
}
