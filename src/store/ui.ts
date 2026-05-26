import { create } from 'zustand';

interface UIState {
  collapsed: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  toggleTheme: () => void;
}

const savedTheme = (localStorage.getItem('theme') ?? 'light') as 'light' | 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

export const useUIStore = create<UIState>((set) => ({
  collapsed: false,
  theme: savedTheme,
  toggleSidebar: () => set((s) => ({ collapsed: !s.collapsed })),
  toggleTheme: () => set((s) => {
    const next = s.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    return { theme: next };
  }),
}));
