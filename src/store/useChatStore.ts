import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { Message } from '@/types';

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

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  currentContext: {
    destination?: string;
    startDate?: string;
    endDate?: string;
    days?: number;
    budget?: string;
  };
}

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;

  // Actions
  addSession: (title?: string) => string;
  switchSession: (sessionId: string) => void;
  closeSession: (sessionId: string) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string) => void;
  updateContext: (context: Partial<ChatSession['currentContext']>) => void;
  setLoading: (isLoading: boolean) => void;
  clearCurrentSession: () => void;
  updateSessionTitle: (sessionId: string, title: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      isLoading: false,

      addSession: (title) => {
        const sessionId = Date.now().toString();
        const newSession: ChatSession = {
          id: sessionId,
          title: title || `新对话 ${new Date().toLocaleTimeString()}`,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          currentContext: {},
        };

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: sessionId,
        }));

        return sessionId;
      },

      switchSession: (sessionId) => {
        set({ currentSessionId: sessionId });
      },

      closeSession: (sessionId) => {
        set((state) => ({
          sessions: state.sessions.filter(session => session.id !== sessionId),
          currentSessionId: state.currentSessionId === sessionId ? 
            (state.sessions.find(s => s.id !== sessionId)?.id || null) : 
            state.currentSessionId,
        }));
      },

      addMessage: (message) =>
        set((state) => {
          if (!state.currentSessionId) return state;
          
          const sessions = state.sessions.map(session => {
            if (session.id === state.currentSessionId) {
              return {
                ...session,
                messages: [...session.messages, message],
                updatedAt: Date.now(),
              };
            }
            return session;
          });

          return { sessions };
        }),

      updateLastMessage: (content) =>
        set((state) => {
          if (!state.currentSessionId) return state;
          
          const sessions = state.sessions.map(session => {
            if (session.id === state.currentSessionId) {
              const messages = [...session.messages];
              if (messages.length > 0) {
                messages[messages.length - 1] = {
                  ...messages[messages.length - 1],
                  content,
                };
              }
              return {
                ...session,
                messages,
                updatedAt: Date.now(),
              };
            }
            return session;
          });

          return { sessions };
        }),

      updateContext: (context) =>
        set((state) => {
          if (!state.currentSessionId) return state;
          
          const sessions = state.sessions.map(session => {
            if (session.id === state.currentSessionId) {
              return {
                ...session,
                currentContext: { ...session.currentContext, ...context },
                updatedAt: Date.now(),
              };
            }
            return session;
          });

          return { sessions };
        }),

      setLoading: (isLoading) => set({ isLoading }),

      clearCurrentSession: () =>
        set((state) => {
          if (!state.currentSessionId) return state;
          
          const sessions = state.sessions.map(session => {
            if (session.id === state.currentSessionId) {
              return {
                ...session,
                messages: [],
                currentContext: {},
                updatedAt: Date.now(),
              };
            }
            return session;
          });

          return { sessions };
        }),

      updateSessionTitle: (sessionId, title) =>
        set((state) => {
          const sessions = state.sessions.map(session => {
            if (session.id === sessionId) {
              return {
                ...session,
                title,
                updatedAt: Date.now(),
              };
            }
            return session;
          });

          return { sessions };
        }),
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => secureStore),
    }
  )
);

// 选择器函数
export const useCurrentSession = () => {
  return useChatStore((state) => {
    if (!state.currentSessionId) return null;
    return state.sessions.find(session => session.id === state.currentSessionId) || null;
  });
};

export const useCurrentMessages = () => {
  return useChatStore((state) => {
    if (!state.currentSessionId) return [];
    const session = state.sessions.find(session => session.id === state.currentSessionId);
    return session?.messages || [];
  });
};
