import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-pulse space-y-3 p-4">
      <div className="aspect-[4/3] bg-slate-950 rounded-xl" />
      <div className="h-4 bg-slate-800 rounded w-3/4" />
      <div className="h-3 bg-slate-800 rounded w-1/2" />
      <div className="flex gap-2 pt-2">
        <div className="h-8 bg-slate-800 rounded-xl flex-1" />
        <div className="h-8 bg-slate-800 rounded-xl w-10" />
      </div>
    </div>
  );
};
