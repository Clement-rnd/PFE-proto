import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

export interface Pet {
  name: string;
  species: string;
  races: string[];
  sex: string;
  sterilized: string;
  birthDate: string;
  photoUri?: string;
  coatColor?: string;
  identType?: string;
  identNumber?: string;
  insurance?: string;
}

const PETS_FILE = FileSystem.documentDirectory + 'pets.json';
const PHOTOS_DIR = FileSystem.documentDirectory + 'pet-photos/';

const pets: Pet[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(fn => fn());
}

async function saveToDisk() {
  try {
    await FileSystem.writeAsStringAsync(PETS_FILE, JSON.stringify(pets));
  } catch (e) {
    console.warn('[petStore] save failed:', e);
  }
}

export async function initPetStore() {
  try {
    const info = await FileSystem.getInfoAsync(PETS_FILE);
    if (info.exists) {
      const json = await FileSystem.readAsStringAsync(PETS_FILE);
      const loaded = JSON.parse(json) as Pet[];
      pets.splice(0, pets.length, ...loaded);
      notify();
    }
  } catch (e) {
    console.warn('[petStore] load failed:', e);
  }
}

export async function copyPhotoToPermanent(uri: string): Promise<string> {
  if (uri.startsWith(PHOTOS_DIR)) return uri;
  await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
  const ext = uri.split('.').pop()?.split('?')[0] || 'jpg';
  const dest = PHOTOS_DIR + Date.now() + '.' + ext;
  await FileSystem.copyAsync({ from: uri, to: dest });
  return dest;
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function addPet(pet: Pet) {
  pets.push(pet);
  notify();
  saveToDisk();
}

export function getPets(): Pet[] {
  return [...pets];
}

export function updatePet(index: number, pet: Pet) {
  pets[index] = pet;
  notify();
  saveToDisk();
}

export function deletePet(index: number) {
  pets.splice(index, 1);
  notify();
  saveToDisk();
}

export function usePets(): Pet[] {
  const [data, setData] = useState<Pet[]>(getPets);
  useEffect(() => subscribe(() => setData(getPets())), []);
  return data;
}

export function computeAge(birthDate: string): string {
  if (!birthDate || birthDate.length < 8) return '';
  const [day, month, year] = birthDate.split('/').map(Number);
  if (!day || !month || !year) return '';
  const birth = new Date(year, month - 1, day);
  const now = new Date();
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (months < 1) return 'Moins d\'1 mois';
  if (months < 12) return `${months} mois`;
  const years = Math.floor(months / 12);
  return years === 1 ? '1 an' : `${years} ans`;
}
