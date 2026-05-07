import { Stethoscope02Icon, HospitalBed02Icon } from '@hugeicons/core-free-icons';

export type MedicalDocument = {
  name: string;
  size: string;
  date: string;
};

export type MedicalEvent = {
  id: string;
  title: string;
  icon: any;
  doctor: string;
  dateLabel: string;
  year: number;
  status: string;
  clinic: string;
  duration?: string;
  reason?: string;
  treatments: string[];
  documents: MedicalDocument[];
};

export const MEDICAL_HISTORY: MedicalEvent[] = [
  {
    id: 'bilan-2026',
    title: 'Bilan annuel',
    icon: Stethoscope02Icon,
    doctor: 'Dr. MARTIN',
    dateLabel: '21 mars 2026',
    year: 2026,
    status: 'Passée',
    clinic: 'Clinique Vétérinaire des Lilas',
    reason: 'Bilan annuel de santé. Contrôle poids, vaccination et état général.',
    treatments: [],
    documents: [
      { name: 'bilan-annuel-naya-2026.pdf', size: '1.2MB', date: '21 mars 2026' },
    ],
  },
  {
    id: 'sterilisation-2025',
    title: 'Stérilisation',
    icon: HospitalBed02Icon,
    doctor: 'Dr. BERNARD',
    dateLabel: '14 janvier 2025',
    year: 2025,
    status: 'Passée',
    clinic: 'Clinique Vétérinaire des Lilas',
    duration: '1 jour (14 janv. 2025)',
    reason: 'Ovariectomie sous anesthésie générale. Suites opératoires normales.',
    treatments: [
      'Meloxicam 1 mg · 1x/j · pendant 5 jours',
      'Amoxicilline 500 mg · 2x/j · pendant 7 jours',
    ],
    documents: [
      { name: 'compte-rendu-sterilisation.pdf', size: '2.4MB', date: '14 janv. 2025' },
    ],
  },
  {
    id: 'hospi-oct-2024',
    title: 'Hospitalisation',
    icon: HospitalBed02Icon,
    doctor: 'Dr. MARTIN',
    dateLabel: '2 octobre 2024',
    year: 2024,
    status: 'Passée',
    clinic: 'Clinique Vétérinaire des Lilas',
    duration: '3 jours (2 oct. 2024 → 5 oct. 2024)',
    reason: "Ingestion d'un corps étranger. Observation et surveillance post-opératoire.",
    treatments: [
      'Métronidazole 250 mg · 2x/j · pendant 7 jours',
      'Oméprazole 10 mg · 1x/j · pendant 14 jours',
    ],
    documents: [
      { name: 'compte-rendu-hospitalisation.pdf', size: '7MB', date: '2 oct. 2024' },
      { name: 'ordonnance-veterinaire-naya.pdf', size: '2MB', date: '2 oct. 2024' },
    ],
  },
  {
    id: 'hospi-juin-2024',
    title: 'Hospitalisation',
    icon: HospitalBed02Icon,
    doctor: 'Dr. MARTIN',
    dateLabel: '27 juin 2024',
    year: 2024,
    status: 'Passée',
    clinic: 'Clinique Vétérinaire des Lilas',
    duration: '2 jours (27 juin 2024 → 29 juin 2024)',
    reason: 'Gastro-entérite aiguë. Réhydratation et surveillance digestive.',
    treatments: [
      'Métronidazole 250 mg · 2x/j · pendant 5 jours',
    ],
    documents: [],
  },
];
