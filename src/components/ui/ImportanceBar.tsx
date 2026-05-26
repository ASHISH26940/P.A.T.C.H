"use client";
import React from "react";
import clsx from "clsx";

interface ImportanceBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export const ImportanceBar: React.FC<ImportanceBarProps> = ({
  value, className, showLabel = true, label = "Significance",
}) => (
  <div className={clsx("pt-2", className)}>
    {showLabel && (
      <div className="flex justify-between text-[10px] font-mono-code text-on-surface-variant mb-1.5 uppercase tracking-wider">
        <span>{label}</span>
        <span className="text-primary">{value.toFixed(2)}</span>
      </div>
    )}
    <div className="h-1 w-full bg-surface-lowest rounded-full overflow-hidden">
      <div
        className="h-full bg-primary rounded-full"
        style={{ width: `${Math.min(value * 100, 100)}%` }}
      />
    </div>
  </div>
);
