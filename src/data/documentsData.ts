import { Medicine02Icon, File02Icon, ClipboardIcon } from '@hugeicons/core-free-icons';

export type DocumentType = 'ordonnance' | 'analyse' | 'compte-rendu';
export type DocumentStatus = 'active' | 'expired';

export type DocumentMedication = {
  name: string;
  frequence: string;
  duree: string;
  instructions?: string;
};

export type PetDocument = {
  id: string;
  petIndex: number;
  type: DocumentType;
  title: string;
  date: string;
  year: number;
  status?: DocumentStatus;
  doctor?: string;
  clinic?: string;
  deliveryDate?: string;
  validity?: string;
  medications?: DocumentMedication[];
  content?: string;
};

export const DOC_TYPE_STYLE: Record<DocumentType, { label: string; bg: string; text: string; icon: any }> = {
  ordonnance:    { label: 'Ordonnance',   bg: '#FCEEF1', text: '#FF5A7D', icon: Medicine02Icon },
  analyse:       { label: 'Analyses',     bg: '#E5FAF5', text: '#1D745F', icon: ClipboardIcon },
  'compte-rendu':{ label: 'Compte-rendu', bg: '#E5E8FA', text: '#39438D', icon: File02Icon },
};

export const DOC_STATUS_STYLE: Record<DocumentStatus, { label: string; bg: string; text: string }> = {
  active:  { label: 'En cours', bg: '#E5FAF5', text: '#1D745F' },
  expired: { label: 'expirée',  bg: '#F5F5F5', text: '#4F4F4F' },
};

export const DOCUMENTS: PetDocument[] = [
  {
    id: 'ordonnance-naya-juin-2026',
    petIndex: 0,
    type: 'ordonnance',
    title: 'Ordonnance',
    date: '7 juin 2026',
    year: 2026,
    status: 'active',
    doctor: 'Dr. MARTIN',
    clinic: 'Clinique Vétérinaire des Lilas',
    deliveryDate: '7 juin 2026',
    validity: '7 juin 2026 – 7 juin 2027',
    medications: [
      { name: 'Métronidazole 250 mg', frequence: '2x par jours · matin et soir', duree: '7 jours', instructions: 'À administrer au moment des repas.' },
      { name: 'Oméprazole 10 mg',     frequence: '1x par jour · matin',          duree: '14 jours' },
      { name: 'Apoquel 16 mg',        frequence: '1x par jour · matin',          duree: 'Traitement chronique', instructions: 'Donner avec la nourriture.' },
    ],
  },
  {
    id: 'cr-metro-naya-avr-2026',
    petIndex: 0,
    type: 'compte-rendu',
    title: 'Ordonnance métronidazole',
    date: '7 avril 2026',
    year: 2026,
    doctor: 'Dr. MARTIN',
    clinic: 'Clinique Vétérinaire des Lilas',
    content: "Compte-rendu de consultation du 7 avril 2026. Naya présente des troubles digestifs. Prescription d'un traitement antibiotique au métronidazole.",
  },
  {
    id: 'analyse-bilan-naya-mars-2026',
    petIndex: 0,
    type: 'analyse',
    title: 'Bilan sanguin complet',
    date: '21 mars 2026',
    year: 2026,
    doctor: 'Dr. DUPONT',
    clinic: 'Centre Vétérinaire Orthopédie',
    content: 'Bilan sanguin de contrôle. Résultats dans les normes pour la race. Légère augmentation des globules blancs, à surveiller.',
  },
  {
    id: 'ordonnance-naya-oct-2025',
    petIndex: 0,
    type: 'ordonnance',
    title: 'Ordonnance métronidazole',
    date: '2 octobre 2025',
    year: 2025,
    status: 'expired',
    doctor: 'Dr. DUPONT',
    clinic: 'Clinique Vétérinaire des Lilas',
    deliveryDate: '2 octobre 2025',
    validity: '2 octobre 2025 – 2 octobre 2026',
    medications: [
      { name: 'Métronidazole 250 mg', frequence: '2x par jour · matin et soir', duree: '7 jours', instructions: 'À administrer au moment des repas.' },
    ],
  },
  {
    id: 'analyse-bilan-naya-jun-2025',
    petIndex: 0,
    type: 'analyse',
    title: 'Bilan sanguin complet',
    date: '29 juin 2025',
    year: 2025,
    doctor: 'Dr. MARTIN',
    clinic: 'Clinique Vétérinaire des Lilas',
    content: 'Bilan sanguin annuel. Tous les paramètres sont dans les normes.',
  },
  {
    id: 'cr-sterilisation-naya-2025',
    petIndex: 0,
    type: 'compte-rendu',
    title: 'Compte-rendu stérilisation',
    date: '17 janvier 2025',
    year: 2025,
    doctor: 'Dr. BERNARD',
    clinic: 'Clinique Vétérinaire des Lilas',
    content: "Ovariectomie réalisée sans complication. Suites opératoires normales. Naya est en bonne santé.",
  },
  {
    id: 'analyse-bilan-preop-naya-2025',
    petIndex: 0,
    type: 'analyse',
    title: 'Bilan pré-opératoire',
    date: '10 janvier 2025',
    year: 2025,
    doctor: 'Dr. BERNARD',
    clinic: 'Clinique Vétérinaire des Lilas',
    content: 'Bilan pré-opératoire avant stérilisation. Résultats satisfaisants, feu vert pour l\'intervention.',
  },
];
