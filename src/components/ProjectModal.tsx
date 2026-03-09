import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, CheckCircle2 } from "lucide-react";
import type { Project } from "@/data/projects";

interface Props {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: Props) => {
  if (!project) return null;

  return (
    <Dialog open={!!project} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto glass">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.title}</DialogTitle>
          <DialogDescription className="font-mono text-xs text-primary">
            {project.subtitle} · {project.role} · {project.timeline}
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {project.longDescription}
        </p>

        <div>
          <h4 className="text-sm font-semibold mb-2 text-foreground">Key Features</h4>
          <ul className="space-y-1.5">
            {project.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2 text-foreground">Tech Stack</h4>
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">
                {t}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          {project.github && (
            <Button variant="outline" asChild>
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                View Code
              </a>
            </Button>
          )}
          {project.live && (
            <Button asChild>
              <a href={project.live} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Live Demo
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
