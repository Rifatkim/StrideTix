"use client";

import React, { useState, useEffect, useRef } from "react";

export interface TimePickerInputProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Parses a time string into 12-hour components (hour: 01-12, minute: 00-59, period: AM/PM)
 */
function parseTimeString(val?: string): { hour: string; minute: string; period: "AM" | "PM" } {
  if (!val || !val.trim()) {
    return { hour: "", minute: "", period: "AM" };
  }

  const clean = val.trim();
  // Support "12:30 PM", "05:30 AM", "15:45 WIB", "05:00", etc.
  const match = clean.match(/^(\d{1,2})[:.](\d{2})(?:\s*(AM|PM))?/i);
  if (!match) {
    return { hour: "", minute: "", period: "AM" };
  }

  let rawHour = parseInt(match[1], 10);
  const minute = match[2];
  let period: "AM" | "PM" = (match[3]?.toUpperCase() as "AM" | "PM") || "AM";

  // If 24-hour time without AM/PM
  if (!match[3]) {
    if (rawHour >= 12) {
      period = "PM";
      if (rawHour > 12) rawHour -= 12;
    } else if (rawHour === 0) {
      rawHour = 12;
      period = "AM";
    }
  } else if (rawHour === 0) {
    rawHour = 12;
  }

  return {
    hour: isNaN(rawHour) ? "" : String(rawHour).padStart(2, "0"),
    minute: minute || "",
    period,
  };
}

export function TimePickerInput({
  value = "",
  onChange,
  disabled = false,
  className = "",
}: TimePickerInputProps) {
  const initial = parseTimeString(value);
  const [hour, setHour] = useState<string>(initial.hour);
  const [minute, setMinute] = useState<string>(initial.minute);
  const [period, setPeriod] = useState<"AM" | "PM">(initial.period);

  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  // Track values emitted by this component to prevent controlled re-entrancy feedback
  const lastEmittedValueRef = useRef<string>(value);

  // Sync external value changes ONLY if they originate outside this component (e.g. form reset)
  useEffect(() => {
    if (value === lastEmittedValueRef.current) {
      return;
    }
    lastEmittedValueRef.current = value;
    const parsed = parseTimeString(value);
    setHour(parsed.hour);
    setMinute(parsed.minute);
    setPeriod(parsed.period);
  }, [value]);

  const triggerChange = (nextHour: string, nextMinute: string, nextPeriod: "AM" | "PM") => {
    if (!nextHour.trim() && !nextMinute.trim()) {
      lastEmittedValueRef.current = "";
      onChange("");
      return;
    }
    const h = nextHour ? nextHour.padStart(2, "0") : "12";
    const m = nextMinute ? nextMinute.padStart(2, "0") : "00";
    const formatted = `${h}:${m} ${nextPeriod}`;
    lastEmittedValueRef.current = formatted;
    onChange(formatted);
  };

  // Hour KeyDown: deterministic keystroke sequencing
  const handleHourKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      const digit = e.key;
      const num = parseInt(digit, 10);

      // If empty or already has 2 digits, treat this as the first digit
      if (!hour || hour.length === 0 || hour.length >= 2) {
        if (num > 1) {
          // In 12-hour clock, digits 2-9 cannot have a second digit (max is 12)
          // Format as "0X" and auto-advance to minute
          const formatted = `0${digit}`;
          setHour(formatted);
          triggerChange(formatted, minute, period);
          minuteRef.current?.focus();
          minuteRef.current?.select();
        } else {
          // Digit is 0 or 1, wait for possible second digit (10, 11, 12, 01-09)
          setHour(digit);
          triggerChange(digit, minute, period);
        }
      } else {
        // Second digit typed
        let combined = hour + digit;
        let combinedNum = parseInt(combined, 10);
        if (combinedNum > 12) {
          combined = "12";
        } else if (combinedNum === 0) {
          combined = "12";
        }
        setHour(combined);
        triggerChange(combined, minute, period);
        minuteRef.current?.focus();
        minuteRef.current?.select();
      }
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      if (hour.length > 0) {
        const next = hour.slice(0, -1);
        setHour(next);
        triggerChange(next, minute, period);
      }
      return;
    }

    if (e.key === ":" || e.key === "Enter" || e.key === "ArrowRight") {
      e.preventDefault();
      minuteRef.current?.focus();
      minuteRef.current?.select();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const current = parseInt(hour, 10) || 12;
      const next = current >= 12 ? 1 : current + 1;
      const formatted = String(next).padStart(2, "0");
      setHour(formatted);
      triggerChange(formatted, minute, period);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const current = parseInt(hour, 10) || 1;
      const next = current <= 1 ? 12 : current - 1;
      const formatted = String(next).padStart(2, "0");
      setHour(formatted);
      triggerChange(formatted, minute, period);
      return;
    }
  };

  const handleHourBlur = () => {
    if (hour) {
      const padded = hour.padStart(2, "0");
      setHour(padded);
      triggerChange(padded, minute, period);
    }
  };

  // Minute KeyDown: deterministic keystroke sequencing (e.g. typing 3 then 0 ALWAYS makes 30!)
  const handleMinuteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      const digit = e.key;

      // If empty or already has 2 digits, this is the first digit
      if (!minute || minute.length === 0 || minute.length >= 2) {
        setMinute(digit);
        triggerChange(hour, digit, period);
      } else {
        // Second digit: previous digit was tens, this is units digit! E.g. "3" + "0" = "30"
        let combined = minute + digit;
        let combinedNum = parseInt(combined, 10);
        if (combinedNum > 59) {
          combined = "59";
        }
        setMinute(combined);
        triggerChange(hour, combined, period);
        selectRef.current?.focus();
      }
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      if (minute.length > 0) {
        const next = minute.slice(0, -1);
        setMinute(next);
        triggerChange(hour, next, period);
      } else {
        // Empty minute, backspace navigates back to hour
        hourRef.current?.focus();
        hourRef.current?.select();
      }
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      hourRef.current?.focus();
      hourRef.current?.select();
      return;
    }

    if (e.key === "ArrowRight" || e.key === "Enter") {
      e.preventDefault();
      selectRef.current?.focus();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const current = parseInt(minute, 10) || 0;
      const next = (current + 5) % 60;
      const formatted = String(next).padStart(2, "0");
      setMinute(formatted);
      triggerChange(hour, formatted, period);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const current = parseInt(minute, 10) || 0;
      const next = current - 5 < 0 ? 55 : current - 5;
      const formatted = String(next).padStart(2, "0");
      setMinute(formatted);
      triggerChange(hour, formatted, period);
      return;
    }
  };

  const handleMinuteBlur = () => {
    if (minute) {
      const padded = minute.padStart(2, "0");
      setMinute(padded);
      triggerChange(hour, padded, period);
    }
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as "AM" | "PM";
    setPeriod(next);
    triggerChange(hour, minute, next);
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {/* Kotak 1: Jam (HH) */}
      <div className="relative">
        <input
          ref={hourRef}
          type="text"
          inputMode="numeric"
          maxLength={2}
          disabled={disabled}
          placeholder="12"
          value={hour}
          onChange={() => {}} // Controlled via onKeyDown for 100% deterministic typing
          onFocus={(e) => e.target.select()}
          onBlur={handleHourBlur}
          onKeyDown={handleHourKeyDown}
          title="Jam flag-off (1 - 12)"
          aria-label="Jam flag-off"
          className="w-11 sm:w-12 h-10 text-center font-mono font-bold text-xs text-espresso placeholder:text-espresso-muted/40 bg-sand-warm border border-sand-border rounded-btn focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all disabled:opacity-50"
        />
      </div>

      {/* Separator Titik Dua */}
      <span className="font-black text-espresso-secondary text-sm select-none px-0.5">
        :
      </span>

      {/* Kotak 2: Menit (MM) */}
      <div className="relative">
        <input
          ref={minuteRef}
          type="text"
          inputMode="numeric"
          maxLength={2}
          disabled={disabled}
          placeholder="30"
          value={minute}
          onChange={() => {}} // Controlled via onKeyDown for 100% deterministic typing
          onFocus={(e) => e.target.select()}
          onBlur={handleMinuteBlur}
          onKeyDown={handleMinuteKeyDown}
          title="Menit flag-off (00 - 59)"
          aria-label="Menit flag-off"
          className="w-11 sm:w-12 h-10 text-center font-mono font-bold text-xs text-espresso placeholder:text-espresso-muted/40 bg-sand-warm border border-sand-border rounded-btn focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all disabled:opacity-50"
        />
      </div>

      {/* Dropdown AM / PM */}
      <div className="relative">
        <select
          ref={selectRef}
          disabled={disabled}
          value={period}
          onChange={handlePeriodChange}
          title="Format waktu AM / PM"
          aria-label="Format waktu AM atau PM"
          className="h-10 px-2.5 text-center font-black text-xs text-espresso bg-sand-warm border border-sand-border rounded-btn focus:ring-2 focus:ring-brand focus:border-brand outline-none cursor-pointer transition-all uppercase disabled:opacity-50"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}
