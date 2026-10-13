import React from 'react';

interface NmcLogoProps {
  className?: string;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const NmcLogo: React.FC<NmcLogoProps> = ({
  className = '',
  showSubtitle = true,
  size = 'md',
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* NMC Pine & Wave Emblem SVG */}
      <div
        className={`relative shrink-0 flex items-center justify-center rounded-xl bg-white p-1 border border-slate-200/80 shadow-xs ${
          isSm ? 'w-9 h-9' : isLg ? 'w-12 h-12' : 'w-10 h-10'
        }`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle background circle/shield tint */}
          <circle cx="50" cy="50" r="46" fill="#e6f1f5" />

          {/* NMC Green Pine Tree (#0e6537) */}
          <g fill="#0e6537">
            {/* Top tier of pine */}
            <path d="M50 14L62 31H38L50 14Z" />
            {/* Middle tier */}
            <path d="M50 26L67 47H33L50 26Z" />
            {/* Lower tier */}
            <path d="M50 40L72 65H28L50 40Z" />
            {/* Pine trunk */}
            <rect x="47" y="65" width="6" height="12" rx="1.5" fill="#094726" />
          </g>

          {/* NMC Blue Great Lakes Wave (#004c6e) */}
          <path
            d="M14 74C24 67 36 67 47 74C58 81 70 81 86 73C86 77 84 83 78 86C66 92 52 87 40 82C28 77 20 81 14 84V74Z"
            fill="#004c6e"
          />
          <path
            d="M20 81C30 76 40 76 50 82C60 88 72 88 84 81C82 86 77 90 69 91C57 93 45 88 34 84C26 81 22 83 18 85C19 83 19 82 20 81Z"
            fill="#003750"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg leading-tight">
            NMC
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#0e6537]" />
          <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-[#004c6e]">
            nmc.edu
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-slate-500 leading-tight">
            Northwestern Michigan College
          </span>
        )}
      </div>
    </div>
  );
};
