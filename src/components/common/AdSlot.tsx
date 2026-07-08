'use client';

import React, { useEffect, useRef } from 'react';

interface AdSlotProps {
  id: string;
  className?: string;
  type?: 'banner' | 'rectangle' | 'bottom';
}

export function AdSlot({ id, className = '', type = 'banner' }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Clear previous elements to avoid duplication (especially in React 18+ Dev mode)
    containerRef.current.innerHTML = '';

    let width = 300;
    let height = 250;
    let key = '';

    if (type === 'banner') {
      const isMobile = window.innerWidth < 768;
      key = isMobile ? 'c0e56ff887881c866dd9f0241b2ccb1c' : '16b352bc065ab8d1387c99cc4c08f868';
      width = isMobile ? 320 : 728;
      height = isMobile ? 50 : 90;
    } else if (type === 'rectangle') {
      key = '28ca4085a132e7009e4321c8f0eb39ba';
      width = 300;
      height = 250;
    }

    if (key) {
      // 1. Create a script element containing the configuration options
      const configScript = document.createElement('script');
      configScript.type = 'text/javascript';
      configScript.innerHTML = `
        atOptions = {
          'key' : '${key}',
          'format' : 'iframe',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `;
      containerRef.current.appendChild(configScript);

      // 2. Create the script element to invoke the ad network
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `https://www.highperformanceformat.com/${key}/invoke.js`;
      invokeScript.async = true;
      containerRef.current.appendChild(invokeScript);
    } else if (type === 'bottom') {
      // Native Banner Tag - relies on a container element + external script
      const divContainer = document.createElement('div');
      divContainer.id = 'container-ef76154fdc014c8ba62b33c2ad4525fa';
      containerRef.current.appendChild(divContainer);

      const nativeScript = document.createElement('script');
      nativeScript.type = 'text/javascript';
      nativeScript.src = 'https://pl30260318.effectivecpmnetwork.com/ef76154fdc014c8ba62b33c2ad4525fa/invoke.js';
      nativeScript.async = true;
      nativeScript.setAttribute('data-cfasync', 'false');
      containerRef.current.appendChild(nativeScript);
    }
  }, [type]);

  // Setup layout heights to prevent Cumulative Layout Shift (CLS)
  let heightClass = 'h-[90px]';
  if (type === 'banner') {
    heightClass = 'h-[50px] md:h-[90px]';
  } else if (type === 'rectangle') {
    heightClass = 'h-[250px]';
  } else if (type === 'bottom') {
    heightClass = 'min-h-[150px]';
  }

  return (
    <div
      id={id}
      className={`w-full my-6 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center relative overflow-hidden transition-all duration-200 ${heightClass} ${className}`}
    >
      <div className="absolute top-1 left-2 text-[9px] font-semibold tracking-wider text-slate-400 uppercase select-none z-10">
        Advertisement
      </div>
      <div ref={containerRef} className="w-full flex justify-center items-center"></div>
    </div>
  );
}
