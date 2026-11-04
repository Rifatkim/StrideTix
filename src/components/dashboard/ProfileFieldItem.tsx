"use client";

import React from "react";

interface ProfileFieldItemProps {
  label: string;
  icon?: React.ReactNode;
  displayValue: string;
  isEditing: boolean;
  colSpan?: string;
  onBoxClick?: () => void;
  renderInput?: () => React.ReactNode;
}

export function ProfileFieldItem({
  label,
  icon,
  displayValue,
  isEditing,
  colSpan = "col-span-1",
  onBoxClick,
  renderInput,
}: ProfileFieldItemProps) {
  const isMuted =
    !displayValue ||
    displayValue === "Belum diatur" ||
    displayValue === "Tidak ada catatan khusus";

  if (isEditing) {
    return (
      <div className={`${colSpan} space-y-1.5`}>
        {/* Label di luar form tapi di atas */}
        <div className="flex items-center gap-1.5 px-0.5">
          {icon && (
            <div className="text-brand w-3.5 h-3.5 flex items-center justify-center">
              {icon}
            </div>
          )}
          <label className="text-xs font-semibold text-stone-700 tracking-tight">
            {label}
          </label>
        </div>

        {/* Input Form Aktif */}
        <div>{renderInput && renderInput()}</div>
      </div>
    );
  }

  return (
    <div className={`${colSpan} space-y-1.5`}>
      {/* Label di luar form tapi di atas */}
      <div className="flex items-center gap-1.5 px-0.5">
        {icon && (
          <div className="text-stone-500 w-3.5 h-3.5 flex items-center justify-center">
            {icon}
          </div>
        )}
        <label className="text-xs font-semibold text-stone-700 tracking-tight">
          {label}
        </label>
      </div>

      {/* Form Box Sendiri Berisi Nilai Pengguna (Tanpa tanda '>') */}
      <div
        onClick={onBoxClick}
        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-stone-200/90 bg-white hover:border-stone-300 transition-colors flex items-center cursor-pointer"
      >
        <span
          className={`text-sm truncate ${
            isMuted
              ? "text-stone-400 italic font-normal"
              : "text-espresso font-semibold"
          }`}
        >
          {displayValue}
        </span>
      </div>
    </div>
  );
}
