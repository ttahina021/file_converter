import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Soutenez ConviFree',
  description: 'Soutenez ConviFree pour maintenir des outils de conversion 100% gratuits et sans publicité. Découvrez nos objectifs et milestones.',
  keywords: ['soutenir ConviFree', 'don ConviFree', 'buy me a coffee', 'support outils gratuits'],
  openGraph: {
    title: 'Soutenez ConviFree - Outils de conversion gratuits',
    description: 'Soutenez ConviFree pour maintenir des outils 100% gratuits et sans publicité.',
    url: 'https://convifree.com/support',
  },
  alternates: {
    canonical: '/support',
  },
}

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

