import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Redimensionnement', description: 'Redimensionnez vos images à la taille souhaitée gratuitement.',
  keywords: ['redimensionner image', 'resize image', 'changer taille image'],
  openGraph: { title: 'Redimensionnement Image - ConviFree' },
  alternates: { canonical: '/tools/image-resize' },
}
export default function ImageResizeLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

