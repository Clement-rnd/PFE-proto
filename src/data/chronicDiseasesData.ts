import { PulseRectangle01Icon, BloodIcon } from '@hugeicons/core-free-icons';
import { dermatiteCustomIcon } from '../components/icons/DermatiteIcon';

export type Treatment = {
  name: string;
  since: string;
  posologie: string;
  prise: string;
};

export type ChronicDisease = {
  name: string;
  category: string;
  icon: any;
  symptoms: string[];
  treatment: Treatment | null;
};

export const CHRONIC_DISEASES: ChronicDisease[] = [
  {
    name: 'Dermatite atopique',
    category: 'Dermatologique',
    icon: dermatiteCustomIcon,
    symptoms: ['Démangeaisons', 'Léchage des pattes', 'Rougeurs sur le ventre'],
    treatment: {
      name: 'Apoquel - 16 mg',
      since: 'Depuis Janvier 2025',
      posologie: '1 cp / jour',
      prise: 'Matin avec repas',
    },
  },
  {
    name: 'Arthrose légère',
    category: 'Locomotrice',
    icon: PulseRectangle01Icon,
    symptoms: ['Boiterie légère', 'Raideur matinale', 'Douleur à la palpation'],
    treatment: {
      name: 'Meloxicam - 0.5 mg',
      since: 'Depuis Juin 2024',
      posologie: '1 cp / jour',
      prise: 'Soir avec repas',
    },
  },
  {
    name: 'Hypothyroïdie',
    category: 'Endocrinologique',
    icon: BloodIcon,
    symptoms: ['Fatigue excessive', 'Prise de poids', 'Perte de poils'],
    treatment: {
      name: 'Forthyron - 200 mcg',
      since: 'Depuis Mars 2025',
      posologie: '1 cp / jour',
      prise: 'Matin à jeun',
    },
  },
];

export const DISEASE_CATEGORIES = ['Dermatologique', 'Locomotrice', 'Endocrinologique'] as const;
