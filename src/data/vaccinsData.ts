export type VaccineStatus = 'upToDate' | 'toDo' | 'late';

export type VaccineHistory = {
  date: string;
  doctor: string;
  clinic: string;
};

export type Vaccine = {
  id: string;
  name: string;
  petIndex: number;
  petName: string;
  status: VaccineStatus;
  lastInjection?: string;
  nextInjection: string;
  doctor: string;
  clinic: string;
  history: VaccineHistory[];
};

export const VACCINS: Vaccine[] = [
  {
    id: 'rage-cooper',
    name: 'Rage',
    petIndex: 0,
    petName: 'Cooper',
    status: 'upToDate',
    lastInjection: '3 mars 2023',
    nextInjection: 'Janv. 2028',
    doctor: 'Dr. MARTIN',
    clinic: 'Clinique Vétérinaire du Parc',
    history: [
      { date: '3 mars 2023', doctor: 'Dr. MARTIN', clinic: 'Clinique Vétérinaire du Parc' },
      { date: '5 mars 2020', doctor: 'Dr. MARTIN', clinic: 'Clinique Vétérinaire du Parc' },
      { date: '12 juin 2017', doctor: 'Dr. DUPONT', clinic: 'Clinique Vétérinaire du Parc' },
    ],
  },
  {
    id: 'leptospirose-cooper',
    name: 'Leptospirose',
    petIndex: 0,
    petName: 'Cooper',
    status: 'upToDate',
    lastInjection: '3 mars 2023',
    nextInjection: 'Avr. 2027',
    doctor: 'Dr. MARTIN',
    clinic: 'Clinique Vétérinaire du Parc',
    history: [
      { date: '3 mars 2023', doctor: 'Dr. MARTIN', clinic: 'Clinique Vétérinaire du Parc' },
      { date: '3 mars 2022', doctor: 'Dr. MARTIN', clinic: 'Clinique Vétérinaire du Parc' },
      { date: '5 mars 2020', doctor: 'Dr. MARTIN', clinic: 'Clinique Vétérinaire du Parc' },
    ],
  },
  {
    id: 'toux-chenil-cooper',
    name: 'Toux du chenil',
    petIndex: 0,
    petName: 'Cooper',
    status: 'toDo',
    lastInjection: '15 avr. 2024',
    nextInjection: 'Avr. 2026',
    doctor: 'Dr. LEROY',
    clinic: 'Clinique Vétérinaire du Parc',
    history: [
      { date: '15 avr. 2024', doctor: 'Dr. LEROY', clinic: 'Clinique Vétérinaire du Parc' },
      { date: '12 avr. 2022', doctor: 'Dr. DUPONT', clinic: 'Clinique Vétérinaire du Parc' },
    ],
  },
  {
    id: 'parvovirose-cooper',
    name: 'Parvovirose',
    petIndex: 0,
    petName: 'Cooper',
    status: 'late',
    lastInjection: '3 mars 2022',
    nextInjection: 'Mars 2025',
    doctor: 'Dr. MARTIN',
    clinic: 'Clinique Vétérinaire du Parc',
    history: [
      { date: '3 mars 2022', doctor: 'Dr. MARTIN', clinic: 'Clinique Vétérinaire du Parc' },
      { date: '5 mars 2019', doctor: 'Dr. MARTIN', clinic: 'Clinique Vétérinaire du Parc' },
    ],
  },
];
