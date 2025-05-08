import type { Metadata } from 'next';
import Navbar from '@/components/navbar';
import { ThemeProvider } from '@/components/themeProvider';
import './globals.css';

// 1) Import Poppins jako główna
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
  title: '',
  description: '…',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      {/* do <body> doklejamy tylko zmienną Poppins */}
      <body className={`${poppins.variable} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
