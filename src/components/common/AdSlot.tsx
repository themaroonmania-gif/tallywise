'use client';

import React from 'react';

interface AdSlotProps {
  id: string;
  className?: string;
  type?: 'banner' | 'rectangle' | 'bottom';
}

export function AdSlot({ id, className = '', type = 'banner' }: AdSlotProps) {
  // Determine height classes based on the ad type to prevent layout shifts (CLS)
  let heightClass = 'h-[90px]'; // default banner height
  let sizeLabel = '728 x 90 (Leaderboard) / 320 x 50 (Mobile)';

  if (type === 'rectangle') {
    heightClass = 'h-[250px]';
    sizeLabel = '300 x 250 (Medium Rectangle)';
  } else if (type === 'bottom') {
    heightClass = 'h-[90px] md:h-[250px]';
    sizeLabel = 'Flexible Banner / Rectangle';
  }

  return (
    <div
      id={id}
      className={`w-full my-6 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center relative overflow-hidden transition-all duration-200 ${heightClass} ${className}`}
    >
      <div className="absolute top-1 left-2 text-[9px] font-semibold tracking-wider text-slate-400 uppercase select-none">
        Advertisement
      </div>
      <div className="text-xs text-slate-400 font-mono text-center px-4">
        <span className="hidden sm:inline">Ad Slot: {id}</span>
        <span className="sm:hidden">Ad: {id}</span>
        <div className="text-[10px] text-slate-300 mt-0.5">{sizeLabel}</div>
      </div>
    </div>
  );
}
