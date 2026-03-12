import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Générateur Meta Tag', description: 'Générez des balises meta optimisées pour le SEO gratuitement.',
  keywords: ['meta tag', 'SEO', 'générateur meta', 'balises meta'],
  openGraph: { title: 'Générateur Meta Tag - ConviFree' },
  alternates: { canonical: '/tools/meta-tag-generator' },
}
export default function MetaTagGeneratorLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

