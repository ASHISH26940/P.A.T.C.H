import React from "react";

export const PersonaSkeleton: React.FC = () => (
  <div className="bg-surface border border-glass-border rounded-xl p-6 animate-pulse">
    <div className="h-5 w-32 bg-surface-high rounded mb-3" />
    <div className="h-3 w-48 bg-surface-high rounded mb-4" />
    <div className="flex gap-2 mb-3">
      <div className="h-5 w-16 bg-surface-high rounded-full" />
      <div className="h-5 w-20 bg-surface-high rounded-full" />
    </div>
    <div className="flex gap-2">
      <div className="h-5 w-24 bg-surface-high rounded-full" />
    </div>
  </div>
);
