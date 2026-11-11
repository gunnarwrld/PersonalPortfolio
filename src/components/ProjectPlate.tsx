import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { LanguageBar } from "@/components/LanguageBar";
import { Reveal } from "@/components/Reveal";
import { Stamp } from "@/components/Stamp";
import { StarGlyph } from "@/components/StarGlyph";
import type { ResolvedProject } from "@/lib/githubSync";
import { cn } from "@/lib/utils";

interface ProjectPlateProps {
  project: ResolvedProject;
  /** Position in the list, from 0. The order is deliberate, so the number is shown. */
  index: number;
  /** The first plate runs the full width and lists its highlights. */
  lead?: boolean;
  /** Opens the details. `opener` is this plate's Details button, where focus returns on close. */
  onOpen: (project: ResolvedProject, opener: HTMLElement | null) => void;
  className?: string;
  delay?: number;
}

/**
 * One project, printed on a paper plate. Clicking anywhere on the plate opens
 * the details; the Details button is the same action for keyboards and screen
 * readers, and the Code and Live links stay separate links.
 */
export function ProjectPlate({ project, index, lead = false, onOpen, className, delay }: ProjectPlateProps) {
  const titleId = `project-${project.id}-title`;
  const detailsButton = useRef<HTMLButtonElement>(null);

  const stackLimit = lead ? 11 : 5;

  const facts = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="typed font-bold">No. {index + 1}</span>
        <span className="flex flex-col items-end gap-2">
          <Stamp tone={project.status === "Live" ? "solid" : "line"}>{project.status}</Stamp>
          {project.archived && <Stamp>Archived</Stamp>}
        </span>
      </div>

      <h3 id={titleId} className="plate-title mt-4">
        {project.title}
      </h3>
      <p className="typed mt-2 text-mahogany">{project.subtitle}</p>

      <p className={cn("mt-4 leading-relaxed", lead ? "text-[1.0625rem]" : "line-clamp-4 text-[0.975rem]")}>
        {project.description}
      </p>

      <div className="mt-5">
        {project.languages.length > 0 ? (
          <LanguageBar languages={project.languages} />
        ) : (
          <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
            {project.tech.slice(0, stackLimit).map((tech) => (
              <li key={tech} className="chip">
                {tech}
              </li>
            ))}
            {project.tech.length > stackLimit && <li className="chip">+{project.tech.length - stackLimit}</li>}
          </ul>
        )}
      </div>

      <div className="mt-auto pt-6">
        <p className="typed text-mahogany" title={project.synced ? "Last push on GitHub" : undefined}>
          {project.lastUpdatedLabel ? `Last push ${project.lastUpdatedLabel}` : project.timeline}
        </p>
        <div className="mt-3 flex items-center justify-between gap-4">
          <button
            ref={detailsButton}
            type="button"
            className="btn btn-paper btn-sm"
            aria-label={`View details for ${project.title}`}
          >
            Details
          </button>
          <div className="flex gap-5">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="plate-link"
                aria-label={`View source code for ${project.title}`}
                onClick={(event) => event.stopPropagation()}
              >
                Code
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="plate-link"
                aria-label={`View live demo for ${project.title}`}
                onClick={(event) => event.stopPropagation()}
              >
                Live
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Reveal
      as="article"
      id={`project-${project.id}`}
      aria-labelledby={titleId}
      delay={delay}
      className={cn("paper plate p-6 sm:p-7", lead ? "md:grid md:grid-cols-[1.15fr_1fr] md:gap-10 lg:p-9" : "flex flex-col", className)}
      // The Details button has no handler of its own: its click bubbles up to here.
      onClick={() => onOpen(project, detailsButton.current)}
    >
      {lead ? (
        <>
          <div className="flex flex-col">{facts}</div>
          {/* The lead plate has room to say what was built. */}
          <div className="mt-8 border-t-[3px] border-double border-espresso pt-6 md:mt-0 md:border-l-[3px] md:border-t-0 md:pl-10 md:pt-0">
            <h4 className="font-display text-xl uppercase leading-none">Highlights</h4>
            <ul className="mt-4 space-y-3 text-[0.975rem] leading-snug">
              {project.features.map((feature) => (
                <li key={feature} className="flex gap-2.5">
                  <StarGlyph className="mt-[0.3em]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        facts
      )}
    </Reveal>
  );
}
