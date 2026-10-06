import React, { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeModeToggle: React.FC = () => {
  const { mode, toggleMode } = useTheme();

  // Keyboard shortcut Cmd/Ctrl+Shift+D to toggle theme
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
      className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors border border-zinc-800/80 bg-[#0c0d12] min-h-[32px] min-w-[32px] flex items-center justify-center"
      title={`Toggle ${mode === 'dark' ? 'Light' : 'Dark'} Mode (⌘⇧D)`}
      aria-label="Toggle theme mode"
    >
      {mode === 'dark' ? (
        <Sun className="w-3.5 h-3.5 text-zinc-300" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-zinc-700" />
      )}
    </button>
  );
};
