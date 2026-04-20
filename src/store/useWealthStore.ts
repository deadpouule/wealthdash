import { create } from 'zustand';

export type UserMode = 'Particulier' | 'Business';

interface Facture { id: string; type: 'IN' | 'OUT'; amountHT: number; tva: number; date: string; client: string; }
interface Employe { id: string; role: string; salaryNet: number; costGlobal: number; }
interface Asset { id: string; category: string; name: string; value: number; status?: string; qty?: number; price?: number; points?: string; }

interface InOutTransaction { id: string; type: 'IN' | 'OUT'; category: string; label: string; amount: number; }
interface ExpensePlan { category: string; planned: number; }

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
    transactions: InOutTransaction[];
    plans: ExpensePlan[];
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
    crypto: 12000,
    cash: 25000,
    or: 42000,
    epargne: 110000,
    listeActifs: [
      {
        id: 'cash-1',
        category: 'Cash',
        name: 'Attijariwafa Bank',
        status: 'Compte Courant',
        value: 20000
      },
      {
        id: 'cash-2',
        category: 'Cash',
        name: 'BMCE Bank',
        status: 'Compte Devises (€) ~460 EUR',
        value: 5000
      },
      {
        id: 'ep-1',
        category: 'Epargne',
        name: 'Compte sur Carnet',
        status: 'Rendement: 2.5% net',
        value: 10000
      },
      {
        id: 'ep-2',
        category: 'Epargne',
        name: "Fonds d'Urgence",
        status: 'OPCVM Monétaire',
        value: 100000
      },
      {
        id: 'b-1',
        category: 'Bourse',
        name: "Maroc Telecom (IAM)",
        value: 9550,
        qty: 100,
        price: 95.50,
        points: "M0,25 C20,20 40,30 60,15 S80,20 100,5"
      },
      {
        id: 'b-2',
        category: 'Bourse',
        name: "Attijariwafa Bank",
        value: 19200,
        qty: 40,
        price: 480.00,
        points: "M0,20 C15,25 30,10 50,20 S70,10 100,2"
      },
      {
        id: 'c-1',
        category: 'Crypto',
        name: 'Bitcoin',
        status: 'BTC',
        qty: 0.012,
        value: 9000,
        points: '+4.2%'
      },
      {
        id: 'c-2',
        category: 'Crypto',
        name: 'Ethereum',
        status: 'ETH',
        qty: 0.038,
        value: 1200,
        points: '+1.5%'
      },
      {
        id: 'c-3',
        category: 'Crypto',
        name: 'HYPE',
        status: 'HYPE',
        qty: 500.00,
        value: 1800,
        points: '+12.4%'
      },
      {
        id: 'or-1',
        category: 'Or',
        name: 'Lingot Or',
        status: '24K',
        qty: 50,
        value: 42000
      }
    ],
    revenuMensuel: 35000,
    transactions: [
      { id: 'in-1', type: 'IN', category: 'Salaire', label: 'Salaire MAD', amount: 12000 },
      { id: 'out-1', type: 'OUT', category: 'Loyer', label: 'Loyer Appartement', amount: 6000 },
      { id: 'out-2', type: 'OUT', category: 'Factures', label: 'Électricité & Eau', amount: 800 },
      { id: 'out-3', type: 'OUT', category: 'Factures', label: 'Internet', amount: 500 },
      { id: 'out-4', type: 'OUT', category: 'Crédit', label: 'Crédit Auto', amount: 572 },
      { id: 'out-5', type: 'OUT', category: 'Aide Familiale', label: 'Parents', amount: 1500 }
    ],
    plans: [
      { category: 'Loyer', planned: 6000 },
      { category: 'Factures', planned: 2000 },
      { category: 'Crédit', planned: 572 },
      { category: 'Aide Familiale', planned: 1500 },
      { category: 'Épargne Recom.', planned: 2400 }
    ]
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
      immobilier: 0, bourse: 0, crypto: 0, cash: 0, or: 0, epargne: 0, listeActifs: [], revenuMensuel: 0, transactions: [], plans: []
    },
    business: {
      tresorerie: 0, fluxIn: 0, fluxOut: 0, stock: 0, dettes: 0, resultatComptable: 0, chiffreAffairesHT: 0, factures: [], employes: []
    },
    calendarEvents: []
  }))
}));

