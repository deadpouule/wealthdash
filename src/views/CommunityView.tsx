import { MessageSquare, ExternalLink, TrendingUp, Newspaper } from 'lucide-react';

const news = [
  {
    title: 'Nouvelle Introduction en Bourse à Casablanca (SE)',
    time: 'Il y a 2 heures',
    source: 'Bourse de Casablanca',
    icon: TrendingUp
  },
  {
    title: 'Analyse des Taux de la Banque Centrale (BAM)',
    time: 'Il y a 5 heures',
    source: 'Finances Hebdo',
    icon: Newspaper
  },
  {
    title: 'Loi de Finances 2026 : Ce qui change pour l\'IGR',
    time: 'Hier',
    source: 'Le Matin',
    icon: Newspaper
  }
];

const threads = [
  {
    title: 'Meilleure Banque pour Crédit Immo ?',
    replies: 42,
    active: 'À l\'instant'
  },
  {
    title: 'Stratégie Bourse 2026',
    replies: 156,
    active: 'Il y a 10 min'
  },
  {
    title: 'Avis sur Crypto au Maroc',
    replies: 89,
    active: 'Il y a 1 heure'
  }
];

export default function CommunityView() {
  return (
    <div className="px-10 py-8 space-y-12 animate-in fade-in duration-1000 pb-20">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: News */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <Newspaper className="text-space-gray" size={20} />
            <h2 className="text-2xl font-light text-white">Dernières Infos Financières</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            {news.map((item, i) => (
              <div key={i} className="glass-card p-6 rounded-2xl group hover:border-white/20 transition-all cursor-pointer flex justify-between items-center">
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center bg-white/5 text-space-gray group-hover:text-white transition-colors">
                    <item.icon size={16} />
                  </div>
                  <div>
                     <h4 className="text-white font-medium mb-1 line-clamp-1">{item.title}</h4>
                     <p className="text-xs text-space-gray">{item.source}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <ExternalLink size={14} className="text-space-gray opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[10px] uppercase tracking-widest text-space-gray">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Forum */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="text-space-gray" size={20} />
            <h2 className="text-2xl font-light text-white">Discussions & Échanges</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            {threads.map((thread, i) => (
              <div key={i} className="glass-card p-6 rounded-2xl group hover:border-white/20 transition-all cursor-pointer flex justify-between items-center relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none" />
                <div className="flex flex-col gap-2 relative z-10">
                   <h4 className="text-white font-medium text-lg">{thread.title}</h4>
                   <div className="flex items-center gap-4 text-xs font-bold text-space-gray uppercase tracking-widest">
                     <span className="text-neon-mint">{thread.replies} Rép.</span>
                     <span>Dernier msg: {thread.active}</span>
                   </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 group-hover:bg-white group-hover:text-midnight transition-all relative z-10">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
