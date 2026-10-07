import React from 'react';
import { cn } from '../../lib/utils';

interface LevelUpLogoProps {
  className?: string;
}

export const LevelUpLogo: React.FC<LevelUpLogoProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-7 shrink-0 select-none', className)}
      aria-label="LevelUp Logo"
    >
      {/* Top-Left Stepped Corner Bracket */}
      <path d="M11 28 V15 H13 V13 H26 V16.5 H14.5 V28 Z" fill="#8B5CF6" />

      {/* Top-Right Stepped Corner Bracket */}
      <path d="M74 13 H87 V15 H89 V28 H85.5 V16.5 H74 Z" fill="#8B5CF6" />

      {/* Bottom-Left Stepped Corner Bracket */}
      <path d="M11 74 H14.5 V85.5 H26 V89 H13 V87 H11 Z" fill="#8B5CF6" />

      {/* Bottom-Right Stepped Corner Bracket */}
      <path d="M85.5 74 H89 V87 H87 V89 H74 V85.5 H85.5 Z" fill="#8B5CF6" />

      {/* Center 3D Faceted 5-Pointed Purple Star */}
      {/* Top Point (Right Facet) */}
      <polygon points="50,52 50,34 54,46.5" fill="#C8B2F8" />

      {/* Right Point (Upper & Lower Facets) */}
      <polygon points="50,52 54,46.5 66.5,46.5" fill="#7C3AED" />
      <polygon points="50,52 66.5,46.5 56.8,54.2" fill="#5B21B6" />

      {/* Bottom-Right Point (Right & Left Facets) */}
      <polygon points="50,52 56.8,54.2 60,66" fill="#4C1D95" />
      <polygon points="50,52 60,66 50,58.8" fill="#3B0764" />

      {/* Bottom-Left Point (Right & Left Facets) */}
      <polygon points="50,52 50,58.8 40,66" fill="#5B21B6" />
      <polygon points="50,52 40,66 43.2,54.2" fill="#7C3AED" />

      {/* Left Point (Lower & Upper Facets) */}
      <polygon points="50,52 43.2,54.2 33.5,46.5" fill="#A78BFA" />
      <polygon points="50,52 33.5,46.5 46,46.5" fill="#C4B5FD" />
    </svg>
  );
};
