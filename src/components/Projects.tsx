import { useCallback, useRef, useState } from "react";
import ProjectModal from "@/components/ProjectModal";
import { ProjectPlate } from "@/components/ProjectPlate";
import { SectionHeading } from "@/components/SectionHeading";
import { githubSync } from "@/data/githubSyncData";
import { projects as projectCopy } from "@/data/projects";
import { resolveProjects, type ResolvedProject } from "@/lib/githubSync";

const projects = resolveProjects(projectCopy, githubSync);

/** A comic page: one splash plate across the top, then a pair, then rows of three. */
function span(index: number): string {
  if (index === 0) return "md:col-span-2 lg:col-span-12";
  if (index < 3) return "lg:col-span-6";
  return "lg:col-span-4";
}

const Projects = () => {
  const [selected, setSelected] = useState<ResolvedProject | null>(null);
  // The Details button of the open plate: focus goes back there when the dialog closes.
  const opener = useRef<HTMLElement | null>(null);
  const open = useCallback((project: ResolvedProject, from: HTMLElement | null) => {
    opener.current = from;
    setSelected(project);
  }, []);

  return (
    <section id="projects" aria-labelledby="projects-title" className="py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          id="projects"
          title="Projects"
          say="Strongest backend work first. Open a card for the details, limits included."
        />

        <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-12">
          {projects.map((project, i) => (
            <ProjectPlate
              key={project.id}
              project={project}
              index={i}
              lead={i === 0}
              onOpen={open}
              className={span(i)}
              delay={i === 0 ? 0 : i < 3 ? (i - 1) * 110 : (i % 3) * 90}
            />
          ))}
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} returnFocus={opener} />
    </section>
  );
};

export default Projects;
