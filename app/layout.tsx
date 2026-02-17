import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Product Sense — Interview Framework',
  description: 'Master the 5-step product sense framework for world-class product interviews.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
