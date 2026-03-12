import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Générateur QR Code',
  description: 'Générez des QR codes personnalisés gratuitement avec votre logo et vos couleurs. Téléchargez en haute qualité. Aucune inscription requise.',
  keywords: ['QR code', 'générateur QR', 'créer QR code', 'QR code personnalisé', 'QR code logo', 'générateur QR gratuit'],
  openGraph: {
    title: 'Générateur QR Code personnalisé - ConviFree',
    description: 'Générez des QR codes personnalisés avec logo et couleurs gratuitement.',
    url: 'https://convifree.com/tools/qr-generator',
  },
  alternates: {
    canonical: '/tools/qr-generator',
  },
}

export default function QrGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
