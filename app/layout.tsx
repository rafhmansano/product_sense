import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Family Trip Manager — Orlando 2025',
  description: 'Gestao completa da viagem em familia para Orlando. Disney, Universal, SeaWorld.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
