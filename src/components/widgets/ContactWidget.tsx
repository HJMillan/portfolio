import { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { GitHubIcon, LinkedInIcon } from '@/components/ui/BrandIcons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SOCIAL_LINKS, FULL_NAME } from '@/data/personal';
import { sanitizeUrl } from '@/lib/utils';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error' | 'cooldown';

// ✅ H-7: FormSubmit email/hash via variable de entorno — permite rotación sin re-deploy
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${import.meta.env.VITE_FORMSUBMIT_TO}`;

// ✅ H-4: Límites de longitud del formulario
const MAX_NAME = 100;
const MIN_NAME = 2;
const MAX_EMAIL = 254;  // RFC 5321
const MAX_MESSAGE = 2000;
const MIN_MESSAGE = 10;
const PHONE_LENGTH = 10;
// Solo letras (incluyendo acentos/ñ) y espacios
const NAME_REGEX = /^[a-zA-ZÀ-ɏ\s]+$/;
// Exactamente 10 dígitos
const PHONE_REGEX = /^\d{10}$/;

// ✅ H-5: Rate limiting persistente — sobrevive recargas, tabs y navegación SPA
const RL_STORAGE_KEY = 'contact_rl';
const BASE_COOLDOWN_MS = 30_000;    // 30s base
const MAX_COOLDOWN_MS = 120_000;    // 2min máximo

// ✅ H-6: Validación de email más estricta que type="email" del navegador
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/** Lee timestamp + contador de envíos de localStorage */
function getRateLimitState(): { lastSubmit: number; attempts: number } {
  try {
    const raw = localStorage.getItem(RL_STORAGE_KEY);
    if (!raw) return { lastSubmit: 0, attempts: 0 };
    const parsed = JSON.parse(raw) as { lastSubmit?: number; attempts?: number };
    return {
      lastSubmit: typeof parsed.lastSubmit === 'number' ? parsed.lastSubmit : 0,
      attempts: typeof parsed.attempts === 'number' ? parsed.attempts : 0,
    };
  } catch {
    return { lastSubmit: 0, attempts: 0 };
  }
}

function setRateLimitState(lastSubmit: number, attempts: number): void {
  try {
    localStorage.setItem(RL_STORAGE_KEY, JSON.stringify({ lastSubmit, attempts }));
  } catch { /* quota exceeded — silently fail */ }
}

export function ContactWidget() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setValidationError(null);

    // Bot trap
    if (honeypot) { setStatus('success'); return; }

    // ✅ H-4: Trim + validación de longitud mínima
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < MIN_NAME) {
      setValidationError(`El nombre debe tener al menos ${MIN_NAME} caracteres.`);
      return;
    }
    if (!NAME_REGEX.test(trimmedName)) {
      setValidationError('El nombre solo puede contener letras y espacios.');
      return;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setValidationError('Ingresá un email válido.');
      return;
    }
    if (trimmedMessage.length < MIN_MESSAGE) {
      setValidationError(`El mensaje debe tener al menos ${MIN_MESSAGE} caracteres.`);
      return;
    }
    const trimmedPhone = phone.trim();
    if (!PHONE_REGEX.test(trimmedPhone)) {
      setValidationError(`El teléfono debe tener exactamente ${PHONE_LENGTH} dígitos numéricos.`);
      return;
    }

    // ✅ H-5: Rate limiting persistente con cooldown progresivo
    const rl = getRateLimitState();
    const now = Date.now();
    const cooldown = Math.min(BASE_COOLDOWN_MS * Math.pow(2, rl.attempts), MAX_COOLDOWN_MS);
    if (now - rl.lastSubmit < cooldown) {
      setStatus('cooldown');
      return;
    }

    setStatus('submitting');

    try {
      const res = await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          message: trimmedMessage,
          _subject: `Portfolio — Mensaje de ${trimmedName}`,
          _template: 'table',
          _captcha: 'false',
          _honey: honeypot,
        }),
      });

      // Registrar envío (exitoso o no) para rate limiting
      setRateLimitState(now, rl.attempts + 1);

      if (res.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setRateLimitState(now, rl.attempts + 1);
      setStatus('error');
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Social links */}
      <Card variant="glass" padding="lg">
        <h3 className="text-sm font-semibold text-text-primary mb-4">
          Conecta conmigo
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href={sanitizeUrl(SOCIAL_LINKS.github)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-md bg-surface-hover border border-border-subtle hover:border-accent/30 hover:bg-accent/5 transition-all duration-200 group"
          >
            <GitHubIcon size={20} className="text-text-muted group-hover:text-text-primary transition-colors" />
            <div>
              <p className="text-sm font-medium text-text-primary">GitHub</p>
              <p className="text-xs text-text-muted">@HJMillan</p>
            </div>
          </a>

          <a
            href={sanitizeUrl(SOCIAL_LINKS.linkedin)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-md bg-surface-hover border border-border-subtle hover:border-[#0A66C2]/30 hover:bg-[#0A66C2]/5 transition-all duration-200 group"
          >
            <LinkedInIcon size={20} className="text-text-muted group-hover:text-[#0A66C2] transition-colors" />
            <div>
              <p className="text-sm font-medium text-text-primary">LinkedIn</p>
              <p className="text-xs text-text-muted">hjesusmillan</p>
            </div>
          </a>

          <a
            href={sanitizeUrl(SOCIAL_LINKS.email)}
            className="flex items-center gap-3 p-4 rounded-md bg-surface-hover border border-border-subtle hover:border-accent-alt/30 hover:bg-accent-alt/5 transition-all duration-200 group"
          >
            <Mail size={20} className="text-text-muted group-hover:text-accent-alt transition-colors" />
            <div>
              <p className="text-sm font-medium text-text-primary">Email</p>
              <p className="text-xs text-text-muted">Contacto directo</p>
            </div>
          </a>
        </div>
      </Card>

      {/* Contact form */}
      <Card padding="lg">
        <h3 className="text-sm font-semibold text-text-primary mb-4">
          Enviar un mensaje
        </h3>

        {status === 'success' ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle size={40} className="text-success" />
            <p className="text-sm font-medium text-text-primary">
              ¡Mensaje enviado correctamente!
            </p>
            <p className="text-xs text-text-muted">
              Te responderé lo antes posible.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="text-xs text-accent hover:underline cursor-pointer mt-2"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ✅ H-3: Honeypot — FormSubmit usa _honey como campo trampa */}
            <input
              type="text"
              name="_honey"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="ohnohoney"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ✅ H-4: Solo letras y espacios en nombre */}
              <Input
                id="contact-name"
                label="Nombre"
                type="text"
                required
                maxLength={MAX_NAME}
                placeholder={`Ej: ${FULL_NAME}`}
                value={name}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === '' || /^[a-zA-ZÀ-ɏ\s]*$/.test(v)) setName(v.slice(0, MAX_NAME));
                }}
                disabled={status === 'submitting'}
              />
              {/* ✅ H-4: maxLength en email (RFC 5321) */}
              <Input
                id="contact-email"
                label="Email"
                type="email"
                required
                maxLength={MAX_EMAIL}
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.slice(0, MAX_EMAIL))}
                disabled={status === 'submitting'}
              />
            </div>
            {/* Teléfono — solo dígitos, exactamente 10 */}
            <Input
              id="contact-phone"
              label="Teléfono"
              type="tel"
              required
              maxLength={PHONE_LENGTH}
              placeholder="1122334455"
              value={phone}
              onChange={(e) => {
                const v = e.target.value.replaceAll(/\D/g, '');
                setPhone(v.slice(0, PHONE_LENGTH));
              }}
              disabled={status === 'submitting'}
            />
            <div>
              <label htmlFor="contact-message" className="block text-xs text-text-muted mb-1.5">
                Mensaje
              </label>
              {/* ✅ H-4: maxLength en textarea */}
              <textarea
                id="contact-message"
                rows={4}
                required
                maxLength={MAX_MESSAGE}
                placeholder="¿En qué puedo ayudarte?"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
                disabled={status === 'submitting'}
                className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all duration-200 resize-none disabled:opacity-50"
              />
              {/* ✅ H-4: Contador de caracteres */}
              <p className="text-xs text-text-muted text-right mt-1">
                {message.length}/{MAX_MESSAGE}
              </p>
            </div>

            {/* ✅ H-4: Error de validación client-side */}
            {validationError && (
              <div className="flex items-center gap-2 text-warning text-xs">
                <AlertCircle size={14} />
                <span>{validationError}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 text-error text-xs">
                <AlertCircle size={14} />
                <span>Error al enviar. Intentá de nuevo o escribime directo por email.</span>
              </div>
            )}

            {/* ✅ H-5: Feedback visual del cooldown */}
            {status === 'cooldown' && (
              <div className="flex items-center gap-2 text-warning text-xs">
                <AlertCircle size={14} />
                <span>Esperá unos segundos antes de enviar otro mensaje.</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              icon={<Send size={14} />}
              loading={status === 'submitting'}
            >
              Enviar mensaje
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
