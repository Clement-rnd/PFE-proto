import { Medicine02Icon, DropperIcon } from '@hugeicons/core-free-icons';

export type TreatmentStatus = 'active' | 'upcoming' | 'finished' | 'paused';

export type TreatmentDocument = { name: string; size: string; date: string };

export type Traitement = {
  id: string;
  name: string;
  icon: any;
  petIndex: number;
  petName: string;
  doctor: string;
  clinic: string;
  startDate: string;
  endDate?: string;
  status: TreatmentStatus;
  posologie: string;
  prise: string;
  duree?: string;
  reason?: string;
  diseaseId?: string;
  daysInfo?: string;
  dateRange?: string;
  year?: number;
  totalDays?: number;
  elapsedDays?: number;
  documents?: TreatmentDocument[];
};

export const TRAITEMENTS: Traitement[] = [
  {
    id: 'apoquel-cooper',
    name: 'Apoquel - 16 mg',
    icon: Medicine02Icon,
    petIndex: 0,
    petName: 'Cooper',
    doctor: 'Dr. LEROY',
    clinic: 'Clinique Vétérinaire du Parc',
    startDate: 'Janv. 2025',
    status: 'active',
    posologie: '1 cp / jour',
    prise: 'Matin avec repas',
    duree: 'Traitement chronique (janv. 2025 → en cours)',
    reason: 'Traitement contre les démangeaisons liées à la dermatite atopique.',
    diseaseId: 'Dermatite atopique',
    daysInfo: '21 jours restants',
    totalDays: 90,
    elapsedDays: 69,
    documents: [
      { name: 'ordonnance-apoquel-janv-2025.pdf', size: '1.2 MB', date: '8 janv. 2025' },
    ],
  },
  {
    id: 'meloxicam-cooper',
    name: 'Meloxicam - 0.5 mg',
    icon: Medicine02Icon,
    petIndex: 0,
    petName: 'Cooper',
    doctor: 'Dr. DUPONT',
    clinic: 'Centre Vétérinaire Orthopédie',
    startDate: 'Nov. 2024',
    status: 'active',
    posologie: '1 cp / jour',
    prise: 'Soir avec repas',
    duree: 'Pendant 14 jours (1 nov. → 15 nov. 2024)',
    reason: "Anti-inflammatoire pour la gestion de la douleur liée à la dysplasie des hanches.",
    diseaseId: 'Dysplasie des hanches',
    daysInfo: '7 jours restants',
    totalDays: 14,
    elapsedDays: 7,
  },
  {
    id: 'forthyron-cooper',
    name: 'Forthyron - 200 mcg',
    icon: Medicine02Icon,
    petIndex: 0,
    petName: 'Cooper',
    doctor: 'Dr. MARTIN',
    clinic: 'Clinique Vétérinaire du Parc',
    startDate: 'Oct. 2024',
    status: 'upcoming',
    posologie: '2 cp / jour',
    prise: 'Matin à jeun',
    duree: 'À vie',
    diseaseId: 'Hypothyroïdie',
    daysInfo: 'Dans 14 jours',
  },
  {
    id: 'stronghold-luna',
    name: 'Stronghold - 60 mg',
    icon: DropperIcon,
    petIndex: 1,
    petName: 'Luna',
    doctor: 'Dr. MARTIN',
    clinic: 'Clinique Vétérinaire du Parc',
    startDate: 'Mars 2025',
    status: 'active',
    posologie: '1 pipette / mois',
    prise: 'Application cutanée',
    duree: 'Mensuel (mars 2025 → en cours)',
    reason: 'Traitement antiparasitaire mensuel préventif.',
    daysInfo: '12 jours restants',
    totalDays: 30,
    elapsedDays: 18,
  },
  {
    id: 'amoxicilline-cooper',
    name: 'Amoxicilline - 500 mg',
    icon: Medicine02Icon,
    petIndex: 0,
    petName: 'Cooper',
    doctor: 'Dr. MARTIN',
    clinic: 'Clinique Vétérinaire du Parc',
    startDate: 'Juin 2024',
    endDate: 'Juil. 2024',
    status: 'finished',
    posologie: '2 cp / jour',
    prise: 'Matin et soir avec repas',
    reason: 'Antibiotique suite à une infection cutanée.',
    dateRange: 'Juin - Juil. 2024',
    year: 2024,
  },
  {
    id: 'prednisolone-cooper',
    name: 'Prednisolone - 5 mg',
    icon: Medicine02Icon,
    petIndex: 0,
    petName: 'Cooper',
    doctor: 'Dr. LEROY',
    clinic: 'Clinique Vétérinaire du Parc',
    startDate: 'Fév. 2024',
    endDate: 'Mars 2024',
    status: 'finished',
    posologie: '1 cp / jour',
    prise: 'Matin avec repas',
    reason: 'Corticoïde en cure courte suite à une réaction allergique sévère.',
    dateRange: 'Fév. - Mars 2024',
    year: 2024,
  },
  {
    id: 'metronidazole-oct2024-cooper',
    name: 'Métronidazole - 250 mg',
    icon: Medicine02Icon,
    petIndex: 0,
    petName: 'Cooper',
    doctor: 'Dr. MARTIN',
    clinic: 'Clinique Vétérinaire des Lilas',
    startDate: 'Oct. 2024',
    endDate: 'Oct. 2024',
    status: 'finished',
    posologie: '2 cp / jour',
    prise: 'Matin et soir avec repas',
    duree: 'Pendant 7 jours (2 oct. → 9 oct. 2024)',
    reason: 'Antibiotique post-hospitalisation suite à ingestion de corps étranger.',
    dateRange: 'Oct. 2024',
    year: 2024,
  },
  {
    id: 'omeprazole-cooper',
    name: 'Oméprazole - 10 mg',
    icon: Medicine02Icon,
    petIndex: 0,
    petName: 'Cooper',
    doctor: 'Dr. DUPONT',
    clinic: 'Centre Vétérinaire Orthopédie',
    startDate: 'Nov. 2023',
    endDate: 'Déc. 2023',
    status: 'finished',
    posologie: '1 cp / jour',
    prise: 'Matin à jeun',
    reason: "Protecteur gastrique prescrit en accompagnement du Meloxicam.",
    dateRange: 'Nov. - Déc. 2023',
    year: 2023,
  },
];
