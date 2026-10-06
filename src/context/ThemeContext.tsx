import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppTheme = 'vercel' | 'supabase' | 'claude' | 'mono';
export type AppMode = 'dark' | 'light';

interface ThemeContextType {
  theme: AppTheme;
  mode: AppMode;
  setTheme: (theme: AppTheme) => void;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
}

const THEME_STORAGE_KEY = 'levelup_dashboard_theme';
const MODE_STORAGE_KEY = 'levelup_dashboard_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as AppTheme | null;
    return saved && ['vercel', 'supabase', 'claude', 'mono'].includes(saved) ? saved : 'vercel';
  });

  const [mode, setModeState] = useState<AppMode>(() => {
    const saved = localStorage.getItem(MODE_STORAGE_KEY) as AppMode | null;
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    // Apply data-theme attribute
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    // Apply dark class to html
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  }, [mode]);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
  };

  const setMode = (newMode: AppMode) => {
    setModeState(newMode);
  };

  const toggleMode = () => {
    setModeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
