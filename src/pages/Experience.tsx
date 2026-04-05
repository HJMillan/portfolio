import { Briefcase, GraduationCap, Award, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getLanguageColor, sanitizeUrl } from '@/lib/utils';
import linkedinData from '@/data/linkedin-data';

export default function Experience() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Work Experience */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Briefcase size={18} className="text-accent-alt" />
          <h2 className="text-lg font-semibold text-text-primary">
            Experiencia Laboral
          </h2>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-4 bottom-4 w-px bg-border-subtle" />

          <div className="space-y-4">
            {linkedinData.experience.map((exp, index) => (
              <div
                key={exp.id}
                className="relative pl-10 animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Dot */}
                <div className="absolute left-2.5 top-5 size-3 rounded-full bg-accent-alt border-2 border-surface z-10" />

                <Card padding="md" className="hover:border-accent-alt/40">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">
                        {exp.role}
                      </h3>
                      <p className="text-xs text-accent-alt font-medium">
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-xs text-text-muted font-mono whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed mb-3">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} size="sm" color={getLanguageColor(tech)}>
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap size={18} className="text-warning" />
          <h2 className="text-lg font-semibold text-text-primary">
            Educación
          </h2>
        </div>

        <div className="space-y-4">
          {linkedinData.education.map((edu, index) => (
            <div
              key={edu.id}
              className="animate-slide-up opacity-0"
              style={{ animationDelay: `${(index + 3) * 0.1}s` }}
            >
              <Card padding="md" className="hover:border-warning/40">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      {edu.degree}
                    </h3>
                    <p className="text-xs text-warning font-medium">
                      {edu.institution}
                    </p>
                  </div>
                  <span className="text-xs text-text-muted font-mono whitespace-nowrap">
                    {edu.period}
                  </span>
                </div>
                {edu.description && (
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Award size={18} className="text-success" />
          <h2 className="text-lg font-semibold text-text-primary">
            Certificaciones
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {linkedinData.certifications.map((cert, index) => (
            <div
              key={cert.id}
              className="animate-scale-in opacity-0"
              style={{ animationDelay: `${(index + 5) * 0.1}s` }}
            >
              <Card padding="md" className="hover:border-success/40">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      {cert.name}
                    </h3>
                    <p className="text-xs text-success font-medium">
                      {cert.issuer}
                    </p>
                    <p className="text-xs text-text-muted mt-1 font-mono">
                      {cert.date}
                    </p>
                  </div>
                  {cert.url && (
                    <a
                      href={sanitizeUrl(cert.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 -m-1 text-text-muted hover:text-success rounded-md hover:bg-success/5 transition-colors"
                      aria-label={`Ver certificado: ${cert.name}`}
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
