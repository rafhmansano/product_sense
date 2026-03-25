import type { Metadata } from 'next';
import './globals.css';
import TripProvider from '@/components/TripProvider';

export const metadata: Metadata = {
  title: 'Family Trip Manager — Orlando 2026',
  description: 'Gestao completa da viagem em familia para Orlando. Disney, Universal, SeaWorld.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <TripProvider>{children}</TripProvider>
      </body>
    </html>
  );
}
