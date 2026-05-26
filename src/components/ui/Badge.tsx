"use client";
import React from "react";
import clsx from "clsx";

type BadgeVariant = "primary" | "secondary" | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  uppercase?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children, variant = "outline", className, uppercase = true,
}) => (
  <span
    className={clsx(
      "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider",
      uppercase && "uppercase",
      variant === "primary" && "bg-primary-container/20 text-primary border border-primary/20",
      variant === "secondary" && "bg-secondary-container/20 text-secondary border border-secondary/20",
      variant === "outline" && "bg-surface-high/50 border border-glass-border text-on-surface-variant",
      className
    )}
  >
    {children}
  </span>
);
