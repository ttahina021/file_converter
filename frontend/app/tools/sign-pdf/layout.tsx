import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Signer PDF',
  description: 'Signez numériquement votre PDF avec une signature. Ajoutez votre signature image sur vos documents PDF. Aucune inscription requise.',
  keywords: ['signer PDF', 'signature PDF', 'signature numérique', 'ajouter signature PDF', 'sign PDF'],
  openGraph: {
    title: 'Signer PDF - ConviFree',
    description: 'Signez numériquement votre PDF avec une signature.',
    url: 'https://convifree.com/tools/sign-pdf',
  },
  alternates: {
    canonical: '/tools/sign-pdf',
  },
}

export default function SignPdfLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

