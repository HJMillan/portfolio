import type { Experience, Education, Certification } from '@/types';
import raw from './linkedin-data.json';

/** Typed LinkedIn/experience data. */
interface LinkedInData {
  experience: readonly Experience[];
  education: readonly Education[];
  certifications: readonly Certification[];
}

// ✅ H-10: Type guard — valida estructura mínima antes del cast (consistencia con github-data.ts)
function isValidLinkedInData(data: unknown): data is LinkedInData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    Array.isArray(d.experience) &&
    Array.isArray(d.education) &&
    Array.isArray(d.certifications)
  );
}

if (!isValidLinkedInData(raw)) {
  throw new Error(
    '[linkedin-data] Estructura de datos inválida. Verificar linkedin-data.json'
  );
}

const linkedinData: LinkedInData = raw;

export const { experience, education, certifications } = linkedinData;
export default linkedinData;
