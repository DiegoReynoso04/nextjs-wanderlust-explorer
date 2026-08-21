"use client";

import ExperienceCard from "@/components/ExperienceCard";
import type { Experience } from "@/types/experience";

interface ExperienceGridProps {
  experiences: Experience[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

/** 1 columna en móvil, 2 en tablet, 3–4 en escritorio (CONTEXT.md §4). */
export default function ExperienceGrid({
  experiences,
  favorites,
  onToggleFavorite,
}: ExperienceGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {experiences.map((experience) => (
        <li key={experience.id}>
          <ExperienceCard
            experience={experience}
            isFavorite={favorites.includes(experience.id)}
            onToggleFavorite={onToggleFavorite}
          />
        </li>
      ))}
    </ul>
  );
}
