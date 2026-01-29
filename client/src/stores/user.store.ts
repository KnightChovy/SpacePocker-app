import { create } from 'zustand';

interface UserState {
    email: string | null;
    setEmail: (email: string | null) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    email: null,
    setEmail: (email: string | null) => set({ email }),
    clearUser: () => set({ email: null }),
}));