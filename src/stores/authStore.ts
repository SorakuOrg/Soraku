import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DiscordUser } from '@/lib/discord';

export type UserRole = 'admin' | 'moderator' | 'member';

export interface User {
  id: string;
  discordId: string;
  username: string;
  avatarUrl: string | null;
  email: string | null;
  role: UserRole;
  createdAt: string;
}

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  discordAccessToken: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setDiscordAccessToken: (token: string | null) => void;
  login: (discordUser: DiscordUser, accessToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Getters
  isAdmin: () => boolean;
  isModerator: () => boolean;
  canManageContent: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: true,
      discordAccessToken: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setDiscordAccessToken: (token) => set({ discordAccessToken: token }),
      
      login: (discordUser, accessToken) => {
        const user: User = {
          id: '', // Will be set from database
          discordId: discordUser.id,
          username: discordUser.username,
          avatarUrl: discordUser.avatar 
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=256`
            : `https://cdn.discordapp.com/embed/avatars/${parseInt(discordUser.discriminator) % 5}.png`,
          email: discordUser.email || null,
          role: 'member',
          createdAt: new Date().toISOString(),
        };
        
        set({ 
          user, 
          isAuthenticated: true, 
          discordAccessToken: accessToken,
          isLoading: false 
        });
      },
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        discordAccessToken: null,
        isLoading: false 
      }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
      
      // Getters
      isAdmin: () => get().user?.role === 'admin',
      isModerator: () => ['admin', 'moderator'].includes(get().user?.role || ''),
      canManageContent: () => ['admin', 'moderator'].includes(get().user?.role || ''),
    }),
    {
      name: 'soraku-auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
