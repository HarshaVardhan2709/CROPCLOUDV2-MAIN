'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
  user: AuthUser | null;
  hydrated: boolean;
  setSession: (input: {
    accessToken: string;
    refreshToken: string;
    role?: string | null;
    user?: AuthUser | null;
  }) => void;
  setHydrated: () => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      role: null,
      user: null,
      hydrated: false,
      setSession: ({ accessToken, refreshToken, role, user }) =>
        set({
          accessToken,
          refreshToken,
          role: role ?? user?.role ?? null,
          user: user ?? null,
        }),
      setHydrated: () => set({ hydrated: true }),
      clearSession: () =>
        set({
          accessToken: null,
          refreshToken: null,
          role: null,
          user: null,
        }),
    }),
    {
      name: 'cropcloud-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        role: state.role,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
