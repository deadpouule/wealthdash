/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
import OrMetauxView from './views/OrMetauxView';
import OnboardingView from './views/OnboardingView';
import BusinessOnboardingView from './views/BusinessOnboardingView';
import SaisieFacturesView from './views/SaisieFacturesView';
import GestionRHView from './views/GestionRHView';
import GenericDetailView from './views/GenericDetailView';
import BusinessTresorerieView from './views/BusinessTresorerieView';
import BusinessStockView from './views/BusinessStockView';
import BusinessDettesView from './views/BusinessDettesView';
import FiscaliteProView from './views/FiscaliteProView';
import { useWealthStore } from './store/useWealthStore';
import Logo from './components/Logo';

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const mode = useWealthStore(state => state.mode);

  useEffect(() => {
    // Initial luxury boot-up
    const timer = setTimeout(() => {
      setIsBooting(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check if user has already onboarded for the current mode
    const hasOnboardedParticulier = localStorage.getItem('onboarded') === 'true';
    const hasOnboardedBusiness = localStorage.getItem('onboarded_business') === 'true';
    
    if (mode === 'Particulier' && !hasOnboardedParticulier) {
      setShowOnboarding(true);
    } else if (mode === 'Business' && !hasOnboardedBusiness) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [mode]);

  const handleOnboardingComplete = (data: any) => {
    if (mode === 'Particulier') {
      localStorage.setItem('onboarded', 'true');
      const cryptoTotal = data.crypto.reduce((acc: number, c: any) => acc + Number(c.value || 0), 0);
      const immobilierTotal = data.immobilier.reduce((acc: number, c: any) => acc + Number(c.value || 0), 0);
      const bourseTotal = data.bourse.reduce((acc: number, c: any) => acc + (Number(c.price || 0) * Number(c.qty || 1)), 0);
      
      const newAssets: any[] = [];
      data.crypto.forEach((c: any) => newAssets.push({ id: Math.random().toString(), category: 'Crypto', name: c.label, value: Number(c.value) }));
      data.immobilier.forEach((c: any) => newAssets.push({ id: Math.random().toString(), category: 'Immobilier', name: c.name, value: Number(c.value) }));
      data.bourse.forEach((c: any) => newAssets.push({ id: Math.random().toString(), category: 'Bourse', name: c.label, value: (Number(c.price || 0) * Number(c.qty || 1)) }));

      useWealthStore.getState().updateParticulier({
        revenuMensuel: Number(data.income || 0),
        cash: Number(data.cash || 0),
        epargne: Number(data.savings || 0),
        crypto: cryptoTotal,
        immobilier: immobilierTotal,
        bourse: bourseTotal,
        listeActifs: newAssets
      });
    } else {
      localStorage.setItem('onboarded_business', 'true');
      const expenses = data.expenses || {};
      const totalOut = Number(expenses.payroll||0) + Number(expenses.rent||0) + Number(expenses.software||0) + Number(expenses.other||0);
      
      useWealthStore.getState().updateBusiness({
        tresorerie: Number(data.cash || 0),
        chiffreAffairesHT: Number(data.monthlyCA || 0) * 12, // CA is often annualized for taxes
        fluxIn: Number(data.monthlyCA || 0),
        fluxOut: totalOut,
        stock: 0,
        dettes: 0,
        resultatComptable: (Number(data.monthlyCA || 0) - totalOut) * 12 // Simulated RC
      });
    }
    setShowOnboarding(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onNavigate={setCurrentView} mode={mode} />;
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
      case 'cash':
        return <CashEpargneView onNavigate={setCurrentView} initialTab="cash" />;
      case 'epargne':
        return <CashEpargneView onNavigate={setCurrentView} initialTab="epargne" />;
      case 'bourse':
        return <BourseView onNavigate={setCurrentView} />;
      case 'or':
        return <OrMetauxView onNavigate={setCurrentView} />;
      case 'factures':
        return <SaisieFacturesView onNavigate={setCurrentView} />;
      case 'rh':
        return <GestionRHView onNavigate={setCurrentView} />;
      case 'fiscalite':
      case 'business-fiscal':
        return <FiscaliteProView onNavigate={setCurrentView} />;
      case 'business-tresorerie':
        return <BusinessTresorerieView onNavigate={setCurrentView} />;
      case 'business-flux':
        return <SaisieFacturesView onNavigate={setCurrentView} />;
      case 'business-stock':
        return <BusinessStockView onNavigate={setCurrentView} />;
      case 'business-rh':
        return <GenericDetailView title="Détails Salaires & RH" onNavigate={setCurrentView} actionLabel="Modifier Paie" />;
      case 'business-dettes':
        return <BusinessDettesView onNavigate={setCurrentView} />;
      default:
        // By default or for investments (if stub)
        return <DashboardView onNavigate={setCurrentView} mode={mode} />;
    }
  };

  if (isBooting) {
    return (
      <div className="min-h-screen bg-midnight flex flex-col items-center justify-center font-sans selection:bg-neon-mint/30">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1, rotate: 360 }}
           transition={{ 
             opacity: { duration: 0.8 }, 
             scale: { duration: 0.8 },
             rotate: { duration: 10, repeat: Infinity, ease: "linear" } 
           }}
           className="relative"
        >
          {/* We add an extra glow wrapper for the pulse effect */}
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full blur-[30px] bg-[#34C759]/20"
          />
          <Logo size={80} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 text-center"
        >
          <h1 className="text-white font-bold text-lg tracking-[0.4em] uppercase">Noria</h1>
          <p className="text-space-gray text-[10px] tracking-widest uppercase mt-2">Initialisation du noyau</p>
        </motion.div>
      </div>
    );
  }

  if (showOnboarding) {
    if (mode === 'Business') {
      return <BusinessOnboardingView onComplete={handleOnboardingComplete} />;
    }
    return <OnboardingView onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] font-sans selection:bg-neon-mint/30 pb-[80px] md:pb-0">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} mode={mode} />
      
      <main className="md:pl-[72px] min-h-screen relative flex flex-col items-center">
        <Header />
        
        <div className="w-full max-w-7xl mx-auto px-0 md:px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>

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
