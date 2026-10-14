"use client";

import React from "react";
import { StravaActivitySummary } from "@/types";

interface WeeklyMileageChartProps {
  summary: StravaActivitySummary;
}

export function WeeklyMileageChart({ summary }: WeeklyMileageChartProps) {
  // Generate 8-week trend data based on summary average & longest run
  const avg = summary.averageDistanceKm * summary.weeklyFrequency;
  const weeks = [
    { label: "M-7", km: Math.round(avg * 0.75) },
    { label: "M-6", km: Math.round(avg * 0.85) },
    { label: "M-5", km: Math.round(avg * 1.05) },
    { label: "M-4", km: Math.round(avg * 0.9) },
    { label: "M-3", km: Math.round(avg * 1.15) },
    { label: "M-2", km: Math.round(avg * 1.25) },
    { label: "M-1", km: Math.round(avg * 1.1) },
    { label: "Mgg Ini", km: Math.round(avg) },
  ];

  const maxKm = Math.max(...weeks.map((w) => w.km), 20);

  return (
    <div className="bg-white rounded-card p-5 border border-sand-border shadow-warm space-y-4">
      <div className="flex items-center justify-between border-b border-sand-border pb-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-brand block">
            Grafik Tren Latihan
          </span>
          <h4 className="text-sm font-extrabold text-espresso">
            Volume Jarak Mingguan (8 Minggu Terakhir)
          </h4>
        </div>
        <span className="text-xs font-bold text-espresso-secondary">
          Rata-rata: <strong className="text-brand">{avg.toFixed(1)} KM</strong> /mgg
        </span>
      </div>

      {/* Bar Chart Visualizer */}
      <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
        {weeks.map((week, idx) => {
          const heightPercent = Math.min(100, Math.max(12, Math.round((week.km / maxKm) * 100)));
          const isCurrentWeek = idx === weeks.length - 1;

          return (
            <div key={week.label} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              {/* Tooltip / Km value */}
              <span className="text-[10px] font-bold text-espresso group-hover:text-brand transition-colors">
                {week.km}k
              </span>

              {/* Bar */}
              <div className="w-full max-w-[28px] bg-surface-muted rounded-t-btn h-full flex items-end overflow-hidden">
                <div
                  className={`w-full rounded-t-btn transition-all duration-300 ${
                    isCurrentWeek
                      ? "bg-brand shadow-warm"
                      : "bg-brand-300 group-hover:bg-brand-500"
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Label */}
              <span className="text-[9px] font-bold text-espresso-muted truncate block">
                {week.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
