import { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { GitHubIcon, LinkedInIcon } from '@/components/ui/BrandIcons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SOCIAL_LINKS, FULL_NAME } from '@/data/personal';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error' | 'cooldown';

// ✅ H-7: Formspree ID via variable de entorno — permite rotación sin re-deploy
const FORMSPREE_URL = `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_ID}`;

// ✅ H-4: Límites de longitud del formulario (MAX_EMAIL según RFC 5321)
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 2000;
// ✅ H-5: Rate limiting — cooldown de 30s entre envíos (defensa contra spam de cuota Formspree)
const SUBMIT_COOLDOWN_MS = 30_000;

export function ContactWidget() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [honeypot, setHoneypot] = useState('');
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Bot trap: if honeypot is filled, fake success
    if (honeypot) { setStatus('success'); return; }

    // ✅ H-5: Rate limiting en cliente — 30s entre envíos
    const now = Date.now();
    if (now - lastSubmitTime < SUBMIT_COOLDOWN_MS) {
      setStatus('cooldown');
      return;
    }

    setLastSubmitTime(now);
    setStatus('submitting');

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
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
            href={SOCIAL_LINKS.github}
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
            href={SOCIAL_LINKS.linkedin}
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
            href={SOCIAL_LINKS.email}
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
            {/* ✅ H-3: Honeypot con clase CSS en lugar de display:none */}
            <input
              type="text"
              name="_gotcha"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="ohnohoney"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ✅ H-4: maxLength en nombre */}
              <Input
                id="contact-name"
                label="Nombre"
                type="text"
                required
                maxLength={MAX_NAME}
                placeholder={`Ej: ${FULL_NAME}`}
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, MAX_NAME))}
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
