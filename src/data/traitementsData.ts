import { Medicine02Icon, DropperIcon } from '@hugeicons/core-free-icons';

export type TreatmentStatus = 'active' | 'upcoming' | 'finished' | 'paused';

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
  reason?: string;
  diseaseId?: string;
  daysInfo?: string;   // "7 jours restants" | "Dans 45 jours"
  dateRange?: string;  // "Juin - Juil. 2024" pour les terminés
  year?: number;       // pour le groupement par année dans l'onglet Expiré
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
    reason: 'Traitement contre les démangeaisons liées à la dermatite atopique.',
    diseaseId: 'Dermatite atopique',
    daysInfo: '21 jours restants',
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
    reason: "Anti-inflammatoire pour la gestion de la douleur liée à la dysplasie des hanches.",
    diseaseId: 'Dysplasie des hanches',
    daysInfo: '7 jours restants',
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
    reason: 'Traitement antiparasitaire mensuel préventif.',
    daysInfo: '12 jours restants',
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
