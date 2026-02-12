import type { Metadata } from 'next'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import StructuredData from './components/StructuredData'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'ConviFree - Outils de conversion gratuits et simples',
    template: '%s | ConviFree'
  },
  description: 'ConviFree offre une suite d\'outils de conversion 100% gratuits : JSON vers Excel, PDF vers Office, conversion d\'images, générateur QR Code. Aucune inscription requise, données privées.',
  keywords: ['conversion fichiers', 'JSON Excel', 'PDF Word', 'convertisseur image', 'QR code', 'outils gratuits', 'conversion gratuite', 'PDF vers Excel', 'PNG JPG', 'convertisseur gratuit'],
  authors: [{ name: 'ConviFree' }],
  creator: 'ConviFree',
  publisher: 'ConviFree',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://convifree.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://convifree.com',
    title: 'ConviFree - Outils de conversion gratuits et simples',
    description: 'Suite d\'outils de conversion 100% gratuits : JSON vers Excel, PDF vers Office, images, QR Code. Sans inscription, données privées.',
    siteName: 'ConviFree',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ConviFree - Outils de conversion gratuits',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ConviFree - Outils de conversion gratuits',
    description: 'Suite d\'outils de conversion 100% gratuits : JSON vers Excel, PDF vers Office, images, QR Code.',
    images: ['/images/og-image.png'],
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    // google: 'votre-code-google',
    // yandex: 'votre-code-yandex',
    // bing: 'votre-code-bing',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <StructuredData />
      </head>
      <body>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  )
}

