'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function ShareButton() {
  const familyInviteCode = useAppStore((s) => s.familyInviteCode);
  const familyName = useAppStore((s) => s.familyName);
  const [copied, setCopied] = useState(false);

  if (!isSupabaseConfigured() || !familyInviteCode) return null;

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/onboarding?code=${familyInviteCode}`
      : '';

  async function handleShare() {
    // Try native share first (mobile)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Family Trip Manager — Orlando 2026',
          text: `Entre na família${familyName ? ` "${familyName}"` : ''} no Family Trip Manager! Código: ${familyInviteCode}`,
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
        width: '100%',
        transition: 'all 0.2s',
      }}
    >
      <span style={{ fontSize: '16px' }}>{copied ? '✓' : '🔗'}</span>
      {copied ? 'Link copiado!' : 'Convidar para família'}
    </button>
  );
}
