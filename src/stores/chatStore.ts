import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface ChatState {
  chats: Chat[];
  addChat: (chat: Chat) => void;
  addMessage: (chatId: string, text: string) => void;
  loadChats: () => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],

  addChat: (chat: Chat) => {
    set((s) => ({ chats: [chat, ...s.chats] }));
    AsyncStorage.setItem('insata_chats', JSON.stringify(get().chats)).catch(() => {});
  },

  addMessage: (chatId: string, text: string) => {
    set((s) => ({
      chats: s.chats.map((c) =>
        c.id === chatId
          ? { ...c, lastMessage: text, time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }
          : c
      ),
    }));
    AsyncStorage.setItem('insata_chats', JSON.stringify(get().chats)).catch(() => {});
  },

  loadChats: async () => {
    try {
      const raw = await AsyncStorage.getItem('insata_chats');
      if (raw) set({ chats: JSON.parse(raw) });
    } catch {
      // empty
    }
  },
}));
