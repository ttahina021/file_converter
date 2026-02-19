import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ConviFree - Outils de conversion gratuits',
    short_name: 'ConviFree',
    description: 'Suite complète d\'outils de conversion 100% gratuits : JSON vers Excel, PDF vers Office, images, QR Code, outils SEO, calculatrices business, outils Madagascar',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#20B2AA',
    categories: ['utilities', 'productivity', 'business'],
    lang: 'fr',
    dir: 'ltr',
    scope: '/',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}

