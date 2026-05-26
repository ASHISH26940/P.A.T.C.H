"use client";
import React from "react";
import clsx from "clsx";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "aside" | "button";
  border?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children, className, as: Tag = "div", border = true, hover = false, onClick,
}) => (
  <Tag
    onClick={onClick}
    className={clsx(
      "bg-glass-fill backdrop-blur-glass",
      border && "border border-glass-border",
      hover && "hover:border-primary-container/40 transition-colors",
      className
    )}
  >
    {children}
  </Tag>
);
