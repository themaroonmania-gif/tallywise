import React from 'react';
import { AdSlot } from './AdSlot';

/**
 * Sticky ad rails along the left/right edges of the viewport. Only shown on
 * very wide screens (min-[1600px]) where there's real empty margin outside
 * the main content column, so they never compress or overlap page content.
 */
export function SidebarAds() {
  return (
    <>
      <div className="hidden min-[1600px]:block fixed left-4 top-24 z-30 w-[300px]">
        <AdSlot id="sidebar-left" type="sidebar" className="my-0" />
      </div>
      <div className="hidden min-[1600px]:block fixed right-4 top-24 z-30 w-[300px]">
        <AdSlot id="sidebar-right" type="sidebar" className="my-0" />
      </div>
    </>
  );
}
