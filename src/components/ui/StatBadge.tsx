import React from 'react';

interface StatBadgeProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  suffix?: string;
}

export function StatBadge({ value, label, icon, suffix }: StatBadgeProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 glass-luxury-light rounded-2xl min-w-[100px]">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-amber-400">{icon}</span>}
        <span className="text-2xl sm:text-3xl font-black gradient-text-gold">
          {value}{suffix && <span className="text-sm ml-0.5">{suffix}</span>}
        </span>
      </div>
      <span className="text-xs text-slate-400 font-medium text-center">{label}</span>
    </div>
  );
}
