import { Bone02Icon, Atom01Icon, PillIcon, InjectionIcon } from '@hugeicons/core-free-icons';
import { dermatiteCustomIcon } from '../components/icons/DermatiteIcon';

export type TreatmentType = 'cachet' | 'injection' | 'sirop' | 'autre';

export type Treatment = {
  name: string;
  since: string;
  posologie: string;
  prise: string;
  type: TreatmentType;
};

export const TREATMENT_ICON: Record<TreatmentType, any> = {
  cachet: PillIcon,
  injection: InjectionIcon,
  sirop: PillIcon,
  autre: PillIcon,
};

export type ChronicDisease = {
  name: string;
  category: string;
  icon: any;
  diagnosedDate: string;
  symptoms: string[];
  treatment: Treatment | null;
};

export const CHRONIC_DISEASES: ChronicDisease[] = [
  {
    name: 'Dermatite atopique',
    category: 'Dermatologique',
    icon: dermatiteCustomIcon,
    diagnosedDate: 'janv. 2025',
    symptoms: ['Démangeaisons', 'Léchage des pattes', 'Rougeurs sur le ventre'],
    treatment: {
      name: 'Apoquel - 16 mg',
      since: 'Depuis Janvier 2025',
      posologie: '1 cp / jour',
      prise: 'Matin avec repas',
      type: 'cachet',
    },
  },
  {
    name: 'Dysplasie des hanches',
    category: 'Articulaire',
    icon: Bone02Icon,
    diagnosedDate: 'nov. 2024',
    symptoms: ['Boiterie légère', 'Douleur à la palpation des hanches', 'Difficulté à se lever'],
    treatment: {
      name: 'Meloxicam - 0.5 mg',
      since: 'Depuis Juin 2024',
      posologie: '1 cp / jour',
      prise: 'Soir avec repas',
      type: 'cachet',
    },
  },
  {
    name: 'Hypothyroïdie',
    category: 'Endocrinien',
    icon: Atom01Icon,
    diagnosedDate: 'oct. 2024',
    symptoms: ['Fatigue excessive', 'Prise de poids', 'Perte de poils'],
    treatment: {
      name: 'Forthyron - 200 mcg',
      since: 'Depuis Mars 2025',
      posologie: '1 cp / jour',
      prise: 'Matin à jeun',
      type: 'cachet',
    },
  },
];
