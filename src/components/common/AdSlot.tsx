'use client';

import React, { useEffect, useRef } from 'react';

type AdSlotType = 'banner' | 'rectangle' | 'bottom' | 'sidebar';

interface AdSlotProps {
  id: string;
  className?: string;
  type?: AdSlotType;
}

type IframeAdConfig = {
  key: string;
  width: number;
  height: number;
};

let iframeAdQueue: Promise<void> = Promise.resolve();

function getIframeAdConfig(type: AdSlotType, viewportWidth: number, viewportHeight: number): IframeAdConfig | null {
  if (type === 'banner') {
    if (viewportWidth < 468) {
      return {
        key: 'c0e56ff887881c866dd9f0241b2ccb1c',
        width: 320,
        height: 50,
      };
    }

    if (viewportWidth < 768) {
      return {
        key: '69262f5b442fb28c5f7e7f6e45e77911',
        width: 468,
        height: 60,
      };
    }

    return {
      key: '16b352bc065ab8d1387c99cc4c08f868',
      width: 728,
      height: 90,
    };
  }

  if (type === 'rectangle') {
    return {
      key: '28ca4085a132e7009e4321c8f0eb39ba',
      width: 300,
      height: 250,
    };
  }

  if (type === 'sidebar') {
    if (viewportWidth < 1400) {
      return null;
    }

    if (viewportHeight < 860) {
      return {
        key: '90262e5b9cbb8189ee3cc3b1b9c28782',
        width: 160,
        height: 300,
      };
    }

    return {
      key: 'cb54f8adcbd8dce1bf0489497277c920',
      width: 160,
      height: 600,
    };
  }

  return null;
}

function enqueueIframeAd(work: () => Promise<void>) {
  const next = iframeAdQueue.then(work).catch(() => undefined);
  iframeAdQueue = next.then(() => undefined, () => undefined);
  return next;
}

export function AdSlot({ id, className = '', type = 'banner' }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (typeof window === 'undefined' || !container) return;

    // Clear previous elements to avoid duplication (especially in React 18+ Dev mode)
    container.innerHTML = '';

    if (type === 'bottom') {
      const divContainer = document.createElement('div');
      divContainer.id = 'container-ef76154fdc014c8ba62b33c2ad4525fa';
      container.appendChild(divContainer);

      const nativeScript = document.createElement('script');
      nativeScript.type = 'text/javascript';
      nativeScript.src = 'https://pl30260318.effectivecpmnetwork.com/ef76154fdc014c8ba62b33c2ad4525fa/invoke.js';
      nativeScript.async = true;
      nativeScript.setAttribute('data-cfasync', 'false');
      container.appendChild(nativeScript);
      return;
    }

    const config = getIframeAdConfig(type, window.innerWidth, window.innerHeight);

    if (!config) return;

    let cancelled = false;

    enqueueIframeAd(async () => {
      if (cancelled || !container.isConnected) return;

      container.innerHTML = '';

      const configScript = document.createElement('script');
      configScript.type = 'text/javascript';
      configScript.innerHTML = `
        atOptions = {
          'key' : '${config.key}',
          'format' : 'iframe',
          'height' : ${config.height},
          'width' : ${config.width},
          'params' : {}
        };
      `;
      container.appendChild(configScript);

      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `https://www.highperformanceformat.com/${config.key}/invoke.js`;
      invokeScript.async = false;
      const loaded = new Promise<void>((resolve) => {
        invokeScript.onload = () => resolve();
        invokeScript.onerror = () => resolve();
        window.setTimeout(resolve, 5000);
      });

      container.appendChild(invokeScript);
      await loaded;
    });

    return () => {
      cancelled = true;
      container.innerHTML = '';
    };
  }, [type]);

  // Setup layout heights to prevent Cumulative Layout Shift (CLS)
  let heightClass = 'h-[90px]';
  if (type === 'banner') {
    heightClass = 'h-[50px] sm:h-[60px] md:h-[90px]';
  } else if (type === 'rectangle') {
    heightClass = 'h-[250px]';
  } else if (type === 'bottom') {
    heightClass = 'min-h-[150px]';
  } else if (type === 'sidebar') {
    heightClass = 'h-[300px] 2xl:h-[600px]';
  }

  const widthClass = type === 'sidebar' ? 'w-[160px]' : 'w-full';

  return (
    <div
      id={id}
      className={`my-6 flex flex-col items-center justify-center relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#ffffff]/58 shadow-sm transition-all duration-200 ${widthClass} ${heightClass} ${className}`}
    >
      <div className="absolute left-2 top-1 z-10 select-none text-[8px] font-black uppercase tracking-[0.18em] text-[#94a3b8]">
        Advertisement
      </div>
      <div ref={containerRef} className="flex h-full w-full items-center justify-center" />
    </div>
  );
}
