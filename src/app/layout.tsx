/**
 * t3-chat-frontend/app/layout.tsx
 *
 * The root layout for the entire application. It defines the main
 * HTML structure and includes global styles.
 */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Set up the Inter font, as per our design plan
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'CogniFlow AI Chat',
  description: 'A modern, context-aware AI chat application.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-[#F0F4F9]`}>
        {children}
      </body>
    </html>
  );
}