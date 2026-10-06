import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  onClick: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:border-border transition-colors text-xs min-h-[34px] group"
      title="Global Search (⌘K)"
      aria-label="Open global search"
    >
      <Search className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
      <span className="hidden md:inline text-muted-foreground group-hover:text-foreground transition-colors">
        Search...
      </span>
      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted border border-border rounded">
        <span>⌘</span>K
      </kbd>
    </button>
  );
};
