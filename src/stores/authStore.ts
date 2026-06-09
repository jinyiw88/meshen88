import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isVerified: boolean;
  pin: string;
  setPin: (pin: string) => void;
  verify: (input: string) => boolean;
  setVerified: (v: boolean) => void;
  logout: () => void;
  loadPin: () => Promise<void>;
}

const DEFAULT_PIN = '123456';

export const useAuthStore = create<AuthState>((set, get) => ({
  isVerified: false,
  pin: DEFAULT_PIN,

  setPin: async (pin: string) => {
    set({ pin });
    await AsyncStorage.setItem('insata_pin', pin);
  },

  verify: (input: string) => {
    return input === get().pin;
  },

  setVerified: (v: boolean) => set({ isVerified: v }),

  logout: () => set({ isVerified: false }),

  loadPin: async () => {
    try {
      const saved = await AsyncStorage.getItem('insata_pin');
      if (saved) set({ pin: saved });
    } catch {
      // use default
    }
  },
}));
