import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { AIConfig, AIProvider } from '@/types';

// 使用expo-secure-store作为存储适配器
const secureStore = {
  getItem: async (name: string) => {
    try {
      const value = await SecureStore.getItemAsync(name);
      return value;
    } catch (error) {
      console.error('Error getting item from secure store:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error('Error setting item in secure store:', error);
    }
  },
  removeItem: async (name: string) => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error('Error removing item from secure store:', error);
    }
  },
};

interface SettingsState {
  // AI配置 - 简化为只保留必要的配置
  aiConfig: AIConfig;
  apiKeys: Partial<Record<AIProvider, string>>;

  // 用户偏好
  theme: 'light' | 'dark' | 'auto';
  language: 'zh-CN' | 'en-US';

  // 功能开关
  enableVoice: boolean;
  enableNotification: boolean;

  // Actions
  setAPIKey: (provider: AIProvider, apiKey: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setLanguage: (language: 'zh-CN' | 'en-US') => void;
  toggleVoice: () => void;
  toggleNotification: () => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // 默认配置 - 使用doubao provider
      aiConfig: {
        provider: 'doubao',
        apiKey: process.env.EXPO_PUBLIC_DOUBAO_API_KEY || '',
        model: 'doubao-seed-1-6-251015',
        maxTokens: 4096,
        temperature: 0.7,
      },
      apiKeys: {},
      theme: 'auto',
      language: 'zh-CN',
      enableVoice: false,
      enableNotification: true,

      setAPIKey: (provider, apiKey) =>
        set((state) => ({
          apiKeys: { ...state.apiKeys, [provider]: apiKey },
          // 同时更新aiConfig中的provider和apiKey
          aiConfig: { ...state.aiConfig, provider, apiKey },
        })),

      setTheme: (theme) => set({ theme }),

      setLanguage: (language) => set({ language }),

      toggleVoice: () => set((state) => ({ enableVoice: !state.enableVoice })),

      toggleNotification: () =>
        set((state) => ({ enableNotification: !state.enableNotification })),

      resetSettings: async () => {
        // 清除持久化存储
        try {
          await secureStore.removeItem('settings-storage');
          console.log('Cleared persistent storage');
        } catch (error) {
          console.error('Failed to clear storage:', error);
        }
        
        // 重置状态
        set({
          aiConfig: {
            provider: 'doubao',
            apiKey: process.env.EXPO_PUBLIC_DOUBAO_API_KEY || '',
            model: 'doubao-seed-1-6-251015',
            maxTokens: 4096,
            temperature: 0.7,
          },
          apiKeys: {},
          theme: 'auto',
          language: 'zh-CN',
          enableVoice: false,
          enableNotification: true,
        });
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => secureStore),
    }
  )
);
