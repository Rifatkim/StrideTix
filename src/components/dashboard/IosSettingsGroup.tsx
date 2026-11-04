"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { IosToggle } from "@/components/ui/IosToggle";

interface IosSettingsGroupProps {
  header?: React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function IosSettingsGroup({
  header,
  headerAction,
  footer,
  children,
  className = "",
}: IosSettingsGroupProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {(header || headerAction) && (
        <div className="flex items-center justify-between px-4">
          {header && (
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-espresso-muted">
              {header}
            </h3>
          )}
          {headerAction}
        </div>
      )}
      <div className="bg-white rounded-2xl border border-stone-200/70 shadow-[0_1px_3px_rgba(43,30,22,0.04)] overflow-hidden divide-y divide-stone-100">
        {children}
      </div>
      {footer && (
        <p className="px-4 text-[11px] text-espresso-muted leading-relaxed">
          {footer}
        </p>
      )}
    </div>
  );
}

interface IosSettingsRowProps {
  icon?: React.ReactNode;
  iconBgColor?: string;
  title: string | React.ReactNode;
  subtitle?: string;
  value?: string | React.ReactNode;
  badge?: React.ReactNode;
  badgeVariant?: "brand" | "beta" | "muted";
  badgePosition?: "inline" | "trailing";
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
  toggle?: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    id?: string;
  };
}

export function IosSettingsRow({
  icon,
  iconBgColor = "bg-brand",
  title,
  subtitle,
  value,
  badge,
  badgeVariant = "brand",
  badgePosition = "trailing",
  disabled = false,
  href,
  onClick,
  toggle,
}: IosSettingsRowProps) {
  const badgeElement = badge ? (
    typeof badge === "string" ? (
      badgeVariant === "beta" || badge === "Beta" ? (
        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-300/80 shadow-2xs shrink-0">
          {badge}
        </span>
      ) : (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand border border-brand/20 shrink-0">
          {badge}
        </span>
      )
    ) : (
      badge
    )
  ) : null;

  const content = (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-3 min-h-[50px] transition-colors ${
        disabled
          ? "opacity-60 cursor-not-allowed select-none bg-stone-50/40"
          : "hover:bg-stone-50/60 active:bg-stone-100/50"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-[8px] ${
              disabled ? "bg-stone-300 text-stone-500" : `${iconBgColor} text-white`
            } flex items-center justify-center shrink-0 shadow-xs`}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`text-xs sm:text-sm font-semibold truncate ${
                disabled ? "text-stone-500" : "text-espresso"
              }`}
            >
              {title}
            </span>
            {badgePosition === "inline" && badgeElement}
          </div>
          {subtitle && (
            <span className="text-[11px] text-espresso-muted block truncate mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {badgePosition === "trailing" && badgeElement}
        {value && (
          typeof value === "string" ? (
            <span className="text-xs text-espresso-secondary font-medium truncate max-w-[150px] sm:max-w-xs">
              {value}
            </span>
          ) : (
            <div className="flex items-center gap-1.5 shrink-0">{value}</div>
          )
        )}
        {toggle ? (
          <IosToggle
            id={toggle.id}
            checked={toggle.checked}
            onChange={toggle.onChange}
            disabled={disabled || toggle.disabled}
            ariaLabel={typeof title === "string" ? title : undefined}
          />
        ) : href || onClick ? (
          <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
        ) : null}
      </div>
    </div>
  );

  if (disabled) {
    return <div>{content}</div>;
  }

  if (href) {
    return (
      <Link href={href} className="block group">
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full text-left block">
        {content}
      </button>
    );
  }

  return <div>{content}</div>;
}
