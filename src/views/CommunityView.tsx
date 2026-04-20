import { useState } from 'react';
import { MessageSquare, ArrowUp, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

type Category = 'Immobilier' | 'Bourse' | 'Crypto' | 'Épargne' | 'Or & Métaux' | 'Tout';

const FORUM_CATEGORIES: { name: Category; icon: string; color: string; border: string; bg: string }[] = [
  { name: 'Tout', icon: '🌐', color: 'text-white', border: 'border-white/20', bg: 'bg-white/10' },
  { name: 'Immobilier', icon: '🏠', color: 'text-[#0A84FF]', border: 'border-[#0A84FF]/30', bg: 'bg-[#0A84FF]/10' },
  { name: 'Bourse', icon: '📈', color: 'text-[#34C759]', border: 'border-[#34C759]/30', bg: 'bg-[#34C759]/10' },
  { name: 'Crypto', icon: '₿', color: 'text-[#BF5AF2]', border: 'border-[#BF5AF2]/30', bg: 'bg-[#BF5AF2]/10' },
  { name: 'Épargne', icon: '💰', color: 'text-[#FF9F0A]', border: 'border-[#FF9F0A]/30', bg: 'bg-[#FF9F0A]/10' },
  { name: 'Or & Métaux', icon: '🪙', color: 'text-[#FFD60A]', border: 'border-[#FFD60A]/30', bg: 'bg-[#FFD60A]/10' }
];

const POSTS = [
  {
    id: 1,
    category: 'Bourse',
    title: 'Analyse Maroc Telecom (IAM): Est-ce le moment de renforcer suite aux résultats T3 ?',
    author: 'AtlasTrader',
    time: '2h ago',
    comments: 42,
    upvotes: 128
  },
  {
    id: 2,
    category: 'Immobilier',
    title: 'Avis sur les nouveaux taux Crédit Immo à Bank Of Africa',
    author: 'CasaInvest',
    time: '4h ago',
    comments: 15,
    upvotes: 56
  },
  {
    id: 3,
    category: 'Crypto',
    title: 'DCA Bitcoin vs Ethereum pour 2026 : Ma stratégie exposée',
    author: 'CryptoMaroc',
    time: '5h ago',
    comments: 89,
    upvotes: 342
  },
  {
    id: 4,
    category: 'Épargne',
    title: 'Quel est le meilleur compte sur carnet (rendement net) actuellement ?',
    author: 'SafeSaver',
    time: '6h ago',
    comments: 11,
    upvotes: 23
  },
  {
    id: 5,
    category: 'Or & Métaux',
    title: "Où acheter de l'Or physique avec certificat d'authenticité au Maroc ?",
    author: 'GoldBug',
    time: '12h ago',
    comments: 34,
    upvotes: 87
  },
  {
    id: 6,
    category: 'Bourse',
    title: 'Stratégie Dividendes DVM 2026 - Portfolio Review',
    author: 'DivSeeker',
    time: '1d ago',
    comments: 156,
    upvotes: 512
  }
];

export default function CommunityView() {
  const [activeCategory, setActiveCategory] = useState<Category>('Tout');

  const filteredPosts = activeCategory === 'Tout' ? POSTS : POSTS.filter(p => p.category === activeCategory);

  return (
     <div className="px-6 md:px-10 py-12 space-y-12 animate-in fade-in duration-1000 max-w-5xl mx-auto w-full pb-20">
      
      <div>
        <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-white mb-4">
          Noria Community
        </h2>
        <p className="text-space-gray tracking-wide">
          Discutez, partagez vos stratégies et apprenez des autres investisseurs
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 overflow-x-auto pb-4 custom-scrollbar">
        {FORUM_CATEGORIES.map(cat => (
           <button
             key={cat.name}
             onClick={() => setActiveCategory(cat.name as Category)}
             className={cn(
               "px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all border flex items-center gap-2 whitespace-nowrap active:scale-[0.98]",
               activeCategory === cat.name 
                 ? `${cat.bg} ${cat.border} ${cat.color} shadow-[0_0_15px_inherit]`
                 : "bg-white/5 border-white/10 text-space-gray hover:border-white/20 hover:text-white"
             )}
           >
              <span>{cat.icon}</span> {cat.name}
           </button>
        ))}
      </div>

      {/* Forum List */}
      <div className="space-y-4">
         <AnimatePresence mode="popLayout">
            {filteredPosts.map(post => {
              const catData = FORUM_CATEGORIES.find(c => c.name === post.category);
              
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={post.id}
                  className="bg-white/5 border border-white/5 p-4 sm:p-5 rounded-[20px] hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center relative overflow-hidden"
                >
                   {/* Upvote block */}
                   <div className="hidden sm:flex flex-col items-center gap-1 justify-center min-w-[50px] relative z-10">
                      <ArrowUp size={20} className="text-space-gray group-hover:text-white transition-colors" />
                      <span className="text-sm font-bold text-white/80">{post.upvotes}</span>
                   </div>

                   <div className="flex-1 space-y-2 relative z-10">
                     <div className="flex items-center gap-3">
                        <span className={cn(
                          "text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border", 
                          catData?.bg, catData?.color, catData?.border
                        )}>
                          {post.category}
                        </span>
                        <span className="text-xs text-space-gray">Posted by <span className="text-white/60">@{post.author}</span> • {post.time}</span>
                     </div>
                     <h3 className="text-lg md:text-xl font-medium text-white/90 group-hover:text-white transition-colors line-clamp-2">
                        {post.title}
                     </h3>
                     
                     <div className="flex sm:hidden items-center gap-4 text-xs font-bold text-space-gray">
                        <span className="flex items-center gap-1"><ArrowUp size={14}/> {post.upvotes}</span>
                        <div className="w-1 h-1 rounded-full bg-white/20"/>
                        <span className="flex items-center gap-1.5"><MessageSquare size={14}/> {post.comments} commentaires</span>
                     </div>
                   </div>

                   <div className="hidden sm:flex items-center gap-6 justify-end relative z-10">
                      <div className="flex items-center gap-2 text-space-gray group-hover:text-white/90 transition-colors">
                         <MessageSquare size={18} />
                         <span className="text-sm font-bold">{post.comments}</span>
                      </div>
                      <ChevronRight size={20} className="text-space-gray opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
                   </div>
                   
                   {/* Post subtle bg glow on hover */}
                   <div className={cn("absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l to-transparent opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none", catData?.bg.replace('/10', ''))} />
                </motion.div>
              );
            })}
         </AnimatePresence>

         {filteredPosts.length === 0 && (
            <div className="text-center p-12 bg-white/5 border border-white/10 rounded-3xl animate-in fade-in">
               <p className="text-space-gray font-light">Aucun sujet dans cette catégorie pour le moment.</p>
            </div>
         )}
      </div>

     </div>
  );
}
