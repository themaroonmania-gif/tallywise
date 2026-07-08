'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorShell, ShellSelect, ResultCard } from './CalculatorShell';

export function TimeZoneCalculator() {
  const [timeInput, setTimeInput] = useState<string>('12:00');
  const [fromTz, setFromTz] = useState<number>(-5); // EST = -5
  const [toTz, setToTz] = useState<number>(0); // UTC = 0

  const [convertedTime, setConvertedTime] = useState<string>('17:00');
  const [dayOffset, setDayOffset] = useState<number>(0);

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

    // Calculate base time in UTC hours (fromTz is the offset of the source zone from UTC)
    const utcMinutes = (hours * 60 + minutes) - fromTz * 60;

    // Convert UTC minutes to destination timezone minutes
    const destTotalMinutes = utcMinutes + toTz * 60;

    // Normalize to a 24-hour cycle, and track how many days we crossed
    const normalizedMinutes = ((destTotalMinutes % 1440) + 1440) % 1440;
    const offset = Math.floor(destTotalMinutes / 1440) - Math.floor(((hours * 60 + minutes)) / 1440);
    setDayOffset(offset);

    const destHours = Math.floor(normalizedMinutes / 60);
    const destMins = normalizedMinutes % 60;

    // Format to 12-hour AM/PM clock
    const displayHours = destHours % 12 === 0 ? 12 : destHours % 12;
    const ampm = destHours >= 12 ? 'PM' : 'AM';
    const displayMins = destMins < 10 ? `0${destMins}` : destMins;

    setConvertedTime(`${displayHours}:${displayMins} ${ampm}`);
  }, [timeInput, fromTz, toTz]);

  return (
    <CalculatorShell
      title="Time Conversion Details"
      inputs={
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Input Time</label>
            <input
              type="time"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-800 bg-white transition-all hover:border-slate-300"
            />
          </div>

          <ShellSelect label="From Timezone" value={fromTz} onChange={(e) => setFromTz(Number(e.target.value))}>
            {timezones.map((tz) => (
              <option key={tz.name} value={tz.offset}>{tz.name}</option>
            ))}
          </ShellSelect>

          <ShellSelect label="To Timezone" value={toTz} onChange={(e) => setToTz(Number(e.target.value))}>
            {timezones.map((tz) => (
              <option key={tz.name} value={tz.offset}>{tz.name}</option>
            ))}
          </ShellSelect>
        </div>
      }
      results={
        <div className="space-y-4">
          <ResultCard label="Converted Target Time" value={convertedTime} color="amber" />
          {dayOffset !== 0 && (
            <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-100 font-semibold text-center">
              {dayOffset > 0
                ? `This falls on the next day (+${dayOffset}) relative to the input date.`
                : `This falls on the previous day (${dayOffset}) relative to the input date.`}
            </div>
          )}
        </div>
      }
    />
  );
}
