'use client';

import AppShell from '@/components/AppShell';
import ChecklistPage from '@/components/ChecklistPage';

export default function MalaPage() {
  return (
    <AppShell>
      <div style={{ padding: '40px 48px', maxWidth: '900px' }}>
        <ChecklistPage
          listKey="suitcaseItems"
          title="Mala de Viagem"
          emoji="🧳"
          description="Checklist completo de itens para levar na mala. Marque cada item conforme for separando."
        />
      </div>
    </AppShell>
  );
}
