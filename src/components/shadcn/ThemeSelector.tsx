import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme, AppTheme } from '../../context/ThemeContext';

const THEMES: { id: AppTheme; name: string; color: string }[] = [
  { id: 'vercel', name: 'Vercel', color: '#000000' },
  { id: 'supabase', name: 'Supabase', color: '#3ecf8e' },
  { id: 'claude', name: 'Claude', color: '#d97706' },
  { id: 'whatsapp', name: 'WhatsApp', color: '#25D366' },
  { id: 'instagram', name: 'Instagram', color: '#E1306C' },
  { id: 'gmail', name: 'Gmail', color: '#EA4335' },
];

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentThemeObj = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border border-border bg-card hover:bg-accent/60 hover:text-foreground transition-colors text-foreground min-h-[34px]"
        title="Select Theme"
      >
        <Palette className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="hidden sm:inline font-medium">{currentThemeObj.name}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-44 rounded-lg bg-popover border border-border shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-b border-border/80 mb-1">
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
                      ? 'bg-accent text-accent-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-border"
                      style={{ backgroundColor: t.color }}
                    />
                    <span>{t.name}</span>
                  </div>
                  {theme === t.id && <Check className="w-3.5 h-3.5 text-foreground" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
