import { Stethoscope02Icon, HospitalBed02Icon, TestTube02Icon } from '@hugeicons/core-free-icons';

export type ConsultationStatus = 'upcoming' | 'done';

export type Consultation = {
  id: string;
  title: string;
  petIndex: number;
  petName: string;
  icon: any;
  doctor: string;
  clinic: string;
  dateLabel: string;
  dateTime: string;
  year: number;
  status: ConsultationStatus;
  reason?: string;
  weight?: number;   // kg
  height?: number;   // cm
  chartLabel?: string; // short label for chart x-axis, e.g. "Nov '24"
};

export const CONSULTATIONS: Consultation[] = [
  {
    id: 'bilan-2026-cooper',
    title: 'Bilan annuel',
    petIndex: 0,
    petName: 'Cooper',
    icon: Stethoscope02Icon,
    doctor: 'Dr. MARTIN',
    clinic: 'Clinique Vétérinaire du Parc',
    dateLabel: '21 mars 2026',
    dateTime: '21 mars 2026 à 10h30',
    year: 2026,
    status: 'upcoming',
    reason: 'Bilan de santé annuel, vérification des vaccins et contrôle général.',
  },
  {
    id: 'dermato-2025-cooper',
    title: 'Consultation dermatologique',
    petIndex: 0,
    petName: 'Cooper',
    icon: Stethoscope02Icon,
    doctor: 'Dr. LEROY',
    clinic: 'Clinique Vétérinaire du Parc',
    dateLabel: '14 oct. 2025',
    dateTime: '14 oct. 2025 à 14h00',
    year: 2025,
    status: 'done',
    reason: 'Suivi de la dermatite atopique, ajustement du traitement.',
    weight: 29.5,
    height: 57,
    chartLabel: "Oct '25",
  },
  {
    id: 'bilan-2025-luna',
    title: 'Bilan annuel',
    petIndex: 1,
    petName: 'Luna',
    icon: Stethoscope02Icon,
    doctor: 'Dr. MARTIN',
    clinic: 'Clinique Vétérinaire du Parc',
    dateLabel: '3 juin 2025',
    dateTime: '3 juin 2025 à 11h00',
    year: 2025,
    status: 'done',
    reason: 'Bilan de santé annuel et vaccination.',
    weight: 4.2,
    height: 25,
    chartLabel: "Jun '25",
  },
  {
    id: 'analyse-2025-cooper',
    title: 'Analyse sanguine',
    petIndex: 0,
    petName: 'Cooper',
    icon: TestTube02Icon,
    doctor: 'Dr. MARTIN',
    clinic: 'Laboratoire VetDiag',
    dateLabel: '18 fév. 2025',
    dateTime: '18 fév. 2025 à 09h00',
    year: 2025,
    status: 'done',
    reason: 'Contrôle thyroïde dans le cadre du suivi hypothyroïdie.',
    weight: 28.5,
    height: 56,
    chartLabel: "Fév '25",
  },
  {
    id: 'ortho-2024-cooper',
    title: 'Consultation orthopédique',
    petIndex: 0,
    petName: 'Cooper',
    icon: HospitalBed02Icon,
    doctor: 'Dr. DUPONT',
    clinic: 'Centre Vétérinaire Orthopédie',
    dateLabel: '7 nov. 2024',
    dateTime: '7 nov. 2024 à 15h30',
    year: 2024,
    status: 'done',
    reason: 'Diagnostic dysplasie des hanches, bilan radiographique.',
    weight: 27.0,
    height: 55,
    chartLabel: "Nov '24",
  },
];
