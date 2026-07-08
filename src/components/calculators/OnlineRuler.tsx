'use client';

import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'tallywise-ruler-px-per-inch';
const CSS_DEFAULT_PX_PER_INCH = 96; // CSS spec assumes 96px = 1 logical inch
const CARD_WIDTH_IN = 3.370; // standard ID-1 credit card width

function buildTicks(pxPerUnit: number, totalUnits: number, minorPerMajor: number) {
  const ticks: { left: number; major: boolean; label?: string }[] = [];
  const totalMinor = totalUnits * minorPerMajor;
  for (let i = 0; i <= totalMinor; i++) {
    const major = i % minorPerMajor === 0;
    ticks.push({
      left: (i / minorPerMajor) * pxPerUnit,
      major,
      label: major ? String(i / minorPerMajor) : undefined,
    });
  }
  return ticks;
}

export function OnlineRuler() {
  const [pxPerInch, setPxPerInch] = useState<number>(CSS_DEFAULT_PX_PER_INCH);
  const [calibrating, setCalibrating] = useState(false);
  const [cardWidthPx, setCardWidthPx] = useState<number>(CSS_DEFAULT_PX_PER_INCH * CARD_WIDTH_IN);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      const val = parseFloat(saved);
      if (val > 0) {
        setPxPerInch(val);
        setCardWidthPx(val * CARD_WIDTH_IN);
      }
    }
    setLoaded(true);
  }, []);

  const nudgeCard = (deltaPx: number) => {
    setCardWidthPx((prev) => {
      const next = Math.max(50, prev + deltaPx);
      return next;
    });
  };

  const saveCalibration = () => {
    const newPxPerInch = cardWidthPx / CARD_WIDTH_IN;
    setPxPerInch(newPxPerInch);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, String(newPxPerInch));
    }
    setCalibrating(false);
  };

  const resetCalibration = () => {
    setPxPerInch(CSS_DEFAULT_PX_PER_INCH);
    setCardWidthPx(CSS_DEFAULT_PX_PER_INCH * CARD_WIDTH_IN);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const pxPerCm = pxPerInch / 2.54;
  const inchTicks = buildTicks(pxPerInch, 12, 8); // 12in ruler, 1/8in minor ticks
  const cmTicks = buildTicks(pxPerCm, 30, 10); // 30cm ruler, mm minor ticks

  if (!loaded) {
    return <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 h-64" />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Screen Ruler</h2>
          <p className="text-sm text-slate-500 mt-1">
            Uses your browser&apos;s default scale (~1 inch = 96px). For higher accuracy on this specific screen, calibrate with a credit card below.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setCalibrating((v) => !v)}
            className="text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors"
          >
            {calibrating ? 'Cancel' : 'Calibrate'}
          </button>
          <button
            onClick={resetCalibration}
            className="text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {calibrating && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
          <p className="text-sm font-semibold text-slate-700">
            Hold a standard credit/debit card up to the rectangle below. Use the buttons until its width matches your card exactly.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => nudgeCard(-2)}
              className="w-9 h-9 shrink-0 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold hover:border-teal-400 hover:text-teal-600 transition-colors"
              aria-label="Make smaller"
            >
              −
            </button>
            <div
              className="h-24 rounded-md bg-teal-100 border-2 border-teal-500 shrink-0"
              style={{ width: `${cardWidthPx}px` }}
            />
            <button
              onClick={() => nudgeCard(2)}
              className="w-9 h-9 shrink-0 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold hover:border-teal-400 hover:text-teal-600 transition-colors"
              aria-label="Make bigger"
            >
              +
            </button>
          </div>
          <button
            onClick={saveCalibration}
            className="text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition-colors"
          >
            Save Calibration
          </button>
        </div>
      )}

      <div className="space-y-8 overflow-x-auto pb-2">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Inches</span>
          <div className="relative h-14 bg-slate-50 rounded-lg border border-slate-200" style={{ width: `${inchTicks[inchTicks.length - 1].left + 8}px`, minWidth: '100%' }}>
            {inchTicks.map((t, i) => (
              <div
                key={`in-${i}`}
                className="absolute bottom-0 bg-slate-500"
                style={{
                  left: `${t.left}px`,
                  width: '1px',
                  height: t.major ? '28px' : '12px',
                }}
              >
                {t.label && (
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-600">
                    {t.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Centimeters</span>
          <div className="relative h-14 bg-slate-50 rounded-lg border border-slate-200" style={{ width: `${cmTicks[cmTicks.length - 1].left + 8}px`, minWidth: '100%' }}>
            {cmTicks.map((t, i) => (
              <div
                key={`cm-${i}`}
                className="absolute bottom-0 bg-slate-500"
                style={{
                  left: `${t.left}px`,
                  width: '1px',
                  height: t.major ? '28px' : '12px',
                }}
              >
                {t.label && (
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-600">
                    {t.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Zooming your browser in or out will change measurement accuracy. Keep your browser at 100% zoom for the most accurate results, or recalibrate after changing zoom level.
      </p>
    </div>
  );
}
