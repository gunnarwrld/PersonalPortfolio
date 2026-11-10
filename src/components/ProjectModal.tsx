import { useState, type RefObject } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Stamp } from "@/components/Stamp";
import { StarGlyph } from "@/components/StarGlyph";
import type { ResolvedProject } from "@/lib/githubSync";

interface Props {
  project: ResolvedProject | null;
  onClose: () => void;
  /** Where keyboard focus goes when the dialog closes: the card's Details button. */
  returnFocus?: RefObject<HTMLElement | null>;
}

const ProjectModal = ({ project: selected, onClose, returnFocus }: Props) => {
  // Keep showing the last project while the dialog closes. The dialog then stays
  // mounted through its exit, and focus goes back to the card that opened it.
  const [shown, setShown] = useState<ResolvedProject | null>(selected);
  if (selected && selected !== shown) setShown(selected);
  const project = selected ?? shown;
  if (!project) return null;

  return (
    <Dialog open={!!selected} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[88vh] max-w-2xl overflow-y-auto"
        // This dialog is opened from state, not from a Radix trigger, so it has to hand focus back itself.
        onCloseAutoFocus={(event) => {
          if (!returnFocus?.current) return;
          event.preventDefault();
          returnFocus.current.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription>
            {project.subtitle}. {project.role}, {project.timeline}.
          </DialogDescription>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
            <Stamp className="text-ivory">{project.status}</Stamp>
            {project.archived && <Stamp className="text-ivory">Archived</Stamp>}
            {project.lastUpdatedLabel && <p className="typed text-stone">Updated {project.lastUpdatedLabel}</p>}
          </div>
        </DialogHeader>

        <p className="leading-[1.7] text-parchment">{project.longDescription}</p>

        <div>
          <h3 className="mb-3 font-display text-lg uppercase leading-none">Key features</h3>
          <ul className="space-y-2 text-[0.975rem] leading-snug text-parchment">
            {project.features.map((feature) => (
              <li key={feature} className="flex gap-2.5">
                <StarGlyph className="mt-[0.3em] text-ivory" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {project.limits && (
          <div className="rounded-sm border-2 border-dashed border-stone p-4">
            <h3 className="mb-1.5 font-display text-lg uppercase leading-none">Limits</h3>
            <p className="text-[0.975rem] leading-snug text-parchment">{project.limits}</p>
          </div>
        )}

        {project.languages.length > 0 && (
          <div>
            <h3 className="mb-3 font-display text-lg uppercase leading-none">Languages</h3>
            <ul className="flex flex-wrap gap-2">
              {project.languages.map((language) => (
                <li key={language.name} className="chip typed">
                  {language.name} {language.percentage.toFixed(1)}%
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="mb-3 font-display text-lg uppercase leading-none">Tech stack</h3>
          <ul className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <li key={tech} className="chip">
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-5 pb-2 pt-1">
          {project.live && (
            <Button variant="cta" asChild>
              <a href={project.live} target="_blank" rel="noopener noreferrer">
                Live Demo
                <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
          )}
          {project.github && (
            <Button variant="ink" asChild>
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github aria-hidden="true" />
                View Code
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
