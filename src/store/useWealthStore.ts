import { create } from 'zustand';

export type UserMode = 'Particulier' | 'Business';

interface Facture { id: string; type: 'IN' | 'OUT'; amountHT: number; tva: number; date: string; client: string; }
interface Employe { id: string; role: string; salaryNet: number; costGlobal: number; }
interface Asset { id: string; category: string; name: string; value: number; }

export interface CalendarEvent {
  id: string;
  type: 'RENTREÉ' | 'SORTIE';
  amount: number;
  label: string;
  dateStr: string; // Format YYYY-MM-DD for easy mapping
}

interface WealthState {
  mode: UserMode;
  toggleMode: () => void;
  setMode: (mode: UserMode) => void;

  particulier: {
    immobilier: number;
    bourse: number;
    crypto: number;
    cash: number;
    or: number;
    epargne: number;
    listeActifs: Asset[];
    revenuMensuel: number;
  };

  business: {
    tresorerie: number;
    fluxIn: number;
    fluxOut: number;
    stock: number;
    dettes: number;
    resultatComptable: number;
    chiffreAffairesHT: number;
    factures: Facture[];
    employes: Employe[];
  };

  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: CalendarEvent) => void;
  deleteCalendarEvent: (id: string) => void;

  updateParticulier: (data: Partial<WealthState['particulier']>) => void;
  updateBusiness: (data: Partial<WealthState['business']>) => void;
  
  clearData: () => void;
}

export const useWealthStore = create<WealthState>((set) => ({
  mode: 'Particulier',
  
  toggleMode: () => set((state) => ({ 
    mode: state.mode === 'Particulier' ? 'Business' : 'Particulier' 
  })),
  
  setMode: (mode) => set({ mode }),

  particulier: {
    immobilier: 1250000,
    bourse: 450000,
    crypto: 120000,
    cash: 85000,
    or: 0,
    epargne: 300000,
    listeActifs: [],
    revenuMensuel: 35000
  },

  business: {
    tresorerie: 780000,
    fluxIn: 124000,
    fluxOut: 145000,
    stock: 1200000,
    dettes: 320000,
    resultatComptable: 800000,
    chiffreAffairesHT: 1500000,
    factures: [
      {
        id: 'f-1',
        type: 'OUT',
        amountHT: 50000,
        tva: 10000,
        date: new Date().toLocaleDateString('fr-FR'),
        client: 'Matériel Informatique (Apple, Dell)'
      }
    ],
    employes: []
  },

  calendarEvents: [],
  addCalendarEvent: (event) => set((state) => ({ calendarEvents: [...state.calendarEvents, event] })),
  deleteCalendarEvent: (id) => set((state) => ({ calendarEvents: state.calendarEvents.filter(e => e.id !== id) })),

  updateParticulier: (data) => set((state) => ({
    particulier: { ...state.particulier, ...data }
  })),

  updateBusiness: (data) => set((state) => ({
    business: { ...state.business, ...data }
  })),

  clearData: () => set((state) => ({
    particulier: {
      immobilier: 0, bourse: 0, crypto: 0, cash: 0, or: 0, epargne: 0, listeActifs: [], revenuMensuel: 0
    },
    business: {
      tresorerie: 0, fluxIn: 0, fluxOut: 0, stock: 0, dettes: 0, resultatComptable: 0, chiffreAffairesHT: 0, factures: [], employes: []
    },
    calendarEvents: []
  }))
}));

