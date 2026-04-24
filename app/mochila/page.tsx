'use client';

import AppShell from '@/components/AppShell';
import ChecklistPage from '@/components/ChecklistPage';

export default function MochilaPage() {
  return (
    <AppShell>
      <div style={{ padding: '52px 56px', maxWidth: '900px' }}>
        <ChecklistPage
          listKey="backpackItems"
          title="Mochila do Parque"
          emoji="🎒"
          description="O que levar na mochila para cada dia de parque. Confira antes de sair do hotel!"
        />
      </div>
    </AppShell>
  );
}
