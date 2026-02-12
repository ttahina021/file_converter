import type { Metadata } from 'next'
import Navigation from './components/Navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'Boîte à outils - Convertisseurs de fichiers',
  description: 'Collection d\'outils pratiques pour convertir et manipuler vos fichiers',
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
      </body>
    </html>
  )
}

