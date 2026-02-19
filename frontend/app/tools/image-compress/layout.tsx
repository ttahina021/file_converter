import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Compression Image', description: 'Compressez vos images pour réduire leur taille gratuitement. Aucune inscription requise.',
  keywords: ['compression image', 'réduire taille image', 'optimiser image'],
  openGraph: { title: 'Compression Image - ConviFree', description: 'Compressez vos images pour réduire leur taille.' },
  alternates: { canonical: '/tools/image-compress' },
}
export default function ImageCompressLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

