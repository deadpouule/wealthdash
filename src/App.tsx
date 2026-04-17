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
    <div className="min-h-screen bg-[#0A0A0B] font-sans selection:bg-neon-mint/30 pb-[80px] md:pb-0">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="md:pl-[72px] min-h-screen relative flex flex-col items-center">
        <Header />
        
        <div className="w-full max-w-7xl mx-auto px-0 md:px-4">
          <div className="animate-in fade-in duration-700">
            {renderView()}
          </div>

          <footer className="px-6 md:px-10 py-12 border-t border-[#1A1A1A] flex flex-col md:flex-row justify-between items-center gap-6 mt-6 opacity-30">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center">
              <span className="text-[10px] uppercase tracking-widest text-space-gray">© 2026 WealthDash</span>
              <span className="text-[10px] uppercase tracking-widest text-space-gray cursor-pointer hover:text-white transition-colors">Politique de Confidentialité</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
