import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

export interface UserProfile {
  firstName: string;
  lastName: string;
}

const PROFILE_FILE = FileSystem.documentDirectory + 'user-profile.json';

let profile: UserProfile | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(fn => fn());
}

export async function initUserStore() {
  try {
    const info = await FileSystem.getInfoAsync(PROFILE_FILE);
    if (info.exists) {
      const json = await FileSystem.readAsStringAsync(PROFILE_FILE);
      profile = JSON.parse(json) as UserProfile;
      notify();
    }
  } catch (e) {
    console.warn('[userStore] load failed:', e);
  }
}

export async function saveUserProfile(data: UserProfile) {
  profile = data;
  notify();
  try {
    await FileSystem.writeAsStringAsync(PROFILE_FILE, JSON.stringify(data));
  } catch (e) {
    console.warn('[userStore] save failed:', e);
  }
}

export function getUserProfile(): UserProfile | null {
  return profile;
}

export function useUserProfile(): UserProfile | null {
  const [data, setData] = useState<UserProfile | null>(profile);
  useEffect(() => {
    const unsub = () => setData(getUserProfile());
    listeners.add(unsub);
    return () => { listeners.delete(unsub); };
  }, []);
  return data;
}
