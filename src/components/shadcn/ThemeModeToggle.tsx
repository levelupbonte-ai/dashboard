import React, { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeModeToggle: React.FC = () => {
  const { mode, toggleMode } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        const target = e.target as HTMLElement | null;
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target?.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        toggleMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleMode]);

  return (
    <button
      onClick={toggleMode}
      className="size-8 rounded-md text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
      title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
      aria-label="Toggle theme mode"
    >
      {mode === 'dark' ? (
        <Sun className="size-4 text-muted-foreground hover:text-foreground" />
      ) : (
        <Moon className="size-4 text-muted-foreground hover:text-foreground" />
      )}
    </button>
  );
};
