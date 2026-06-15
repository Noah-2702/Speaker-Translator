"use client";

import { create } from "zustand";
import type { Profile, UserRole } from "@rt/shared";

interface AuthState {
  userId: string | null;
  email: string | null;
  profile: Profile | null;
  setSession: (payload: {
    userId: string;
    email: string;
    profile: Profile | null;
  }) => void;
  clearSession: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  userId: null,
  email: null,
  profile: null,
  setSession: ({ userId, email, profile }) => set({ userId, email, profile }),
  clearSession: () => set({ userId: null, email: null, profile: null }),
  hasRole: (roles) => {
    const role = get().profile?.role;
    return role ? roles.includes(role) : false;
  },
}));
