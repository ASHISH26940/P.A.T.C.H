"use client";
import React from "react";
import clsx from "clsx";

interface Step {
  label: string;
  description?: string;
  status: "complete" | "current" | "pending";
}

interface BreadcrumbStepperProps {
  steps: Step[];
  className?: string;
  leading?: React.ReactNode;
}

export const BreadcrumbStepper: React.FC<BreadcrumbStepperProps> = ({ steps, className, leading }) => (
  <header className={clsx("w-full h-[88px] bg-surface border-b border-glass-border flex items-stretch z-50", className)}>
    {leading && (
      <div className="flex items-center justify-center w-[88px] border-r border-glass-border hover:bg-glass-fill cursor-pointer transition-colors flex-shrink-0">
        {leading}
      </div>
    )}
    <div className="flex-1 flex overflow-hidden">
      {steps.map((step, i) => (
        <div
          key={i}
          className={clsx(
            "flex-1 min-w-0 flex justify-center flex-col px-8 gap-1 group cursor-pointer hover:bg-glass-fill transition-colors",
            i < steps.length - 1 && "border-r border-glass-border",
            step.status === "current" && "bg-surface-container-low border-b-2 border-b-primary-container",
            step.status === "pending" && "opacity-50",
          )}
        >
          <div className="flex items-center justify-between">
            <span className={clsx(
              "text-[10px] font-mono-code uppercase tracking-wider",
              step.status === "complete" && "text-on-surface-variant",
              step.status === "current" && "text-primary-container",
              step.status === "pending" && "text-on-surface-variant",
            )}>
              {step.status === "complete" ? "Complete" : step.status === "current" ? "Current" : "Pending"}
            </span>
            {step.status === "complete" && (
              <span className="material-symbols-outlined text-primary-container text-[18px]">check</span>
            )}
            {step.status === "current" && (
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary-container rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-primary-container/40 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-primary-container/40 rounded-full"></div>
              </div>
            )}
          </div>
          <h4 className={clsx(
            "text-label-md truncate font-bold mt-1",
            step.status === "current" ? "text-primary-container" : "text-on-surface",
          )}>
            {step.label}
          </h4>
          {step.description && (
            <p className="text-[12px] text-on-surface-variant truncate">{step.description}</p>
          )}
        </div>
      ))}
    </div>
  </header>
);
