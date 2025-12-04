import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Build With Live - Transform Your Body",
  description: "The world's first live video bodybuilding book.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-black text-white`} suppressHydrationWarning>
        {/* Load PayHere JS SDK */}
        <Script 
          src="https://www.payhere.lk/lib/payhere.js" 
          strategy="lazyOnload" 
        />
        {children}
      </body>
    </html>
  );
}