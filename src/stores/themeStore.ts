import { Theme } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  applyTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme: Theme) => {
        set({ theme });
        get().applyTheme();
      },
      applyTheme: () => {
        const { theme } = get();
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
            .matches
            ? 'dark'
            : 'light';
          root.classList.add(systemTheme);
          return;
        }

        root.classList.add(theme);
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);
