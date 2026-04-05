import type { NavItem } from '@/types';

export const GITHUB_USERNAME = 'HJMillan';

export const FULL_NAME = 'Jesús Millán';

export const TITLE = 'Analista de Sistemas & Desarrollador Frontend';

export const SUBTITLE = 'Técnico en Administración';

export const BIO =
  'Profesional orientado al desarrollo de soluciones tecnológicas escalables con enfoque en arquitectura frontend moderna, diseño de interfaces de usuario y análisis de sistemas empresariales. Apasionado por transformar problemas complejos en experiencias digitales intuitivas y de alto rendimiento.';

// Obfuscation against automated bundle scrapers
const _emailParts = ['contacto', 'jesusmillan.dev'];

export const SOCIAL_LINKS = {
  github: `https://github.com/${GITHUB_USERNAME}`,
  linkedin: 'https://www.linkedin.com/in/hjesusmillan/',
  email: `mailto:${_emailParts[0]}@${_emailParts[1]}`,
} as const;

export const CV_URL = 'https://www.linkedin.com/in/hjesusmillan/';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Resumen', path: '/', icon: 'LayoutDashboard' },
  { label: 'Repositorios', path: '/repos', icon: 'FolderGit2' },
  { label: 'Experiencia', path: '/experience', icon: 'Briefcase' },
  { label: 'Contacto', path: '/contact', icon: 'Mail' },
];

/** Language colors matching GitHub's language colors */
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Python: '#3572A5',
  'C#': '#239120',
  Java: '#ED8B00',
  HTML: '#E34C26',
  CSS: '#563D7C',
  SCSS: '#CC6699',
  Shell: '#89E051',
  Dockerfile: '#384D54',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Ruby: '#CC342D',
  PHP: '#4F5D95',
  Vue: '#41B883',
  Svelte: '#FF3E00',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Dart: '#00B4AB',
  default: '#8B8B8B',
};
