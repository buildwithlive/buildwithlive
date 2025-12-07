import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

// 1. Viewport Settings (Mobile SEO සඳහා අනිවාර්යයි)
export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// 2. Full SEO Metadata Configuration
export const metadata: Metadata = {
  metadataBase: new URL('https://www.buildwithvideos.com'), // ඔයාගේ Domain එක
  
  title: {
    default: 'Build With Live | First Live Video Bodybuilding Book',
    template: '%s | Build With Live',
  },
  
  description: 'The world\'s first interactive bodybuilding video book. Get lifetime access to 250+ live exercise videos, anatomy guides, and expert tips. Perfect for beginners and pros.',
  
  keywords: [
    'Bodybuilding Book', 'Live Video Book', 'Workout Guide', 'Fitness eBook',
    'Javi Isurumal', 'Sri Lanka Fitness', 'Build With Live', 'Digital Fitness Product',
    'Muscle Building', 'Gym Guide PDF'
  ],

  authors: [{ name: 'Build With Live Team', url: 'https://www.buildwithvideos.com' }],
  creator: 'Javi Isurumal',
  publisher: 'Build With Live',

  // 3. Open Graph (Facebook / LinkedIn / WhatsApp Sharing)
  openGraph: {
    type: 'book',
    locale: 'en_US',
    url: 'https://www.buildwithvideos.com',
    siteName: 'Build With Live',
    title: 'Build With Live - The Ultimate Video Bodybuilding Guide',
    description: 'Transform your training with the world\'s first live video bodybuilding book. 250+ videos included.',
    images: [
      {
        url: '/sample.jpg', // ඔයාගේ Cover Photo එක public folder එකේ තියෙන්න ඕනේ
        width: 1200,
        height: 630,
        alt: 'Build With Live Book Cover',
      },
    ],
  },

  // 4. Twitter Card (Twitter Sharing)
  twitter: {
    card: 'summary_large_image',
    title: 'Build With Live | Interactive Bodybuilding Book',
    description: 'Access 250+ live workout videos instantly. No more guessing. Train like a pro.',
    images: ['/sample.jpg'],
    creator: '@buildwithlive',
  },

  // 5. Geo Targeting (Local SEO for Sri Lanka & Global)
  other: {
    'geo.region': 'LK', // Sri Lanka Code
    'geo.placename': 'Sri Lanka',
    'geo.position': '7.8731;80.7718', // Generic SL Coordinates
    'ICBM': '7.8731, 80.7718',
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png', // ලෝගෝ එකක් දාගන්න public එකට
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {children}
        <Toaster position="top-center" richColors theme="dark" closeButton />
      </body>
    </html>
  );
}