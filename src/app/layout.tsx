import type { Metadata } from "next";
import { Geist, Space_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" });

export const metadata: Metadata = {
  title: "P.A.T.C.H — Nocturnal Studio",
  description: "Creator memory infrastructure.",
  icons: [{ rel: "icon", url: "/logo.svg", type: "image/svg+xml" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,200&display=block" />
      </head>
      <body className={`${geist.variable} ${spaceMono.variable} font-sans bg-surface text-on-surface antialiased`}>
        {children}
      </body>
    </html>
  );
}
