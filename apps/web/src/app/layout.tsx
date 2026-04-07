import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Providers } from '@/components/providers';
import Chatbot from '../../components/Chatbot';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: 'CropCloud Marketplace',
  description: 'Production-style agricultural marketplace connecting farmers and buyers.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${display.variable}`}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}
