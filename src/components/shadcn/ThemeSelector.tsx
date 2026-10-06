import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme, AppTheme } from '../../context/ThemeContext';

const THEMES: { id: AppTheme; name: string; color: string }[] = [
  { id: 'vercel', name: 'Vercel', color: '#000000' },
  { id: 'supabase', name: 'Supabase', color: '#3ecf8e' },
  { id: 'claude', name: 'Claude', color: '#d97706' },
  { id: 'mono', name: 'Mono', color: '#52525b' },
];

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs border border-zinc-800 bg-[#0c0d12] hover:bg-zinc-800/60 hover:text-white transition-colors text-zinc-300 min-h-[32px]"
        title="Select Theme"
      >
        <Palette className="w-3.5 h-3.5 text-zinc-400" />
        <span className="hidden sm:inline capitalize">{theme}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-44 rounded-lg bg-[#0c0d12] border border-zinc-800 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-400 border-b border-zinc-800/80 mb-1">
              Design Theme
            </div>
            <div className="space-y-0.5">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-left transition-colors ${
                    theme === t.id
                      ? 'bg-zinc-800 text-white font-medium'
                      : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/20"
                      style={{ backgroundColor: t.color }}
                    />
                    <span>{t.name}</span>
                  </div>
                  {theme === t.id && <Check className="w-3.5 h-3.5 text-zinc-200" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
