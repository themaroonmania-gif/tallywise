'use client';

import React from 'react';
import { AdSlot } from './AdSlot';

/**
 * Sticky ad rails along the left/right edges of the viewport. Only shown on
 * very wide screens where there is enough margin outside the main content.
 */
export function SidebarAds() {
  return (
    <div className="pointer-events-none hidden 2xl:block" aria-hidden="true">
      <div className="fixed left-4 top-24 z-40 pointer-events-auto">
        <AdSlot id="left-sidebar-ad" type="sidebar" className="my-0 shadow-xl shadow-slate-200/60" />
      </div>

      <div className="fixed right-4 top-24 z-40 pointer-events-auto">
        <AdSlot id="right-sidebar-ad" type="sidebar" className="my-0 shadow-xl shadow-slate-200/60" />
      </div>
    </div>
  );
}
