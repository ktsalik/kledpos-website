import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import './globals.css';

const notoSans = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin', 'greek'],
});

export const metadata: Metadata = {
  title: 'KledPOS — Το εστιατόριό σας, σε μία ροή',
  description:
    'Παραγγελίες, κουζίνα, απόθεμα και εικόνα της επιχείρησης σε μία σύγχρονη πλατφόρμα για εστιατόρια.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el">
      <body className={`${notoSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
