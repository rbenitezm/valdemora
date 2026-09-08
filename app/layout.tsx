import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Caso 001 · Valdemora',
  description: 'Una investigación narrativa en la finca Valdemora.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
