import {
  ChickenThighsIcon, Bug02Icon, MoleculesIcon, Medicine02Icon,
} from '@hugeicons/core-free-icons';

export type Allergy = {
  name: string;
  category: 'Alimentaire' | 'Environnementale' | 'Médical';
  severity: 'Risque faible' | 'Risque modéré' | 'Risque élevé';
  icon: any;
  symptoms: string[];
  avoidance: string[];
};

export const ALLERGIES: Allergy[] = [
  {
    name: 'Poulet',
    category: 'Alimentaire',
    severity: 'Risque faible',
    icon: ChickenThighsIcon,
    symptoms: ['Démangeaisons cutanées', 'Éruption cutanée', 'Vomissements'],
    avoidance: [
      'Éviter les aliments à base de volaille',
      'Lire attentivement les étiquettes',
      'Privilégier des croquettes hypoallergéniques',
    ],
  },
  {
    name: 'Acariens',
    category: 'Environnementale',
    severity: 'Risque modéré',
    icon: Bug02Icon,
    symptoms: ['Grattage insistant', 'Éternuements fréquents', 'Yeux larmoyants'],
    avoidance: [
      'Laver la litière régulièrement',
      'Aspirer les zones de couchage',
      'Maintenir une bonne ventilation',
    ],
  },
  {
    name: 'Pollen de graminées',
    category: 'Environnementale',
    severity: 'Risque faible',
    icon: MoleculesIcon,
    symptoms: ['Grattage insistant', 'Éruption cutanée', 'Difficulté à respirer'],
    avoidance: [
      'Éviter les hautes herbes',
      'Aérer le logement',
      'Nettoyer régulièrement les couchages et textiles',
      'Surveiller l\'apparition de réactions cutanées',
    ],
  },
  {
    name: 'Pénicilline',
    category: 'Médical',
    severity: 'Risque élevé',
    icon: Medicine02Icon,
    symptoms: ['Gonflement du visage', 'Urticaire', 'Détresse respiratoire'],
    avoidance: [
      'Ne jamais administrer de pénicilline',
      'Informer tous les vétérinaires de cette allergie',
      'Garder une liste des médicaments à éviter',
    ],
  },
];

export const CATEGORY_ORDER = ['Alimentaire', 'Environnementale', 'Médical'] as const;
export const SEVERITY_ORDER = ['Risque élevé', 'Risque modéré', 'Risque faible'] as const;

export const RISK_STYLE: Record<string, { bg: string; text: string }> = {
  'Risque faible': { bg: '#e5faf5', text: '#1d745f' },
  'Risque modéré': { bg: '#fceee3', text: '#ea863e' },
  'Risque élevé':  { bg: '#fff1f2', text: '#e11d48' },
};
