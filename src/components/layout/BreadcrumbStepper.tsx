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
  onStepClick?: (index: number) => void;
}

export const BreadcrumbStepper: React.FC<BreadcrumbStepperProps> = ({
  steps,
  className,
  leading,
  onStepClick,
}) => (
  <header
    className={clsx(
      "w-full h-[88px] bg-surface border-b border-glass-border flex items-stretch z-50",
      className,
    )}
  >
    {leading && (
      <div className="flex items-center justify-center w-[88px] border-r border-glass-border hover:bg-glass-fill transition-colors flex-shrink-0">
        {leading}
      </div>
    )}
    <div className="flex-1 flex overflow-hidden">
      {steps.map((step, i) => {
        const isCurrent = step.status === "current";
        return (
          <div
            key={i}
            onClick={() => {
              if (!isCurrent) onStepClick?.(i);
            }}
            className={clsx(
              "flex-1 min-w-0 flex justify-center flex-col px-8 gap-1 group transition-colors",
              onStepClick && !isCurrent ? "cursor-pointer" : "cursor-default",
              i < steps.length - 1 && "border-r border-glass-border",
              isCurrent &&
                "bg-surface-container-low border-b-2 border-b-primary-container",
              step.status === "pending" && "opacity-50",
              onStepClick && !isCurrent && "hover:bg-glass-fill",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={clsx(
                  "text-[10px] font-mono uppercase tracking-wider",
                  step.status === "current"
                    ? "text-primary-container"
                    : "text-on-surface-variant/50",
                )}
              >
                {step.status === "current"
                  ? "Current"
                  : step.status === "pending"
                    ? "Pending"
                    : ""}
              </span>
              {step.status === "current" && (
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary-container rounded-full" />
                  <div className="w-1.5 h-1.5 bg-primary-container/30 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-primary-container/30 rounded-full" />
                </div>
              )}
            </div>
            <h4
              className={clsx(
                "text-label-md truncate font-bold mt-1",
                step.status === "current"
                  ? "text-primary-container"
                  : "text-on-surface",
              )}
            >
              {step.label}
            </h4>
            {step.description && (
              <p className="text-[12px] text-on-surface-variant truncate">
                {step.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  </header>
);
