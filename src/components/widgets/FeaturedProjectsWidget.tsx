import { ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn, sanitizeUrl } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

import { PROJECTS_DATA } from '@/data/projects';

export function FeaturedProjectsWidget() {
  return (
    <section className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">
          Proyectos Destacados
        </h2>
        <Link
          to="/proyectos"
          className="text-sm font-medium flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
        >
          Ver todos
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Horizontal Scroll Container */}
      <div 
        className="flex overflow-x-auto snap-x snap-mandatory pb-4 -mx-1 px-1 gap-4 lg:gap-6 scrollbar-hide"
      >
        {PROJECTS_DATA.map((project) => (
          <article
            key={project.id}
            className={cn(
              'shrink-0 snap-start w-[calc(100vw-4rem)] sm:w-[70vw] md:w-[45%] lg:w-[32%]',
              'flex flex-col bg-surface border border-border-subtle rounded-xl overflow-hidden',
              'transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-card-hover) hover:border-border group'
            )}
          >
            {/* Content Area */}
            <div className="flex flex-col flex-1 p-5 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-text-primary">
                  {project.title}
                </h3>
                <p className="text-sm text-text-secondary mt-0.5">
                  {project.role}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-auto">
                {project.techStack.slice(0, 3).map((tech) => (
                  <Badge key={tech} size="sm" variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>

              {/* Action Button */}
              <a
                href={sanitizeUrl(project.liveUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-text-primary bg-surface-hover border border-border-subtle hover:bg-surface-active hover:text-accent rounded-lg transition-colors focus:ring-2 focus:ring-accent/50 focus:outline-none"
              >
                Visitar Web
                <ExternalLink size={16} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
