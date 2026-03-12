import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Protéger PDF',
  description: 'Ajoutez un mot de passe à votre PDF pour le protéger. Sécurisez vos documents sensibles avec un mot de passe fort. Aucune inscription requise.',
  keywords: ['protéger PDF', 'mot de passe PDF', 'sécuriser PDF', 'verrouiller PDF', 'protect PDF'],
  openGraph: {
    title: 'Protéger PDF - ConviFree',
    description: 'Ajoutez un mot de passe à votre PDF pour le protéger.',
    url: 'https://convifree.com/tools/protect-pdf',
  },
  alternates: {
    canonical: '/tools/protect-pdf',
  },
}

export default function ProtectPdfLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

