export interface Pet {
  name: string;
  species: string;
  races: string[];
  sex: string;
  sterilized: string;
  birthDate: string;
  photoUri?: string;
}

const pets: Pet[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(fn => fn());
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function addPet(pet: Pet) {
  pets.push(pet);
  notify();
}

export function getPets(): Pet[] {
  return [...pets];
}

export function updatePet(index: number, pet: Pet) {
  pets[index] = pet;
  notify();
}

export function deletePet(index: number) {
  pets.splice(index, 1);
  notify();
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
