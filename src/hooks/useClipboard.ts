import { useState, useCallback } from 'react';

/**
 * Reusable hook for clipboard copy with visual feedback.
 * Returns { copied, copy } — `copied` resets after `timeout` ms.
 */
export function useClipboard(text: string, timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    });
  }, [text, timeout]);

  return { copied, copy } as const;
}
