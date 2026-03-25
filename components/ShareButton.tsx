'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { getShareURL } from '@/lib/sync';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function ShareButton() {
  const tripCode = useAppStore((s) => s.tripCode);
  const [copied, setCopied] = useState(false);

  if (!isSupabaseConfigured() || !tripCode) return null;

  const shareUrl = getShareURL(tripCode);

  async function handleShare() {
    // Try native share first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Family Trip Manager — Orlando 2026',
          text: 'Acesse nossa viagem:',
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or not supported, fall through to copy
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <button
      onClick={handleShare}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        background: copied ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.08)',
        border: '1px solid ' + (copied ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255,255,255,0.12)'),
        borderRadius: '10px',
        color: copied ? '#4ade80' : 'rgba(255,255,255,0.8)',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
        fontFamily: 'sans-serif',
        width: '100%',
        transition: 'all 0.2s',
      }}
    >
      <span style={{ fontSize: '16px' }}>{copied ? '✓' : '🔗'}</span>
      {copied ? 'Link copiado!' : 'Compartilhar viagem'}
    </button>
  );
}
