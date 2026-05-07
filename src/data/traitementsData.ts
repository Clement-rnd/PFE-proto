import { Medicine02Icon, DropperIcon } from '@hugeicons/core-free-icons';

export type TreatmentStatus = 'active' | 'finished' | 'paused';

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
    status: 'active',
    posologie: '2 cp / jour',
    prise: 'Matin à jeun',
    diseaseId: 'Hypothyroïdie',
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
  },
];
