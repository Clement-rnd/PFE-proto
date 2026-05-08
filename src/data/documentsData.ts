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
  petName: string;
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
  // ── Naya (petIndex 0) ──────────────────────────────────────────────────────
  {
    id: 'ordonnance-naya-juin-2026',
    petIndex: 0,
    petName: 'Naya',
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
    petName: 'Naya',
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
    petName: 'Naya',
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
    petName: 'Naya',
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
    petName: 'Naya',
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
    petName: 'Naya',
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
    petName: 'Naya',
    type: 'analyse',
    title: 'Bilan pré-opératoire',
    date: '10 janvier 2025',
    year: 2025,
    doctor: 'Dr. BERNARD',
    clinic: 'Clinique Vétérinaire des Lilas',
    content: "Bilan pré-opératoire avant stérilisation. Résultats satisfaisants, feu vert pour l'intervention.",
  },

  // ── Cooper (petIndex 1) ────────────────────────────────────────────────────
  {
    id: 'ordonnance-cooper-mars-2026',
    petIndex: 1,
    petName: 'Cooper',
    type: 'ordonnance',
    title: 'Ordonnance métronidazole',
    date: '29 mars 2026',
    year: 2026,
    status: 'active',
    doctor: 'Dr. LEROY',
    clinic: 'Clinique Vétérinaire du Parc',
    deliveryDate: '29 mars 2026',
    validity: '29 mars 2026 – 29 mars 2027',
    medications: [
      { name: 'Métronidazole 250 mg', frequence: '2x par jour · matin et soir', duree: '7 jours', instructions: 'À administrer au moment des repas.' },
      { name: 'Smecta', frequence: '3x par jour', duree: '5 jours' },
    ],
  },
  {
    id: 'ordonnance-cooper-nov-2025',
    petIndex: 1,
    petName: 'Cooper',
    type: 'ordonnance',
    title: 'Ordonnance amoxiciline',
    date: '7 novembre 2025',
    year: 2025,
    status: 'expired',
    doctor: 'Dr. MARTIN',
    clinic: 'Clinique Vétérinaire du Parc',
    deliveryDate: '7 novembre 2025',
    validity: '7 novembre 2025 – 7 novembre 2026',
    medications: [
      { name: 'Amoxicilline 500 mg', frequence: '2x par jour · matin et soir', duree: '10 jours', instructions: 'Donner avec la nourriture.' },
    ],
  },
  {
    id: 'ordonnance-cooper-aout-2025',
    petIndex: 1,
    petName: 'Cooper',
    type: 'ordonnance',
    title: 'Ordonnance métronidazole',
    date: '30 août 2025',
    year: 2025,
    status: 'expired',
    doctor: 'Dr. LEROY',
    clinic: 'Clinique Vétérinaire du Parc',
    deliveryDate: '30 août 2025',
    validity: '30 août 2025 – 30 août 2026',
    medications: [
      { name: 'Métronidazole 250 mg', frequence: '2x par jour · matin et soir', duree: '7 jours', instructions: 'À administrer au moment des repas.' },
    ],
  },
  {
    id: 'cr-cooper-mars-2026',
    petIndex: 1,
    petName: 'Cooper',
    type: 'compte-rendu',
    title: 'Consultation gastro-entérite',
    date: '29 mars 2026',
    year: 2026,
    doctor: 'Dr. LEROY',
    clinic: 'Clinique Vétérinaire du Parc',
    content: "Consultation du 29 mars 2026. Cooper présente des troubles digestifs depuis 48h. Prescription d'un traitement au métronidazole et de smecta.",
  },
  {
    id: 'analyse-bilan-cooper-jan-2026',
    petIndex: 1,
    petName: 'Cooper',
    type: 'analyse',
    title: 'Bilan sanguin complet',
    date: '19 janvier 2026',
    year: 2026,
    doctor: 'Dr. DUPONT',
    clinic: 'Centre Vétérinaire Orthopédie',
    content: 'Bilan sanguin annuel de contrôle. Résultats dans les normes. Surveillance de la fonction thyroïdienne recommandée.',
  },
];
