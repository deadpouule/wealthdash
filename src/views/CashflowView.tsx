import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useWealthStore } from '../store/useWealthStore';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#34C759', '#FF3B30', '#0A84FF', '#FF9F0A', '#BF5AF2', '#30D158', '#FF453A'];

export default function CashflowView() {
  const particulier = useWealthStore(state => state.particulier);
  const updateParticulier = useWealthStore(state => state.updateParticulier);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Modals for CRUD
  const [showAddForm, setShowAddForm] = useState(false);
  const [formType, setFormType] = useState<'IN' | 'OUT'>('OUT');
  const [formData, setFormData] = useState({ id: '', category: '', label: '', amount: '' });

  const incomes = particulier.transactions.filter(t => t.type === 'IN');
  const expenses = particulier.transactions.filter(t => t.type === 'OUT');

  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = totalIncome - totalSpent;

  // Chart Data preparation
  const chartDataMap = new Map<string, number>();
  expenses.forEach(e => {
    chartDataMap.set(e.category, (chartDataMap.get(e.category) || 0) + e.amount);
  });
  
  const chartData = Array.from(chartDataMap.keys()).map(key => ({
    name: key,
    value: chartDataMap.get(key) || 0
  }));

  // Expense listing UI calculations
  const displayExpenses = particulier.plans.map(plan => {
    const spent = expenses.filter(e => e.category === plan.category).reduce((acc, e) => acc + e.amount, 0);
    return { ...plan, spent };
  });

  // Calculate un-planned expenses
  const unPlannedCategories = Array.from(new Set(expenses.map(e => e.category))).filter(c => !particulier.plans.find(p => p.category === c));
  unPlannedCategories.forEach(c => {
    const spent = expenses.filter(e => e.category === c).reduce((acc, e) => acc + e.amount, 0);
    displayExpenses.push({ category: c, planned: spent, spent }); // if unplanned, planned=spent for visualization
  });

  // Handle Edit/Add Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.amount || !formData.category) return;
    
    const amountNum = Number(formData.amount);
    if(formData.id) {
      // Edit
      const updated = particulier.transactions.map(t => 
        t.id === formData.id ? { ...t, label: formData.label, amount: amountNum, category: formData.category } : t
      );
      updateParticulier({ transactions: updated });
    } else {
      // Add
      const newTx = {
         id: Math.random().toString(),
         type: formType,
         label: formData.label,
         amount: amountNum,
         category: formData.category
      };
      updateParticulier({ transactions: [...particulier.transactions, newTx] });
    }
    closeForm();
  };

  const handleDelete = (id: string) => {
    updateParticulier({ transactions: particulier.transactions.filter(t => t.id !== id) });
  };

  const openEdit = (tx: any) => {
    setFormType(tx.type);
    setFormData({ id: tx.id, category: tx.category, label: tx.label, amount: tx.amount.toString() });
    setShowAddForm(true);
  };

  const closeForm = () => {
    setShowAddForm(false);
    setFormData({ id: '', category: '', label: '', amount: '' });
  };

  const currentCategoryTransactions = particulier.transactions.filter(t => t.category === selectedCategory);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/60 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-xl">
          <p className="text-white font-medium mb-1">{payload[0].name}</p>
          <p className="text-[#34C759] font-bold">{payload[0].value.toLocaleString('fr-FR')} MAD</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="px-6 md:px-10 space-y-12 animate-in fade-in duration-1000 pb-20 w-full max-w-7xl mx-auto pt-8">
      
      <div>
        <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-white mb-2">
          Gestion des Flux (Cashflow)
        </h2>
        <p className="text-space-gray tracking-wide">
          Répartition des revenus et dépenses
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Income Management (Chart) */}
        <div className="glass-card p-6 md:p-10 rounded-3xl space-y-8 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
             <h3 className="text-xl font-light text-white">Répartition des Dépenses</h3>
             <span className="text-[10px] uppercase tracking-widest text-space-gray">Analysis</span>
          </div>
          
          <div className="flex-1 w-full min-h-[300px] flex items-center justify-center">
             {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      onClick={(data) => setSelectedCategory(data.name)}
                      cursor="pointer"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#8E8E93' }}/>
                  </PieChart>
                </ResponsiveContainer>
             ) : (
                <p className="text-space-gray">Aucune dépense catégorisée.</p>
             )}
          </div>
        </div>

        {/* Expenses List */}
        <div className="glass-card p-6 md:p-10 rounded-3xl space-y-8 flex flex-col relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-light text-white">Budget (Fixes & Variables)</h3>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest text-space-gray block">Total Sortant</span>
              <span className="text-lg font-medium text-white">{totalSpent.toLocaleString()} MAD</span>
            </div>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {displayExpenses.map((exp) => (
              <div 
                key={exp.category} 
                className="space-y-2 group cursor-pointer p-3 xl:p-4 rounded-2xl hover:bg-white/5 transition-all outline outline-1 outline-transparent hover:outline-white/10"
                onClick={() => setSelectedCategory(exp.category)}
              >
                <div className="flex justify-between items-end">
                  <span className="text-sm text-space-gray group-hover:text-white transition-colors">{exp.category}</span>
                  <div className="text-right">
                     <span className="text-sm font-semibold text-white/90">{exp.spent.toLocaleString()} MAD</span>
                     <span className="text-[10px] text-space-gray ml-2">/ {exp.planned.toLocaleString()}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className={cn(
                      "h-full rounded-full",
                      exp.spent > exp.planned ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" : "bg-[#34C759]/80 shadow-[0_0_8px_rgba(52,199,89,0.3)]"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((exp.spent / (Math.max(exp.planned, 1))) * 100, 100)}%` }}
                    transition={{ delay: 0.1, duration: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => { setFormType('OUT'); setShowAddForm(true); }} className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium flex justify-center items-center gap-2 transition-all">
             <Plus size={16} /> Ajouter Dépense
          </button>
        </div>
      </div>

      {/* Reste a Vivre / Revenues List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="glass-card p-6 md:p-10 rounded-3xl flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-light text-white">Revenus & Rentrées</h3>
               <div className="text-right">
                 <span className="text-[10px] uppercase tracking-widest text-space-gray block">Total Entrant</span>
                 <span className="text-lg font-medium text-[#34C759]">{totalIncome.toLocaleString()} MAD</span>
               </div>
            </div>
            <div className="space-y-4 mb-8">
               {incomes.map(inc => (
                  <div key={inc.id} className="flex justify-between items-center group p-3 hover:bg-white/5 rounded-xl transition-all">
                     <div className="flex-1">
                        <p className="text-white font-medium">{inc.label}</p>
                        <p className="text-xs text-space-gray uppercase">{inc.category}</p>
                     </div>
                     <span className="text-[#34C759] font-bold mr-4">{inc.amount.toLocaleString()} MAD</span>
                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(inc)} className="p-2 bg-white/10 rounded-full text-white hover:text-[#34C759]"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(inc.id)} className="p-2 bg-white/10 rounded-full text-white hover:text-red-500"><Trash2 size={14} /></button>
                     </div>
                  </div>
               ))}
            </div>
            <button onClick={() => { setFormType('IN'); setShowAddForm(true); }} className="w-full mt-auto py-3 bg-white/5 hover:bg-white/10 border border-[#34C759]/30 hover:border-[#34C759] rounded-xl text-white font-medium flex justify-center items-center gap-2 transition-all">
               <Plus size={16} /> Ajouter Revenu
            </button>
         </div>

         <div className="glass-card p-6 md:p-10 rounded-3xl flex flex-col justify-center">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
              <div>
                 <h3 className="text-xl font-light text-white">Reste à Vivre Mensuel</h3>
                 <p className="text-xs text-space-gray uppercase tracking-widest mt-1">Liquidité disponible après charges</p>
              </div>
              <p className="text-5xl font-bold text-[#34C759] tracking-tight">
                 {remaining.toLocaleString()} <span className="text-2xl font-light">MAD</span>
              </p>
            </div>

            <div className="relative h-12 flex items-center bg-white/5 rounded-full px-2 overflow-hidden border border-white/5">
               <motion.div 
                 className="h-8 bg-gradient-to-r from-[#34C759] to-[#30D158] rounded-full shadow-[0_0_20px_#34C759]"
                 initial={{ width: 0 }}
                 animate={{ width: `${Math.max(0, Math.min((remaining / Math.max(totalIncome, 1)) * 100, 100))}%` }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
               />
               <div className="absolute inset-0 flex justify-between px-8 pointer-events-none text-[9px] uppercase tracking-widest text-white/30 font-bold items-center mix-blend-difference">
                  <span>Critique</span>
                  <span className="mr-[20%]">Optimisé</span>
               </div>
            </div>
         </div>
      </div>

      {/* Category Detail Overlay */}
      <AnimatePresence>
         {selectedCategory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                 onClick={() => setSelectedCategory(null)}
               />
               <motion.div 
                 initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                 className="bg-[#0A0A0B] border border-white/10 p-8 rounded-[32px] w-full max-w-lg relative z-10 shadow-2xl"
               >
                  <button onClick={() => setSelectedCategory(null)} className="absolute top-6 left-6 text-space-gray hover:text-white transition-colors">
                     <ArrowLeft size={20} />
                  </button>
                  <h3 className="text-2xl text-white font-light text-center mb-8">{selectedCategory}</h3>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                     {currentCategoryTransactions.length === 0 ? (
                        <p className="text-center text-space-gray">Aucune transaction.</p>
                     ) : currentCategoryTransactions.map(tx => (
                        <div key={tx.id} className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-white/30 transition-colors">
                           <div>
                              <p className="text-white font-medium">{tx.label}</p>
                              <p className="text-[10px] text-space-gray uppercase">{tx.type === 'IN' ? 'Entrant' : 'Sortant'}</p>
                           </div>
                           <div className="flex items-center gap-4">
                              <span className={tx.type === 'IN' ? 'text-[#34C759] font-bold' : 'text-white font-bold'}>
                                 {tx.type === 'IN' ? '+' : '-'}{tx.amount.toLocaleString()} MAD
                              </span>
                              <div className="flex gap-2">
                                <button onClick={() => openEdit(tx)} className="p-2 bg-white/5 rounded-full text-white hover:text-[#34C759] transition-colors"><Pencil size={14} /></button>
                                <button onClick={() => handleDelete(tx.id)} className="p-2 bg-white/5 rounded-full text-white hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* Add / Edit Overlay Form */}
      <AnimatePresence>
         {showAddForm && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                 onClick={closeForm}
               />
               <motion.div 
                 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                 className="bg-[#0A0A0B] border border-[#34C759]/30 p-8 rounded-[32px] w-full max-w-md relative z-10 shadow-[0_0_40px_rgba(52,199,89,0.1)]"
               >
                  <h3 className="text-2xl text-white font-light mb-6 text-center">
                     {formData.id ? 'Modifier Flux' : (formType === 'IN' ? 'Nouvelle Rentrée' : 'Nouvelle Dépense')}
                  </h3>
                  <form onSubmit={handleSave} className="space-y-4">
                     <div>
                        <label className="text-xs text-space-gray uppercase tracking-widest ml-2 mb-1 block">Catégorie</label>
                        <input required value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} placeholder="ex: Loyer, Factures, Salaire" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                     </div>
                     <div>
                        <label className="text-xs text-space-gray uppercase tracking-widest ml-2 mb-1 block">Libellé</label>
                        <input required value={formData.label} onChange={e=>setFormData({...formData, label: e.target.value})} placeholder="ex: Loyer Appartement" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                     </div>
                     <div>
                        <label className="text-xs text-space-gray uppercase tracking-widest ml-2 mb-1 block">Montant (MAD)</label>
                        <input required type="number" step="0.01" value={formData.amount} onChange={e=>setFormData({...formData, amount: e.target.value})} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none font-light focus:border-[#34C759]/50 transition-colors" />
                     </div>
                     <div className="flex gap-4 mt-8">
                        <button type="button" onClick={closeForm} className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-all">Annuler</button>
                        <button type="submit" className="flex-1 bg-[#34C759] text-midnight font-bold py-3 rounded-xl hover:bg-[#34C759]/90 transition-all shadow-[0_0_15px_rgba(52,199,89,0.3)]">Sauvegarder</button>
                     </div>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
