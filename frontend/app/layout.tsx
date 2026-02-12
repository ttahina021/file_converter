import type { Metadata } from 'next'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'ConvertirFacile - Outils de conversion gratuits',
  description: 'Collection d\'outils pratiques pour convertir et manipuler vos fichiers',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  )
}

