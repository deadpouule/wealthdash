import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import * as d3 from 'd3';
import { cn } from '../lib/utils';

const incomeSources = [
  { name: 'Salaire MAD', value: 12000 },
];

const totalIncome = incomeSources.reduce((acc, curr) => acc + curr.value, 0);

const expenses = [
  { category: 'Loyer', spent: 6000, planned: 6000 },
  { category: 'Factures', spent: 2000, planned: 2000 },
  { category: 'Crédit', spent: 572, planned: 572 },
  { category: 'Aide Familiale', spent: 1500, planned: 1500 },
  { category: 'Épargne Recom.', spent: 0, planned: 2400 },
];

const totalExpenses = expenses.reduce((acc, curr) => acc + curr.spent, 0);
const remaining = totalIncome - totalExpenses;

export default function CashflowView() {
  const sankeyRef = useRef<SVGSVGElement>(null);
  const [dataRem, setDataRem] = useState(remaining);

  useEffect(() => {
    if (!sankeyRef.current) return;
    const svg = d3.select(sankeyRef.current);
    svg.selectAll("*").remove();

    const width = 450;
    const height = 300;
    const nodeWidth = 4;

    // Simplified Sankey construction
    const sources = incomeSources;
    const centerY = height / 2;
    const rightX = width - 40;
    const leftX = 40;

    let currentLefY = 50;
    const spacing = 40;

    sources.forEach((s) => {
      const h = (s.value / totalIncome) * 150;
      
      // Node left
      svg.append('rect')
        .attr('x', leftX)
        .attr('y', currentLefY)
        .attr('width', nodeWidth)
        .attr('height', h)
        .attr('fill', '#ffffff20');

      // Label left
      svg.append('text')
        .attr('x', leftX - 10)
        .attr('y', currentLefY + h / 2)
        .attr('text-anchor', 'end')
        .attr('fill', '#8E8E93')
        .attr('font-size', '10px')
        .attr('font-weight', '500')
        .text(s.name);

      // Path to center
      const path = d3.path();
      path.moveTo(leftX + nodeWidth, currentLefY + h / 2);
      path.bezierCurveTo(
        (leftX + rightX) / 2, currentLefY + h / 2,
        (leftX + rightX) / 2, centerY,
        rightX, centerY
      );

      svg.append('path')
        .attr('d', path.toString())
        .attr('fill', 'none')
        .attr('stroke', 'url(#linkGrad)')
        .attr('stroke-width', h)
        .attr('opacity', 0.2);

      currentLefY += h + spacing;
    });

    // Center Node
    svg.append('rect')
      .attr('x', rightX)
      .attr('y', centerY - 40)
      .attr('width', nodeWidth)
      .attr('height', 80)
      .attr('fill', '#fff');

    svg.append('text')
      .attr('x', rightX + 10)
      .attr('y', centerY)
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .text(`${totalIncome.toLocaleString()} MAD`);

    // Gradient definition
    svg.append('defs').append('linearGradient')
      .attr('id', 'linkGrad')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '0%')
      .selectAll('stop')
      .data([
        { offset: '0%', color: '#ffffff20' },
        { offset: '100%', color: '#ffffff' },
      ])
      .enter().append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color);

  }, []);

  return (
    <div className="px-10 space-y-12 animate-in fade-in duration-1000 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Income Management */}
        <div className="glass-card p-10 rounded-3xl space-y-8 min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-light text-white">Gestion des Revenus</h3>
            <span className="text-[10px] uppercase tracking-widest text-space-gray">Analysis</span>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <svg ref={sankeyRef} width="450" height="300" className="opacity-80" />
          </div>
        </div>

        {/* Expenses List */}
        <div className="glass-card p-10 rounded-3xl space-y-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-light text-white">Dépenses Fixes & Variables</h3>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest text-space-gray block">Total Sortant</span>
              <span className="text-lg font-medium text-white">{totalExpenses.toLocaleString()} MAD</span>
            </div>
          </div>

          <div className="space-y-8 flex-1">
            {expenses.map((exp) => (
              <div key={exp.category} className="space-y-3 group cursor-pointer">
                <div className="flex justify-between items-end">
                  <span className="text-[13px] text-space-gray group-hover:text-white transition-colors">{exp.category}</span>
                  <div className="text-right">
                     <span className="text-xs font-semibold text-white/90">{exp.spent.toLocaleString()} MAD</span>
                     <span className="text-[10px] text-space-gray ml-2">/ {exp.planned.toLocaleString()}</span>
                  </div>
                </div>
                <div className="w-full h-[6px] bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className={cn(
                      "h-full rounded-full",
                      exp.spent > exp.planned ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" : "bg-white/40"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((exp.spent / exp.planned) * 100, 100)}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Gauge */}
      <div className="glass-card p-10 rounded-3xl">
        <div className="flex items-center justify-between mb-10">
          <div>
             <h3 className="text-xl font-light text-white">Reste à Vivre Mensuel</h3>
             <p className="text-xs text-space-gray uppercase tracking-widest">Liquidité disponible après charges</p>
          </div>
          <p className="text-4xl font-bold text-neon-mint tracking-tight">
             {dataRem.toLocaleString()} <span className="text-lg font-light">MAD</span>
          </p>
        </div>

        <div className="relative h-12 flex items-center bg-white/5 rounded-full px-2 overflow-hidden border border-white/5">
           <motion.div 
             className="h-8 bg-neon-mint rounded-full shadow-[0_0_20px_#34C759]"
             initial={{ width: 0 }}
             animate={{ width: `${(dataRem / totalIncome) * 100}%` }}
             transition={{ duration: 1.5, ease: "easeOut" }}
           />
           <div className="absolute inset-0 flex justify-between px-8 pointer-events-none text-[8px] uppercase tracking-widest text-white/20 font-bold items-center">
              <span>Critique</span>
              <span className="mr-[20%]">Optimisé</span>
           </div>
        </div>
      </div>
    </div>
  );
}
