import {
  ExternalLink,
  MonitorSmartphone,
  Code2,
  Database,
  Palette,
  Rocket
} from 'lucide-react';
import { PROJECTS_DATA } from '@/data/projects';
import { sanitizeUrl } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const ICONS = [
  MonitorSmartphone,
  Code2,
  Database,
  Palette,
  Rocket
];

export default function Projects() {
  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-text-primary">Proyectos y Colaboraciones</h2>
        <p className="text-text-secondary mt-1">
          Sistemas comerciales, plataformas en producción y proyectos en los
          que he colaborado (código cerrado).
        </p>
      </div>

      {/* Grid de proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {PROJECTS_DATA.map((project, index) => {
          const Icon = ICONS[index % ICONS.length];
          return (
            <Card
              key={project.id}
              padding="none"
              className="group flex flex-col hover:-translate-y-1 hover:shadow-(--shadow-glow-accent) hover:border-accent/40 transition-all duration-300"
            >
              {/* Header Visual Compacto */}
              <div className="h-28 bg-surface-hover/30 border-b border-border-subtle relative overflow-hidden">
                <div className="absolute -bottom-4 -right-4 text-border-subtle group-hover:text-accent/10 transition-colors duration-500">
                  <Icon size={120} strokeWidth={1.5} />
                </div>
                <div className="p-5 flex items-start justify-between relative z-10">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-accent/20 text-accent">
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-surface rounded-full text-text-muted border border-border-subtle uppercase tracking-wider">
                    Producción
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 p-5 space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-sm text-accent-muted mt-0.5">
                    {project.role}
                  </p>
                </div>

                <p className="text-sm text-text-muted leading-relaxed line-clamp-3 mb-2 grow">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} size="sm" variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Acción */}
              <div className="p-5 pt-0 mt-auto">
                <a
                  href={sanitizeUrl(project.liveUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full p-3 rounded-lg bg-surface border border-border-subtle text-sm font-medium text-text-primary hover:bg-surface-active hover:text-accent transition-colors focus:ring-2 focus:ring-accent/50 focus:outline-none"
                >
                  Visitar Web Oficial
                  <ExternalLink size={16} />
                </a>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
