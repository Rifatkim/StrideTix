import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Standard Wide Container for StrideTix
 * - Max-width: 1680px for wide desktop monitors
 * - Horizontal safe padding: 48px on XL, 32px on LG, 24px on SM, 16px on mobile
 * - Follows Loket.com-inspired wide layout principles
 */
export function Container({
  children,
  className,
  as: Component = "div",
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
