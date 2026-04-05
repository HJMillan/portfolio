import { ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn, sanitizeUrl } from '@/lib/utils';

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
        className="flex overflow-x-auto snap-x snap-mandatory pb-4 -mx-1 px-1 gap-4 lg:gap-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {PROJECTS_DATA.map((project) => (
          <article
            key={project.id}
            className={cn(
              'shrink-0 snap-start w-[85vw] md:w-[45%] lg:w-[32%]',
              'flex flex-col bg-surface border border-border-subtle rounded-xl overflow-hidden',
              'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-border-muted group'
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

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-auto">
                {project.techStack.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-[11px] font-medium rounded-md bg-surface-hover text-text-secondary border border-border-subtle"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              <a
                href={sanitizeUrl(project.liveUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-text-primary bg-surface-hover border border-border-subtle hover:bg-neutral-800 dark:hover:bg-neutral-100 hover:text-white dark:hover:text-black rounded-lg transition-colors focus:ring-2 focus:ring-accent/50 focus:outline-none"
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
