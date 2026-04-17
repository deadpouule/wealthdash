/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Sidebar, { ViewType } from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import CashflowView from './views/CashflowView';
import TaxesView from './views/TaxesView';
import CommunityView from './views/CommunityView';
import CryptoDetailView from './views/CryptoDetailView';
import ImmobilierView from './views/ImmobilierView';
import CashEpargneView from './views/CashEpargneView';
import BourseView from './views/BourseView';
import OnboardingView from './views/OnboardingView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Auto-completed onboarding removed to allow new user flow
  useEffect(() => {
    localStorage.removeItem('onboarded');
    setShowOnboarding(true);
  }, []);

  const handleOnboardingComplete = (data: any) => {
    localStorage.setItem('onboarded', 'true');
    localStorage.setItem('userIncome', JSON.stringify(data.income));
    setShowOnboarding(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onNavigate={setCurrentView} />;
      case 'cashflow':
        return <CashflowView />;
      case 'taxes':
        return <TaxesView />;
      case 'community':
        return <CommunityView />;
      case 'crypto-detail':
        return <CryptoDetailView onNavigate={setCurrentView} />;
      case 'immobilier':
        return <ImmobilierView onNavigate={setCurrentView} />;
      case 'cash-epargne':
        return <CashEpargneView onNavigate={setCurrentView} />;
      case 'bourse':
        return <BourseView onNavigate={setCurrentView} />;
      default:
        // By default or for investments (if stub)
        return <DashboardView onNavigate={setCurrentView} />;
    }
  };

  if (showOnboarding) {
    return <OnboardingView onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-midnight font-sans selection:bg-neon-mint/30">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="pl-[72px] min-h-screen relative">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-in fade-in duration-700">
            {renderView()}
          </div>

          <footer className="px-10 py-12 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-6 mt-12 opacity-50">
            <div className="flex items-center gap-6">
              <span className="text-[10px] uppercase tracking-widest">© 2026 WealthDash Private</span>
              <span className="text-[10px] uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Politique de Confidentialité</span>
              <span className="text-[10px] uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Conditions Générales</span>
            </div>
            <div className="text-[10px] uppercase tracking-widest">
              Dernière Synchro: 16:11:39 GMT+1
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
