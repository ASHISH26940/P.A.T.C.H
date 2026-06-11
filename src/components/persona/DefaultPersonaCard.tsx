import React from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import type { Persona } from "@/types/api";

interface DefaultPersonaCardProps {
  name: string;
  description: string;
  traits: string[];
  goals: string[];
  onSelect: () => void;
}

export const DefaultPersonaCard: React.FC<DefaultPersonaCardProps> = ({
  name,
  description,
  traits,
  goals,
  onSelect,
}) => (
  <GlassPanel className="p-6 rounded-xl transition-all border border-dashed border-glass-border">
    <div className="mb-4">
      <h3 className="font-heading text-h3 text-on-surface mb-1">{name}</h3>
      <p className="text-body-sm text-on-surface-variant">{description}</p>
    </div>
    <div className="flex flex-wrap gap-2 mb-3">
      {traits.map((t) => (
        <Badge key={t} variant="secondary">
          {t}
        </Badge>
      ))}
    </div>
    <div className="flex flex-wrap gap-2 mb-4">
      {goals.map((g) => (
        <Badge key={g} variant="outline">
          {g}
        </Badge>
      ))}
    </div>
    <button
      onClick={onSelect}
      className="w-full py-2 rounded-lg text-sm font-bold transition-all bg-primary-container text-surface-dim hover:brightness-110 flex items-center justify-center gap-2"
    >
      <span className="material-symbols-outlined text-[16px]">add</span>
      Add & Select
    </button>
  </GlassPanel>
);
