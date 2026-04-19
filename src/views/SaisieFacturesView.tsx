import { useState, useRef } from 'react';
import { useWealthStore } from '../store/useWealthStore';
import { ArrowLeft, Plus, ScanLine, FileText, CheckCircle2 } from 'lucide-react';
import { ViewType } from '../components/Sidebar';
import { WealthEngine } from '../lib/WealthEngine';
import { GoogleGenAI, Type } from '@google/genai';

interface Props {
  onNavigate: (v: ViewType) => void;
}

export default function SaisieFacturesView({ onNavigate }: Props) {
  const business = useWealthStore(state => state.business);
  const updateBusiness = useWealthStore(state => state.updateBusiness);
  const facts = business.factures || [];

  const [client, setClient] = useState('');
  const [amountHT, setAmountHT] = useState('');
  const [tvaRate, setTvaRate] = useState('20');
  const [type, setType] = useState<'IN'|'OUT'>('IN');
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const performAdd = (c: string, aHT: number, t: 'IN'|'OUT', rateVal: number) => {
    const valHT = aHT;
    const tvaVal = valHT * (rateVal / 100);
    const newFacture = {
      id: Math.random().toString(),
      type: t,
      amountHT: valHT,
      tva: tvaVal,
      client: c,
      date: new Date().toLocaleDateString('fr-FR')
    };

    const updatedFactures = [...facts, newFacture];
    
    // Simulate real-time impact on Business metrics
    const impact = t === 'IN' ? valHT + tvaVal : -(valHT + tvaVal); // TTC impacts Tresorerie
    const newCA = t === 'IN' ? business.chiffreAffairesHT + valHT : business.chiffreAffairesHT;
    const newRes = t === 'IN' ? business.resultatComptable + valHT : business.resultatComptable - valHT;

    updateBusiness({
      factures: updatedFactures,
      tresorerie: business.tresorerie + impact,
      chiffreAffairesHT: newCA,
      resultatComptable: newRes,
      fluxIn: t === 'IN' ? business.fluxIn + impact : business.fluxIn,
      fluxOut: t === 'OUT' ? business.fluxOut + Math.abs(impact) : business.fluxOut
    });
  };

  const handleAdd = (e: any) => {
    e.preventDefault();
    if (!client || !amountHT) return;
    performAdd(client, Number(amountHT), type, Number(tvaRate));
    setClient('');
    setAmountHT('');
    setTvaRate('20');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64String = (event.target?.result as string).split(',')[1];
          const mimeType = file.type;

          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          
          const promptString = `Analyze this invoice or receipt. Extract the following information and return it strictly as JSON.
If it's a receipt for a purchase made by the company (e.g. food, equipment, software like Apple), classify it as OUT. If it's an invoice issued BY the company to a client, classify it as IN. Most uploaded receipts are OUT.
Provide:
1. clientName: The name of the merchant, vendor, or client.
2. amountHT: The amount without taxes (HT). If only TTC is visible, estimate HT by determining the likely tax rate.
3. tvaRate: The likely VAT rate applied (extract 20, 14, 10, 7, or 0 based on context or explicit text on the receipt). Default to 20 if unsure.
4. type: "IN" or "OUT".`;

          const response = await ai.models.generateContent({
            model: "gemini-3.1-pro-preview",
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: base64String,
                  },
                },
                {
                  text: promptString,
                },
              ]
            },
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  clientName: { type: Type.STRING },
                  amountHT: { type: Type.NUMBER },
                  tvaRate: { type: Type.NUMBER },
                  type: { type: Type.STRING, description: "Must be exactly IN or OUT" }
                },
                required: ["clientName", "amountHT", "type", "tvaRate"]
              }
            }
          });

          const responseText = response.text;
          if (responseText) {
            const data = JSON.parse(responseText.trim());
            
            const detectedRate = data.tvaRate ? Number(data.tvaRate) : 20;

            setClient(data.clientName || 'Inconnu');
            setAmountHT(data.amountHT?.toString() || '0');
            setTvaRate(detectedRate.toString());
            setType(data.type === 'IN' ? 'IN' : 'OUT');
            
            // Auto add
            performAdd(data.clientName || 'Inconnu', Number(data.amountHT || 0), data.type === 'IN' ? 'IN' : 'OUT', detectedRate);
            
            setClient('');
            setAmountHT('');
            setTvaRate('20');
          }
        } catch (err) {
          console.error("Failed to parse invoice", err);
          alert("Erreur lors de l'analyse de l'image.");
        } finally {
          setIsScanning(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsScanning(false);
    }
  };

  const simulateScan = () => {
    fileInputRef.current?.click();
  };

  const tvaCollectee = facts.filter(f => f.type === 'IN').reduce((acc, f) => acc + f.tva, 0);
  const tvaDeductible = facts.filter(f => f.type === 'OUT').reduce((acc, f) => acc + f.tva, 0);
  const tvaEstimee = tvaCollectee - tvaDeductible;

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 px-6 md:px-10 pt-8 pb-20 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-space-gray hover:text-white transition-colors text-xs uppercase tracking-widest font-bold mb-6"
          >
            <ArrowLeft size={14} /> Retour
          </button>
          <h2 className="text-3xl md:text-[40px] font-extralight tracking-tight text-white leading-none">
            Saisie & Factures
          </h2>
        </div>
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
        <button 
          onClick={simulateScan}
          disabled={isScanning}
          className="flex items-center gap-2 px-6 py-3 bg-neon-mint text-midnight rounded-full text-xs font-bold uppercase tracking-widest hover:brightness-110 shadow-[0_0_15px_rgba(52,199,89,0.3)] transition-all disabled:opacity-50"
        >
           {isScanning ? <span className="animate-pulse">Analyse AI...</span> : <><ScanLine size={16} /> Scanner (IA)</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1 bg-white/[0.02] border border-[#1A1A1A] rounded-[24px] p-6 h-fit">
           <h3 className="text-white font-medium mb-6">Ajouter manuellement</h3>
           <form onSubmit={handleAdd} className="space-y-5">
             <div>
                <label className="text-space-gray text-[10px] uppercase tracking-widest mb-2 block font-bold">Client / Fournisseur</label>
                <input required value={client} onChange={e=>setClient(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-mint/50" placeholder="Nom de l'entité" />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-space-gray text-[10px] uppercase tracking-widest mb-2 block font-bold">Montant HT (MAD)</label>
                  <input required type="number" value={amountHT} onChange={e=>setAmountHT(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-mint/50" placeholder="0" />
               </div>
               <div>
                  <label className="text-space-gray text-[10px] uppercase tracking-widest mb-2 block font-bold">TVA (%)</label>
                  <select value={tvaRate} onChange={e=>setTvaRate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-mint/50 appearance-none">
                     <option value="20" className="bg-midnight">20% (Standard)</option>
                     <option value="14" className="bg-midnight">14% (Transport, Énergie)</option>
                     <option value="10" className="bg-midnight">10% (Restauration, Banque)</option>
                     <option value="7" className="bg-midnight">7% (Eau, Fournitures)</option>
                     <option value="0" className="bg-midnight">0% (Exonéré)</option>
                  </select>
               </div>
             </div>
             <div>
                <label className="text-space-gray text-[10px] uppercase tracking-widest mb-2 block font-bold">Type de Flux</label>
                <div className="flex bg-white/5 p-1 rounded-xl">
                  <button type="button" onClick={()=>setType('IN')} className={`flex-1 py-2 text-xs font-bold rounded-lg ${type==='IN'?'bg-neon-mint text-midnight':'text-space-gray'}`}>ENCAISSEMENT</button>
                  <button type="button" onClick={()=>setType('OUT')} className={`flex-1 py-2 text-xs font-bold rounded-lg ${type==='OUT'?'bg-white/10 text-white':'text-space-gray'}`}>DÉCAISSEMENT</button>
                </div>
             </div>
             <button type="submit" className="w-full py-4 bg-white text-midnight font-bold flex items-center justify-center gap-2 rounded-xl mt-4 hover:bg-neutral-200">
               <Plus size={16} /> Enregistrer
             </button>
           </form>
        </div>

        {/* TVA Summary & History */}
        <div className="lg:col-span-2 space-y-6">
           {/* TVA Synthesis Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/[0.02] border border-[#1A1A1A] p-5 rounded-2xl">
                 <p className="text-[10px] uppercase tracking-widest text-space-gray font-bold mb-1">TVA Collectée</p>
                 <p className="text-xl font-light text-white">{Number(tvaCollectee).toLocaleString('fr-FR')} <span className="text-xs text-space-gray">MAD</span></p>
              </div>
              <div className="bg-white/[0.02] border border-[#1A1A1A] p-5 rounded-2xl">
                 <p className="text-[10px] uppercase tracking-widest text-space-gray font-bold mb-1">TVA Déductible</p>
                 <p className="text-xl font-light text-white">{Number(tvaDeductible).toLocaleString('fr-FR')} <span className="text-xs text-space-gray">MAD</span></p>
              </div>
              <div className={`p-5 rounded-2xl border ${tvaEstimee > 0 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-neon-mint/10 border-neon-mint/20'}`}>
                 <p className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${tvaEstimee > 0 ? 'text-amber-500' : 'text-neon-mint'}`}>
                   {tvaEstimee > 0 ? 'TVA à Décaisser (Est.)' : 'Crédit de TVA (Est.)'}
                 </p>
                 <p className={`text-xl font-light ${tvaEstimee > 0 ? 'text-amber-500' : 'text-neon-mint'}`}>
                   {Math.abs(Number(tvaEstimee)).toLocaleString('fr-FR')} <span className="text-xs opacity-70">MAD</span>
                 </p>
              </div>
           </div>

           <div className="flex items-center justify-between pt-4">
             <h3 className="text-white font-medium">Historique Récent</h3>
             <span className="text-space-gray text-sm">{facts.length} documents</span>
           </div>
           
           <div className="space-y-3">
             {facts.length === 0 ? (
               <div className="bg-white/[0.01] border border-[#1A1A1A] rounded-[20px] p-10 flex flex-col items-center justify-center text-center">
                 <FileText className="text-space-gray mb-4" size={40} strokeWidth={1} />
                 <p className="text-space-gray font-light">Aucune facture enregistrée pour le moment.</p>
               </div>
             ) : (
               [...facts].reverse().map((f) => (
                 <div key={f.id} className="bg-white/[0.02] border border-[#1A1A1A] rounded-[16px] p-5 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center ${f.type === 'IN' ? 'bg-neon-mint/10 text-neon-mint' : 'bg-red-500/10 text-red-500'}`}>
                        {f.type === 'IN' ? <Plus size={16} /> : <span className="text-lg leading-none mb-1">-</span>}
                     </div>
                     <div>
                       <p className="text-white font-medium text-sm md:text-base">{f.client}</p>
                       <p className="text-space-gray text-xs mt-0.5">{f.date} &bull; TVA : {f.tva.toLocaleString()} MAD</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className={`font-semibold md:text-lg ${f.type === 'IN' ? 'text-neon-mint' : 'text-white'}`}>
                       {f.type === 'IN' ? '+' : '-'}{(f.amountHT + f.tva).toLocaleString('fr-FR')} MAD
                     </p>
                     <p className="text-space-gray text-xs mt-0.5">TTC</p>
                   </div>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
