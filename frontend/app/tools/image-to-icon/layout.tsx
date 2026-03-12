import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Convertisseur image en icone', description: 'Convertissez vos images en fichiers .ico gratuitement.',
  keywords: ['convertir en ico', 'image vers ico', 'créer icone'],
  openGraph: { title: 'Convertisseur Image en Ico - ConviFree' },
  alternates: { canonical: '/tools/image-to-icon' },
}
export default function ImageToIconLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

