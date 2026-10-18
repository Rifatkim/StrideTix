"use client";

import React, { useMemo } from "react";
import { Clock } from "lucide-react";

export interface TimePickerInputProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

// Jam 00 s/d 23
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

// Menit 00 s/d 59 (custom bebas)
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

const TIMEZONES = ["WIB", "WITA", "WIT"] as const;
type Timezone = (typeof TIMEZONES)[number];

interface ParsedTime {
  hour: string;
  minute: string;
  tz: Timezone;
}

/**
 * Parses any incoming time string into hour (00-23), minute (00-59), and timezone.
 * Handles "05:30 WIB", "05:30 AM", "07:00 PM", "15:45", etc.
 */
function parseTime(val?: string): ParsedTime {
  if (!val || !val.trim()) {
    return { hour: "05", minute: "30", tz: "WIB" };
  }

  const clean = val.trim();

  // Extract timezone if exists (WIB / WITA / WIT)
  let tz: Timezone = "WIB";
  const tzMatch = clean.match(/(WIB|WITA|WIT)$/i);
  if (tzMatch) {
    tz = tzMatch[1].toUpperCase() as Timezone;
  }

  // Check for 12h AM/PM
  const ampmMatch = clean.match(/^(\d{1,2})[:.](\d{2})(?:\s*(AM|PM))?/i);
  if (ampmMatch) {
    let h = parseInt(ampmMatch[1], 10);
    const m = ampmMatch[2];
    const period = ampmMatch[3]?.toUpperCase();

    if (period === "PM" && h < 12) h += 12;
    if (period === "AM" && h === 12) h = 0;

    const hourStr = String(Math.min(Math.max(h, 0), 23)).padStart(2, "0");
    const minuteStr = String(Math.min(Math.max(parseInt(m, 10) || 0, 0), 59)).padStart(2, "0");

    return { hour: hourStr, minute: minuteStr, tz };
  }

  return { hour: "05", minute: "30", tz };
}

export function TimePickerInput({
  value = "05:30 WIB",
  onChange,
  disabled = false,
  className = "",
}: TimePickerInputProps) {
  const { hour, minute, tz } = useMemo(() => parseTime(value), [value]);

  const updateTime = (newHour: string, newMinute: string, newTz: Timezone) => {
    const formatted = `${newHour}:${newMinute} ${newTz}`;
    onChange(formatted);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTime(e.target.value, minute, tz);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTime(hour, e.target.value, tz);
  };

  const handleTzChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTime(hour, minute, e.target.value as Timezone);
  };

  return (
    <div
      className={`flex items-center h-10 px-2.5 rounded-btn bg-sand-warm border border-sand-border focus-within:ring-2 focus-within:ring-brand focus-within:border-brand transition-all ${
        disabled ? "opacity-50 pointer-events-none" : ""
      } ${className}`}
    >
      {/* Icon Jam */}
      <Clock className="w-3.5 h-3.5 text-espresso-muted mr-1.5 flex-shrink-0" />

      {/* Dropdown Jam (00 - 23) */}
      <div className="relative flex items-center">
        <select
          value={hour}
          onChange={handleHourChange}
          disabled={disabled}
          aria-label="Pilih Jam"
          title="Pilih Jam (00 - 23)"
          className="bg-transparent text-xs font-bold text-espresso outline-none cursor-pointer py-1 pr-1 text-center appearance-none"
        >
          {HOURS.map((h) => (
            <option key={h} value={h} className="bg-sand-warm text-espresso font-semibold">
              {h}
            </option>
          ))}
        </select>
      </div>

      {/* Separator Titik Dua */}
      <span className="font-bold text-espresso text-xs mx-0.5 select-none">:</span>

      {/* Dropdown Menit (00 - 59) */}
      <div className="relative flex items-center">
        <select
          value={minute}
          onChange={handleMinuteChange}
          disabled={disabled}
          aria-label="Pilih Menit"
          title="Pilih Menit (00 - 59)"
          className="bg-transparent text-xs font-bold text-espresso outline-none cursor-pointer py-1 pr-1 text-center appearance-none"
        >
          {MINUTES.map((m) => (
            <option key={m} value={m} className="bg-sand-warm text-espresso font-semibold">
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown Zona Waktu (WIB / WITA / WIT) */}
      <div className="ml-auto flex items-center border-l border-sand-border/80 pl-1.5">
        <select
          value={tz}
          onChange={handleTzChange}
          disabled={disabled}
          aria-label="Pilih Zona Waktu"
          title="Zona Waktu"
          className="bg-transparent text-[11px] font-black text-brand outline-none cursor-pointer py-1 uppercase appearance-none"
        >
          {TIMEZONES.map((zone) => (
            <option key={zone} value={zone} className="bg-sand-warm text-espresso font-semibold">
              {zone}
            </option>
          ))}
        </select>
        <span className="text-[10px] text-espresso-muted ml-0.5 pointer-events-none select-none">▾</span>
      </div>
    </div>
  );
}
