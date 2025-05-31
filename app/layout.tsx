import type { Metadata } from 'next';
import Navbar from '@/components/navbar';
import { ThemeProvider } from '@/providers/themeProvider';
import AuthSessionProvider from '@/providers/sessionProvider';
import './globals.css';

import { Poppins, Montserrat } from 'next/font/google';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'acctly',
  description: 'Your best account marketplace',

  openGraph: {
    title: 'Acctly – Your best account marketplace',
    description:
      'Acctly is a cutting-edge account marketplace where you can purchase affordable access to the most popular streaming platforms—and much more.',
    url: 'https://acctly.xyz',
    siteName: 'acctly.xyz',
    images: [
      {
        url: 'https://twojadomena.pl/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Acctly logo',
      },
    ],
    locale: 'en_EN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      {/* do <body> doklejamy tylko zmienną Poppins */}
      <body
        className={`${poppins.variable} antialiased`}
        suppressHydrationWarning>
        <AuthSessionProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange>
            <Navbar />
            {children}
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
