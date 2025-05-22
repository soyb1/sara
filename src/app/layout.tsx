import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AgeVerificationProvider } from '@/contexts/age-verification-context';
import { AgeVerificationModal } from '@/components/age-verification-modal';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Crimson Canvas',
  description: 'AI-driven adult conversational experiences and image generation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">{/* Apply dark theme by default */}<body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <AgeVerificationProvider>
          <AgeVerificationModal />
          {children}
          <Toaster />
        </AgeVerificationProvider>
      </body>
    </html>
  );
}
