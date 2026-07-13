'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Eraser } from 'lucide-react';

/** Cursive font used to rasterize a "typed" signature — loaded once per page
 *  via a Google Fonts stylesheet link so `ctx.font` can reference it. */
const SIGNATURE_FONT_FAMILY = '"Dancing Script", cursive';
let signatureFontLoadPromise: Promise<void> | null = null;

function ensureSignatureFontLoaded(): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();
  if (!signatureFontLoadPromise) {
    signatureFontLoadPromise = (async () => {
      if (!document.querySelector('link[data-signature-font]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap';
        link.setAttribute('data-signature-font', 'true');
        document.head.appendChild(link);
      }
      try {
        await (document as unknown as { fonts: { load: (font: string) => Promise<unknown> } }).fonts.load(
          `48px ${SIGNATURE_FONT_FAMILY}`
        );
      } catch {
        // If the font API or the network font fails, canvas falls back to the
        // browser's default cursive font — still a usable typed signature.
      }
    })();
  }
  return signatureFontLoadPromise;
}

function DrawPad({ onChange }: { onChange: (dataUrl: string | null) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const dirty = useRef(false);

  useEffect(() => {
    const c = canvasRef.current!;
    const ctx = c.getContext('2d')!;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
    const pos = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) };
    };
    const down = (e: PointerEvent) => {
      drawing.current = true;
      const p = pos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    };
    const move = (e: PointerEvent) => {
      if (!drawing.current) return;
      const p = pos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      dirty.current = true;
    };
    const up = () => {
      if (drawing.current && dirty.current) onChange(c.toDataURL('image/png'));
      drawing.current = false;
    };
    c.addEventListener('pointerdown', down);
    c.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      c.removeEventListener('pointerdown', down);
      c.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [onChange]);

  const clear = () => {
    const c = canvasRef.current!;
    c.getContext('2d')!.clearRect(0, 0, c.width, c.height);
    dirty.current = false;
    onChange(null);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Draw your signature</label>
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-rose-600"
        >
          <Eraser className="h-3.5 w-3.5" /> Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        className="w-full touch-none rounded-xl border-2 border-dashed border-slate-300 bg-white"
        style={{ aspectRatio: '3 / 1' }}
      />
    </div>
  );
}

function TypePad({ onChange }: { onChange: (dataUrl: string | null) => void }) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (!text.trim()) {
      onChange(null);
      return;
    }
    let cancelled = false;
    void ensureSignatureFontLoaded().then(() => {
      if (cancelled) return;
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f172a';
      ctx.font = `64px ${SIGNATURE_FONT_FAMILY}`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(text.trim(), canvas.width / 2, canvas.height / 2, canvas.width - 40);
      onChange(canvas.toDataURL('image/png'));
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Type your name</label>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 text-2xl outline-none focus:border-rose-300"
        style={{ fontFamily: SIGNATURE_FONT_FAMILY, aspectRatio: '3 / 1' }}
      />
    </div>
  );
}

/** Draw-or-type signature capture, rasterized to a transparent-background PNG
 *  data URL via `onChange`. Shared by the standalone Sign PDF tool and the
 *  main editor's signature/initials fields. */
export function SignaturePad({ onChange }: { onChange: (dataUrl: string | null) => void }) {
  const [mode, setMode] = useState<'draw' | 'type'>('draw');

  return (
    <div>
      <div className="mb-2 flex gap-1.5">
        {(['draw', 'type'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              onChange(null);
            }}
            className={`rounded-md px-3 py-1 text-xs font-black uppercase tracking-wide transition-all ${
              mode === m ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {m === 'draw' ? 'Draw' : 'Type'}
          </button>
        ))}
      </div>
      {mode === 'draw' ? <DrawPad onChange={onChange} /> : <TypePad onChange={onChange} />}
    </div>
  );
}
