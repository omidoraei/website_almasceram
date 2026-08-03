import React from 'react';

interface LuxuryDividerProps {
  className?: string;
  text?: string;
}

export function LuxuryDivider({ className = '', text }: LuxuryDividerProps) {
  return (
    <div className={`flex items-center gap-4 my-12 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-amber-500/60" />
      {text && (
        <span className="text-amber-400/80 font-display text-sm tracking-widest uppercase whitespace-nowrap">
          {text}
        </span>
      )}
      <div className="flex-1 h-px bg-gradient-to-r from-amber-500/60 via-amber-500/30 to-transparent" />
    </div>
  );
}
