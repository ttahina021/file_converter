import type { Metadata } from 'next'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import StructuredData from './components/StructuredData'
import { CurrencyProvider } from './contexts/CurrencyContext'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'ConviFree - Outils de conversion gratuits et simples',
    template: '%s | ConviFree'
  },
  description: 'ConviFree offre une suite complète d\'outils de conversion 100% gratuits : JSON vers Excel, PDF vers Office, conversion d\'images, générateur QR Code, outils SEO, calculatrices business, outils Madagascar. Aucune inscription requise, données privées et sécurisées.',
  keywords: [
    'conversion fichiers', 'JSON Excel', 'PDF Word', 'convertisseur image', 'QR code', 
    'outils gratuits', 'conversion gratuite', 'PDF vers Excel', 'PNG JPG', 'convertisseur gratuit',
    'fusionner PDF', 'diviser PDF', 'compresser PDF', 'protéger PDF', 'signer PDF',
    'Excel vers JSON', 'CSV vers JSON', 'XML vers JSON', 'YAML JSON', 'SQL CSV',
    'nettoyage CSV', 'supprimer doublons', 'comparateur fichiers',
    'JSON formatter', 'XML formatter', 'HTML beautifier', 'CSS minify', 'JS minify',
    'base64 encode', 'base64 decode', 'UUID generator', 'hash generator', 'API key generator',
    'compression image', 'redimensionnement image', 'favicon generator', 'image to icon',
    'générateur facture PDF', 'générateur devis', 'calcul TVA', 'calcul marge', 'simulateur crédit',
    'calcul IRSA', 'calcul CNAPS', 'calcul OSTIE', 'salaire brut', 'fiche de paie', 'contrat de travail',
    'générateur meta tag', 'open graph', 'robots.txt', 'sitemap.xml', 'compteur mots', 'densité mots-clés',
    'outils Madagascar', 'calculs Madagascar', 'outils SEO', 'outils développeur'
  ],
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
    description: 'Suite complète d\'outils de conversion 100% gratuits : JSON vers Excel, PDF vers Office, images, QR Code, outils SEO, calculatrices business, outils Madagascar. Sans inscription, données privées.',
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
    description: 'Suite complète d\'outils de conversion 100% gratuits : JSON vers Excel, PDF vers Office, images, QR Code, outils SEO, calculatrices business.',
    images: ['/images/og-image.png'],
    creator: '@convifree',
    site: '@convifree',
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#20B2AA" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ConviFree" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#20B2AA" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="canonical" href="https://convifree.com" />
        <StructuredData />
      </head>
      <body>
        <CurrencyProvider>
          <Navigation />
          {children}
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  )
}

