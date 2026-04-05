import { Mail as MailIcon, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FULL_NAME, TITLE, SUBTITLE, BIO, SOCIAL_LINKS } from '@/data/personal';
import { GitHubIcon, LinkedInIcon } from '@/components/ui/BrandIcons';
import profileAvatar from '@/assets/profile-avatar.png';

export function ProfileWidget() {
  return (
    <Card variant="glass" padding="lg" className="relative overflow-hidden">
      {/* Gradient accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-accent via-accent-alt to-accent" />

      <div className="flex flex-col items-center text-center gap-4">
        {/* Avatar with animated gradient border */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full p-[2px] bg-linear-to-br from-accent to-accent-alt animate-pulse-glow">
            <img
              src={profileAvatar}
              alt={FULL_NAME}
              className="w-full h-full rounded-full object-cover bg-surface"
            />
          </div>
          {/* Online indicator */}
          <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-success border-2 border-surface" />
        </div>

        {/* Info */}
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-text-primary">{FULL_NAME}</h2>
          <p className="text-sm text-accent font-medium">{TITLE}</p>
          <p className="text-xs text-text-muted">{SUBTITLE}</p>
        </div>

        {/* Open to work badge */}
        <Badge color="#22C55E" size="md" variant="outline">
          <Sparkles size={12} className="mr-1" />
          Disponible para trabajar
        </Badge>

        {/* Bio */}
        <p className="text-xs text-text-secondary leading-relaxed max-w-sm">
          {BIO}
        </p>

        {/* Social links */}
        <div className="flex items-center gap-3 pt-2">
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md bg-surface-hover text-text-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200"
            aria-label="GitHub"
          >
            <GitHubIcon size={18} />
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md bg-surface-hover text-text-secondary hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 transition-all duration-200"
            aria-label="LinkedIn"
          >
            <LinkedInIcon size={18} />
          </a>
          <a
            href={SOCIAL_LINKS.email}
            className="p-2 rounded-md bg-surface-hover text-text-secondary hover:text-accent-alt hover:bg-accent-alt/10 transition-all duration-200"
            aria-label="Email"
          >
            <MailIcon size={18} />
          </a>
        </div>
      </div>
    </Card>
  );
}
