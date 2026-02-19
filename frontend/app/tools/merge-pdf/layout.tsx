import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fusionner PDF',
  description: 'Fusionnez plusieurs fichiers PDF en un seul document gratuitement. Combinez vos PDFs rapidement et facilement. Aucune inscription requise.',
  keywords: ['fusionner PDF', 'combiner PDF', 'joindre PDF', 'unir PDF', 'merger PDF'],
  openGraph: {
    title: 'Fusionner PDF - ConviFree',
    description: 'Fusionnez plusieurs fichiers PDF en un seul document gratuitement.',
    url: 'https://convifree.com/tools/merge-pdf',
  },
  alternates: {
    canonical: '/tools/merge-pdf',
  },
}

export default function MergePdfLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

