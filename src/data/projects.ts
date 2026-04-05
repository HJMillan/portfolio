export interface Project {
  id: string;
  title: string;
  role: string;
  description: string;
  techStack: string[];
  liveUrl: string;
}

export const PROJECTS_DATA: Project[] = [
  {
    id: 'tren-patagonico',
    title: 'Tren Patagónico',
    role: 'Frontend Developer',
    description: 'Sistema completo web y portal principal para la empresa ferroviaria. Diseño responsivo de múltiples pasajes y gestión de backoffice operativo.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS'],
    liveUrl: 'https://trenpatagonicosa.com.ar/',
  },
  {
    id: 'autenticar-mdq',
    title: 'MDQ Digital',
    role: 'Full Stack Developer',
    description: 'Entorno de autenticación y validación de usuarios digitales para la Municipalidad del Partido de General Pueyrredon. Altamente seguro e integrado.',
    techStack: ['Next.js', 'Node.js', 'PostgreSQL'],
    liveUrl: 'https://autenticar.mardelplata.gob.ar/',
  },
  {
    id: 'encontrar',
    title: 'Encontrar',
    role: 'Frontend Architect',
    description: 'Plataforma arquitectónica Frontend construida con enfoque en altísimo rendimiento, escalabilidad y accesibilidad para todos los usuarios.',
    techStack: ['React', 'Vite', 'Tailwind CSS'],
    liveUrl: 'https://encontrar.com.ar/',
  },
];
