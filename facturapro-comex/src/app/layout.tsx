import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FacturaPro COMEX',
  description: 'Sistema automatizado de documentación COMEX',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}