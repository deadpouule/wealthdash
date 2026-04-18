export const WealthEngine = {
  /**
   * Calcul de l'Impôt sur les Sociétés (IS) - Barème Progressif Maroc 2025
   * Tranche 1: <= 300.000 (10%)
   * Tranche 2: 300.001 - 1.000.000 (20% - abattement 30.000)
   * Tranche 3: > 1.000.000 (35% - abattement 180.000)
   */
  calculateIS: (resultatFiscal: number): number => {
    if (resultatFiscal <= 0) return 0;
    if (resultatFiscal <= 300000) return resultatFiscal * 0.10;
    if (resultatFiscal <= 1000000) return (resultatFiscal * 0.20) - 30000;
    return (resultatFiscal * 0.35) - 180000;
  },

  /**
   * Cotisation Minimale (CM) - Taux de 0.25% sur le CA (Loi de finances actuelle)
   */
  calculateCM: (chiffreAffairesHT: number): number => {
    return chiffreAffairesHT * 0.0025;
  },

  /**
   * Impôt dû (Le plus élevé entre l'IS et la CM)
   */
  calculateImpotDu: (resultatFiscal: number, chiffreAffairesHT: number): number => {
    const is = WealthEngine.calculateIS(resultatFiscal);
    const cm = WealthEngine.calculateCM(chiffreAffairesHT);
    return Math.max(is, cm);
  },

  /**
   * TVA à Décaisser
   */
  calculateTVA: (tvaCollectee: number, tvaDeductible: number): number => {
    return Math.max(0, tvaCollectee - tvaDeductible);
  },

  /**
   * Coût Réel Employeur
   * Pour un salaire brut donné, on ajoute les charges patronales marocaines :
   * CNSS (Patronal) + AMO = Environ 21.09% du Brut
   */
  calculateCoutGlobalSalarie: (salaireBrut: number): number => {
    return salaireBrut * 1.2109;
  },

  /**
   * Évaluation du gain d'optimisation fiscale (Économie d'IS)
   */
  calculateGainIS: (depenseDeductible: number, resultatFiscalAvant: number): number => {
    const isAvant = WealthEngine.calculateIS(resultatFiscalAvant);
    const isApres = WealthEngine.calculateIS(resultatFiscalAvant - depenseDeductible);
    return isAvant - isApres;
  }
};
