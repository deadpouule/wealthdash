import React, { useMemo } from 'react';
import Header from './Header';
import Hero from './Hero';
import WealthCards from './WealthCards';
import BusinessCards from './BusinessCards';
import AssetAllocation from './AssetAllocation';
import { ViewType } from './Sidebar';
import { useWealthStore } from '../store/useWealthStore';

export default function DashboardView({ onNavigate, mode = 'Particulier' }: { onNavigate: (v: ViewType) => void, mode?: 'Particulier' | 'Business' }) {
  const particulierAssets = useWealthStore(state => state.particulier);
  const businessAssets = useWealthStore(state => state.business);

  const particulierTotal = useMemo(() => {
    return (
      Number(particulierAssets.immobilier) +
      Number(particulierAssets.bourse) +
      Number(particulierAssets.crypto) +
      Number(particulierAssets.cash) +
      Number(particulierAssets.or) +
      Number(particulierAssets.epargne)
    );
  }, [particulierAssets]);

  if (mode === 'Business') {
    return (
      <div className="space-y-4 animate-in fade-in duration-1000 w-full pb-20 mt-4">
        <Hero title="Trésorerie Nette" initialValue={businessAssets.tresorerie} />
        <BusinessCards onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-1000">
      <Hero title="Valeur Nette Totale" initialValue={particulierTotal} />
      <WealthCards onNavigate={onNavigate} />
      <AssetAllocation />
    </div>
  );
}
