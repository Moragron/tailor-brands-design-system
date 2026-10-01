import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tailor Brands design system — example',
  description: 'Reference consumer app for tailor-brands-design-system',
};

// No provider or theme wrapper is required. Fonts come from the tokens (--tb-font-family-*):
// Tailor Brands' licensed Proxima Nova / Memories with fallbacks; they are not bundled.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
