'use client';

import React, { useState, useEffect } from 'react';

export function TimeZoneCalculator() {
  const [timeInput, setTimeInput] = useState<string>('12:00');
  const [fromTz, setFromTz] = useState<number>(-5); // EST = -5
  const [toTz, setToTz] = useState<number>(0); // UTC = 0

  const [convertedTime, setConvertedTime] = useState<string>('17:00');

  const timezones = [
    { name: 'UTC / GMT (Greenwich Mean Time)', offset: 0 },
    { name: 'EST (Eastern Standard Time / New York)', offset: -5 },
    { name: 'CST (Central Standard Time / Chicago)', offset: -6 },
    { name: 'MST (Mountain Standard Time / Denver)', offset: -7 },
    { name: 'PST (Pacific Standard Time / Los Angeles)', offset: -8 },
    { name: 'CET (Central European Time / Paris)', offset: 1 },
    { name: 'JST (Japan Standard Time / Tokyo)', offset: 9 },
    { name: 'AEST (Australian Eastern Standard Time / Sydney)', offset: 10 },
  ];

  useEffect(() => {
    if (!timeInput) return;

    const [hoursStr, minutesStr] = timeInput.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (isNaN(hours) || isNaN(minutes)) return;

    // Calculate base time in UTC hours
    let utcHours = hours - fromTz;

    // Convert UTC hours to destination timezone hours
    let destHours = utcHours + toTz;

    // Normalize hours to 24-hour cycle
    destHours = (destHours % 24 + 24) % 24;

    const destHoursRounded = Math.floor(destHours);
    const destMins = Math.round((destHours - destHoursRounded) * 60) + minutes;
    
    // Format to 12-hour AM/PM clock
    const displayHours = destHoursRounded % 12 === 0 ? 12 : destHoursRounded % 12;
    const ampm = destHoursRounded >= 12 ? 'PM' : 'AM';
    const displayMins = destMins < 10 ? `0${destMins}` : destMins;

    setConvertedTime(`${displayHours}:${displayMins} ${ampm}`);
  }, [timeInput, fromTz, toTz]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Time Conversion details</h2>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Input Time</label>
            <input
              type="time"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-800 bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">From Timezone</label>
            <select
              value={fromTz}
              onChange={(e) => setFromTz(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-800 bg-white"
            >
              {timezones.map((tz) => (
                <option key={tz.name} value={tz.offset}>{tz.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">To Timezone</label>
            <select
              value={toTz}
              onChange={(e) => setToTz(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-800 bg-white"
            >
              {timezones.map((tz) => (
                <option key={tz.name} value={tz.offset}>{tz.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Conversion Output</h2>

            <div className="bg-amber-500 text-white rounded-xl p-6 text-center shadow-md shadow-amber-500/10">
              <span className="text-xs font-bold uppercase tracking-wider opacity-85 block mb-1">
                Converted Target Time
              </span>
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {convertedTime}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
