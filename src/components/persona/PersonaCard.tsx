import React from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import type { Persona } from "@/types/api";
import clsx from "clsx";

interface PersonaCardProps {
  persona: Persona;
  isActive: boolean;
  onSelect: (p: Persona) => void;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({
  persona,
  isActive,
  onSelect,
}) => (
  <GlassPanel
    className={clsx(
      "p-6 rounded-xl transition-all relative",
      isActive ? "border-2 border-primary-container bg-surface-high" : "",
    )}
  >
    <div className="mb-4">
      <h3 className="font-heading text-h3 text-on-surface mb-1 truncate">
        {persona.name}
      </h3>
      <p className="text-body-sm text-on-surface-variant line-clamp-2">
        {persona.description}
      </p>
    </div>
    <div className="flex flex-wrap gap-2 mb-3">
      {persona.traits.map((t) => (
        <Badge key={t} variant="secondary">
          {t}
        </Badge>
      ))}
    </div>
    <div className="flex flex-wrap gap-2 mb-4">
      {persona.goals.map((g) => (
        <Badge key={g} variant="outline">
          {g}
        </Badge>
      ))}
    </div>
    <button
      onClick={() => onSelect(persona)}
      className={clsx(
        "w-full py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
        isActive
          ? "bg-primary-container/20 text-primary-container border border-primary-container/40"
          : "bg-surface-low border border-glass-border text-on-surface-variant hover:border-primary-container/40 hover:text-primary-container",
      )}
    >
      {isActive ? (
        <>
          <span
            className="material-symbols-outlined text-[16px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          Active
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-[16px]">
            radio_button_unchecked
          </span>
          Select
        </>
      )}
    </button>
  </GlassPanel>
);
