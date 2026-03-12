import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Générateur Open Graph', description: 'Créez des balises Open Graph pour les réseaux sociaux gratuitement.',
  keywords: ['open graph', 'og tags', 'réseaux sociaux', 'SEO'],
  openGraph: { title: 'Générateur Open Graph - ConviFree' },
  alternates: { canonical: '/tools/open-graph-generator' },
}
export default function OpenGraphGeneratorLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

