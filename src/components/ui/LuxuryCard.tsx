import React from 'react';

interface LuxuryCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'glow' | 'border' | 'none';
  glass?: boolean;
}

export function LuxuryCard({
  children,
  className = '',
  hoverEffect = 'lift',
  glass = true
}: LuxuryCardProps) {
  const baseStyles = 'relative rounded-3xl overflow-hidden transition-all duration-500 ease-out';
  
  const glassStyles = glass 
    ? 'glass-luxury backdrop-blur-xl' 
    : 'bg-slate-900/80 border border-slate-800';

  const hoverEffects = {
    lift: 'card-luxury hover:-translate-y-2',
    glow: 'hover:glow-amber-md transition-shadow duration-500',
    border: 'border-animated',
    none: ''
  };

  return (
    <div className={`${baseStyles} ${glassStyles} ${hoverEffects[hoverEffect]} ${className}`}>
      {children}
    </div>
  );
}
